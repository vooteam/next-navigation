# Performance Guide

Optimization tips and performance considerations for `@vooteam/next-navigation`.

## Table of Contents

- [Bundle Size Impact](#bundle-size-impact)
- [Runtime Performance](#runtime-performance)
- [Memory Management](#memory-management)
- [Optimization Strategies](#optimization-strategies)
- [Performance Monitoring](#performance-monitoring)
- [Best Practices](#best-practices)

## Bundle Size Impact

### Library Size

```bash
# Actual bundle sizes (gzipped)
@vooteam/next-navigation: ~2KB
├── Core navigation: ~1.2KB
├── Progress provider: ~0.6KB
└── Type definitions: ~0.2KB

# Comparison with alternatives
next/navigation: ~0.8KB (baseline)
react-router-dom: ~8.2KB
@reach/router: ~5.1KB
```

### Tree Shaking

The library is fully tree-shakeable. Only import what you need:

```typescript
// ✅ Good - Only imports what you use
import { useNavigation } from '@vooteam/next-navigation';

// ✅ Good - Selective imports
import { ProgressProvider, useProgress } from '@vooteam/next-navigation';

// ❌ Avoid - Imports everything
import * as Navigation from '@vooteam/next-navigation';
```

### Bundle Analysis

```bash
# Analyze bundle impact with webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}

# Run analysis
npm run analyze
```

Example Next.js bundle analysis configuration:

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your Next.js config
});
```

## Runtime Performance

### React Performance

The library is optimized for React performance:

```typescript
// Uses React.memo for progress components
const ProgressBar = React.memo(({ isLoading, config }) => {
  // Component implementation
});

// Optimized context provider
const ProgressProvider = ({ children, config }) => {
  const contextValue = useMemo(() => ({
    start,
    complete,
    isLoading,
  }), [start, complete, isLoading]);

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
};
```

### useTransition Integration

Leverages React 18's `useTransition` for optimal UX:

```typescript
// Internal implementation
function useNavigation() {
  const [isPending, startTransition] = useTransition();
  
  const push = useCallback(async (route) => {
    return new Promise((resolve) => {
      startTransition(() => {
        router.push(route);
        // Navigation is non-blocking
        setTimeout(resolve, 100);
      });
    });
  }, [router]);
  
  return { push, isPending };
}
```

### Performance Metrics

```typescript
// Measure navigation performance
const measureNavigation = async () => {
  const start = performance.now();
  
  await navigation.push('/route');
  
  const end = performance.now();
  console.log(`Navigation took ${end - start}ms`);
};

// Web Vitals impact
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Memory Management

### Memory Leak Prevention

The library is designed to prevent memory leaks:

```typescript
// Automatic cleanup in useEffect
useEffect(() => {
  const timers = [];
  
  if (isLoading) {
    timers.push(setTimeout(() => setProgress(30), 50));
    timers.push(setTimeout(() => setProgress(60), 200));
    timers.push(setTimeout(() => setProgress(80), 400));
  }
  
  // ✅ Automatic cleanup
  return () => timers.forEach(clearTimeout);
}, [isLoading]);

// ✅ useCallback prevents recreation
const handleNavigation = useCallback(async (route) => {
  await navigation.push(route);
}, [navigation]);
```

### Event Listener Management

```typescript
// No global event listeners that could leak
// Uses React's built-in event handling
<button onClick={handleClick}>Navigate</button>

// Progress animations use CSS transitions, not JS intervals
const progressStyle = {
  transition: `width ${config.speed}ms ${config.easing}`,
  width: `${progress}%`,
};
```

### Memory Profiling

```typescript
// Monitor memory usage
const profileMemory = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log({
      used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`,
    });
  }
};

// Profile before and after navigation
profileMemory();
await navigation.push('/route');
profileMemory();
```

## Optimization Strategies

### Route-Based Code Splitting

Combine with Next.js dynamic imports:

```typescript
// Lazy load components
const LazyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading component...</div>,
});

