# Examples

Comprehensive examples demonstrating how to use `@vooteam/next-navigation` in real-world scenarios.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Progress Bar Examples](#progress-bar-examples)
- [Type-Safe Routes](#type-safe-routes)
- [Advanced Patterns](#advanced-patterns)
- [Integration Examples](#integration-examples)
- [Testing Examples](#testing-examples)

## Basic Examples

### Simple Navigation

```typescript
// components/SimpleNavigation.tsx
'use client';

import { useNavigation } from '@vooteam/next-navigation';

export default function SimpleNavigation() {
  const navigation = useNavigation();

  return (
    <nav className="flex gap-4 p-4">
      <button 
        onClick={() => navigation.push('/about')}
        disabled={navigation.isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        About
      </button>
      
      <button 
        onClick={() => navigation.push('/products')}
        disabled={navigation.isPending}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        Products
      </button>
      
      <button 
        onClick={() => navigation.back()}
        disabled={navigation.isPending}
        className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
      >
        ← Back
      </button>
    </nav>
  );
}
```

### Navigation with Options

```typescript
// components/NavigationWithOptions.tsx
'use client';

import { useNavigation } from '@vooteam/next-navigation';

export default function NavigationWithOptions() {
  const navigation = useNavigation();

  const handleNavigateWithoutScroll = async () => {
    // Navigate without scrolling to top
    await navigation.push('/long-page', { scroll: false });
  };

  const handleReplaceRoute = async () => {
    // Replace current route (won't add to history)
    await navigation.replace('/dashboard');
  };

  return (
    <div className="space-y-4 p-4">
      <button 
        onClick={handleNavigateWithoutScroll}
        className="block px-4 py-2 bg-purple-500 text-white rounded"
      >
        Navigate (No Scroll)
      </button>
      
      <button 
        onClick={handleReplaceRoute}
        className="block px-4 py-2 bg-orange-500 text-white rounded"
      >
        Replace Route
      </button>
      
      {navigation.isPending && (
        <div className="text-sm text-gray-600">
          Navigation in progress...
        </div>
      )}
    </div>
  );
}
```

## Progress Bar Examples

### Basic Progress Setup

```typescript
// app/layout.tsx
import { ProgressProvider } from '@vooteam/next-navigation';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProgressProvider>
          <main>{children}</main>
        </ProgressProvider>
      </body>
    </html>
  );
}
```

### Custom Progress Themes

```typescript
// components/ThemedProgressProvider.tsx
import { ProgressProvider, ProgressConfig } from '@vooteam/next-navigation';
import { ReactNode } from 'react';

const progressThemes = {
  default: {
    color: '#3b82f6',
    height: 3,
    showSpinner: true,
    shadow: true,
  },
  minimal: {
    color: '#6b7280',
    height: 1,
    showSpinner: false,
    shadow: false,
    speed: 100,
  },
  dramatic: {
    color: '#f59e0b',
    height: 5,
    showSpinner: true,
    shadow: true,
    speed: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dark: {
    color: '#60a5fa',
    height: 2,
    showSpinner: true,
    shadow: true,
  },
} satisfies Record<string, ProgressConfig>;

interface ThemedProgressProviderProps {
  children: ReactNode;
  theme?: keyof typeof progressThemes;
}

export default function ThemedProgressProvider({ 
  children, 
  theme = 'default' 
}: ThemedProgressProviderProps) {
  return (
    <ProgressProvider config={progressThemes[theme]}>
      {children}
    </ProgressProvider>
  );
}
```

### Manual Progress Control

```typescript
// components/ManualProgressControl.tsx
'use client';

import { useProgress } from '@vooteam/next-navigation';
import { useState } from 'react';

export default function ManualProgressControl() {
  const progress = useProgress();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLongOperation = async () => {
    setIsProcessing(true);
    progress.start();
    
    try {
      // Simulate long operation
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Operation completed');
    } finally {
      progress.complete();
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleLongOperation}
        disabled={isProcessing}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Start Long Operation'}
      </button>
      
      {progress.isLoading && (
        <div className="mt-2 text-sm text-blue-600">
          Progress indicator is active
        </div>
      )}
    </div>
  );
}
```

## Type-Safe Routes

### Route Definitions

```typescript
// lib/routes.ts
export const routes = {
  // Simple routes
  home: '/',
  about: '/about',
  contact: '/contact',
  
  // Parameterized routes
  user: {
    path: '/users/[id]',
    params: { id: '' } as { id: string }
  },
  
  // Multiple parameters
  blog: {
    path: '/blog/[category]/[slug]',
    params: { 
      category: '', 
      slug: '' 
    } as { 
      category: string; 
      slug: string; 
    }
  },
  
  // Optional parameters
  product: {
    path: '/products/[id]',
    params: { 
      id: '',
      tab: 'overview'
    } as { 
      id: string; 
      tab?: string; 
    }
  },
  
  // Nested routes
  admin: {
    path: '/admin/[section]/[action]',
    params: {
      section: '',
      action: ''
    } as {
      section: 'users' | 'products' | 'orders';
      action: 'list' | 'create' | 'edit';
    }
  }
} as const;

export type AppRoutes = typeof routes;
```

### Typed Navigation Setup

```typescript
// lib/navigation.ts
import { createNextNavigation } from '@vooteam/next-navigation';
import { routes } from './routes';

export const { useNavigation, NextLink } = createNextNavigation({
  routes,
  enableProgress: true
});

// Export types for use in other files
export type { AppRoutes } from './routes';
```

### Using Typed Navigation

```typescript
// components/TypedNavigationExample.tsx
'use client';

import { useNavigation, NextLink } from '../lib/navigation';

export default function TypedNavigationExample() {
  const navigation = useNavigation();

  const handleUserNavigation = async () => {
    // TypeScript validates route keys and parameters
    await navigation.push('user', { id: '123' });
  };

  const handleBlogNavigation = async () => {
    await navigation.push('blog', { 
      category: 'technology', 
      slug: 'nextjs-13-features' 
    });
  };

  const handleAdminNavigation = async () => {
    await navigation.push('admin', { 
      section: 'users', 
      action: 'create' 
    });
  };

  return (
    <div className="space-y-4 p-4">
      {/* Programmatic navigation */}
      <div className="space-x-2">
        <button 
          onClick={handleUserNavigation}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          User Profile
        </button>
        
        <button 
          onClick={handleBlogNavigation}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Tech Blog Post
        </button>
        
        <button 
          onClick={handleAdminNavigation}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Admin Panel
        </button>
      </div>

      {/* Declarative navigation with NextLink */}
      <nav className="space-x-4">
        <NextLink 
          route="home" 
          className="text-blue-600 hover:underline"
        >
          Home
        </NextLink>
        
        <NextLink 
          route="user" 
          id="456"
          className="text-blue-600 hover:underline"
        >
          Another User
        </NextLink>
        
        <NextLink 
          route="product" 
          id="laptop-123"
          tab="reviews"
          className="text-blue-600 hover:underline"
        >
          Product Reviews
        </NextLink>
      </nav>
    </div>
  );
}
```

## Advanced Patterns

### Error Handling with Retry

```typescript
// components/NavigationWithRetry.tsx
'use client';

import { useNavigation } from '@vooteam/next-navigation';
import { useState } from 'react';

export default function NavigationWithRetry() {
  const navigation = useNavigation();
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleNavigationWithRetry = async (href: string, maxRetries = 3) => {
    try {
      setError(null);
      await navigation.push(href);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Navigation failed';
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        console.log(`Retrying navigation (attempt ${retryCount + 1}/${maxRetries})`);
        
        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          handleNavigationWithRetry(href, maxRetries);
        }, delay);
      } else {
        setError(`${errorMessage} (failed after ${maxRetries} attempts)`);
        setRetryCount(0);
      }
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-900 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}
      
      <button
        onClick={() => handleNavigationWithRetry('/potentially-failing-route')}
        disabled={navigation.isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {navigation.isPending ? 'Navigating...' : 'Navigate with Retry'}
      </button>
      
      {retryCount > 0 && (
        <div className="mt-2 text-sm text-yellow-600">
          Retry attempt: {retryCount}
        </div>
      )}
    </div>
  );
}
```

### Loading Overlay

```typescript
// components/NavigationWithOverlay.tsx
'use client';

import { useNavigation } from '@vooteam/next-navigation';

export default function NavigationWithOverlay() {
  const navigation = useNavigation();

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <div className="space-y-2 p-4">
        <button 
          onClick={() => navigation.push('/slow-page')}
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go to Slow Page
        </button>
        
        <button 
          onClick={() => navigation.push('/dashboard')}
          className="block w-full px-4 py-2 bg-green-500 text-white rounded"
        >
          Go to Dashboard
        </button>
      </div>

      {/* Loading overlay */}
      {navigation.isPending && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-700">Navigating...</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Navigation Guard

```typescript
// components/NavigationGuard.tsx
'use client';

import { useNavigation } from '@vooteam/next-navigation';
import { useState } from 'react';

interface NavigationGuardProps {
  onNavigate?: (route: string) => boolean | Promise<boolean>;
  children: React.ReactNode;
}

export default function NavigationGuard({ 
  onNavigate, 
  children 
}: NavigationGuardProps) {
  const navigation = useNavigation();
  const [isBlocked, setIsBlocked] = useState(false);

  const guardedPush = async (route: string, options?: any) => {
    setIsBlocked(false);
    
    if (onNavigate) {
      const canNavigate = await onNavigate(route);
      if (!canNavigate) {
        setIsBlocked(true);
        return;
      }
    }
    
    await navigation.push(route, options);
  };

  const guardedReplace = async (route: string, options?: any) => {
    setIsBlocked(false);
    
    if (onNavigate) {
      const canNavigate = await onNavigate(route);
      if (!canNavigate) {
        setIsBlocked(true);
        return;
      }
    }
    
    await navigation.replace(route, options);
  };

  return (
    <div>
      {isBlocked && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Navigation blocked by guard
        </div>
      )}
      
      {/* Provide guarded navigation through context */}
      <div>
        {children}
        
        {/* Example usage */}
        <button 
          onClick={() => guardedPush('/protected-route')}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Go to Protected Route
        </button>
      </div>
    </div>
  );
}

// Usage example
function App() {
  const handleNavigationGuard = async (route: string) => {
    if (route.includes('protected')) {
      // Check authentication, show modal, etc.
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        alert('Please log in to access this page');
        return false;
      }
    }
    return true;
  };

  return (
    <NavigationGuard onNavigate={handleNavigationGuard}>
      {/* Your app content */}
    </NavigationGuard>
  );
}
```

## Integration Examples

### Server Actions Integration

```typescript
// app/actions.ts
'use server';

export async function submitForm(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!name || !email) {
      return { success: false, error: 'Name and email are required' };
    }
    
    return { success: true, data: { name, email } };
  } catch (error) {
    return { success: false, error: 'Server error occurred' };
  }
}
```

```typescript
// components/FormWithNavigation.tsx
'use client';

import { useNavigation } from '@vooteam/next-navigation';
import { submitForm } from '../actions';
import { useState } from 'react';

export default function FormWithNavigation() {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const result = await submitForm(formData);
      
      if (result.success) {
        setMessage('Form submitted successfully!');
        // Navigate on success
        await navigation.push('/success');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || navigation.isPending}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isSubmitting || navigation.isPending ? 'Processing...' : 'Submit'}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
```

### React Query Integration

```typescript
// components/NavigationWithQuery.tsx
'use client';

import { useNavigation } from '@vooteam/next-navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function NavigationWithQuery() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/user').then(res => res.json()),
  });

  const handleNavigateWithPrefetch = async (route: string, prefetchKey: string) => {
    // Prefetch data before navigation
    await queryClient.prefetchQuery({
      queryKey: [prefetchKey],
      queryFn: () => fetch(`/api/${prefetchKey}`).then(res => res.json()),
    });
    
    await navigation.push(route);
  };

  const handleNavigateWithInvalidation = async (route: string) => {
    // Invalidate cache before navigation
    await queryClient.invalidateQueries({ queryKey: ['user'] });
    await navigation.push(route);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-sm text-gray-600">
        Current user: {user?.name || 'Loading...'}
      </div>
      
      <button
        onClick={() => handleNavigateWithPrefetch('/dashboard', 'dashboard')}
        className="block px-4 py-2 bg-blue-500 text-white rounded"
      >
        Dashboard (with prefetch)
      </button>
      
      <button
        onClick={() => handleNavigateWithInvalidation('/profile')}
        className="block px-4 py-2 bg-green-500 text-white rounded"
      >
        Profile (invalidate cache)
      </button>
    </div>
  );
}
```

## Testing Examples

### Basic Component Testing

```typescript
// __tests__/NavigationComponent.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProgressProvider } from '@vooteam/next-navigation';
import NavigationComponent from '../components/NavigationComponent';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('NavigationComponent', () => {
  it('renders navigation buttons', () => {
    render(
      <TestWrapper>
        <NavigationComponent />
      </TestWrapper>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('shows loading state during navigation', async () => {
    render(
      <TestWrapper>
        <NavigationComponent />
      </TestWrapper>
    );

    const aboutButton = screen.getByText('About');
    fireEvent.click(aboutButton);

    // Check if loading state is shown
    expect(screen.getByText('Navigating...')).toBeInTheDocument();

    // Wait for navigation to complete
    await waitFor(() => {
      expect(screen.queryByText('Navigating...')).not.toBeInTheDocument();
    });
  });
});
```

### Testing with Custom Hooks

```typescript
// __tests__/useNavigation.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useNavigation, ProgressProvider } from '@vooteam/next-navigation';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('useNavigation', () => {
  it('provides navigation functions', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    expect(result.current.push).toBeDefined();
    expect(result.current.replace).toBeDefined();
    expect(result.current.back).toBeDefined();
    expect(result.current.isPending).toBe(false);
  });

  it('updates pending state during navigation', async () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    act(() => {
      result.current.push('/test');
    });

    expect(result.current.isPending).toBe(true);

    // Wait for navigation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.isPending).toBe(false);
  });
});
```

### E2E Testing with Playwright

```typescript
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navigates between pages with progress bar', async ({ page }) => {
    await page.goto('/');

    // Check initial page
    await expect(page.locator('h1')).toContainText('Home');

    // Click navigation button
    await page.click('button:has-text("About")');

    // Check for progress bar (might be brief)
    const progressBar = page.locator('[role="progressbar"]');
    
    // Wait for navigation to complete
    await expect(page.locator('h1')).toContainText('About');
    await expect(page).toHaveURL('/about');
  });

  test('shows loading state during navigation', async ({ page }) => {
    await page.goto('/');

    // Click button and immediately check for loading state
    const aboutButton = page.locator('button:has-text("About")');
    await aboutButton.click();

    // Check that button shows loading state
    await expect(aboutButton).toContainText('Navigating...');
    await expect(aboutButton).toBeDisabled();

    // Wait for navigation to complete
    await expect(page).toHaveURL('/about');
    await expect(aboutButton).not.toBeDisabled();
  });
});
```

These examples demonstrate various real-world usage patterns and can serve as a starting point for implementing the library in your Next.js applications.
