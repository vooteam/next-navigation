'use client';

import { useNavigation, NextLink } from '../../navigation';

export default function TypeScriptTest() {
  const navigation = useNavigation();

  const testNavigation = async () => {
    // Type navigation.push(' and see auto-completion for route names
    await navigation.push('home');
    await navigation.push('about');
    await navigation.push('products');

    // For routes with parameters, you need to provide them as second argument
    await navigation.push('product', { productId: 'test-123' });
    await navigation.push('login', { returnUrl: '/products', source: 'modal' });

    // Optional parameters can be omitted
    await navigation.push('login', { source: 'header' });
    await navigation.push('api', { message: 'hello' });
  };

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h3>🔍 TypeScript Auto-completion Test</h3>
      <p>
        <strong>Test auto-completion by typing in your IDE:</strong>
      </p>
      <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
        <li>
          <code>navigation.push(&apos;</code> - should suggest route names
        </li>
        <li>
          <code>navigation.push(&apos;product&apos;, {'{'}</code> - should
          suggest productId
        </li>
        <li>
          <code>navigation.push(&apos;login&apos;, {'{'} source: &apos;</code> -
          should suggest &apos;header&apos; | &apos;footer&apos; |
          &apos;modal&apos;
        </li>
      </ul>

      {/* Test NextLink components */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <NextLink route="home">Home</NextLink>
        <NextLink route="about">About</NextLink>
        <NextLink route="products">Products</NextLink>
        <NextLink route="product" productId="test-123">
          Product Example
        </NextLink>
        <NextLink route="login" source="header" returnUrl="/products">
          Login Example
        </NextLink>
      </div>

      <button
        onClick={testNavigation}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Test Navigation Methods
      </button>
    </div>
  );
}
