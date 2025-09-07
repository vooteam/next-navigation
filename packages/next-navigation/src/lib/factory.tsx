'use client';

import {
  Routes,
  NavigationConfig,
  UseNavigationReturn,
  useNavigation,
  NavigationParams,
} from './next-navigation';
import { NextLink, NextLinkProps } from './next-link';

export function createNextNavigation<T extends Routes>(
  config: NavigationConfig<T>
) {
  const TypedNextLink = <K extends keyof T>(
    props: Omit<NextLinkProps<T, K>, 'routes'> & Partial<NavigationParams<T, K>>
  ) => {
    return NextLink({ ...props, routes: config.routes } as NextLinkProps<T, K> &
      Partial<NavigationParams<T, K>>);
  };

  return {
    useNavigation: (): UseNavigationReturn<T> => useNavigation(config),
    NextLink: TypedNextLink,
  };
}
