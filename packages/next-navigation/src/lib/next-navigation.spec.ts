import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('react', () => ({
  useCallback: vi.fn((fn) => fn),
  useTransition: vi.fn(() => [false, vi.fn()]),
  createContext: vi.fn(() => ({
    Provider: vi.fn(({ children }) => children),
    Consumer: vi.fn(),
  })),
  useContext: vi.fn(() => ({
    start: vi.fn(),
    complete: vi.fn(),
    isLoading: false,
  })),
  useState: vi.fn(() => [false, vi.fn()]),
  useEffect: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('./progress-provider', () => ({
  useProgress: vi.fn(() => ({
    start: vi.fn(),
    complete: vi.fn(),
    isLoading: false,
  })),
}));

import { useNavigation, resolveRoute, type Routes } from './next-navigation';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useProgress } from './progress-provider';

const mockUseRouter = useRouter as ReturnType<typeof vi.fn>;
const mockUseTransition = useTransition as ReturnType<typeof vi.fn>;
const mockUseProgress = useProgress as ReturnType<typeof vi.fn>;

// Test helper functions
const createMockRoutes = () => ({
  simple: '/simple-route',
  userProfile: { path: '/user/[id]/profile', params: { id: '' } },
  userPost: {
    path: '/user/[userId]/post/[postId]',
    params: { userId: '', postId: '' },
  },
  product: '/product/[id]',
  post: { path: '/post/[slug]', params: { slug: '' } },
});

const expectProgressCalls = (
  mockStart: ReturnType<typeof vi.fn>,
  mockComplete: ReturnType<typeof vi.fn>
) => {
  expect(mockStart).toHaveBeenCalled();
  expect(mockComplete).toHaveBeenCalled();
};

const expectNoProgressCalls = (
  mockStart: ReturnType<typeof vi.fn>,
  mockComplete: ReturnType<typeof vi.fn>
) => {
  expect(mockStart).not.toHaveBeenCalled();
  expect(mockComplete).not.toHaveBeenCalled();
};

describe('resolveRoute', () => {
  const testCases = [
    {
      name: 'should return the href as string when routes is undefined',
      routes: undefined,
      href: '/test',
      params: {},
      expected: '/test',
    },
    {
      name: 'should return the href as string when href is not a string',
      routes: { home: '/home' },
      href: 123 as unknown as string,
      params: {},
      expected: '123',
    },
    {
      name: 'should return the href as string when href is not in routes',
      routes: { home: '/home' },
      href: '/unknown',
      params: {},
      expected: '/unknown',
    },
    {
      name: 'should return string route directly',
      routes: { home: '/home', about: '/about' },
      href: 'home',
      params: {},
      expected: '/home',
    },
    {
      name: 'should resolve route with params object and no parameters',
      routes: { user: { path: '/user/profile', params: undefined } } as Routes,
      href: 'user',
      params: {},
      expected: '/user/profile',
    },
    {
      name: 'should resolve route with params and replace dynamic segments',
      routes: {
        user: { path: '/user/[id]/profile', params: { id: '' } },
      } as Routes,
      href: 'user',
      params: { id: '123' },
      expected: '/user/123/profile',
    },
    {
      name: 'should replace multiple dynamic segments',
      routes: {
        post: {
          path: '/user/[userId]/post/[postId]',
          params: { userId: '', postId: '' },
        },
      } as Routes,
      href: 'post',
      params: { userId: '123', postId: '456' },
      expected: '/user/123/post/456',
    },
    {
      name: 'should handle empty params object',
      routes: { user: { path: '/user/[id]', params: { id: '' } } } as Routes,
      href: 'user',
      params: {},
      expected: '/user/[id]',
    },
    {
      name: 'should convert non-string param values to strings',
      routes: { user: { path: '/user/[id]', params: { id: '' } } } as Routes,
      href: 'user',
      params: { id: 123 },
      expected: '/user/123',
    },
  ];

  testCases.forEach(({ name, routes, href, params, expected }) => {
    it(name, () => {
      const result = resolveRoute(routes, href, params);
      expect(result).toBe(expected);
    });
  });
});

describe('useNavigation', () => {
  let mockPush: ReturnType<typeof vi.fn>;
  let mockReplace: ReturnType<typeof vi.fn>;
  let mockBack: ReturnType<typeof vi.fn>;
  let mockStartTransition: ReturnType<typeof vi.fn>;
  let mockProgressStart: ReturnType<typeof vi.fn>;
  let mockProgressComplete: ReturnType<typeof vi.fn>;

  const setupMocks = () => {
    mockPush = vi.fn();
    mockReplace = vi.fn();
    mockBack = vi.fn();
    mockStartTransition = vi.fn((callback) => callback());
    mockProgressStart = vi.fn();
    mockProgressComplete = vi.fn();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
    });
    mockUseTransition.mockReturnValue([false, mockStartTransition]);
    mockUseProgress.mockReturnValue({
      start: mockProgressStart,
      complete: mockProgressComplete,
      isLoading: false,
    });
  };

  const advanceTimersAndWait = async (ms = 100) => {
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
  };

  beforeEach(() => {
    vi.useFakeTimers();
    setupMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should provide async push function', async () => {
      const navigation = useNavigation();
      const pushPromise = navigation.push('/test-path');

      await advanceTimersAndWait();
      await pushPromise;

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/test-path', undefined);
      expectProgressCalls(mockProgressStart, mockProgressComplete);
    });

    it('should provide async push function with scroll option', async () => {
      const navigation = useNavigation();
      const pushPromise = navigation.push('/test-path', { scroll: false });

      await advanceTimersAndWait();
      await pushPromise;

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/test-path', { scroll: false });
    });

    it('should provide async push function with scroll undefined', async () => {
      const navigation = useNavigation();
      const pushPromise = navigation.push('/test-path', { scroll: undefined });

      await advanceTimersAndWait();
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/test-path', undefined);
    });

    it('should provide async replace function', async () => {
      const navigation = useNavigation();
      const replacePromise = navigation.replace('/test-path');

      await advanceTimersAndWait();
      await replacePromise;

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/test-path', undefined);
      expectProgressCalls(mockProgressStart, mockProgressComplete);
    });

    it('should provide async replace function with scroll option', async () => {
      const navigation = useNavigation();
      const replacePromise = navigation.replace('/test-path', { scroll: true });

      await advanceTimersAndWait();
      await replacePromise;

      expect(mockReplace).toHaveBeenCalledWith('/test-path', { scroll: true });
    });

    it('should provide async back function', async () => {
      const navigation = useNavigation();
      const backPromise = navigation.back();

      await advanceTimersAndWait();
      await backPromise;

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockBack).toHaveBeenCalledWith();
      expectProgressCalls(mockProgressStart, mockProgressComplete);
    });

    it('should return navigation methods and isPending state', () => {
      const navigation = useNavigation();

      expect(navigation).toHaveProperty('push');
      expect(navigation).toHaveProperty('replace');
      expect(navigation).toHaveProperty('back');
      expect(navigation).toHaveProperty('isPending');
      expect(typeof navigation.push).toBe('function');
      expect(typeof navigation.replace).toBe('function');
      expect(typeof navigation.back).toBe('function');
      expect(typeof navigation.isPending).toBe('boolean');
    });

    it('should return isPending state from useTransition', () => {
      mockUseTransition.mockReturnValueOnce([true, mockStartTransition]);
      const navigation = useNavigation();

      expect(navigation.isPending).toBe(true);
    });
  });

  describe('progress configuration', () => {
    const testProgressConfig = async (
      enableProgress: boolean,
      shouldCallProgress: boolean
    ) => {
      const navigation = useNavigation({ enableProgress });
      const pushPromise = navigation.push('/test-path');

      await advanceTimersAndWait();
      await pushPromise;

      if (shouldCallProgress) {
        expectProgressCalls(mockProgressStart, mockProgressComplete);
      } else {
        expectNoProgressCalls(mockProgressStart, mockProgressComplete);
      }
    };

    it('should not call progress methods when enableProgress is false', async () => {
      await testProgressConfig(false, false);
    });

    it('should call progress methods when enableProgress is true', async () => {
      await testProgressConfig(true, true);
    });

    it('should call progress methods by default', async () => {
      const navigation = useNavigation({});
      const pushPromise = navigation.push('/test-path');

      await advanceTimersAndWait();
      await pushPromise;

      expectProgressCalls(mockProgressStart, mockProgressComplete);
    });
  });

  describe('routes configuration', () => {
    it('should resolve routes when provided in config for push', async () => {
      const navigation = useNavigation({ routes: { home: '/homepage' } });

      const pushPromise = navigation.push('home');
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/homepage', undefined);
    });

    it('should resolve routes with params for push', async () => {
      const routes = createMockRoutes();
      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('userProfile', {
        id: '123',
      });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123/profile', undefined);
    });

    it('should resolve routes with params and scroll option for push', async () => {
      const routes = createMockRoutes();
      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('userProfile', {
        id: '123',
        scroll: false,
      });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123/profile', {
        scroll: false,
      });
    });

    it('should resolve routes when provided in config for replace', async () => {
      const navigation = useNavigation({ routes: { about: '/about-us' } });

      const replacePromise = navigation.replace('about');
      vi.advanceTimersByTime(100);
      await replacePromise;

      expect(mockReplace).toHaveBeenCalledWith('/about-us', undefined);
    });

    it('should resolve routes with params for replace', async () => {
      const routes = createMockRoutes();
      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const replacePromise = (navigation.replace as any)('post', {
        slug: 'my-post',
        scroll: true,
      });
      vi.advanceTimersByTime(100);
      await replacePromise;

      expect(mockReplace).toHaveBeenCalledWith('/post/my-post', {
        scroll: true,
      });
    });

    it('should use string href directly when not in routes', async () => {
      const navigation = useNavigation();

      const pushPromise = navigation.push('/custom-path');
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/custom-path', undefined);
    });
  });

  describe('parameter handling', () => {
    const routes = createMockRoutes();

    it('should separate route params from navigation options', async () => {
      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('userPost', {
        userId: '123',
        postId: '456',
        scroll: false,
      });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123/post/456', {
        scroll: false,
      });
    });

    it('should handle empty options object', async () => {
      const navigation = useNavigation();

      const pushPromise = navigation.push('/test', {});
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/test', undefined);
    });

    it('should handle undefined options', async () => {
      const navigation = useNavigation();

      const pushPromise = navigation.push('/test', undefined);
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/test', undefined);
    });

    it('should handle route with params and separate navigation options for push', async () => {
      const navigation = useNavigation({ routes });

      // Testing undocumented 3-argument runtime behavior
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)(
        'userProfile',
        { id: '123' },
        { scroll: false }
      );
      await advanceTimersAndWait();
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123/profile', {
        scroll: false,
      });
    });

    it('should handle route with params and separate navigation options for replace', async () => {
      const navigation = useNavigation({ routes });

      // Testing undocumented 3-argument runtime behavior
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const replacePromise = (navigation.replace as any)(
        'post',
        { slug: 'test-post' },
        { scroll: true }
      );
      await advanceTimersAndWait();
      await replacePromise;

      expect(mockReplace).toHaveBeenCalledWith('/post/test-post', {
        scroll: true,
      });
    });

    it('should handle pure navigation options without route params for push', async () => {
      const navigation = useNavigation();

      const pushPromise = navigation.push('/simple-route', { scroll: false });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/simple-route', { scroll: false });
    });

    it('should handle pure navigation options without route params for replace', async () => {
      const navigation = useNavigation();

      const replacePromise = navigation.replace('/simple-route', {
        scroll: true,
      });
      vi.advanceTimersByTime(100);
      await replacePromise;

      expect(mockReplace).toHaveBeenCalledWith('/simple-route', {
        scroll: true,
      });
    });

    it('should handle route parameters when route config has no params defined for push', async () => {
      const navigation = useNavigation({
        routes: { product: '/product/[id]' },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('product', {
        id: '123',
        scroll: false,
      });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/product/[id]', { scroll: false });
    });

    it('should handle route parameters when route config has no params defined for replace', async () => {
      const navigation = useNavigation({
        routes: { category: '/category/[slug]' },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const replacePromise = (navigation.replace as any)('category', {
        slug: 'electronics',
        scroll: true,
      });
      vi.advanceTimersByTime(100);
      await replacePromise;

      expect(mockReplace).toHaveBeenCalledWith('/category/[slug]', {
        scroll: true,
      });
    });

    it('should handle extra parameters not defined in route params for push', async () => {
      const routes = { user: { path: '/user/[id]', params: { id: '' } } };
      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('user', {
        id: '123',
        name: 'john',
        scroll: false,
      });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123', { scroll: false });
    });

    it('should handle extra parameters not defined in route params for replace', async () => {
      const routes = { post: { path: '/post/[slug]', params: { slug: '' } } };
      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const replacePromise = (navigation.replace as any)('post', {
        slug: 'my-article',
        author: 'jane',
        scroll: true,
      });
      vi.advanceTimersByTime(100);
      await replacePromise;

      expect(mockReplace).toHaveBeenCalledWith('/post/my-article', {
        scroll: true,
      });
    });
  });

  describe('timing and promises', () => {
    const testPromiseResolution = async (action: () => Promise<void>) => {
      let resolved = false;
      const promise = action().then(() => {
        resolved = true;
      });

      expect(resolved).toBe(false);

      vi.advanceTimersByTime(99);
      await Promise.resolve();
      expect(resolved).toBe(false);

      vi.advanceTimersByTime(1);
      await promise;
      expect(resolved).toBe(true);
    };

    it('should resolve push promise after timeout', async () => {
      const navigation = useNavigation();
      await testPromiseResolution(() => navigation.push('/test'));
    });

    it('should resolve replace promise after timeout', async () => {
      const navigation = useNavigation();
      await testPromiseResolution(() => navigation.replace('/test'));
    });

    it('should resolve back promise after timeout', async () => {
      const navigation = useNavigation();
      await testPromiseResolution(() => navigation.back());
    });
  });
});
