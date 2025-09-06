'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';

// Progress context interface
interface ProgressContextType {
  start: () => void;
  complete: () => void;
  isLoading: boolean;
}

// Progress provider props
interface ProgressProviderProps {
  children: React.ReactNode;
  config?: {
    color?: string;
    height?: number;
    showSpinner?: boolean;
    easing?: string;
    speed?: number;
    shadow?: boolean;
  };
}

// Default progress bar styles
const defaultConfig = {
  color: '#3b82f6',
  height: 3,
  showSpinner: true,
  easing: 'ease',
  speed: 200,
  shadow: true,
};

const ProgressContext = createContext<ProgressContextType | null>(null);

// Built-in progress bar component
const ProgressBar: React.FC<{
  isLoading: boolean;
  config: typeof defaultConfig;
}> = ({ isLoading, config }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timer = setTimeout(() => setProgress(30), 50);
      const timer2 = setTimeout(() => setProgress(60), 200);
      const timer3 = setTimeout(() => setProgress(80), 400);

      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `${config.height}px`,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          zIndex: 9999,
          transition: 'opacity 0.2s ease',
          opacity: isLoading || progress > 0 ? 1 : 0,
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: config.color,
            width: `${progress}%`,
            transition: `width ${config.speed}ms ${config.easing}`,
            boxShadow: config.shadow
              ? `0 0 10px ${config.color}, 0 0 20px ${config.color}`
              : 'none',
          }}
        />
      </div>
      {config.showSpinner && isLoading && (
        <div
          style={{
            position: 'fixed',
            top: '15px',
            right: '15px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              border: `2px solid ${config.color}`,
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'progress-spin 1s linear infinite',
            }}
          />
        </div>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes progress-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `,
        }}
      />
    </>
  );
};

export function ProgressProvider({
  children,
  config = {},
}: ProgressProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const finalConfig = { ...defaultConfig, ...config };

  const start = useCallback(() => {
    setIsLoading(true);
  }, []);

  const complete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const contextValue: ProgressContextType = {
    start,
    complete,
    isLoading,
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      <ProgressBar isLoading={isLoading} config={finalConfig} />
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (!context) {
    // Return a no-op implementation if provider is not found
    return {
      start: () => {
        // No-op when provider is not available
      },
      complete: () => {
        // No-op when provider is not available
      },
      isLoading: false,
    };
  }
  return context;
}
