import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock React and Next.js modules before importing the hook
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

// Import after mocking
import { useNavigation, resolveRoute, type Routes } from './next-navigation';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useProgress } from './progress-provider';

const mockUseRouter = useRouter as ReturnType<typeof vi.fn>;
const mockUseTransition = useTransition as ReturnType<typeof vi.fn>;
const mockUseProgress = useProgress as ReturnType<typeof vi.fn>;

describe('resolveRoute', () => {
  it('should return the href as string when routes is undefined', () => {
    const result = resolveRoute(undefined, '/test', {});
    expect(result).toBe('/test');
  });

  it('should return the href as string when href is not a string', () => {
    const routes = { home: '/home' };
    const result = resolveRoute(routes, 123 as unknown as string, {});
    expect(result).toBe('123');
  });

  it('should return the href as string when href is not in routes', () => {
    const routes = { home: '/home' };
    const result = resolveRoute(routes, '/unknown', {});
    expect(result).toBe('/unknown');
  });

  it('should return string route directly', () => {
    const routes = { home: '/home', about: '/about' };
    const result = resolveRoute(routes, 'home', {});
    expect(result).toBe('/home');
  });

  it('should resolve route with params object and no parameters', () => {
    const routes: Routes = {
      user: { path: '/user/profile', params: undefined },
    };
    const result = resolveRoute(routes, 'user', {});
    expect(result).toBe('/user/profile');
  });

  it('should resolve route with params and replace dynamic segments', () => {
    const routes: Routes = {
      user: { path: '/user/[id]/profile', params: { id: '' } },
    };
    const result = resolveRoute(routes, 'user', { id: '123' });
    expect(result).toBe('/user/123/profile');
  });

  it('should replace multiple dynamic segments', () => {
    const routes: Routes = {
      post: {
        path: '/user/[userId]/post/[postId]',
        params: { userId: '', postId: '' },
      },
    };
    const result = resolveRoute(routes, 'post', {
      userId: '123',
      postId: '456',
    });
    expect(result).toBe('/user/123/post/456');
  });

  it('should handle empty params object', () => {
    const routes: Routes = {
      user: { path: '/user/[id]', params: { id: '' } },
    };
    const result = resolveRoute(routes, 'user', {});
    expect(result).toBe('/user/[id]');
  });

  it('should convert non-string param values to strings', () => {
    const routes: Routes = {
      user: { path: '/user/[id]', params: { id: '' } },
    };
    const result = resolveRoute(routes, 'user', { id: 123 });
    expect(result).toBe('/user/123');
  });
});

