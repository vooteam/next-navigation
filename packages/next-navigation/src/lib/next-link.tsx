'use client';

import Link from 'next/link';
import React from 'react';
import { Routes, resolveRoute } from './next-navigation';

export interface NextLinkProps<T extends Routes, K extends keyof T>
  extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  route: K;
  routes?: T;
}

export const NextLink = React.forwardRef<
  HTMLAnchorElement,
  NextLinkProps<Routes, string> & Record<string, unknown>
>(function NextLink(props, ref) {
  const { route, routes, children, ...rest } = props;

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

  const href = resolveRoute(routes as Routes, route as string, routeParams);

  return (
    <Link {...linkProps} href={href} ref={ref}>
      {children as React.ReactNode}
    </Link>
  );
});
