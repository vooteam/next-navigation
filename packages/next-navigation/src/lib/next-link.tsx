'use client';

import Link from 'next/link';
import { Routes, NavigationParams, resolveRoute } from './next-navigation';

export interface NextLinkProps<T extends Routes, K extends keyof T>
  extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  route: K | string;
  routes?: T;
}

export function NextLink<T extends Routes, K extends keyof T>(
  props: NextLinkProps<T, K> & Partial<NavigationParams<T, K>>
) {
  const { route, routes, ...rest } = props;

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

  const href = resolveRoute(routes, route, routeParams);

  return <Link {...linkProps} href={href} />;
}
