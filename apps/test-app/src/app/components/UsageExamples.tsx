'use client';

import { NextLink, useNavigation } from '../../navigation';

const UsageExamples = () => {
  const navigation = useNavigation();

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: '#1f2937',
          textAlign: 'center',
        }}
      >
        📚 Usage Examples
      </h1>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
        }}
      >
        {/* Code Example 1: Basic Setup */}
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151',
            }}
          >
            1. 🚀 Basic Setup
          </h2>
          <pre
            style={{
              backgroundColor: '#1f2937',
              color: '#f3f4f6',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              overflow: 'auto',
            }}
          >
            {`// src/navigation/routes.ts
export const routes = {
  home: '/',
  about: '/about',
  product: {
    path: '/products/[productId]',
    params: undefined as undefined | { productId: string }
  }
} as const;

// src/navigation/index.ts
import { createNextNavigation } from '@vooteam/next-navigation';
import { routes } from './routes';

export const { useNavigation, NextLink } = createNextNavigation({
  routes,
  enableProgress: true
});`}
          </pre>
        </div>

        {/* Code Example 2: Navigation Hook */}
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151',
            }}
          >
            2. 🎯 Navigation Hook Usage
          </h2>
          <pre
            style={{
              backgroundColor: '#1f2937',
              color: '#f3f4f6',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              overflow: 'auto',
            }}
          >
            {`import { useNavigation } from '../navigation';

function MyComponent() {
  const navigation = useNavigation();

  const handleClick = async () => {
    // Simple navigation
    await navigation.push('about');
    
    // With parameters
    await navigation.push('product', { productId: '123' });
    
    // Replace instead of push
    await navigation.replace('home');
    
    // Go back
    await navigation.back();
  };

  return (
    <div>
      <button onClick={handleClick}>Navigate</button>
      {navigation.isPending && <span>Loading...</span>}
    </div>
  );
}`}
          </pre>
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() =>
                navigation.push('product', { productId: 'demo-123' })
              }
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Try Navigation Hook
            </button>
          </div>
        </div>

        {/* Code Example 3: NextLink Component */}
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151',
            }}
          >
            3. 🔗 NextLink Component Usage
          </h2>
          <pre
            style={{
              backgroundColor: '#1f2937',
              color: '#f3f4f6',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              overflow: 'auto',
            }}
          >
            {`import { NextLink } from '../navigation';

function MyComponent() {
  return (
    <div>
      {/* Simple link */}
      <NextLink route="home">Home</NextLink>
      
      {/* Link with parameters */}
      <NextLink route="product" productId="abc123">
        View Product
      </NextLink>
      
      {/* With styling and Next.js props */}
      <NextLink 
        route="about"
        className="nav-link"
        prefetch={false}
        style={{ color: 'blue' }}
      >
        About Us
      </NextLink>
    </div>
  );
}`}
          </pre>
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <NextLink
              route="home"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#059669',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
              }}
            >
              Home Link
            </NextLink>
            <NextLink
              route="product"
              productId="example-789"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
              }}
            >
              Product Link
            </NextLink>
          </div>
        </div>

        {/* Code Example 4: Advanced Types */}
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151',
            }}
          >
            4. 🎯 Advanced Type Definitions
          </h2>
          <pre
            style={{
              backgroundColor: '#1f2937',
              color: '#f3f4f6',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              overflow: 'auto',
            }}
          >
            {`export const routes = {
  // Simple routes
  home: '/',
  
  // Dynamic routes with required params
  product: {
    path: '/products/[productId]',
    params: undefined as undefined | {
      productId: string;
    }
  },
  
  // Routes with optional and union types
  login: {
    path: '/login',
    params: undefined as undefined | {
      returnUrl?: string;
      source?: 'header' | 'footer' | 'modal';
    }
  },
  
  // Complex nested parameters
  search: {
    path: '/search',
    params: undefined as undefined | {
      query: string;
      filters?: {
        category?: string;
        priceRange?: [number, number];
      };
    }
  }
} as const;`}
          </pre>
        </div>

        {/* Benefits */}
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #10b981',
            borderRadius: '8px',
            backgroundColor: '#ecfdf5',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#059669',
            }}
          >
            ✨ Benefits
          </h2>
          <ul
            style={{
              color: '#065f46',
              lineHeight: '1.6',
              paddingLeft: '1.5rem',
            }}
          >
            <li>
              <strong>Type Safety:</strong> Full TypeScript support with
              autocomplete
            </li>
            <li>
              <strong>Parameter Validation:</strong> Compile-time parameter
              checking
            </li>
            <li>
              <strong>Progress Integration:</strong> Built-in loading states
            </li>
            <li>
              <strong>Centralized Routes:</strong> All routes defined in one
              place
            </li>
            <li>
              <strong>Next.js Compatible:</strong> Works with all Next.js
              features
            </li>
            <li>
              <strong>Async Support:</strong> Promise-based navigation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsageExamples;
