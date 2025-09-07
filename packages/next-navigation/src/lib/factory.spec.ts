import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the dependencies
vi.mock('./next-navigation', () => ({
  useNavigation: vi.fn(),
}));

vi.mock('./next-link', () => ({
  NextLink: vi.fn(),
}));

import { createNextNavigation } from './factory';
import { useNavigation } from './next-navigation';
import { NextLink } from './next-link';
import type { Routes } from './next-navigation';

const mockUseNavigation = useNavigation as ReturnType<typeof vi.fn>;
const mockNextLink = NextLink as ReturnType<typeof vi.fn>;

describe('createNextNavigation', () => {
  const mockNavigationReturn = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    isPending: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigation.mockReturnValue(mockNavigationReturn);
    mockNextLink.mockImplementation((props) => props);
  });

  it('should return useNavigation hook and NextLink component', () => {
    const routes: Routes = {
      home: '/home',
      about: '/about',
    };

    const navigation = createNextNavigation({ routes });

    expect(navigation).toHaveProperty('useNavigation');
    expect(navigation).toHaveProperty('NextLink');
    expect(typeof navigation.useNavigation).toBe('function');
    expect(typeof navigation.NextLink).toBe('function');
  });

  it('should create useNavigation hook with provided config', () => {
    const routes: Routes = {
      home: '/home',
      user: { path: '/user/[id]', params: { id: '' } },
    };
    const config = {
      routes,
      enableProgress: true,
    };

    const navigation = createNextNavigation(config);
    const hookResult = navigation.useNavigation();

    expect(mockUseNavigation).toHaveBeenCalledWith(config);
    expect(hookResult).toBe(mockNavigationReturn);
  });

  it('should create NextLink component with bound routes', () => {
    const routes: Routes = {
      home: '/home',
      product: { path: '/product/[id]', params: { id: '' } },
    };

    const navigation = createNextNavigation({ routes });
    const TypedNextLink = navigation.NextLink;

    const linkProps = {
      route: 'home' as keyof typeof routes,
      children: 'Home Link',
    };

    TypedNextLink(linkProps);

    expect(mockNextLink).toHaveBeenCalledWith({
      ...linkProps,
      routes,
    });
  });

  it('should create NextLink component with route parameters', () => {
    const routes: Routes = {
      user: { path: '/user/[id]', params: { id: '' } },
      post: { path: '/post/[slug]', params: { slug: '' } },
    };

    const navigation = createNextNavigation({ routes });
    const TypedNextLink = navigation.NextLink;

    const linkProps = {
      route: 'user' as keyof typeof routes,
      id: '123',
      children: 'User Profile',
    };

    TypedNextLink(linkProps);

    expect(mockNextLink).toHaveBeenCalledWith({
      route: 'user',
      id: '123',
      children: 'User Profile',
      routes,
    });
  });

  it('should handle config with enableProgress disabled', () => {
    const routes: Routes = {
      home: '/home',
    };
    const config = {
      routes,
      enableProgress: false,
    };

    const navigation = createNextNavigation(config);
    navigation.useNavigation();

    expect(mockUseNavigation).toHaveBeenCalledWith(config);
  });

  it('should handle empty routes configuration', () => {
    const routes: Routes = {};
    const config = { routes };

    const navigation = createNextNavigation(config);
    navigation.useNavigation();

    expect(mockUseNavigation).toHaveBeenCalledWith(config);
  });

  it('should create multiple independent navigation instances', () => {
    const routes1: Routes = { home: '/home' };
    const routes2: Routes = { dashboard: '/dashboard' };

    const nav1 = createNextNavigation({ routes: routes1 });
    const nav2 = createNextNavigation({ routes: routes2 });

    nav1.useNavigation();
    nav2.useNavigation();

    expect(mockUseNavigation).toHaveBeenCalledTimes(2);
    expect(mockUseNavigation).toHaveBeenNthCalledWith(1, { routes: routes1 });
    expect(mockUseNavigation).toHaveBeenNthCalledWith(2, { routes: routes2 });
  });

  it('should preserve all configuration options', () => {
    const routes: Routes = {
      home: '/home',
      user: { path: '/user/[id]', params: { id: '' } },
    };

    const config = {
      routes,
      enableProgress: true,
    };

    const navigation = createNextNavigation(config);
    navigation.useNavigation();

    expect(mockUseNavigation).toHaveBeenCalledWith({
      routes,
      enableProgress: true,
    });
  });

  it('should pass through Link props to NextLink component', () => {
    const routes: Routes = {
      about: '/about',
    };

    const navigation = createNextNavigation({ routes });
    const TypedNextLink = navigation.NextLink;

    const linkProps = {
      route: 'about' as keyof typeof routes,
      className: 'test-class',
      style: { color: 'blue' },
      prefetch: false,
      children: 'About',
    };

    TypedNextLink(linkProps);

    expect(mockNextLink).toHaveBeenCalledWith({
      ...linkProps,
      routes,
    });
  });
});
