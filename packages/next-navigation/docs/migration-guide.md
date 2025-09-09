# Migration Guide

Complete guide for migrating from other navigation solutions to `@vooteam/next-navigation`.

## Table of Contents

- [From Next.js Pages Router (`next/router`)](#from-nextjs-pages-router-nextrouter)
- [From Next.js App Router (`next/navigation`)](#from-nextjs-app-router-nextnavigation)
- [From React Router](#from-react-router)
- [Common Migration Patterns](#common-migration-patterns)
- [Breaking Changes](#breaking-changes)
- [Migration Checklist](#migration-checklist)

## From Next.js Pages Router (`next/router`)

### Basic Navigation

**Before (Pages Router):**
```typescript
import { useRouter } from 'next/router';

function NavigationComponent() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/about');
    // No way to know when navigation completes
    // No built-in loading states
  };

  return <button onClick={handleNavigation}>Navigate</button>;
}
```

**After (@vooteam/next-navigation):**
```typescript
import { useNavigation } from '@vooteam/next-navigation';

function NavigationComponent() {
  const navigation = useNavigation();

  const handleNavigation = async () => {
    await navigation.push('/about');
    // Navigation completion is awaitable
    console.log('Navigation completed!');
  };

  return (
    <button 
      onClick={handleNavigation}
      disabled={navigation.isPending}
    >
      {navigation.isPending ? 'Navigating...' : 'Navigate'}
    </button>
  );
}
```

### Router Events

**Before (Pages Router):**
```typescript
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function ComponentWithLoading() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <button onClick={() => router.push('/about')}>Navigate</button>
    </div>
  );
}
```

**After (@vooteam/next-navigation):**
```typescript
import { useNavigation } from '@vooteam/next-navigation';

function ComponentWithLoading() {
  const navigation = useNavigation();

  return (
    <div>
      {navigation.isPending && <div>Loading...</div>}
      <button onClick={() => navigation.push('/about')}>Navigate</button>
    </div>
  );
}
```

### Dynamic Routes

**Before (Pages Router):**
```typescript
import { useRouter } from 'next/router';

function UserProfile() {
  const router = useRouter();

  const navigateToUser = (userId: string) => {
    router.push(`/users/${userId}`);
    // Or with query object:
    router.push({
      pathname: '/users/[id]',
      query: { id: userId }
    });
  };

  return <button onClick={() => navigateToUser('123')}>View User</button>;
}
```

**After (@vooteam/next-navigation with typed routes):**
```typescript
import { createNextNavigation } from '@vooteam/next-navigation';

const routes = {
  user: { 
    path: '/users/[id]', 
    params: { id: '' } as { id: string } 
  }
} as const;

const { useNavigation } = createNextNavigation({ routes });

function UserProfile() {
  const navigation = useNavigation();

  const navigateToUser = async (userId: string) => {
    // Type-safe navigation with parameter validation
    await navigation.push('user', { id: userId });
  };

  return <button onClick={() => navigateToUser('123')}>View User</button>;
}
```

## From Next.js App Router (`next/navigation`)

### Basic Migration

**Before (Standard App Router):**
```typescript
import { useRouter } from 'next/navigation';

function NavigationComponent() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/about');
    // No promise support
    // No loading states
  };

  return <button onClick={handleNavigation}>Navigate</button>;
}
```

**After (@vooteam/next-navigation):**
```typescript
import { useNavigation } from '@vooteam/next-navigation';

function NavigationComponent() {
  const navigation = useNavigation();

  const handleNavigation = async () => {
    await navigation.push('/about');
    // Full promise support
  };

  return (
    <button 
      onClick={handleNavigation}
      disabled={navigation.isPending}
    >
      {navigation.isPending ? 'Navigating...' : 'Navigate'}
    </button>
  );
}
```

### Progress Indicators

**Before (Manual implementation):**
```typescript
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

function NavigationWithProgress() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigation = () => {
    startTransition(() => {
      router.push('/about');
    });
  };

  return (
    <div>
      {isPending && <div className="loading-bar">Loading...</div>}
      <button onClick={handleNavigation} disabled={isPending}>
        Navigate
      </button>
    </div>
  );
}
```

**After (@vooteam/next-navigation):**
```typescript
// app/layout.tsx
import { ProgressProvider } from '@vooteam/next-navigation';

export default function Layout({ children }) {
  return (
    <ProgressProvider>
      {children}
    </ProgressProvider>
  );
}

// component
import { useNavigation } from '@vooteam/next-navigation';

function NavigationWithProgress() {
  const navigation = useNavigation();

  return (
    <button 
      onClick={() => navigation.push('/about')}
      disabled={navigation.isPending}
    >
      Navigate
    </button>
  );
}
```

### Link Components

**Before (Standard Next.js Link):**
```typescript
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href={`/users/${userId}`}>User Profile</Link>
    </nav>
  );
}
```

**After (Type-safe NextLink):**
```typescript
import { NextLink } from '@vooteam/next-navigation';

// With typed routes
const routes = {
  about: '/about',
  user: { path: '/users/[id]', params: { id: '' } as { id: string } }
};

function Navigation() {
  return (
    <nav>
      <NextLink route="about">About</NextLink>
      <NextLink route="user" id="123">User Profile</NextLink>
    </nav>
  );
}
```

## From React Router

### Route Definitions

**Before (React Router):**
```typescript
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

function NavigationComponent() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/about');
    // Limited loading state support
  };

  return <button onClick={handleNavigation}>Navigate</button>;
}
```

**After (Next.js with @vooteam/next-navigation):**
```typescript
// Next.js handles routing through file system
// app/page.tsx -> /
// app/about/page.tsx -> /about
// app/users/[id]/page.tsx -> /users/:id

// Define typed routes
const routes = {
  home: '/',
  about: '/about',
  user: { path: '/users/[id]', params: { id: '' } as { id: string } }
} as const;

const { useNavigation } = createNextNavigation({ routes });

function NavigationComponent() {
  const navigation = useNavigation();

  const handleNavigation = async () => {
    await navigation.push('about');
    // Full async support with loading states
  };

  return (
    <button 
      onClick={handleNavigation}
      disabled={navigation.isPending}
    >
      {navigation.isPending ? 'Navigating...' : 'Navigate'}
    </button>
  );
}
```

### Programmatic Navigation

**Before (React Router):**
```typescript
import { useNavigate, useLocation } from 'react-router-dom';

function NavigationHooks() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => navigate(-1);
  const goToUser = (id: string) => navigate(`/users/${id}`);
  const replaceRoute = () => navigate('/login', { replace: true });

  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <button onClick={goBack}>Back</button>
      <button onClick={() => goToUser('123')}>User</button>
      <button onClick={replaceRoute}>Login (Replace)</button>
    </div>
  );
}
```

**After (@vooteam/next-navigation):**
```typescript
import { useNavigation } from '@vooteam/next-navigation';
import { usePathname } from 'next/navigation';

function NavigationHooks() {
  const navigation = useNavigation();
  const pathname = usePathname();

  const goBack = async () => await navigation.back();
  const goToUser = async (id: string) => await navigation.push('user', { id });
  const replaceRoute = async () => await navigation.replace('/login');

  return (
    <div>
      <p>Current path: {pathname}</p>
      <button onClick={goBack} disabled={navigation.isPending}>
        Back
      </button>
      <button onClick={() => goToUser('123')} disabled={navigation.isPending}>
        User
      </button>
      <button onClick={replaceRoute} disabled={navigation.isPending}>
        Login (Replace)
      </button>
    </div>
  );
}
```

## Common Migration Patterns

### Loading States

**Old Pattern:**
```typescript
// Manual loading state management
const [isLoading, setIsLoading] = useState(false);

const handleNavigation = async () => {
  setIsLoading(true);
  try {
    router.push('/route');
    // No way to know when complete
  } finally {
    setTimeout(() => setIsLoading(false), 1000); // Guess
  }
};
```

**New Pattern:**
```typescript
// Automatic loading state management
const navigation = useNavigation();

const handleNavigation = async () => {
  await navigation.push('/route');
  // Navigation completion is guaranteed
};

// Use navigation.isPending for loading state
```

### Error Handling

**Old Pattern:**
```typescript
const handleNavigation = () => {
  try {
    router.push('/route');
    // No way to catch navigation errors
  } catch (error) {
    // This won't catch routing errors
  }
};
```

**New Pattern:**
```typescript
const handleNavigation = async () => {
  try {
    await navigation.push('/route');
  } catch (error) {
    // Properly handle navigation errors
    console.error('Navigation failed:', error);
  }
};
```

### Route Parameters

**Old Pattern:**
```typescript
// String interpolation with potential errors
const navigateToUser = (id: string) => {
  router.push(`/users/${id}`);
};

// Or object syntax
const navigateToPost = (category: string, slug: string) => {
  router.push({
    pathname: '/blog/[category]/[slug]',
    query: { category, slug }
  });
};
```

**New Pattern:**
```typescript
// Type-safe parameter handling
const routes = {
  user: { path: '/users/[id]', params: { id: '' } as { id: string } },
  blog: { 
    path: '/blog/[category]/[slug]', 
    params: { category: '', slug: '' } as { category: string; slug: string } 
  }
};

const navigation = useNavigation({ routes });

const navigateToUser = async (id: string) => {
  await navigation.push('user', { id }); // Type-safe
};

const navigateToPost = async (category: string, slug: string) => {
  await navigation.push('blog', { category, slug }); // Type-safe
};
```

## Breaking Changes

### 1. Async Navigation

- **Before**: `router.push()` returns void
- **After**: `navigation.push()` returns Promise<void>

### 2. Loading State Access

- **Before**: Manual event listeners or state management
- **After**: Built-in `navigation.isPending` property

### 3. Route Configuration

- **Before**: Routes defined in file system only
- **After**: Optional typed route definitions for better DX

### 4. Progress Indicators

- **Before**: Manual implementation required
- **After**: Built-in ProgressProvider component

## Migration Checklist

### Phase 1: Setup

- [ ] Install `@vooteam/next-navigation`
- [ ] Add `ProgressProvider` to root layout
- [ ] Update imports from `next/router` or `next/navigation`

### Phase 2: Basic Migration

- [ ] Replace `useRouter()` with `useNavigation()`
- [ ] Update navigation calls to use async/await
- [ ] Replace manual loading states with `navigation.isPending`
- [ ] Test basic navigation functionality

### Phase 3: Enhanced Features

- [ ] Define typed routes (optional but recommended)
- [ ] Migrate Link components to NextLink
- [ ] Configure progress bar styling
- [ ] Add error handling for navigation

### Phase 4: Testing & Optimization

- [ ] Update test mocks for new navigation
- [ ] Verify all navigation paths work correctly
- [ ] Check performance impact
- [ ] Update documentation

### Example Migration Script

```bash
#!/bin/bash

# Install the new package
npm install @vooteam/next-navigation

# Remove old dependencies if no longer needed
# npm uninstall react-router-dom

# Search for files to migrate
echo "Files using old navigation:"
grep -r "useRouter\|useNavigate" src/ --include="*.tsx" --include="*.ts"

echo "Migration complete! Review the changes and test thoroughly."
```

### Automated Migration Helper

```typescript
// migration-helper.ts
import { codemod } from 'jscodeshift';

// Example codemod to automate basic migration
const transform = (source: string) => {
  return source
    .replace(/import { useRouter } from 'next\/router'/g, 
             "import { useNavigation } from '@vooteam/next-navigation'")
    .replace(/const router = useRouter\(\)/g, 
             'const navigation = useNavigation()')
    .replace(/router\.push\(/g, 
             'await navigation.push(')
    .replace(/router\.replace\(/g, 
             'await navigation.replace(')
    .replace(/router\.back\(/g, 
             'await navigation.back(');
};
```

This migration guide should help you transition smoothly from your current navigation solution to `@vooteam/next-navigation` while taking advantage of all the new features and improvements.
