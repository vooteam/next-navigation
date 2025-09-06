'use client';

import Link from 'next/link';
import NavigationLogger from '../components/NavigationLogger';
import { usePageLogger } from '../hooks/usePageLogger';

export default function About() {
  usePageLogger('About Page');
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0,
              }}
            >
              About Page
            </h1>
            <p
              style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: 0,
              }}
            >
              Navigation successful!
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              color: '#374151',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            🎉 Great! You've successfully navigated to the About page using the{' '}
            <code
              style={{
                backgroundColor: '#e2e8f0',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontFamily: 'Monaco, "Lucida Console", monospace',
              }}
            >
              @vooteam/next-navigation
            </code>{' '}
            hook. This demonstrates the async navigation capabilities with
            built-in loading states.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background-color 0.2s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Demo
          </Link>

          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Try Products Page
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </Link>
        </div>
      </div>

      <NavigationLogger />
    </div>
  );
}
