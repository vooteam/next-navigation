import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

vi.mock('./next-navigation', () => ({
  resolveRoute: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: React.forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>(
    (props, ref) => React.createElement('a', { ...props, ref })
  ),
}));

import { NextLink } from './next-link';
import { resolveRoute } from './next-navigation';

const mockResolveRoute = resolveRoute as ReturnType<typeof vi.fn>;

describe('NextLink', () => {
  const createMockRoutes = () => ({
    home: '/homepage',
    about: '/about',
    user: { path: '/user/[id]', params: { id: '' } },
    product: { path: '/product/[id]', params: { id: '' } },
    post: {
      path: '/posts/[slug]/comments/[commentId]',
      params: { slug: '', commentId: '' },
    },
    complex: {
      path: '/category/[category]/product/[productId]/review/[reviewId]',
      params: { category: '', productId: '', reviewId: '' },
    },
  });

  const expectResolveRouteCall = (
    routes: any,
    route: string,
    params: Record<string, unknown>
  ) => {
    expect(mockResolveRoute).toHaveBeenCalledWith(routes, route, params);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const routeTestCases = [
    {
      name: 'should call resolveRoute with correct parameters for string route',
      mockReturn: '/test',
      routes: { home: '/homepage' },
      props: { route: 'home', children: 'Test' },
      expectedParams: {},
    },
    {
      name: 'should call resolveRoute with route parameters',
      mockReturn: '/user/123',
      routes: { user: { path: '/user/[id]', params: { id: '' } } },
      props: { route: 'user', id: '123', children: 'User Profile' },
      expectedParams: { id: '123' },
    },
    {
      name: 'should handle routes without parameters',
      mockReturn: '/about',
      routes: { about: '/about' },
      props: { route: 'about', children: 'About' },
      expectedParams: {},
    },
    {
      name: 'should handle direct string routes without routes config',
      mockReturn: '/direct-path',
      routes: undefined,
      props: { route: '/direct-path', children: 'Direct Path' },
      expectedParams: {},
    },
    {
      name: 'should handle empty route parameters',
      mockReturn: '/user/[id]',
      routes: { user: { path: '/user/[id]', params: { id: '' } } },
      props: { route: 'user', children: 'User' },
      expectedParams: {},
    },
  ];

  routeTestCases.forEach(
    ({ name, mockReturn, routes, props, expectedParams }) => {
      it(name, () => {
        mockResolveRoute.mockReturnValue(mockReturn);

        const linkProps = routes ? { ...props, routes } : props;
        render(React.createElement(NextLink, linkProps));

        expectResolveRouteCall(routes, props.route, expectedParams);
      });
    }
  );

  it('should separate standard Link props from route parameters', () => {
    mockResolveRoute.mockReturnValue('/posts/my-post/comments/comment-1');

    const routes = createMockRoutes();

    render(
      React.createElement(NextLink, {
        route: 'post',
        routes,
        slug: 'my-post',
        commentId: 'comment-1',
        className: 'link-class',
        scroll: true,
        prefetch: false,
        children: 'Post Link',
      })
    );

    expectResolveRouteCall(routes, 'post', {
      slug: 'my-post',
      commentId: 'comment-1',
    });
  });

  const complexParamTestCases = [
    {
      name: 'should handle complex route parameters',
      mockReturn: '/category/electronics/product/laptop-123/review/review-456',
      route: 'complex',
      params: {
        category: 'electronics',
        productId: 'laptop-123',
        reviewId: 'review-456',
      },
    },
    {
      name: 'should handle numeric route parameters',
      mockReturn: '/product/12345',
      route: 'product',
      params: { id: '12345' },
    },
  ];

  complexParamTestCases.forEach(({ name, mockReturn, route, params }) => {
    it(name, () => {
      mockResolveRoute.mockReturnValue(mockReturn);

      const routes = createMockRoutes();
      const linkProps = { route, routes, ...params, children: 'Test Link' };

      render(React.createElement(NextLink, linkProps));

      expectResolveRouteCall(routes, route, params);
    });
  });

  it('should call resolveRoute even with only required props', () => {
    mockResolveRoute.mockReturnValue('/home');

    render(
      React.createElement(NextLink, {
        route: '/home',
        children: 'Home',
      })
    );

    expectResolveRouteCall(undefined, '/home', {});
  });
});
