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

  const parseNavigationArgs = useCallback(
    (route: string, args: unknown[]) => {
      const params: Record<string, unknown> = {};
      const options: NavigationOptions = {};

      if (args.length > 0) {
        const firstArg = args[0];

        if (firstArg && typeof firstArg === 'object') {
          const routeConfig = config?.routes?.[route];
          const routeParams =
            routeConfig &&
            typeof routeConfig === 'object' &&
            'params' in routeConfig
              ? routeConfig.params
              : {};

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
                params[key] = value;
              }
            }
          );

          if (args[1] && typeof args[1] === 'object') {
            Object.assign(options, args[1] as NavigationOptions);
          }
        }
      }

      return { params, options };
    },
    [config?.routes]
  );

  const createNavigationPromise = useCallback(
    (
      navigateFn: (url: string, options?: Record<string, unknown>) => void,
      route: string,
      args: unknown[]
    ): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (enableProgress) {
          progress.start();
        }

        startTransition(() => {
          const { params, options } = parseNavigationArgs(route, args);
          const url = resolveRoute(config?.routes, route, params);
          
          const filteredOptions = Object.fromEntries(
            Object.entries(options).filter(([, value]) => value !== undefined)
          );
          const routerOptions =
            Object.keys(filteredOptions).length > 0
              ? filteredOptions
              : undefined;
              
          navigateFn(url, routerOptions);

          setTimeout(() => {
            if (enableProgress) {
              progress.complete();
            }
            resolve();
          }, 100);
        });
      });
    },
    [parseNavigationArgs, config?.routes, enableProgress, progress, startTransition]
  );

  const push = useCallback(
    async (route: string, ...args: unknown[]): Promise<void> => {
      return createNavigationPromise(router.push, route, args);
    },
    [router.push, createNavigationPromise]
  );

  const replace = useCallback(
    async (route: string, ...args: unknown[]): Promise<void> => {
      return createNavigationPromise(router.replace, route, args);
    },
    [router.replace, createNavigationPromise]
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
