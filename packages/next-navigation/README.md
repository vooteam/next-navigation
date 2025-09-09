# @vooteam/next-navigation

[![npm version](https://img.shields.io/npm/v/@vooteam/next-navigation.svg)](https://www.npmjs.com/package/@vooteam/next-navigation)
[![npm downloads](https://img.shields.io/npm/dm/@vooteam/next-navigation.svg)](https://www.npmjs.com/package/@vooteam/next-navigation)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@vooteam/next-navigation.svg)](https://github.com/vooteam/next-navigation/blob/main/LICENSE)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/vooteam/next-navigation)

A powerful, type-safe Next.js navigation library with async router operations, built-in progress indicators, and seamless TypeScript integration for the App Router.

## ✨ Features

- 🚀 **Async Navigation**: Promise-based navigation with full `async/await` support
- 📊 **Built-in Progress Bars**: Beautiful, customizable loading indicators with spinners
- 🎯 **Type-Safe Routes**: Full TypeScript support with parameterized route definitions
- ⚡ **React 18 Optimized**: Uses `useTransition` for optimal user experience
- 🎨 **Highly Customizable**: Extensive configuration options for progress bars and navigation
- 📦 **Lightweight**: ~2KB gzipped with zero runtime dependencies
- 🧪 **100% Test Coverage**: Thoroughly tested with comprehensive test suite
- 🔧 **Next.js 13+ Ready**: Built specifically for modern Next.js with App Router
- 🌐 **Accessibility**: ARIA-compliant progress indicators for screen readers

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
    // Navigate with async/await support
    await navigation.push('/about');
    console.log('Navigation completed!');
  };

  return (
    <button 
      onClick={handleNavigation} 
      disabled={navigation.isPending}
    >
      {navigation.isPending ? 'Navigating...' : 'Go to About'}
    </button>
  );
}
```

### Progress Bar Setup

```typescript
// app/layout.tsx
import { ProgressProvider } from '@vooteam/next-navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
```

## 📚 Documentation

- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[Examples](./docs/examples/)** - Comprehensive usage examples
- **[Migration Guide](./docs/migration-guide.md)** - Migrate from other navigation solutions
- **[Testing Guide](./docs/testing-guide.md)** - How to test components using the library
- **[Performance Guide](./docs/performance.md)** - Performance tips and bundle impact

## 📋 Core API

### `useNavigation(config?)`

```typescript
const navigation = useNavigation({
  enableProgress: true, // Enable progress bar integration
  routes: myRoutes     // Type-safe route definitions (optional)
});

// Navigate to routes
await navigation.push('/about');
await navigation.replace('/login');
await navigation.back();

// Check loading state
const isLoading = navigation.isPending;
```

### `ProgressProvider`

```typescript
<ProgressProvider 
  config={{
    color: '#3b82f6',    // Progress bar color
    height: 3,           // Height in pixels
    showSpinner: true,   // Show loading spinner
    speed: 200,          // Animation speed
    shadow: true         // Glowing shadow effect
  }}
>
  {children}
</ProgressProvider>
```

## 🎯 Type-Safe Routes

```typescript
const routes = {
  home: '/',
  user: { path: '/users/[id]', params: { id: '' } as { id: string } },
  blog: { path: '/blog/[category]/[slug]', params: { category: '', slug: '' } }
} as const;

const { useNavigation } = createNextNavigation({ routes });

// TypeScript validates routes and parameters
await navigation.push('user', { id: '123' });
await navigation.push('blog', { category: 'tech', slug: 'nextjs' });
```

## 📋 Requirements

- **Next.js**: 13.0.0+ (App Router)
- **React**: 18.0.0+ (for `useTransition`)
- **TypeScript**: 5.0.0+ (recommended)
- **Node.js**: 16.0.0+

## 🔄 Migration

### From `next/navigation`

```typescript
// Before
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/about'); // No await, no loading states

// After
import { useNavigation } from '@vooteam/next-navigation';
const navigation = useNavigation();
await navigation.push('/about'); // Async + loading states
```

## 📈 Performance

- **Bundle Size**: ~2KB gzipped
- **Runtime**: Minimal overhead using React's `useTransition`
- **Memory**: Efficient, no memory leaks
- **Tree Shaking**: Full ES modules support

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./docs/contributing.md) for details.

```bash
git clone https://github.com/vooteam/next-navigation.git
cd next-navigation
pnpm install
pnpm test
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙋‍♂️ Support

- 📖 [Documentation](./docs/)
- 🐛 [Issues](https://github.com/vooteam/next-navigation/issues)
- 💬 [Discussions](https://github.com/vooteam/next-navigation/discussions)

---

**Made with ❤️ by the VooTeam**

If this library helps you, please consider ⭐ [starring the repository](https://github.com/vooteam/next-navigation)!
