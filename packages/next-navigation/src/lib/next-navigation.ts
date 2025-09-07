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

export type RouteParams<T> = T extends RouteWithParams<infer P>
  ? P extends Record<string, unknown>
    ? P
    : Record<string, unknown>
  : Record<string, unknown>;

export type NavigationParams<
  T extends Routes,
  K extends keyof T
> = T[K] extends RouteWithParams<infer P>
  ? P extends Record<string, unknown>
    ? P
    : never
  : never;

export interface NavigationOptions {
  scroll?: boolean;
}

export interface NavigationConfig<T extends Routes = Routes> {
  enableProgress?: boolean;
  routes?: T;
}

export interface UseNavigationReturn<T extends Routes = Routes> {
  push<K extends keyof T>(
    route: K,
    ...args: T[K] extends RouteWithParams<unknown>
      ? [params: NavigationParams<T, K>, options?: NavigationOptions]
      : [options?: NavigationOptions]
  ): Promise<void>;

  replace<K extends keyof T>(
    route: K,
    ...args: T[K] extends RouteWithParams<unknown>
      ? [params: NavigationParams<T, K>, options?: NavigationOptions]
      : [options?: NavigationOptions]
  ): Promise<void>;

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
    async (route: string, ...args: unknown[]): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (enableProgress) {
          progress.start();
        }

        startTransition(() => {
          const params: Record<string, unknown> = {};
          const options: NavigationOptions = {};

          // Parse arguments based on their type
          if (args.length > 0) {
            const firstArg = args[0];

            if (firstArg && typeof firstArg === 'object') {
              // Check if this route exists in config and has route params
              const routeConfig = config?.routes?.[route];
              const routeParams =
                routeConfig &&
                typeof routeConfig === 'object' &&
                'params' in routeConfig
                  ? routeConfig.params
                  : {};

              // Separate route parameters from navigation options
              const navigationOptionKeys = new Set(['scroll']);

              Object.entries(firstArg as Record<string, unknown>).forEach(
                ([key, value]) => {
                  if (navigationOptionKeys.has(key)) {
                    (options as Record<string, unknown>)[key] = value;
                  } else if (
                    routeParams &&
                    typeof routeParams === 'object' &&
                    key in routeParams
                  ) {
                    params[key] = value;
                  } else {
                    // If route params not defined or key not found in route params, treat as route param
                    params[key] = value;
                  }
                }
              );

              // If we have a second argument, it should be navigation options
              if (args[1] && typeof args[1] === 'object') {
                Object.assign(options, args[1] as NavigationOptions);
              }
            }
          }

          const url = resolveRoute(config?.routes, route, params);
          // Filter out undefined values from options before passing to router
          const filteredOptions = Object.fromEntries(
            Object.entries(options).filter(([, value]) => value !== undefined)
          );
          const routerOptions =
            Object.keys(filteredOptions).length > 0
              ? filteredOptions
              : undefined;
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
    async (route: string, ...args: unknown[]): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (enableProgress) {
          progress.start();
        }

        startTransition(() => {
          const params: Record<string, unknown> = {};
          const options: NavigationOptions = {};

          // Parse arguments based on their type
          if (args.length > 0) {
            const firstArg = args[0];

            if (firstArg && typeof firstArg === 'object') {
              // Check if this route exists in config and has route params
              const routeConfig = config?.routes?.[route];
              const routeParams =
                routeConfig &&
                typeof routeConfig === 'object' &&
                'params' in routeConfig
                  ? routeConfig.params
                  : {};

              // Separate route parameters from navigation options
              const navigationOptionKeys = new Set(['scroll']);

              Object.entries(firstArg as Record<string, unknown>).forEach(
                ([key, value]) => {
                  if (navigationOptionKeys.has(key)) {
                    (options as Record<string, unknown>)[key] = value;
                  } else if (
                    routeParams &&
                    typeof routeParams === 'object' &&
                    key in routeParams
                  ) {
                    params[key] = value;
                  } else {
                    // If route params not defined or key not found in route params, treat as route param
                    params[key] = value;
                  }
                }
              );

              // If we have a second argument, it should be navigation options
              if (args[1] && typeof args[1] === 'object') {
                Object.assign(options, args[1] as NavigationOptions);
              }
            }
          }

          const url = resolveRoute(config?.routes, route, params);
          // Filter out undefined values from options before passing to router
          const filteredOptions = Object.fromEntries(
            Object.entries(options).filter(([, value]) => value !== undefined)
          );
          const routerOptions =
            Object.keys(filteredOptions).length > 0
              ? filteredOptions
              : undefined;
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
    push: push as UseNavigationReturn<T>['push'],
    replace: replace as UseNavigationReturn<T>['replace'],
    back,
    isPending,
  };
}
