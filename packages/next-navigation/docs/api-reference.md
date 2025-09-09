# API Reference

Complete documentation for the `@vooteam/next-navigation` library.

## Table of Contents

- [Core Hooks](#core-hooks)
- [Components](#components)
- [Factory Functions](#factory-functions)
- [Types & Interfaces](#types--interfaces)
- [Configuration](#configuration)

## Core Hooks

### `useNavigation(config?)`

The main hook providing async navigation functionality with built-in progress support.

#### Signature

```typescript
function useNavigation<T extends Routes = Routes>(
  config?: NavigationConfig<T>
): UseNavigationReturn<T>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `NavigationConfig<T>` | No | Configuration options for navigation |

```typescript
interface NavigationConfig<T extends Routes = Routes> {
  enableProgress?: boolean; // Enable progress bar integration (default: true)
  routes?: T;              // Type-safe route definitions
}
```

#### Returns

```typescript
interface UseNavigationReturn<T extends Routes = Routes> {
  push<K extends keyof T>(
    route: K,
    ...args: T[K] extends RouteWithParams<unknown>
      ? [params: NavigationParams<T, K>, options?: NavigationOptions]
      : [options?: NavigationOptions]
  ): Promise<void>;
  
  replace<K extends keyof T>(
    route: K,
    ...args: T[K] extends RouteWithParams<unknown>
      ? [params: NavigationParams<T, K>, options?: NavigationOptions]
      : [options?: NavigationOptions]
  ): Promise<void>;
  
  back: () => Promise<void>;
  isPending: boolean;
}
```

#### Methods

##### `push(route, params?, options?)`

Navigate to a new route, adding it to browser history.

**Parameters:**
- `route`: Route path (string) or route key (when using typed routes)
- `params`: Route parameters (for parameterized routes)
- `options`: Navigation options

**Examples:**
```typescript
// Simple navigation
await navigation.push('/about');

// With navigation options
await navigation.push('/products', { scroll: false });

// With route parameters (typed routes)
await navigation.push('user', { id: '123' });

// With both parameters and options
await navigation.push('user', { id: '123' }, { scroll: false });
```

##### `replace(route, params?, options?)`

Replace the current route without adding to history.

**Examples:**
```typescript
await navigation.replace('/login');
await navigation.replace('dashboard', { tab: 'settings' });
```

##### `back()`

Navigate back to the previous page in history.

**Example:**
```typescript
await navigation.back();
```

#### Properties

##### `isPending: boolean`

Indicates if a navigation operation is currently in progress.

**Example:**
```typescript
const navigation = useNavigation();

return (
  <button disabled={navigation.isPending}>
    {navigation.isPending ? 'Loading...' : 'Navigate'}
  </button>
);
```

### `useProgress()`

Access the progress context for manual progress control.

#### Signature

```typescript
function useProgress(): ProgressContextType
```

#### Returns

```typescript
interface ProgressContextType {
  start: () => void;    // Start the progress indicator
  complete: () => void; // Complete the progress indicator
  isLoading: boolean;   // Current loading state
}
```

#### Example

```typescript
import { useProgress } from '@vooteam/next-navigation';

function CustomProgressControl() {
  const progress = useProgress();
  
  const handleCustomAction = async () => {
    progress.start();
    try {
      await someAsyncOperation();
    } finally {
      progress.complete();
    }
  };
  
  return (
    <button onClick={handleCustomAction}>
      {progress.isLoading ? 'Processing...' : 'Start Action'}
    </button>
  );
}
```

## Components

### `ProgressProvider`

Provides progress context and renders the progress bar.

#### Props

```typescript
interface ProgressProviderProps {
  children: React.ReactNode;
  config?: ProgressConfig;
}
```

#### Configuration

```typescript
interface ProgressConfig {
  color?: string;       // Progress bar color (default: '#3b82f6')
  height?: number;      // Height in pixels (default: 3)
  showSpinner?: boolean; // Show loading spinner (default: true)
  easing?: string;      // CSS transition easing (default: 'ease')
  speed?: number;       // Animation speed in ms (default: 200)
  shadow?: boolean;     // Enable glowing shadow effect (default: true)
}
```

#### Example

```typescript
import { ProgressProvider } from '@vooteam/next-navigation';

export default function Layout({ children }) {
  return (
    <ProgressProvider
      config={{
        color: '#10b981',
        height: 4,
        showSpinner: true,
        speed: 300,
        shadow: true,
      }}
    >
      {children}
    </ProgressProvider>
  );
}
```

### `NextLink`

Type-safe Link component for navigation.

#### Props

```typescript
interface NextLinkProps<T extends Routes, K extends keyof T>
  extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  route: K;
  routes?: T;
  // Additional route parameters are passed as props
}
```

#### Example

```typescript
import { NextLink } from '@vooteam/next-navigation';

function Navigation() {
  return (
    <div>
      {/* Standard link */}
      <NextLink route="/about">About Us</NextLink>
      
      {/* With route parameters */}
      <NextLink route="user" id="123" className="user-link">
        View User
      </NextLink>
      
      {/* With Next.js Link props */}
      <NextLink route="/products" prefetch={false}>
        Products
      </NextLink>
    </div>
  );
}
```

## Factory Functions

### `createNextNavigation(config)`

Creates typed navigation instances with predefined routes.

#### Signature

```typescript
function createNextNavigation<T extends Routes>(
  config: NavigationConfig<T>
): {
  useNavigation: () => UseNavigationReturn<T>;
  NextLink: React.ForwardRefExoticComponent<NextLinkProps<T, keyof T>>;
}
```

#### Parameters

```typescript
interface NavigationConfig<T extends Routes> {
  routes: T;
  enableProgress?: boolean;
}
```

#### Returns

An object containing:
- `useNavigation`: Typed navigation hook
- `NextLink`: Typed Link component

#### Example

```typescript
// Define routes
const routes = {
  home: '/',
  about: '/about',
  user: { 
    path: '/users/[id]', 
    params: { id: '' } as { id: string } 
  },
  blog: { 
    path: '/blog/[category]/[slug]',
    params: { category: '', slug: '' } as { category: string; slug: string }
  }
} as const;

// Create typed navigation
const { useNavigation, NextLink } = createNextNavigation({
  routes,
  enableProgress: true
});

// Usage in components
function MyComponent() {
  const navigation = useNavigation();
  
  const handleClick = async () => {
    // TypeScript validates routes and parameters
    await navigation.push('user', { id: '123' });
    await navigation.push('blog', { 
      category: 'tech', 
      slug: 'nextjs-tutorial' 
    });
  };
  
  return (
    <div>
      <button onClick={handleClick}>Navigate</button>
      <NextLink route="about">About</NextLink>
      <NextLink route="user" id="456">User Profile</NextLink>
    </div>
  );
}
```

## Types & Interfaces

### Route Types

```typescript
// Basic route definition
type Routes = Record<string, RouteDefinition>;

// Route can be string or object with parameters
type RouteDefinition<T = Record<string, unknown>> =
  | string
  | RouteWithParams<T>;

// Route with parameters
interface RouteWithParams<T = Record<string, unknown>> {
  path: string;
  params?: T;
}

// Extract parameters from route definition
type RouteParams<T> = T extends RouteWithParams<infer P>
  ? P extends Record<string, unknown>
    ? P
    : Record<string, unknown>
  : Record<string, unknown>;

// Navigation parameters for typed routes
type NavigationParams<
  T extends Routes,
  K extends keyof T
> = T[K] extends RouteWithParams<infer P>
  ? P extends Record<string, unknown>
    ? P
    : never
  : never;
```

### Navigation Types

```typescript
// Navigation options
interface NavigationOptions {
  scroll?: boolean; // Whether to scroll to top (default: true)
}

// Navigation configuration
interface NavigationConfig<T extends Routes = Routes> {
  enableProgress?: boolean; // Enable progress bar integration
  routes?: T;              // Type-safe route definitions
}
```

### Progress Types

```typescript
// Progress configuration
interface ProgressConfig {
  color?: string;       // Progress bar color
  height?: number;      // Height in pixels
  showSpinner?: boolean; // Show loading spinner
  easing?: string;      // CSS transition easing
  speed?: number;       // Animation speed in ms
  shadow?: boolean;     // Enable shadow effect
}

// Progress context
interface ProgressContextType {
  start: () => void;
  complete: () => void;
  isLoading: boolean;
}

// Progress provider props
interface ProgressProviderProps {
  children: React.ReactNode;
  config?: ProgressConfig;
}
```

## Configuration

### Default Values

```typescript
// Default navigation config
const defaultNavigationConfig = {
  enableProgress: true
};

// Default progress config
const defaultProgressConfig = {
  color: '#3b82f6',
  height: 3,
  showSpinner: true,
  easing: 'ease',
  speed: 200,
  shadow: true
};
```

### Environment Requirements

- **Next.js**: 13.0.0 or higher (App Router required)
- **React**: 18.0.0 or higher (for `useTransition` support)
- **TypeScript**: 5.0.0 or higher (recommended for type safety)
- **Node.js**: 16.0.0 or higher

### Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+
- iOS Safari 14+
- Chrome Mobile 88+

## Utility Functions

### `resolveRoute(routes, href, params?)`

Resolves a route definition to a URL string.

#### Signature

```typescript
function resolveRoute<T extends Routes>(
  routes: T | undefined,
  href: keyof T | string,
  params?: Record<string, unknown>
): string
```

#### Parameters

- `routes`: Route definitions object
- `href`: Route key or string
- `params`: Route parameters to substitute

#### Example

```typescript
import { resolveRoute } from '@vooteam/next-navigation';

const routes = {
  user: { path: '/users/[id]', params: { id: '' } }
};

const url = resolveRoute(routes, 'user', { id: '123' });
// Returns: '/users/123'
```

This utility is used internally but can be helpful for generating URLs without navigation.
