'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { useProgress } from './progress-provider';

// Navigation options interface
export interface NavigationOptions {
  scroll?: boolean;
}

// Route definition types
export interface RouteWithParams<T = Record<string, unknown>> {
  path: string;
  params?: T;
}

export type RouteDefinition<T = Record<string, unknown>> =
  | string
  | RouteWithParams<T>;

// Routes type - can be extended with specific route definitions
export type Routes = Record<string, RouteDefinition>;

// Helper type to extract params from route definition
export type RouteParams<T> = T extends RouteWithParams<infer P> ? P : undefined;

// Helper type for navigation parameters
export type NavigationParams<T extends Routes, K extends keyof T> = RouteParams<
  T[K]
> extends undefined
  ? Record<string, unknown>
  : RouteParams<T[K]>;

// Navigation options interface
export interface NavigationOptions {
  scroll?: boolean;
}

// Navigation hook configuration
export interface NavigationConfig<T extends Routes = Routes> {
  enableProgress?: boolean;
  routes?: T;
}

// Navigation hook interface
export interface UseNavigationReturn<T extends Routes = Routes> {
  push: <K extends keyof T>(
    href: K | string,
    options?: NavigationOptions & NavigationParams<T, K>
  ) => Promise<void>;
  replace: <K extends keyof T>(
    href: K | string,
    options?: NavigationOptions & NavigationParams<T, K>
  ) => Promise<void>;
  back: () => Promise<void>;
  isPending: boolean;
}

// Helper function to resolve route to URL string
export function resolveRoute<T extends Routes>(
  routes: T | undefined,
  href: keyof T | string,
  params?: Record<string, unknown>
): string {
  if (!routes || typeof href !== 'string' || !(href in routes)) {
    return String(href);
  }

  const route = routes[href];

  if (typeof route === 'string') {
    return route;
  }

  let path = route.path;

  // Replace dynamic route parameters
  if (params && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`[${key}]`, String(value));
    });
  }

  return path;
}

// Custom hook for async navigation
export function useNavigation<T extends Routes = Routes>(
  config?: NavigationConfig<T>
): UseNavigationReturn<T> {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const progress = useProgress();

  const enableProgress = config?.enableProgress ?? true;

  const push = useCallback(
    async <K extends keyof T>(
      href: K | string,
      options?: NavigationOptions & NavigationParams<T, K>
    ): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (enableProgress) {
          progress.start();
        }

        startTransition(() => {
          // Extract route parameters (exclude known NavigationOptions properties)
          const { scroll, ...routeParams } = options || {};

          // Resolve the route to a URL string
          const url = resolveRoute(config?.routes, href, routeParams);

          // Only pass options to router if scroll is defined
          const routerOptions = scroll !== undefined ? { scroll } : undefined;
          router.push(url, routerOptions);

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
    [router, progress, enableProgress, config?.routes]
  );

  const replace = useCallback(
    async <K extends keyof T>(
      href: K | string,
      options?: NavigationOptions & NavigationParams<T, K>
    ): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (enableProgress) {
          progress.start();
        }

        startTransition(() => {
          // Extract route parameters (exclude known NavigationOptions properties)
          const { scroll, ...routeParams } = options || {};

          // Resolve the route to a URL string
          const url = resolveRoute(config?.routes, href, routeParams);

          // Only pass options to router if scroll is defined
          const routerOptions = scroll !== undefined ? { scroll } : undefined;
          router.replace(url, routerOptions);

          setTimeout(() => {
            if (enableProgress) {
              progress.complete();
            }
            resolve();
          }, 100);
        });
      });
    },
    [router, progress, enableProgress, config?.routes]
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
