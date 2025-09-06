'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { useProgress } from './progress-provider';

// Navigation options interface
export interface NavigationOptions {
  scroll?: boolean;
}

// Navigation hook configuration
export interface NavigationConfig {
  enableProgress?: boolean;
}

// Navigation hook interface
export interface UseNavigationReturn {
  push: (href: string, options?: NavigationOptions) => Promise<void>;
  replace: (href: string, options?: NavigationOptions) => Promise<void>;
  back: () => Promise<void>;
  isPending: boolean;
}

// Custom hook for async navigation
export function useNavigation(config?: NavigationConfig): UseNavigationReturn {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const progress = useProgress();

  const enableProgress = config?.enableProgress ?? true;

  const push = useCallback(
    async (href: string, options?: NavigationOptions): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (enableProgress) {
          progress.start();
        }

        startTransition(() => {
          router.push(href, options);

          // Complete progress after a small delay to ensure visual feedback
          setTimeout(() => {
            if (enableProgress) {
              progress.complete();
            }
            resolve();
          }, 100);
        });
      });
    },
    [router, progress, enableProgress]
  );

  const replace = useCallback(
    async (href: string, options?: NavigationOptions): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (enableProgress) {
          progress.start();
        }

        startTransition(() => {
          router.replace(href, options);

          setTimeout(() => {
            if (enableProgress) {
              progress.complete();
            }
            resolve();
          }, 100);
        });
      });
    },
    [router, progress, enableProgress]
  );

  const back = useCallback(async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (enableProgress) {
        progress.start();
      }

      startTransition(() => {
        router.back();

        setTimeout(() => {
          if (enableProgress) {
            progress.complete();
          }
          resolve();
        }, 100);
      });
    });
  }, [router, progress, enableProgress]);

  return {
    push,
    replace,
    back,
    isPending,
  };
}
