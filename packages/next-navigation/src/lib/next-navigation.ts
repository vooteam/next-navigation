'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

// Navigation options interface
export interface NavigationOptions {
  scroll?: boolean;
}

// Navigation hook interface
export interface UseNavigationReturn {
  push: (href: string, options?: NavigationOptions) => Promise<void>;
  replace: (href: string, options?: NavigationOptions) => Promise<void>;
  back: () => Promise<void>;
  isPending: boolean;
}

// Custom hook for async navigation
export function useNavigation(): UseNavigationReturn {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = useCallback(
    async (href: string, options?: NavigationOptions): Promise<void> => {
      return new Promise<void>((resolve) => {
        startTransition(() => {
          router.push(href, options);
          resolve();
        });
      });
    },
    [router]
  );

  const replace = useCallback(
    async (href: string, options?: NavigationOptions): Promise<void> => {
      return new Promise<void>((resolve) => {
        startTransition(() => {
          router.replace(href, options);
          resolve();
        });
      });
    },
    [router]
  );

  const back = useCallback(async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      startTransition(() => {
        router.back();
        resolve();
      });
    });
  }, [router]);

  return {
    push,
    replace,
    back,
    isPending,
  };
}
