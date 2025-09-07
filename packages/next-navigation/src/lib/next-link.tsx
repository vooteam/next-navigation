'use client';

import Link from 'next/link';
import { Routes, NavigationParams, resolveRoute } from './next-navigation';

// Link component props
export interface NextLinkProps<T extends Routes, K extends keyof T>
  extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  route: K | string;
  routes?: T;
}

// Typed Link component
export function NextLink<T extends Routes, K extends keyof T>(
  props: NextLinkProps<T, K> & Partial<NavigationParams<T, K>>
) {
  const { route, routes, ...rest } = props;

  // Extract route parameters - everything except standard Link props and our custom props
  const standardLinkProps = new Set([
    'children',
    'className',
    'style',
    'onClick',
    'onMouseEnter',
    'onTouchStart',
    'replace',
    'scroll',
    'shallow',
    'passHref',
    'prefetch',
    'locale',
    'legacyBehavior',
    'route',
    'routes',
  ]);

  const routeParams: Record<string, unknown> = {};
  const linkProps: Record<string, unknown> = {};

  Object.entries(rest).forEach(([key, value]) => {
    if (standardLinkProps.has(key)) {
      linkProps[key] = value;
    } else {
      routeParams[key] = value;
    }
  });

  // Resolve the route to a URL string
  const href = resolveRoute(routes, route, routeParams);

  return <Link {...linkProps} href={href} />;
}