describe('useNavigation', () => {
  let mockPush: ReturnType<typeof vi.fn>;
  let mockReplace: ReturnType<typeof vi.fn>;
  let mockBack: ReturnType<typeof vi.fn>;
  let mockStartTransition: ReturnType<typeof vi.fn>;
  let mockProgressStart: ReturnType<typeof vi.fn>;
  let mockProgressComplete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();

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
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should provide async push function', async () => {
      const navigation = useNavigation();

      const pushPromise = navigation.push('/test-path');
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/test-path', undefined);
      expect(mockProgressStart).toHaveBeenCalled();
      expect(mockProgressComplete).toHaveBeenCalled();
    });

    it('should provide async push function with scroll option', async () => {
      const navigation = useNavigation();
      const options = { scroll: false };

      const pushPromise = navigation.push('/test-path', options);
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/test-path', { scroll: false });
    });

    it('should provide async push function with scroll undefined', async () => {
      const navigation = useNavigation();
      const options = { scroll: undefined };

      const pushPromise = navigation.push('/test-path', options);
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/test-path', undefined);
    });

    it('should provide async replace function', async () => {
      const navigation = useNavigation();

      const replacePromise = navigation.replace('/test-path');
      vi.advanceTimersByTime(100);
      await replacePromise;

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/test-path', undefined);
      expect(mockProgressStart).toHaveBeenCalled();
      expect(mockProgressComplete).toHaveBeenCalled();
    });

    it('should provide async replace function with scroll option', async () => {
      const navigation = useNavigation();
      const options = { scroll: true };

      const replacePromise = navigation.replace('/test-path', options);
      vi.advanceTimersByTime(100);
      await replacePromise;

      expect(mockReplace).toHaveBeenCalledWith('/test-path', { scroll: true });
    });

    it('should provide async back function', async () => {
      const navigation = useNavigation();

      const backPromise = navigation.back();
      vi.advanceTimersByTime(100);
      await backPromise;

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockBack).toHaveBeenCalledWith();
      expect(mockProgressStart).toHaveBeenCalled();
      expect(mockProgressComplete).toHaveBeenCalled();
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
    it('should not call progress methods when enableProgress is false', async () => {
      const navigation = useNavigation({ enableProgress: false });

      const pushPromise = navigation.push('/test-path');
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockProgressStart).not.toHaveBeenCalled();
      expect(mockProgressComplete).not.toHaveBeenCalled();
    });

    it('should call progress methods when enableProgress is true', async () => {
      const navigation = useNavigation({ enableProgress: true });

      const pushPromise = navigation.push('/test-path');
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockProgressStart).toHaveBeenCalled();
      expect(mockProgressComplete).toHaveBeenCalled();
    });

    it('should call progress methods by default', async () => {
      const navigation = useNavigation({});

      const pushPromise = navigation.push('/test-path');
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockProgressStart).toHaveBeenCalled();
      expect(mockProgressComplete).toHaveBeenCalled();
    });
  });

  describe('routes configuration', () => {
    it('should resolve routes when provided in config for push', async () => {
      const routes: Routes = {
        home: '/homepage',
        user: { path: '/user/[id]', params: { id: '' } },
      };

      const navigation = useNavigation({ routes });

      const pushPromise = navigation.push('home');
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/homepage', undefined);
    });

    it('should resolve routes with params for push', async () => {
      const routes: Routes = {
        user: { path: '/user/[id]', params: { id: '' } },
      };

      const navigation = useNavigation({ routes });

      // TypeScript has trouble inferring route params correctly in this test context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('user', { id: '123' });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123', undefined);
    });

    it('should resolve routes with params and scroll option for push', async () => {
      const routes: Routes = {
        user: { path: '/user/[id]', params: { id: '' } },
      };

      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('user', {
        id: '123',
        scroll: false,
      });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123', { scroll: false });
    });

    it('should resolve routes when provided in config for replace', async () => {
      const routes: Routes = {
        about: '/about-us',
      };

      const navigation = useNavigation({ routes });

      const replacePromise = navigation.replace('about');
      vi.advanceTimersByTime(100);
      await replacePromise;

      expect(mockReplace).toHaveBeenCalledWith('/about-us', undefined);
    });

    it('should resolve routes with params for replace', async () => {
      const routes: Routes = {
        post: { path: '/post/[slug]', params: { slug: '' } },
      };

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
      const routes: Routes = {
        home: '/homepage',
      };

      const navigation = useNavigation({ routes });

      const pushPromise = navigation.push('/custom-path');
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/custom-path', undefined);
    });
  });

  describe('parameter handling', () => {
    it('should separate route params from navigation options', async () => {
      const routes: Routes = {
        user: {
          path: '/user/[id]/posts/[postId]',
          params: { id: '', postId: '' },
        },
      };

      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('user', {
        id: '123',
        postId: '456',
        scroll: false,
      });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123/posts/456', {
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
      const routes: Routes = {
        user: {
          path: '/user/[id]',
          params: { id: '' },
        },
      };

      const navigation = useNavigation({ routes });

      // This tests the two-argument case: params as first arg, options as second arg
      // @ts-expect-error - Testing runtime behavior for args[1] coverage
      const pushPromise = navigation.push(
        'user',
        { id: '123' },
        { scroll: false }
      );
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123', {
        scroll: false,
      });
    });

    it('should handle route with params and separate navigation options for replace', async () => {
      const routes: Routes = {
        post: {
          path: '/post/[slug]',
          params: { slug: '' },
        },
      };

      const navigation = useNavigation({ routes });

      // This tests the two-argument case: params as first arg, options as second arg
      // @ts-expect-error - Testing runtime behavior for args[1] coverage
      const replacePromise = navigation.replace(
        'post',
        { slug: 'test-post' },
        { scroll: true }
      );
      vi.advanceTimersByTime(100);
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

      expect(mockPush).toHaveBeenCalledWith('/simple-route', {
        scroll: false,
      });
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
      const routes: Routes = {
        // Route without params property defined
        product: '/product/[id]',
      };

      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('product', {
        id: '123',
        scroll: false,
      });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/product/[id]', {
        scroll: false,
      });
    });

    it('should handle route parameters when route config has no params defined for replace', async () => {
      const routes: Routes = {
        // Route without params property defined
        category: '/category/[slug]',
      };

      const navigation = useNavigation({ routes });

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
      const routes: Routes = {
        user: {
          path: '/user/[id]',
          params: { id: '' }, // Only id is defined
        },
      };

      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pushPromise = (navigation.push as any)('user', {
        id: '123',
        name: 'john', // Extra param not in route definition
        scroll: false,
      });
      vi.advanceTimersByTime(100);
      await pushPromise;

      expect(mockPush).toHaveBeenCalledWith('/user/123', {
        scroll: false,
      });
    });

    it('should handle extra parameters not defined in route params for replace', async () => {
      const routes: Routes = {
        post: {
          path: '/post/[slug]',
          params: { slug: '' }, // Only slug is defined
        },
      };

      const navigation = useNavigation({ routes });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const replacePromise = (navigation.replace as any)('post', {
        slug: 'my-article',
        author: 'jane', // Extra param not in route definition
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
    it('should resolve push promise after timeout', async () => {
      const navigation = useNavigation();
      let resolved = false;

      const pushPromise = navigation.push('/test').then(() => {
        resolved = true;
      });

      expect(resolved).toBe(false);

      vi.advanceTimersByTime(99);
      await Promise.resolve(); // Allow microtasks to run
      expect(resolved).toBe(false);

      vi.advanceTimersByTime(1);
      await pushPromise;
      expect(resolved).toBe(true);
    });

    it('should resolve replace promise after timeout', async () => {
      const navigation = useNavigation();
      let resolved = false;

      const replacePromise = navigation.replace('/test').then(() => {
        resolved = true;
      });

      vi.advanceTimersByTime(50);
      await Promise.resolve();
      expect(resolved).toBe(false);

      vi.advanceTimersByTime(50);
      await replacePromise;
      expect(resolved).toBe(true);
    });

    it('should resolve back promise after timeout', async () => {
      const navigation = useNavigation();
      let resolved = false;

      const backPromise = navigation.back().then(() => {
        resolved = true;
      });

      vi.advanceTimersByTime(50);
      await Promise.resolve();
      expect(resolved).toBe(false);

      vi.advanceTimersByTime(50);
      await backPromise;
      expect(resolved).toBe(true);
    });
  });
});
