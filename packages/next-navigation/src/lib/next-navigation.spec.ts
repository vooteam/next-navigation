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
import { useNavigation } from './next-navigation';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const mockUseRouter = useRouter as ReturnType<typeof vi.fn>;
const mockUseTransition = useTransition as ReturnType<typeof vi.fn>;

describe('useNavigation', () => {
  let mockPush: ReturnType<typeof vi.fn>;
  let mockReplace: ReturnType<typeof vi.fn>;
  let mockBack: ReturnType<typeof vi.fn>;
  let mockStartTransition: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPush = vi.fn();
    mockReplace = vi.fn();
    mockBack = vi.fn();
    mockStartTransition = vi.fn((callback) => callback());

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
    });

    mockUseTransition.mockReturnValue([false, mockStartTransition]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should provide async push function', async () => {
    const navigation = useNavigation();

    await navigation.push('/test-path');

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/test-path', undefined);
  });

  it('should provide async push function with options', async () => {
    const navigation = useNavigation();
    const options = { scroll: false };

    await navigation.push('/test-path', options);

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/test-path', options);
  });

  it('should provide async replace function', async () => {
    const navigation = useNavigation();

    await navigation.replace('/test-path');

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/test-path', undefined);
  });

  it('should provide async replace function with options', async () => {
    const navigation = useNavigation();
    const options = { scroll: false };

    await navigation.replace('/test-path', options);

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/test-path', options);
  });

  it('should provide async back function', async () => {
    const navigation = useNavigation();

    await navigation.back();

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockBack).toHaveBeenCalledWith();
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
    // Test when isPending is true
    mockUseTransition.mockReturnValueOnce([true, mockStartTransition]);
    const navigation = useNavigation();

    expect(navigation.isPending).toBe(true);
  });
});
