# @vooteam/next-navigation

[![npm version](https://img.shields.io/npm/v/@vooteam/next-navigation.svg)](https://www.npmjs.com/package/@vooteam/next-navigation)
[![npm downloads](https://img.shields.io/npm/dm/@vooteam/next-navigation.svg)](https://www.npmjs.com/package/@vooteam/next-navigation)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@vooteam/next-navigation.svg)](https://github.com/vooteam/next-navigation/blob/main/LICENSE)

A powerful, type-safe Next.js navigation library with async router operations, built-in progress indicators, and seamless TypeScript integration.

## ✨ Features

- 🚀 **Async Navigation**: Promise-based navigation with `async/await` support
- 📊 **Built-in Progress Bars**: Beautiful, customizable loading indicators
- 🎯 **Type-Safe Routes**: Full TypeScript support with route type safety
- ⚡ **React 18 Optimized**: Uses `useTransition` for optimal UX
- 🎨 **Highly Customizable**: Extensive configuration options
- 📦 **Zero Dependencies**: Lightweight with only peer dependencies
- 🧪 **100% Test Coverage**: Thoroughly tested and reliable
- 🔧 **Next.js 13+ Ready**: Built for modern Next.js with App Router

## 📦 Installation

```bash
npm install @vooteam/next-navigation
```

```bash
pnpm add @vooteam/next-navigation
```

```bash
yarn add @vooteam/next-navigation
```

## 🚀 Quick Start

### Basic Navigation

```typescript
'use client';

import { useNavigation } from '@vooteam/next-navigation';

function NavigationExample() {
  const navigation = useNavigation();

  const handleNavigation = async () => {
    try {
      // Navigate to a new route
      await navigation.push('/about');
      console.log('Navigation completed');

      // Navigate with options
      await navigation.push('/products', { scroll: false });

      // Replace current route
      await navigation.replace('/login');

      // Go back in history
      await navigation.back();
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleNavigation} disabled={navigation.isPending} className={navigation.isPending ? 'opacity-50' : ''}>
        {navigation.isPending ? 'Navigating...' : 'Navigate'}
      </button>
    </div>
  );
}
```

### With Progress Bar Integration

#### 1. Setup Progress Provider (Layout)

```typescript
// app/layout.tsx
import { ProgressProvider } from '@vooteam/next-navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProgressProvider
          config={{
            color: '#3b82f6', // Primary blue
            height: 3, // 3px height
            showSpinner: true, // Show spinner
            speed: 200, // Animation speed
            easing: 'ease', // CSS easing
            shadow: true, // Drop shadow
          }}
        >
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
```

#### 2. Use Navigation with Progress

```typescript
// components/Navigation.tsx
import { useNavigation } from '@vooteam/next-navigation';

function Navigation() {
  const navigation = useNavigation({ enableProgress: true });

  const navigate = async (href: string) => {
    await navigation.push(href); // Progress bar shows automatically
  };

  return (
    <nav className="flex gap-4">
      <button onClick={() => navigate('/about')}>About</button>
      <button onClick={() => navigate('/products')}>Products</button>
      <button onClick={() => navigate('/contact')}>Contact</button>
    </nav>
  );
}
```

## 📚 API Reference

### `useNavigation(options?)`

The main hook for navigation functionality.

#### Parameters

```typescript
interface UseNavigationOptions {
  enableProgress?: boolean; // Enable progress bar integration
}
```

#### Returns

```typescript
interface NavigationResult {
  push: (href: string, options?: NavigationOptions) => Promise<void>;
  replace: (href: string, options?: NavigationOptions) => Promise<void>;
  back: () => Promise<void>;
  isPending: boolean;
}
```

### Navigation Methods

#### `push(href, options?)`

Navigate to a new route, adding it to the browser history.

```typescript
await navigation.push('/about');
await navigation.push('/products', { scroll: false });
```

#### `replace(href, options?)`

Replace the current route without adding to history.

```typescript
await navigation.replace('/login');
```

#### `back()`

Navigate back to the previous page in history.

```typescript
await navigation.back();
```

### Navigation Options

```typescript
interface NavigationOptions {
  scroll?: boolean; // Whether to scroll to top (default: true)
}
```

### Progress Configuration

```typescript
interface ProgressConfig {
  color?: string; // Progress bar color (default: '#3b82f6')
  height?: number; // Height in pixels (default: 3)
  showSpinner?: boolean; // Show loading spinner (default: true)
  easing?: string; // CSS transition easing (default: 'ease')
  speed?: number; // Animation speed in ms (default: 200)
  shadow?: boolean; // Enable drop shadow (default: true)
}
```

## 🎨 Advanced Usage

### Type-Safe Routes

Create typed navigation instances for better type safety:

```typescript
// routes.ts
export const routes = {
  home: '/',
  about: '/about',
  products: '/products',
  contact: '/contact',
  user: (id: string) => `/users/${id}`,
} as const;

// components/TypedNavigation.tsx
import { createNextNavigation } from '@vooteam/next-navigation';
import { routes } from './routes';

const { useNavigation: useTypedNavigation, NextLink } = createNextNavigation(routes);

function TypedNavigationExample() {
  const navigation = useTypedNavigation();

  const handleClick = async () => {
    // Type-safe navigation - TypeScript will validate routes
    await navigation.push(routes.about);
    await navigation.push(routes.user('123'));
  };

  return (
    <div>
      <button onClick={handleClick}>Navigate</button>

      {/* Type-safe Link component */}
      <NextLink href={routes.products}>Products</NextLink>
    </div>
  );
}
```

### Custom Progress Configuration

```typescript
// Different configurations for different themes
const darkThemeConfig = {
  color: '#60a5fa',
  height: 2,
  showSpinner: false,
  shadow: false,
};

const lightThemeConfig = {
  color: '#3b82f6',
  height: 3,
  showSpinner: true,
  shadow: true,
};

function ThemedLayout({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return <ProgressProvider config={isDark ? darkThemeConfig : lightThemeConfig}>{children}</ProgressProvider>;
}
```

### Error Handling

```typescript
function NavigationWithErrorHandling() {
  const navigation = useNavigation();
  const [error, setError] = useState<string | null>(null);

  const handleNavigation = async (href: string) => {
    try {
      setError(null);
      await navigation.push(href);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Navigation failed');
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={() => handleNavigation('/about')}>Navigate to About</button>
    </div>
  );
}
```

### Integration with Loading States

```typescript
function LoadingAwareNavigation() {
  const navigation = useNavigation({ enableProgress: true });

  return (
    <div>
      <nav>
        <button onClick={() => navigation.push('/about')} disabled={navigation.isPending} className={`btn ${navigation.isPending ? 'btn-loading' : 'btn-primary'}`}>
          {navigation.isPending ? (
            <>
              <Spinner /> Navigating...
            </>
          ) : (
            'About'
          )}
        </button>
      </nav>

      {/* Global loading indicator */}
      {navigation.isPending && <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />}
    </div>
  );
}
```

## 🔧 Configuration Examples

### Minimal Setup

```typescript
// Basic usage without progress bar
import { useNavigation } from '@vooteam/next-navigation';

function MinimalExample() {
  const { push, isPending } = useNavigation();

  return (
    <button onClick={() => push('/about')} disabled={isPending}>
      Navigate
    </button>
  );
}
```

### Full-Featured Setup

```typescript
// Complete setup with all features
import { ProgressProvider, useNavigation } from '@vooteam/next-navigation';

// Layout
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      config={{
        color: '#10b981',
        height: 4,
        showSpinner: true,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        speed: 300,
        shadow: true,
      }}
    >
      {children}
    </ProgressProvider>
  );
}

// Component
function FullFeaturedExample() {
  const navigation = useNavigation({ enableProgress: true });

  return (
    <nav>
      <button onClick={() => navigation.push('/dashboard')}>Dashboard</button>
      <button onClick={() => navigation.replace('/settings')}>Settings</button>
      <button onClick={() => navigation.back()}>Back</button>
    </nav>
  );
}
```

## 🧪 Testing

The library includes comprehensive test utilities:

```typescript
// Test example
import { render, screen } from '@testing-library/react';
import { ProgressProvider } from '@vooteam/next-navigation';

test('navigation with progress', () => {
  render(
    <ProgressProvider>
      <YourComponent />
    </ProgressProvider>
  );

  // Your test assertions
});
```

## 📋 Requirements

- **Next.js**: 13.0.0 or higher (with App Router)
- **React**: 18.0.0 or higher (required for `useTransition`)
- **TypeScript**: 5.0.0 or higher (recommended)

## 🔄 Migration Guide

### From next/router

```typescript
// Before (Pages Router)
import { useRouter } from 'next/router';

function OldWay() {
  const router = useRouter();

  const navigate = () => {
    router.push('/about'); // No await support
  };
}

// After (App Router with @vooteam/next-navigation)
import { useNavigation } from '@vooteam/next-navigation';

function NewWay() {
  const navigation = useNavigation();

  const navigate = async () => {
    await navigation.push('/about'); // Full async support
  };
}
```

## 📈 Performance

- **Bundle Size**: ~2KB gzipped
- **Runtime Overhead**: Minimal - leverages React's built-in `useTransition`
- **Memory Usage**: Efficient - no memory leaks or retained references
- **Tree Shaking**: Full support for optimal bundle sizes

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/vooteam/next-navigation/blob/main/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/vooteam/next-navigation.git

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the package
npm run build
```

## 📄 License

MIT License - see the [LICENSE](https://github.com/vooteam/next-navigation/blob/main/LICENSE) file for details.

## 🙋‍♂️ Support

- 📖 [Documentation](https://github.com/vooteam/next-navigation#readme)
- 🐛 [Issue Tracker](https://github.com/vooteam/next-navigation/issues)
- 💬 [Discussions](https://github.com/vooteam/next-navigation/discussions)

---

**Made with ❤️ by the VooTeam**

If this library helps you, please consider giving it a ⭐ on [GitHub](https://github.com/vooteam/next-navigation)!
