'use client';

import { useNavigation } from '../../navigation';

export default function AutoCompleteTest() {
  const navigation = useNavigation();

  const testInvalidRoutes = async () => {
    // These should show TypeScript errors for invalid routes
    // @ts-expect-error - testing invalid route
    await navigation.push('invalid-route');

    // @ts-expect-error - testing missing required parameter
    await navigation.push('product', {});

    // @ts-expect-error - testing invalid parameter type
    await navigation.push('login', { source: 'invalid-source' });
  };

  return (
    <div
      style={{
        padding: '1rem',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h3>🔧 Auto-completion Status Test</h3>
      <p>If auto-completion is working, your IDE should:</p>
      <ul>
        <li>✅ Suggest route names when typing: navigation.push('')</li>
        <li>
          ✅ Suggest parameters when typing: navigation.push('product', {'{'}...
          {'}'}
        </li>
        <li>✅ Show errors for invalid route names or parameters</li>
        <li>✅ Provide IntelliSense for NextLink component props</li>
      </ul>

      <div style={{ marginTop: '1rem' }}>
        <h4>Try these examples in your IDE:</h4>
        <code
          style={{
            display: 'block',
            backgroundColor: '#f3f4f6',
            padding: '0.5rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
          }}
        >
          navigation.push('|'){' '}
          {/* Place cursor after the quote to see auto-completion */}
        </code>
        <code
          style={{
            display: 'block',
            backgroundColor: '#f3f4f6',
            padding: '0.5rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
          }}
        >
          {'<NextLink route="|">Link</NextLink>'}{' '}
          {/* Place cursor after the quote */}
        </code>
      </div>

      <button
        onClick={testInvalidRoutes}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Test Invalid Routes (Check Console for TypeScript Errors)
      </button>
    </div>
  );
}
