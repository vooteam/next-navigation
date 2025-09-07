'use client';

import { useState } from 'react';
import { useNavigation } from '../../navigation';

const NavigationDemo = () => {
  const navigation = useNavigation();
  const [productId, setProductId] = useState('example-product-123');

  const handleNavigateToProduct = async () => {
    await navigation.push('product', { productId });
  };

  const handleNavigateToLogin = async () => {
    await navigation.push('login', {
      returnUrl: '/products',
      source: 'modal' as const,
    });
  };

  const handleNavigateToLoginFromHeader = async () => {
    await navigation.push('login', {
      source: 'header' as const,
    });
  };

  const handleReplaceWithHome = async () => {
    await navigation.replace('home');
  };

  const handleGoBack = async () => {
    await navigation.back();
  };

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
        🚀 Navigation Hook Demo
      </h2>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {/* Simple Navigation */}
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
            📍 Simple Navigation
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <button
              onClick={() => navigation.push('about')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Go to About
            </button>
            <button
              onClick={() => navigation.push('products')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Go to Products
            </button>
          </div>
        </div>

        {/* Dynamic Routes */}
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
            🔗 Dynamic Routes
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                  color: '#6b7280',
                }}
              >
                Product ID:
              </label>
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                }}
                placeholder="Enter product ID"
              />
            </div>
            <button
              onClick={handleNavigateToProduct}
              disabled={!productId}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: productId ? '#dc2626' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: productId ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
              }}
            >
              View Product: {productId}
            </button>
          </div>
        </div>

        {/* Typed Parameters */}
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
            🎯 Typed Parameters
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <button
              onClick={handleNavigateToLogin}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Login (with return URL)
            </button>
            <button
              onClick={handleNavigateToLoginFromHeader}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#be185d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Login (from header)
            </button>
          </div>
        </div>

        {/* Navigation Methods */}
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
            ⚡ Navigation Methods
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <button
              onClick={handleReplaceWithHome}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Replace with Home
            </button>
            <button
              onClick={handleGoBack}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: navigation.isPending ? '#fef3c7' : '#d1fae5',
          border: `1px solid ${navigation.isPending ? '#f59e0b' : '#10b981'}`,
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          <span>{navigation.isPending ? '⏳' : '✅'}</span>
          <span
            style={{
              color: navigation.isPending ? '#92400e' : '#065f46',
            }}
          >
            Navigation Status: {navigation.isPending ? 'Loading...' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NavigationDemo;
