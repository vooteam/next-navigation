'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface NavigationLogContextType {
  logs: LogEntry[];
  addLog: (message: string, type?: 'info' | 'success' | 'error') => void;
  clearLogs: () => void;
}

const NavigationLogContext = createContext<
  NavigationLogContextType | undefined
>(undefined);

export function NavigationLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback(
    (message: string, type: 'info' | 'success' | 'error' = 'info') => {
      const newLog: LogEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      };

      setLogs((prev) => [...prev, newLog]);
    },
    []
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <NavigationLogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </NavigationLogContext.Provider>
  );
}

export function useNavigationLog() {
  const context = useContext(NavigationLogContext);
  if (context === undefined) {
    throw new Error(
      'useNavigationLog must be used within a NavigationLogProvider'
    );
  }
  return context;
}
