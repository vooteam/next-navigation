# Navigation Configuration

This folder contains the navigation setup for the test app, demonstrating how to use `@vooteam/next-navigation` with typed routes.

## Files

- `routes.ts` - Route definitions with typed parameters
- `index.ts` - Navigation factory instance creation

## Route Definitions

```typescript
export const routes = {
  // Simple string routes
  home: '/',
  about: '/about',
  products: '/products',

  // Dynamic routes with parameters
  product: {
    path: '/products/[productId]',
    params: undefined as
      | undefined
      | {
          productId: string;
        },
  },

  // Routes with typed parameters
  login: {
    path: '/login',
    params: undefined as
      | undefined
      | {
          returnUrl?: string;
          source?: 'header' | 'footer' | 'modal';
        },
  },
} as const;
```

## Usage Examples

### Using the Navigation Hook

```typescript
import { useNavigation } from '../../navigation';

function MyComponent() {
  const navigation = useNavigation();

  // Simple navigation
  const goToAbout = () => navigation.push('about');

  // Navigation with parameters
  const goToProduct = (id: string) => navigation.push('product', { productId: id });

  // Navigation with typed parameters
  const goToLogin = () =>
    navigation.push('login', {
      returnUrl: '/products',
      source: 'header',
    });

  return (
    <div>
      <button onClick={goToAbout}>About</button>
      <button onClick={() => goToProduct('123')}>Product 123</button>
      <button onClick={goToLogin}>Login</button>
    </div>
  );
}
```

### Using the NextLink Component

```typescript
import { NextLink } from '../../navigation';

function MyComponent() {
  return (
    <div>
      {/* Simple links */}
      <NextLink route="home">Home</NextLink>
      <NextLink route="about">About</NextLink>

      {/* Dynamic links with parameters */}
      <NextLink route="product" productId="laptop-123">
        View Laptop
      </NextLink>

      {/* Links with typed parameters */}
      <NextLink route="login" returnUrl="/products" source="header">
        Login
      </NextLink>

      {/* With additional Link props */}
      <NextLink route="about" className="nav-link" prefetch={false} scroll={false}>
        About (no prefetch)
      </NextLink>
    </div>
  );
}
```

## Type Safety

The navigation system provides full TypeScript support:

- ✅ Route name autocomplete
- ✅ Parameter type checking
- ✅ Required parameter validation
- ✅ Source union type validation
- ✅ All standard Next.js Link props supported

## Benefits

1. **Centralized Routes**: All routes defined in one place
2. **Type Safety**: Full TypeScript support with autocomplete
3. **Parameter Validation**: Compile-time parameter checking
4. **Consistent API**: Same interface for hooks and components
5. **Progress Integration**: Built-in loading states
6. **Next.js Compatible**: Works with all Next.js features
