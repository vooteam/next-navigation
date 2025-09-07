import '@testing-library/jest-dom';

global.ResizeObserver = class ResizeObserver {
  observe() {
    return void 0;
  }
  unobserve() {
    return void 0;
  }
  disconnect() {
    return void 0;
  }
};

global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id: number): void => {
  clearTimeout(id);
};

Object.defineProperty(global.performance, 'now', {
  writable: true,
  value: () => Date.now(),
});
