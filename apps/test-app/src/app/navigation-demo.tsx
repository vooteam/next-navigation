'use client';

import { useNavigation } from '@vooteam/next-navigation';
import { useNavigationLog } from './context/NavigationLogContext';
import NavigationLogger from './components/NavigationLogger';

export default function NavigationDemo() {
  const navigation = useNavigation();
  const { addLog } = useNavigationLog();

  const handlePush = async () => {
    addLog('Starting push navigation to /about...', 'info');

    try {
      await navigation.push('/about');
      addLog('Push navigation completed!', 'success');
    } catch (error) {
      addLog(`Push navigation error: ${error}`, 'error');
    }
  };

  const handlePushWithOptions = async () => {
    addLog(
      'Starting push navigation to /products with scroll: false...',
      'info'
    );

    try {
      await navigation.push('/products', { scroll: false });
      addLog('Push navigation with options completed!', 'success');
    } catch (error) {
      addLog(`Push navigation error: ${error}`, 'error');
    }
  };

  const handleReplace = async () => {
    addLog('Starting replace navigation to /login...', 'info');

    try {
      await navigation.replace('/login');
      addLog('Replace navigation completed!', 'success');
    } catch (error) {
      addLog(`Replace navigation error: ${error}`, 'error');
    }
  };

  const handleBack = async () => {
    addLog('Starting back navigation...', 'info');

    try {
      await navigation.back();
      addLog('Back navigation completed!', 'success');
    } catch (error) {
      addLog(`Back navigation error: ${error}`, 'error');
    }
  };

  return (
    <div
      style={{
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '2rem',
        backgroundColor: '#fff',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem',
          gap: '0.75rem',
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
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
        <div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0,
            }}
          >
            Interactive Demo
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              margin: 0,
            }}
          >
            Test the async navigation hook with real navigation actions
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={handlePush}
          disabled={navigation.isPending}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: navigation.isPending ? '#93c5fd' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: navigation.isPending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3l3.293 3.293-7 7 1.414 1.414 7-7L21 11V3z" />
            <path d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z" />
          </svg>
          navigation.push(&apos;/about&apos;)
        </button>

        <button
          onClick={handlePushWithOptions}
          disabled={navigation.isPending}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: navigation.isPending ? '#a78bfa' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: navigation.isPending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          push with options
        </button>

        <button
          onClick={handleReplace}
          disabled={navigation.isPending}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: navigation.isPending ? '#fb7185' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: navigation.isPending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
          </svg>
          navigation.replace(&apos;/login&apos;)
        </button>

        <button
          onClick={handleBack}
          disabled={navigation.isPending}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: navigation.isPending ? '#6ee7b7' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: navigation.isPending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          navigation.back()
        </button>
      </div>

      {navigation.isPending && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid #f59e0b',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span
            style={{
              color: '#92400e',
              fontWeight: '500',
              fontSize: '0.9rem',
            }}
          >
            Navigation in progress... (useTransition isPending:{' '}
            {navigation.isPending.toString()})
          </span>
        </div>
      )}

      <NavigationLogger />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `,
        }}
      />
    </div>
  );
}
