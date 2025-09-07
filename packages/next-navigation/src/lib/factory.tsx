'use client';

import {
  Routes,
  NavigationConfig,
  UseNavigationReturn,
  useNavigation,
} from './next-navigation';
import { NextLink } from './next-link';
import React from 'react';

export function createNextNavigation<T extends Routes>(
  config: NavigationConfig<T>
) {
  // Create a component that forwards all props to NextLink with the routes config
  const TypedNextLink = React.forwardRef<
    HTMLAnchorElement,
    Record<string, unknown>
  >((props, ref) => {
    return React.createElement(NextLink, {
      ...props,
      routes: config.routes,
      ref,
    });
  });

  TypedNextLink.displayName = 'TypedNextLink';

  return {
    useNavigation: (): UseNavigationReturn<T> => useNavigation(config),
    NextLink: TypedNextLink,
  };
}
