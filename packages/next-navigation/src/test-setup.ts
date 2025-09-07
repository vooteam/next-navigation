import '@testing-library/jest-dom';

// Mock ResizeObserver which is not available in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
};

// Mock requestAnimationFrame which is not available in jsdom
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id: number): void => {
  clearTimeout(id);
};

// Mock performance.now for timing tests
Object.defineProperty(global.performance, 'now', {
  writable: true,
  value: () => Date.now(),
});
