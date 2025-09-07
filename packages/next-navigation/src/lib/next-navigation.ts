'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { useProgress } from './progress-provider';
export interface RouteWithParams<T = Record<string, unknown>> {
  path: string;
  params?: T;
}

export type RouteDefinition<T = Record<string, unknown>> =
  | string
  | RouteWithParams<T>;

export type Routes = Record<string, RouteDefinition>;

export type RouteParams<T> = T extends RouteWithParams<infer P> ? P : undefined;

export type NavigationParams<T extends Routes, K extends keyof T> = RouteParams<
  T[K]
> extends undefined
  ? Record<string, unknown>
  : RouteParams<T[K]>;

export interface NavigationOptions {
  scroll?: boolean;
}

export interface NavigationConfig<T extends Routes = Routes> {
  enableProgress?: boolean;
  routes?: T;
}

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

  if (params && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`[${key}]`, String(value));
    });
  }

  return path;
}

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
          const { scroll, ...routeParams } = options || {};
          const url = resolveRoute(config?.routes, href, routeParams);
          const routerOptions = scroll !== undefined ? { scroll } : undefined;
          router.push(url, routerOptions);

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
          const { scroll, ...routeParams } = options || {};
          const url = resolveRoute(config?.routes, href, routeParams);
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
