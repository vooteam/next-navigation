'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';

interface ProgressContextType {
  start: () => void;
  complete: () => void;
  isLoading: boolean;
}

interface ProgressConfig {
  color?: string;
  height?: number;
  showSpinner?: boolean;
  easing?: string;
  speed?: number;
  shadow?: boolean;
}

interface ProgressProviderProps {
  children: React.ReactNode;
  config?: ProgressConfig;
}

const DEFAULT_CONFIG: Required<ProgressConfig> = {
  color: '#3b82f6',
  height: 3,
  showSpinner: true,
  easing: 'ease',
  speed: 200,
  shadow: true,
};

const ProgressContext = createContext<ProgressContextType | null>(null);

const ProgressBar: React.FC<{
  isLoading: boolean;
  config: Required<ProgressConfig>;
}> = ({ isLoading, config }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timers = [
        setTimeout(() => setProgress(30), 50),
        setTimeout(() => setProgress(60), 200),
        setTimeout(() => setProgress(80), 400),
      ];

      return () => timers.forEach(clearTimeout);
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  const progressBarStyle = {
    height: '100%',
    backgroundColor: config.color,
    width: `${progress}%`,
    transition: `width ${config.speed}ms ${config.easing}`,
    boxShadow: config.shadow
      ? `0 0 10px ${config.color}, 0 0 20px ${config.color}`
      : 'none',
  };

  const spinnerStyle = {
    width: '20px',
    height: '20px',
    border: `2px solid ${config.color}`,
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'progress-spin 1s linear infinite',
  };

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
          opacity: 1,
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={progressBarStyle} />
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
          <div style={spinnerStyle} />
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
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

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
    return {
      start: () => void 0,
      complete: () => void 0,
      isLoading: false,
    };
  }
  return context;
}
