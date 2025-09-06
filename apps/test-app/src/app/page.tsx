'use client';

import NavigationDemo from './navigation-demo';
import ProgressDemo from './components/ProgressDemo';
import styles from './page.module.css';
import { usePageLogger } from './hooks/usePageLogger';

export default function Page() {
  usePageLogger('Home Page');

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '3rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          color: 'white',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #fff, #e2e8f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Welcome to the Demo
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            marginBottom: '2rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: '1.6',
          }}
        >
          🚀 Test the async navigation hook with built-in progress bars and
          loading states. Try navigating between pages using both the header
          navigation and the demo buttons below.
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            ⚡ Async Navigation
          </span>
          <span
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            🎯 Progress Bars
          </span>
          <span
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            📱 TypeScript Ready
          </span>
        </div>
      </div>

      <main className={styles.main}>
        {/* Progress Demo Section */}
        <ProgressDemo />

        {/* Navigation Demo Section */}
        <NavigationDemo />

        {/* Features Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
          }}
        >
          <div
            style={{
              padding: '2rem',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#3b82f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              ⚡
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#1f2937',
              }}
            >
              Async Navigation
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              Promise-based navigation with full async/await support. Handle
              navigation completion and errors gracefully.
            </p>
          </div>

          <div
            style={{
              padding: '2rem',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#10b981',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              🎯
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#1f2937',
              }}
            >
              Built-in Progress
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              Built-in progress bar provider with customizable styling.
              Integrates seamlessly with Next.js navigation and third-party
              loaders.
            </p>
          </div>

          <div
            style={{
              padding: '2rem',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#8b5cf6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              📱
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#1f2937',
              }}
            >
              TypeScript Support
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              Full TypeScript support with comprehensive types for all
              navigation methods and configuration options.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
