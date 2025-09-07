'use client';

import { NextLink } from '../../navigation';

const LinkDemo = () => {
  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: '#1f2937',
        }}
      >
        🔗 NextLink Component Demo
      </h2>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
        }}
      >
        {/* Simple Links */}
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151',
            }}
          >
            📍 Simple Links
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <NextLink
              route="home"
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid #3b82f6',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              🏠 Home
            </NextLink>

            <NextLink
              route="about"
              style={{
                color: '#059669',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid #059669',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              ℹ️ About
            </NextLink>

            <NextLink
              route="products"
              style={{
                color: '#dc2626',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid #dc2626',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              📦 Products
            </NextLink>
          </div>
        </div>

        {/* Dynamic Links */}
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151',
            }}
          >
            🔗 Dynamic Links with Parameters
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <NextLink
              route="product"
              productId="laptop-123"
              style={{
                color: '#7c3aed',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #7c3aed',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              💻 Laptop Product
            </NextLink>

            <NextLink
              route="product"
              productId="phone-456"
              style={{
                color: '#be185d',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #be185d',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              📱 Phone Product
            </NextLink>

            <NextLink
              route="product"
              productId="tablet-789"
              style={{
                color: '#ea580c',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #ea580c',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              📟 Tablet Product
            </NextLink>
          </div>
        </div>

        {/* Typed Parameter Links */}
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151',
            }}
          >
            🎯 Links with Typed Parameters
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <NextLink
              route="login"
              style={{
                color: '#6366f1',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #6366f1',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              🔐 Simple Login
            </NextLink>

            <NextLink
              route="login"
              returnUrl="/products"
              source="header"
              style={{
                color: '#059669',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #059669',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              🔐 Login from Header
            </NextLink>

            <NextLink
              route="login"
              returnUrl="/about"
              source="modal"
              style={{
                color: '#dc2626',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #dc2626',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              🔐 Login from Modal
            </NextLink>
          </div>
        </div>

        {/* Advanced Styling */}
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        >
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151',
            }}
          >
            ✨ Advanced Styled Links
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <NextLink
              route="about"
              className="hover-effect"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                textAlign: 'center',
                boxShadow: '0 4px 15px 0 rgba(116, 79, 168, 0.75)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
              }}
            >
              🚀 Gradient Button Link
            </NextLink>

            <NextLink
              route="products"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#374151',
                fontSize: '0.875rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                📦
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Browse Products
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                  Discover our amazing collection
                </div>
              </div>
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkDemo;
