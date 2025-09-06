'use client';

import { useNavigation } from '@vooteam/next-navigation';
import { useState } from 'react';

export default function NavigationDemo() {
  const navigation = useNavigation();
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const handlePush = async () => {
    addLog('Starting push navigation to /about...');

    try {
      await navigation.push('/about');
      addLog('Push navigation completed!');
    } catch (error) {
      addLog(`Push navigation error: ${error}`);
    }
  };

  const handlePushWithOptions = async () => {
    addLog('Starting push navigation to /products with scroll: false...');

    try {
      await navigation.push('/products', { scroll: false });
      addLog('Push navigation with options completed!');
    } catch (error) {
      addLog(`Push navigation error: ${error}`);
    }
  };

  const handleReplace = async () => {
    addLog('Starting replace navigation to /login...');

    try {
      await navigation.replace('/login');
      addLog('Replace navigation completed!');
    } catch (error) {
      addLog(`Replace navigation error: ${error}`);
    }
  };

  const handleBack = async () => {
    addLog('Starting back navigation...');

    try {
      await navigation.back();
      addLog('Back navigation completed!');
    } catch (error) {
      addLog(`Back navigation error: ${error}`);
    }
  };

  const clearLog = () => {
    setLog([]);
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        margin: '20px 0',
        fontFamily: 'monospace',
      }}
    >
      <h3>@vooteam/next-navigation Demo</h3>
      <p>Test the async navigation hook:</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handlePush}
          disabled={navigation.isPending}
          style={{
            margin: '5px',
            padding: '10px 15px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: navigation.isPending ? 'not-allowed' : 'pointer',
            opacity: navigation.isPending ? 0.6 : 1,
          }}
        >
          navigation.push('/about')
        </button>

        <button
          onClick={handlePushWithOptions}
          disabled={navigation.isPending}
          style={{
            margin: '5px',
            padding: '10px 15px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: navigation.isPending ? 'not-allowed' : 'pointer',
            opacity: navigation.isPending ? 0.6 : 1,
          }}
        >
          navigation.push('/products', {`{ scroll: false }`})
        </button>

        <button
          onClick={handleReplace}
          disabled={navigation.isPending}
          style={{
            margin: '5px',
            padding: '10px 15px',
            backgroundColor: '#ff6b35',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: navigation.isPending ? 'not-allowed' : 'pointer',
            opacity: navigation.isPending ? 0.6 : 1,
          }}
        >
          navigation.replace('/login')
        </button>

        <button
          onClick={handleBack}
          disabled={navigation.isPending}
          style={{
            margin: '5px',
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: navigation.isPending ? 'not-allowed' : 'pointer',
            opacity: navigation.isPending ? 0.6 : 1,
          }}
        >
          navigation.back()
        </button>
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <strong>Navigation Log:</strong>
          <button
            onClick={clearLog}
            style={{
              padding: '5px 10px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Clear Log
          </button>
        </div>
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #dee2e6',
          }}
        >
          {log.length === 0 ? (
            <em style={{ color: '#6c757d' }}>No navigation actions yet...</em>
          ) : (
            log.map((entry, index) => (
              <div
                key={index}
                style={{ marginBottom: '5px', fontSize: '12px' }}
              >
                {entry}
              </div>
            ))
          )}
        </div>
      </div>

      {navigation.isPending && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            color: '#856404',
          }}
        >
          🚀 Navigation in progress... (useTransition isPending:{' '}
          {navigation.isPending.toString()})
        </div>
      )}
    </div>
  );
}
