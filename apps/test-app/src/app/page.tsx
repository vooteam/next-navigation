'use client';

import NavigationDemo from './navigation-demo';
import NavigationLogger from './components/NavigationLogger';
import { usePageLogger } from './hooks/usePageLogger';

export default function Index() {
  usePageLogger('Home Page');
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          borderBottom: '2px solid #e1e5e9',
          paddingBottom: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '0.5rem',
          }}
        >
          @vooteam/next-navigation
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '1rem',
          }}
        >
          A Next.js navigation hook library for async router operations
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="https://github.com/vooteam/next-navigation"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#24292e',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f6f8fa',
              color: '#24292e',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            v1.0.0
          </span>
        </div>
      </header>

      <main>
        <NavigationDemo />

        <section
          style={{
            marginTop: '3rem',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '1rem',
            }}
          >
            Installation
          </h2>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.9rem',
              margin: '1rem 0',
            }}
          >
            <code>npm install @vooteam/next-navigation</code>
          </pre>

          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#1a1a1a',
              marginTop: '2rem',
              marginBottom: '1rem',
            }}
          >
            Basic Usage
          </h3>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.9rem',
              lineHeight: '1.5',
            }}
          >
            <code>{`import { useNavigation } from '@vooteam/next-navigation';

function MyComponent() {
  const navigation = useNavigation();

  const handleNavigate = async () => {
    try {
      await navigation.push('/about');
      console.log('Navigation completed!');
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  return (
    <button 
      onClick={handleNavigate}
      disabled={navigation.isPending}
    >
      {navigation.isPending ? 'Navigating...' : 'Go to About'}
    </button>
  );
}`}</code>
          </pre>
        </section>

        <section
          style={{
            marginTop: '2rem',
            padding: '2rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '1rem',
            }}
          >
            Features
          </h2>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
            }}
          >
            {[
              '🚀 Async navigation with Promise-based API',
              '⏳ Built-in loading states with useTransition',
              '🔄 Support for push, replace, and back operations',
              '⚙️ Navigation options support (scroll control)',
              '🎯 TypeScript support with full type safety',
              '📦 Lightweight with zero dependencies',
              '🔧 Next.js 13+ App Router compatible',
            ].map((feature, index) => (
              <li
                key={index}
                style={{
                  padding: '0.5rem 0',
                  fontSize: '1rem',
                  color: '#374151',
                }}
              >
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <NavigationLogger />
      </main>
    </div>
  );
}
