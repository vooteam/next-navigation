'use client';

import Link from 'next/link';
import NavigationLogger from '../components/NavigationLogger';
import { usePageLogger } from '../hooks/usePageLogger';

export default function Products() {
  usePageLogger('Products Page');
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
              backgroundColor: '#8b5cf6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
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
              Products Page
            </h1>
            <p
              style={{
                fontSize: '1rem',
                color: '#6b7280',
                margin: 0,
              }}
            >
              Navigation with custom options
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#faf5ff',
            borderRadius: '8px',
            border: '1px solid #e9d5ff',
            marginBottom: '1.5rem',
          }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#7c3aed',
              marginBottom: '0.5rem',
            }}
          >
            🎯 Navigation Options Demo
          </h3>
          <p
            style={{
              fontSize: '1rem',
              color: '#374151',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            If you navigated here using the "push with options" button, you'll
            notice the page didn't scroll to the top. This demonstrates the{' '}
            <code
              style={{
                backgroundColor: '#e9d5ff',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontFamily: 'Monaco, "Lucida Console", monospace',
              }}
            >
              {'{ scroll: false }'}
            </code>{' '}
            option in action!
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bae6fd',
            }}
          >
            <h4
              style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#0369a1',
                marginBottom: '0.5rem',
              }}
            >
              📦 Product A
            </h4>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#374151',
                margin: 0,
              }}
            >
              Demo product to showcase the navigation system
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0',
            }}
          >
            <h4
              style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#15803d',
                marginBottom: '0.5rem',
              }}
            >
              🚀 Product B
            </h4>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#374151',
                margin: 0,
              }}
            >
              Another demo product for testing navigation
            </p>
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
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Demo
          </Link>

          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Try Login Page
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
