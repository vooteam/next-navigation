'use client';

import Link from 'next/link';
import NavigationLogger from '../components/NavigationLogger';
import { usePageLogger } from '../hooks/usePageLogger';

export default function Login() {
  usePageLogger('Login Page');
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
              backgroundColor: '#ef4444',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
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
              Login Page
            </h1>
            <p
              style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: 0,
              }}
            >
              Reached via navigation.replace()
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#fef2f2',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            marginBottom: '1.5rem',
          }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#dc2626',
              marginBottom: '0.5rem',
            }}
          >
            🔄 Replace Navigation Demo
          </h3>
          <p
            style={{
              fontSize: '1rem',
              color: '#374151',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            You reached this page using{' '}
            <code
              style={{
                backgroundColor: '#fecaca',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontFamily: 'Monaco, "Lucida Console", monospace',
              }}
            >
              navigation.replace()
            </code>
            . This means the previous page was replaced in the browser history.
            Try using the browser's back button - you won't go back to the
            previous page!
          </p>
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
          <h4
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem',
            }}
          >
            Demo Login Form
          </h4>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            />
            <input
              type="password"
              placeholder="Enter your password"
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            />
            <button
              style={{
                padding: '0.75rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Demo Login (Non-functional)
            </button>
          </div>
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
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Return to Demo
          </Link>

          <Link
            href="/about"
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
            Visit About Page
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
