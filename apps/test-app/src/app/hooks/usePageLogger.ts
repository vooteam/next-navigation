'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationLog } from '../context/NavigationLogContext';

export function usePageLogger(pageName: string) {
  const pathname = usePathname();
  const { addLog } = useNavigationLog();
  const hasLoggedRef = useRef<string | null>(null);

  useEffect(() => {
    // Only log if we haven't already logged for this pathname
    if (hasLoggedRef.current !== pathname) {
      hasLoggedRef.current = pathname;
      addLog(`📍 Navigated to ${pageName} (${pathname})`, 'success');
    }
  }, [pathname, pageName, addLog]);
}