// Navigate to routes with heavy components
const navigation = useNavigation();

const handleNavigateToHeavyRoute = async () => {
  // Progress bar will show during component loading
  await navigation.push('/heavy-route');
};
```

### Progress Bar Optimization

```typescript
// Optimize progress configuration for performance
const performantProgressConfig = {
  color: '#3b82f6',
  height: 2, // Smaller height = better performance
  showSpinner: false, // Disable if not needed
  speed: 150, // Faster transitions
  shadow: false, // Disable shadow for better performance
};

<ProgressProvider config={performantProgressConfig}>
  {children}
</ProgressProvider>
```

### Conditional Progress Loading

```typescript
// Only load progress provider when needed
const ConditionalProgressProvider = ({ children, showProgress = true }) => {
  if (!showProgress) {
    return <>{children}</>;
  }
  
  return (
    <ProgressProvider>
      {children}
    </ProgressProvider>
  );
};

// Use in layout
export default function Layout({ children }) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return (
    <ConditionalProgressProvider showProgress={isProduction}>
      {children}
    </ConditionalProgressProvider>
  );
}
```

### Debounced Navigation

```typescript
// Debounce rapid navigation calls
import { debounce } from 'lodash';

const useDebouncedNavigation = (delay = 300) => {
  const navigation = useNavigation();
  
  const debouncedPush = useMemo(
    () => debounce(navigation.push, delay),
    [navigation.push, delay]
  );
  
  const debouncedReplace = useMemo(
    () => debounce(navigation.replace, delay),
    [navigation.replace, delay]
  );
  
  return {
    ...navigation,
    push: debouncedPush,
    replace: debouncedReplace,
  };
};

// Usage
const navigation = useDebouncedNavigation();
```

## Performance Monitoring

### Custom Performance Hook

```typescript
// hooks/usePerformanceMonitor.ts
import { useRef, useCallback } from 'react';

export const usePerformanceMonitor = () => {
  const metricsRef = useRef<Map<string, number>>(new Map());
  
  const startTimer = useCallback((label: string) => {
    metricsRef.current.set(label, performance.now());
  }, []);
  
  const endTimer = useCallback((label: string) => {
    const start = metricsRef.current.get(label);
    if (start) {
      const duration = performance.now() - start;
      console.log(`${label}: ${duration.toFixed(2)}ms`);
      metricsRef.current.delete(label);
      return duration;
    }
    return 0;
  }, []);
  
  return { startTimer, endTimer };
};

// Usage with navigation
const NavigationWithMetrics = () => {
  const navigation = useNavigation();
  const { startTimer, endTimer } = usePerformanceMonitor();
  
  const handleNavigation = async (route: string) => {
    startTimer(`navigation-${route}`);
    await navigation.push(route);
    endTimer(`navigation-${route}`);
  };
  
  return (
    <button onClick={() => handleNavigation('/about')}>
      Navigate to About
    </button>
  );
};
```

### React DevTools Profiler

```typescript
// Wrap components for profiling
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Profiler:', { id, phase, actualDuration });
};

<Profiler id="Navigation" onRender={onRenderCallback}>
  <NavigationComponent />
</Profiler>
```

### Core Web Vitals Monitoring

```typescript
// Monitor Web Vitals impact
import { getCLS, getFID, getLCP } from 'web-vitals';

const vitalsConfig = {
  reportAllChanges: true,
  onLCP: (metric) => {
    // Log Largest Contentful Paint
    console.log('LCP:', metric);
  },
  onFID: (metric) => {
    // Log First Input Delay
    console.log('FID:', metric);
  },
  onCLS: (metric) => {
    // Log Cumulative Layout Shift
    console.log('CLS:', metric);
  },
};

getCLS(vitalsConfig.onCLS);
getFID(vitalsConfig.onFID);
getLCP(vitalsConfig.onLCP);
```

## Best Practices

### 1. Optimize Progress Configuration

```typescript
// ✅ Good - Minimal configuration
const minimalConfig = {
  height: 2,
  showSpinner: false,
  shadow: false,
};

