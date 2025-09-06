'use client';

import { useNavigationLog } from '../context/NavigationLogContext';

export default function NavigationLogger() {
  const { logs, clearLogs } = useNavigationLog();

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📝';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#065f46';
      case 'error':
        return '#dc2626';
      default:
        return '#374151';
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginTop: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#374151',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          Navigation Log ({logs.length} entries)
        </h3>
        <button
          onClick={clearLogs}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          Clear Log
        </button>
      </div>
      <div
        style={{
          padding: '1rem',
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        {logs.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              color: '#9ca3af',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginBottom: '0.5rem' }}
            >
              <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z" />
            </svg>
            <span style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
              No navigation actions yet. Use the navigation demo to get started!
            </span>
          </div>
        ) : (
          logs.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.85rem',
                fontFamily: 'Monaco, "Lucida Console", monospace',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{getLogIcon(entry.type)}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: getLogColor(entry.type),
                    fontWeight: '500',
                  }}
                >
                  {entry.message}
                </div>
                <div
                  style={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    marginTop: '0.25rem',
                  }}
                >
                  {entry.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
