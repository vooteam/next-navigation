'use client';

import { useNavigation, useProgress } from '@vooteam/next-navigation';
import { useNavigationLog } from '../context/NavigationLogContext';

export default function ProgressDemo() {
  const navigation = useNavigation({ enableProgress: true });
  const navigationNoProgress = useNavigation({ enableProgress: false });
  const progress = useProgress();
  const { addLog } = useNavigationLog();

  const handleWithProgress = async () => {
    addLog('Navigation with built-in progress...', 'info');
    try {
      await navigation.push('/about');
      addLog('Navigation with progress completed!', 'success');
    } catch (error) {
      addLog(`Navigation error: ${error}`, 'error');
    }
  };

  const handleWithoutProgress = async () => {
    addLog('Navigation without progress...', 'info');
    try {
      await navigationNoProgress.push('/products');
      addLog('Navigation without progress completed!', 'success');
    } catch (error) {
      addLog(`Navigation error: ${error}`, 'error');
    }
  };

  const handleManualProgress = async () => {
    addLog('Manual progress control...', 'info');
    try {
      progress.start();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      await navigationNoProgress.push('/login');
      progress.complete();
      addLog('Manual progress completed!', 'success');
    } catch (error) {
      progress.complete();
      addLog(`Manual progress error: ${error}`, 'error');
    }
  };

  return (
    <div
      style={{
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '2rem',
        backgroundColor: '#fff',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '1rem',
        }}
      >
        🚀 Progress Bar Demo
      </h2>

      <p
        style={{
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6',
        }}
      >
        This demo shows different progress bar implementations:
      </p>

      <ul
        style={{
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6',
          paddingLeft: '1.5rem',
        }}
      >
        <li>
          <strong>Green bar (top):</strong> Built-in progress provider from
          @vooteam/next-navigation
        </li>
        <li>
          <strong>Blue bar (top):</strong> NextTopLoader for regular Next.js
          navigation
        </li>
        <li>
          <strong>Hook-based:</strong> Progress controlled by our navigation
          hook
        </li>
      </ul>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={handleWithProgress}
          disabled={navigation.isPending}
          style={{
            padding: '1rem',
            backgroundColor: navigation.isPending ? '#6ee7b7' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: navigation.isPending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>🟢</div>
          Navigation with Progress
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            (Hook-controlled green bar)
          </div>
        </button>

        <button
          onClick={handleWithoutProgress}
          disabled={navigationNoProgress.isPending}
          style={{
            padding: '1rem',
            backgroundColor: navigationNoProgress.isPending
              ? '#93c5fd'
              : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: navigationNoProgress.isPending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>🔵</div>
          Navigation without Progress
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            (NextTopLoader blue bar only)
          </div>
        </button>

        <button
          onClick={handleManualProgress}
          disabled={progress.isLoading}
          style={{
            padding: '1rem',
            backgroundColor: progress.isLoading ? '#a78bfa' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: progress.isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>🟣</div>
          Manual Progress Control
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            (Custom timing + navigation)
          </div>
        </button>
      </div>

      {(navigation.isPending ||
        navigationNoProgress.isPending ||
        progress.isLoading) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid #6b7280',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ color: '#374151', fontWeight: '500' }}>
            {navigation.isPending && 'Hook navigation in progress...'}
            {navigationNoProgress.isPending && 'Navigation without progress...'}
            {progress.isLoading && 'Manual progress active...'}
          </span>
        </div>
      )}

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#6b7280',
        }}
      >
        <strong>Note:</strong> You'll see different colored progress bars at the
        top:
        <br />• <span style={{ color: '#10b981' }}>Green</span>: Our built-in
        progress provider
        <br />• <span style={{ color: '#3b82f6' }}>Blue</span>: NextTopLoader
        for regular navigation
      </div>
    </div>
  );
}
