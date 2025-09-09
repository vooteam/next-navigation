# Testing Guide

Comprehensive guide for testing applications that use `@vooteam/next-navigation`.

## Table of Contents

- [Test Setup](#test-setup)
- [Component Testing](#component-testing)
- [Hook Testing](#hook-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Testing Patterns](#testing-patterns)
- [Mock Utilities](#mock-utilities)

## Test Setup

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

module.exports = createJestConfig(customJestConfig);
```

### Test Setup File

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));
```

### TypeScript Test Configuration

```json
// tsconfig.test.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "types": ["jest", "@testing-library/jest-dom"]
  },
  "include": [
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "jest.setup.js"
  ]
}
```

## Component Testing

### Basic Navigation Component

```typescript
// components/Navigation.tsx
'use client';

import { useNavigation } from '@vooteam/next-navigation';

export default function Navigation() {
  const navigation = useNavigation();

  return (
    <nav>
      <button onClick={() => navigation.push('/about')}>
        About
      </button>
      <button onClick={() => navigation.push('/contact')}>
        Contact
      </button>
      <button onClick={() => navigation.back()}>
        Back
      </button>
      {navigation.isPending && <div data-testid="loading">Loading...</div>}
    </nav>
  );
}
```

```typescript
// __tests__/Navigation.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProgressProvider } from '@vooteam/next-navigation';
import Navigation from '../components/Navigation';

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('Navigation Component', () => {
  it('renders navigation buttons', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('shows loading state during navigation', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const aboutButton = screen.getByText('About');
    fireEvent.click(aboutButton);

    // Check if loading state appears
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for navigation to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('disables buttons during navigation', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const aboutButton = screen.getByText('About');
    const contactButton = screen.getByText('Contact');

    fireEvent.click(aboutButton);

    // Buttons should be disabled during navigation
    expect(aboutButton).toBeDisabled();
    expect(contactButton).toBeDisabled();

    await waitFor(() => {
      expect(aboutButton).not.toBeDisabled();
      expect(contactButton).not.toBeDisabled();
    });
  });
});
```

### Testing with Typed Routes

```typescript
// lib/navigation.ts
import { createNextNavigation } from '@vooteam/next-navigation';

const routes = {
  home: '/',
  about: '/about',
  user: { path: '/users/[id]', params: { id: '' } as { id: string } }
} as const;

export const { useNavigation, NextLink } = createNextNavigation({
  routes,
  enableProgress: true
});
```

```typescript
// components/TypedNavigation.tsx
import { useNavigation, NextLink } from '../lib/navigation';

export default function TypedNavigation() {
  const navigation = useNavigation();

  return (
    <div>
      <button onClick={() => navigation.push('about')}>
        About (Typed)
      </button>
      <button onClick={() => navigation.push('user', { id: '123' })}>
        User Profile
      </button>
      <NextLink route="home">Home Link</NextLink>
      <NextLink route="user" id="456">User Link</NextLink>
    </div>
  );
}
```

```typescript
// __tests__/TypedNavigation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressProvider } from '@vooteam/next-navigation';
import TypedNavigation from '../components/TypedNavigation';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('TypedNavigation Component', () => {
  it('renders typed navigation elements', () => {
    render(
      <TestWrapper>
        <TypedNavigation />
      </TestWrapper>
    );

    expect(screen.getByText('About (Typed)')).toBeInTheDocument();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Home Link')).toBeInTheDocument();
    expect(screen.getByText('User Link')).toBeInTheDocument();
  });

  it('handles typed route navigation', () => {
    const mockPush = jest.fn();
    
    // Mock the navigation hook
    jest.doMock('../lib/navigation', () => ({
      useNavigation: () => ({
        push: mockPush,
        isPending: false
      }),
      NextLink: ({ children, route, ...props }: any) => (
        <a data-route={route} {...props}>{children}</a>
      )
    }));

    render(
      <TestWrapper>
        <TypedNavigation />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('About (Typed)'));
    expect(mockPush).toHaveBeenCalledWith('about');

    fireEvent.click(screen.getByText('User Profile'));
    expect(mockPush).toHaveBeenCalledWith('user', { id: '123' });
  });
});
```

## Hook Testing

### Testing useNavigation Hook

```typescript
// __tests__/useNavigation.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useNavigation, ProgressProvider } from '@vooteam/next-navigation';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('useNavigation Hook', () => {
  it('provides navigation methods', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    expect(typeof result.current.push).toBe('function');
    expect(typeof result.current.replace).toBe('function');
    expect(typeof result.current.back).toBe('function');
    expect(typeof result.current.isPending).toBe('boolean');
  });

  it('starts with isPending false', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    expect(result.current.isPending).toBe(false);
  });

  it('updates isPending during navigation', async () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    // Start navigation
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

  it('handles navigation with options', async () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    await act(async () => {
      await result.current.push('/test', { scroll: false });
    });

    // Should complete without errors
    expect(result.current.isPending).toBe(false);
  });
});
```

### Testing useProgress Hook

```typescript
// __tests__/useProgress.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useProgress, ProgressProvider } from '@vooteam/next-navigation';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('useProgress Hook', () => {
  it('provides progress control methods', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    expect(typeof result.current.start).toBe('function');
    expect(typeof result.current.complete).toBe('function');
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('updates loading state', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.start();
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.complete();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('handles multiple start/complete cycles', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    // First cycle
    act(() => {
      result.current.start();
    });
    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.complete();
    });
    expect(result.current.isLoading).toBe(false);

    // Second cycle
    act(() => {
      result.current.start();
    });
    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.complete();
    });
    expect(result.current.isLoading).toBe(false);
  });
});
```

## Integration Testing

### Testing Form Submission with Navigation

```typescript
// components/ContactForm.tsx
'use client';

import { useNavigation } from '@vooteam/next-navigation';
import { useState } from 'react';

export default function ContactForm() {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await navigation.push('/thank-you');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Your name"
        required
        data-testid="name-input"
      />
      <input
        name="email"
        type="email"
        placeholder="Your email"
        required
        data-testid="email-input"
      />
      <textarea
        name="message"
        placeholder="Your message"
        required
        data-testid="message-input"
      />
      <button
        type="submit"
        disabled={isSubmitting || navigation.isPending}
        data-testid="submit-button"
      >
        {isSubmitting || navigation.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

```typescript
// __tests__/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProgressProvider } from '@vooteam/next-navigation';
import ContactForm from '../components/ContactForm';

// Mock fetch
global.fetch = jest.fn();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('ContactForm Integration', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('submits form and navigates on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <TestWrapper>
        <ContactForm />
      </TestWrapper>
    );

    // Fill out form
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByTestId('message-input'), {
      target: { value: 'Hello world' },
    });

    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Check submitting state
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.queryByText('Submitting...')).not.toBeInTheDocument();
    });

    // Verify fetch was called
    expect(fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      body: expect.any(FormData),
    });
  });

  it('handles submission errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <ContactForm />
      </TestWrapper>
    );

    // Fill and submit form
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'John Doe' },
    });
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for error handling
    await waitFor(() => {
      expect(screen.queryByText('Submitting...')).not.toBeInTheDocument();
    });

    // Form should be available for retry
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });
});
```

## E2E Testing

### Playwright Tests

```typescript
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation E2E', () => {
  test('basic navigation flow', async ({ page }) => {
    await page.goto('/');

    // Check initial state
    await expect(page.locator('h1')).toContainText('Home');

    // Navigate to about page
    await page.click('button:has-text("About")');

    // Check for progress bar
    const progressBar = page.locator('[role="progressbar"]');
    // Note: Progress bar might be very brief, so we check if it exists or has finished
    
    // Wait for navigation to complete
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');

    // Test back navigation
    await page.click('button:has-text("Back")');
    await expect(page).toHaveURL('/');
  });

  test('progress bar visibility', async ({ page }) => {
    await page.goto('/');

    // Add artificial delay to make progress bar visible
    await page.route('/about', route => {
      setTimeout(() => route.continue(), 500);
    });

    // Click navigation button
    await page.click('button:has-text("About")');

    // Check for progress bar
    await expect(page.locator('[role="progressbar"]')).toBeVisible();

    // Wait for navigation to complete
    await expect(page).toHaveURL('/about');
    await expect(page.locator('[role="progressbar"]')).toBeHidden();
  });

  test('disabled state during navigation', async ({ page }) => {
    await page.goto('/');

    // Add delay to see disabled state
    await page.route('/about', route => {
      setTimeout(() => route.continue(), 300);
    });

    const aboutButton = page.locator('button:has-text("About")');
    
    // Click button
    await aboutButton.click();

    // Check if button is disabled
    await expect(aboutButton).toBeDisabled();
    await expect(aboutButton).toContainText('Navigating...');

    // Wait for navigation to complete
    await expect(page).toHaveURL('/about');
  });

  test('typed route navigation', async ({ page }) => {
    await page.goto('/typed-navigation');

    // Navigate to user profile
    await page.click('button:has-text("User Profile")');
    await expect(page).toHaveURL('/users/123');

    // Check user page content
    await expect(page.locator('h1')).toContainText('User Profile');
  });
});
```

### Cypress Tests

```typescript
// cypress/e2e/navigation.cy.ts
describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigates between pages with progress indication', () => {
    // Check initial page
    cy.contains('h1', 'Home').should('be.visible');

    // Navigate to about page
    cy.contains('button', 'About').click();

    // Check for progress bar (if visible)
    cy.get('[role="progressbar"]').should('exist');

    // Wait for navigation to complete
    cy.url().should('include', '/about');
    cy.contains('h1', 'About').should('be.visible');
  });

  it('shows loading state during navigation', () => {
    // Intercept route with delay
    cy.intercept('GET', '/about', { delay: 500 }).as('aboutPage');

    // Click navigation button
    cy.contains('button', 'About').click();

    // Check loading state
    cy.contains('button', 'Navigating...').should('be.visible');
    cy.contains('button', 'About').should('be.disabled');

    // Wait for navigation
    cy.wait('@aboutPage');
    cy.url().should('include', '/about');
  });

  it('handles back navigation', () => {
    // Navigate to about page
    cy.contains('button', 'About').click();
    cy.url().should('include', '/about');

    // Go back
    cy.contains('button', 'Back').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
```

## Testing Patterns

### Custom Test Utilities

```typescript
// test-utils/navigation.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ProgressProvider } from '@vooteam/next-navigation';
import { ReactElement } from 'react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  progressConfig?: Parameters<typeof ProgressProvider>[0]['config'];
}

const customRender = (
  ui: ReactElement,
  { progressConfig, ...options }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ProgressProvider config={progressConfig}>
      {children}
    </ProgressProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
```

### Mock Navigation Hook

```typescript
// test-utils/mocks.ts
import { UseNavigationReturn } from '@vooteam/next-navigation';

export const createMockNavigation = (
  overrides: Partial<UseNavigationReturn> = {}
): UseNavigationReturn => ({
  push: jest.fn().mockResolvedValue(undefined),
  replace: jest.fn().mockResolvedValue(undefined),
  back: jest.fn().mockResolvedValue(undefined),
  isPending: false,
  ...overrides,
});

export const mockNavigationModule = (navigation: Partial<UseNavigationReturn> = {}) => {
  jest.doMock('@vooteam/next-navigation', () => ({
    useNavigation: () => createMockNavigation(navigation),
    ProgressProvider: ({ children }: { children: React.ReactNode }) => children,
    useProgress: () => ({
      start: jest.fn(),
      complete: jest.fn(),
      isLoading: false,
    }),
  }));
};
```

### Test Component Factory

```typescript
// test-utils/components.tsx
import { useNavigation } from '@vooteam/next-navigation';

export const TestNavigationComponent = ({ 
  onNavigate 
}: { 
  onNavigate?: (route: string) => void 
}) => {
  const navigation = useNavigation();

  const handleClick = async (route: string) => {
    await navigation.push(route);
    onNavigate?.(route);
  };

  return (
    <div>
      <button onClick={() => handleClick('/about')}>About</button>
      <button onClick={() => handleClick('/contact')}>Contact</button>
      <button onClick={() => navigation.back()}>Back</button>
      {navigation.isPending && <div data-testid="loading">Loading</div>}
    </div>
  );
};
```

## Mock Utilities

### Complete Mock Setup

```typescript
// __mocks__/@vooteam/next-navigation.ts
export const useNavigation = jest.fn(() => ({
  push: jest.fn().mockResolvedValue(undefined),
  replace: jest.fn().mockResolvedValue(undefined),
  back: jest.fn().mockResolvedValue(undefined),
  isPending: false,
}));

export const useProgress = jest.fn(() => ({
  start: jest.fn(),
  complete: jest.fn(),
  isLoading: false,
}));

export const ProgressProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => children;

export const NextLink = ({ 
  children, 
  route, 
  ...props 
}: any) => (
  <a data-route={route} {...props}>
    {children}
  </a>
);

export const createNextNavigation = jest.fn(() => ({
  useNavigation,
  NextLink,
}));
```

### Advanced Mock with State

```typescript
// test-utils/advanced-mocks.ts
import { useState } from 'react';

export const createStatefulNavigationMock = () => {
  let isPending = false;
  const listeners: Array<(pending: boolean) => void> = [];

  const simulateNavigation = async () => {
    isPending = true;
    listeners.forEach(listener => listener(true));
    
    // Simulate navigation delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    isPending = false;
    listeners.forEach(listener => listener(false));
  };

  return {
    useNavigation: () => {
      const [pending, setPending] = useState(isPending);
      
      // Subscribe to pending state changes
      listeners.push(setPending);
      
      return {
        push: jest.fn(simulateNavigation),
        replace: jest.fn(simulateNavigation),
        back: jest.fn(simulateNavigation),
        isPending: pending,
      };
    },
    resetMock: () => {
      isPending = false;
      listeners.length = 0;
    },
  };
};
```

This testing guide provides comprehensive examples for testing all aspects of the `@vooteam/next-navigation` library, from unit tests to end-to-end testing scenarios.