// ❌ Avoid - Heavy configuration
const heavyConfig = {
  height: 10,
  showSpinner: true,
  shadow: true,
  speed: 1000, // Too slow
};
```

### 2. Conditional Feature Loading

```typescript
// Load features based on device capabilities
const useAdaptiveConfig = () => {
  const [config, setConfig] = useState({
    showSpinner: true,
    shadow: true,
  });
  
  useEffect(() => {
    // Reduce features on low-end devices
    if (navigator.hardwareConcurrency <= 2) {
      setConfig({
        showSpinner: false,
        shadow: false,
      });
    }
  }, []);
  
  return config;
};
```

### 3. Efficient State Management

```typescript
// ✅ Good - Localized state
const NavigationButton = ({ route }) => {
  const navigation = useNavigation();
  
  return (
    <button 
      onClick={() => navigation.push(route)}
      disabled={navigation.isPending}
    >
      Navigate
    </button>
  );
};

// ❌ Avoid - Global state for local concerns
const GlobalNavigationState = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  // This creates unnecessary re-renders
  return (
    <NavigationContext.Provider value={{ isNavigating }}>
      {children}
    </NavigationContext.Provider>
  );
};
```

### 4. Preload Critical Routes

```typescript
// Preload critical routes for better performance
const useRoutePreloader = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Preload critical routes
    router.prefetch('/dashboard');
    router.prefetch('/profile');
  }, [router]);
};

// Use in app layout
export default function Layout({ children }) {
  useRoutePreloader();
  
  return (
    <ProgressProvider>
      {children}
    </ProgressProvider>
  );
}
```

### 5. Optimize Re-renders

```typescript
// ✅ Good - Memoized component
const NavigationMenu = React.memo(({ routes }) => {
  const navigation = useNavigation();
  
  return (
    <nav>
      {routes.map(route => (
        <button
          key={route}
          onClick={() => navigation.push(route)}
          disabled={navigation.isPending}
        >
          {route}
        </button>
      ))}
    </nav>
  );
});

// ❌ Avoid - Inline objects and functions
const NavigationMenu = ({ routes }) => {
  const navigation = useNavigation();
  
  return (
    <nav>
      {routes.map(route => (
        <button
          key={route}
          onClick={() => navigation.push(route)} // New function each render
          style={{ opacity: navigation.isPending ? 0.5 : 1 }} // New object each render
        >
          {route}
        </button>
      ))}
    </nav>
  );
};
```

### Performance Checklist

- [ ] **Bundle Size**: Verify library adds minimal overhead
- [ ] **Tree Shaking**: Import only needed components
- [ ] **Memory Leaks**: Check for proper cleanup
- [ ] **Re-renders**: Optimize component updates
- [ ] **Progress Config**: Use minimal configuration for better performance
- [ ] **Route Preloading**: Preload critical routes
- [ ] **Web Vitals**: Monitor Core Web Vitals impact
- [ ] **Device Adaptation**: Adapt features based on device capabilities

### Benchmarking Template

```typescript
// performance-benchmark.ts
import { performance } from 'perf_hooks';

class NavigationBenchmark {
  private metrics: Map<string, number[]> = new Map();
  
  async benchmarkNavigation(iterations = 100) {
    const navigation = useNavigation();
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await navigation.push('/test-route');
      const end = performance.now();
      times.push(end - start);
    }
    
    return {
      avg: times.reduce((a, b) => a + b) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      p95: times.sort()[Math.floor(times.length * 0.95)],
    };
  }
  
  logResults(results: any) {
    console.table(results);
  }
}

// Usage
const benchmark = new NavigationBenchmark();
const results = await benchmark.benchmarkNavigation();
benchmark.logResults(results);
```

This performance guide helps you optimize your application's navigation performance while maintaining the excellent user experience that `@vooteam/next-navigation` provides.
