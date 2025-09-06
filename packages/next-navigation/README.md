# @vooteam/next-navigation

A Next.js navigation hook library for async router operations.

This library provides a simple React hook that wraps Next.js router functionality with async/await support for push, replace, and back operations.

## Installation

```bash
npm install @vooteam/next-navigation
# or
pnpm add @vooteam/next-navigation
# or
yarn add @vooteam/next-navigation
```

## Usage

```typescript
'use client';

import { useNavigation } from '@vooteam/next-navigation';

function MyComponent() {
  const navigation = useNavigation();

  const handleNavigation = async () => {
    // Navigate to a new route
    await navigation.push('/about');
    console.log('Navigation completed');

    // Navigate with options
    await navigation.push('/products', { scroll: false });

    // Replace current route
    await navigation.replace('/login');

    // Go back
    await navigation.back();
  };

  return (
    <div>
      <button onClick={handleNavigation} disabled={navigation.isPending}>
        Navigate
      </button>

      {navigation.isPending && <p>Navigation in progress...</p>}
    </div>
  );
}
```

## API

### `useNavigation()`

Returns an object with async navigation methods:

- `push(href: string, options?: NavigationOptions): Promise<void>` - Navigate to a new route
- `replace(href: string, options?: NavigationOptions): Promise<void>` - Replace current route
- `back(): Promise<void>` - Navigate back in history
- `isPending: boolean` - Indicates if a navigation transition is in progress (from React's `useTransition`)

### `NavigationOptions`

```typescript
interface NavigationOptions {
  scroll?: boolean; // Whether to scroll to top after navigation
}
```

## Features

- **Async Navigation**: All navigation methods return promises for better control flow
- **Loading States**: Built-in `isPending` state using React's `useTransition` for optimal UX
- **TypeScript Support**: Full type definitions included
- **Next.js Optimized**: Uses the official `useRouter` from `next/navigation`
- **Lightweight**: No external dependencies beyond React and Next.js peer dependencies

## Requirements

- Next.js 13+ (with app router)
- React 18+ (required for `useTransition` support)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Clean build artifacts
npm run clean
```

## Building

Run `npm run build` to build the library.

## Running unit tests

Run `npm test` to execute the unit tests via [Vitest](https://vitest.dev/).
