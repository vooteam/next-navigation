import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

// Mock the resolveRoute function
vi.mock('./next-navigation', () => ({
  resolveRoute: vi.fn(),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: React.forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>(
    (props, ref) => React.createElement('a', { ...props, ref })
  ),
}));

import { NextLink } from './next-link';
import { resolveRoute } from './next-navigation';

const mockResolveRoute = resolveRoute as ReturnType<typeof vi.fn>;

describe('NextLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call resolveRoute with correct parameters for string route', () => {
    mockResolveRoute.mockReturnValue('/test');

    const routes = { home: '/homepage' };
    render(
      React.createElement(NextLink, { route: 'home', routes, children: 'Test' })
    );

    expect(mockResolveRoute).toHaveBeenCalledWith(routes, 'home', {});
  });

  it('should call resolveRoute with route parameters', () => {
    mockResolveRoute.mockReturnValue('/user/123');

    const routes = {
      user: { path: '/user/[id]', params: { id: '' } },
    };

    render(
      React.createElement(NextLink, {
        route: 'user',
        routes,
        id: '123',
        children: 'User Profile',
      })
    );

    expect(mockResolveRoute).toHaveBeenCalledWith(routes, 'user', {
      id: '123',
    });
  });

  it('should separate standard Link props from route parameters', () => {
    mockResolveRoute.mockReturnValue('/posts/my-post/comments/comment-1');

    const routes = {
      post: {
        path: '/posts/[slug]/comments/[commentId]',
        params: { slug: '', commentId: '' },
      },
    };

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

    expect(mockResolveRoute).toHaveBeenCalledWith(routes, 'post', {
      slug: 'my-post',
      commentId: 'comment-1',
    });
  });

  it('should handle routes without parameters', () => {
    mockResolveRoute.mockReturnValue('/about');

    const routes = { about: '/about' };

    render(
      React.createElement(NextLink, {
        route: 'about',
        routes,
        children: 'About',
      })
    );

    expect(mockResolveRoute).toHaveBeenCalledWith(routes, 'about', {});
  });

  it('should handle direct string routes without routes config', () => {
    mockResolveRoute.mockReturnValue('/direct-path');

    render(
      React.createElement(NextLink, {
        route: '/direct-path',
        children: 'Direct Path',
      })
    );

    expect(mockResolveRoute).toHaveBeenCalledWith(
      undefined,
      '/direct-path',
      {}
    );
  });

  it('should handle complex route parameters', () => {
    mockResolveRoute.mockReturnValue(
      '/category/electronics/product/laptop-123/review/review-456'
    );

    const routes = {
      complex: {
        path: '/category/[category]/product/[productId]/review/[reviewId]',
        params: { category: '', productId: '', reviewId: '' },
      },
    };

    render(
      React.createElement(NextLink, {
        route: 'complex',
        routes,
        category: 'electronics',
        productId: 'laptop-123',
        reviewId: 'review-456',
        children: 'Complex Route',
      })
    );

    expect(mockResolveRoute).toHaveBeenCalledWith(routes, 'complex', {
      category: 'electronics',
      productId: 'laptop-123',
      reviewId: 'review-456',
    });
  });

  it('should handle numeric route parameters', () => {
    mockResolveRoute.mockReturnValue('/product/12345');

    const routes = {
      product: { path: '/product/[id]', params: { id: '' } },
    };

    render(
      React.createElement(NextLink, {
        route: 'product',
        routes,
        id: '12345',
        children: 'Product',
      })
    );

    expect(mockResolveRoute).toHaveBeenCalledWith(routes, 'product', {
      id: '12345',
    });
  });

  it('should handle empty route parameters', () => {
    mockResolveRoute.mockReturnValue('/user/[id]');

    const routes = {
      user: { path: '/user/[id]', params: { id: '' } },
    };

    render(
      React.createElement(NextLink, {
        route: 'user',
        routes,
        children: 'User',
      })
    );

    expect(mockResolveRoute).toHaveBeenCalledWith(routes, 'user', {});
  });

  it('should call resolveRoute even with only required props', () => {
    mockResolveRoute.mockReturnValue('/home');

    render(
      React.createElement(NextLink, {
        route: '/home',
        children: 'Home',
      })
    );

    expect(mockResolveRoute).toHaveBeenCalledWith(undefined, '/home', {});
  });
});
