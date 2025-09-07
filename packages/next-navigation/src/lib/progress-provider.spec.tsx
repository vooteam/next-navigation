import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { ProgressProvider, useProgress } from './progress-provider';

// Test components
const TestComponent: React.FC = () => {
  const { start, complete, isLoading } = useProgress();

  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'loading' : 'idle'}</div>
      <button data-testid="start-btn" onClick={start}>
        Start
      </button>
      <button data-testid="complete-btn" onClick={complete}>
        Complete
      </button>
    </div>
  );
};

const TestComponentWithoutProvider: React.FC = () => {
  const { start, complete, isLoading } = useProgress();

  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'loading' : 'idle'}</div>
      <button data-testid="start-btn" onClick={start}>
        Start
      </button>
      <button data-testid="complete-btn" onClick={complete}>
        Complete
      </button>
    </div>
  );
};

// Helper functions
const getTestElements = () => ({
  loadingState: screen.getByTestId('loading-state'),
  startBtn: screen.getByTestId('start-btn'),
  completeBtn: screen.getByTestId('complete-btn'),
});

const expectLoadingState = (state: 'loading' | 'idle') => {
  const { loadingState } = getTestElements();
  expect(loadingState.textContent).toBe(state);
};

const clickStart = () => {
  const { startBtn } = getTestElements();
  act(() => startBtn.click());
};

const clickComplete = () => {
  const { completeBtn } = getTestElements();
  act(() => completeBtn.click());
};

const expectProgressBar = (width?: string) => {
  if (width) {
    const progressBar = document.querySelector(`div[style*="width: ${width}"]`);
    expect(progressBar).toBeInTheDocument();
  } else {
    const progressElements = document.querySelectorAll(
      'div[style*="position: fixed"]'
    );
    expect(progressElements.length).toBeGreaterThan(0);
  }
};

describe('useProgress hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should return no-op implementation when used without provider', () => {
    render(<TestComponentWithoutProvider />);

    expectLoadingState('idle');

    const { startBtn, completeBtn } = getTestElements();
    expect(() => {
      startBtn.click();
      completeBtn.click();
    }).not.toThrow();

    expectLoadingState('idle');
  });

  it('should work correctly with ProgressProvider', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    expectLoadingState('idle');

    clickStart();
    expectLoadingState('loading');

    clickComplete();
    expectLoadingState('idle');
  });

  it('should handle multiple start/complete calls correctly', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    const { startBtn } = getTestElements();
    act(() => {
      startBtn.click();
      startBtn.click();
    });

    expectLoadingState('loading');

    clickComplete();
    expectLoadingState('idle');
  });
});

describe('ProgressProvider component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should render children correctly', () => {
    render(
      <ProgressProvider>
        <div data-testid="child">Test Child</div>
      </ProgressProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child').textContent).toBe('Test Child');
  });

  it('should render with default configuration', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    clickStart();
    expectProgressBar();
  });

  const configTestCases = [
    {
      name: 'should render with custom configuration',
      config: {
        color: '#ff0000',
        height: 5,
        showSpinner: false,
        easing: 'linear',
        speed: 100,
        shadow: false,
      },
      expectedSelector: 'div[style*="background-color: rgb(255, 0, 0)"]',
    },
    {
      name: 'should show spinner when showSpinner is true',
      config: { showSpinner: true },
      expectedSelector: 'div[style*="border-radius: 50%"]',
    },
    {
      name: 'should apply custom height configuration',
      config: { height: 10 },
      expectedSelector: 'div[style*="height: 10px"]',
    },
    {
      name: 'should apply shadow when shadow is true',
      config: { shadow: true, color: '#3b82f6' },
      expectedSelector: 'div[style*="box-shadow"]',
    },
  ];

  configTestCases.forEach(({ name, config, expectedSelector }) => {
    it(name, () => {
      render(
        <ProgressProvider config={config}>
          <TestComponent />
        </ProgressProvider>
      );

      clickStart();

      const element = document.querySelector(expectedSelector);
      expect(element).toBeInTheDocument();
    });
  });

  it('should not show spinner when showSpinner is false', () => {
    render(
      <ProgressProvider config={{ showSpinner: false }}>
        <TestComponent />
      </ProgressProvider>
    );

    clickStart();

    const spinner = document.querySelector('div[style*="border-radius: 50%"]');
    expect(spinner).not.toBeInTheDocument();
  });

  it('should not apply shadow when shadow is false', () => {
    render(
      <ProgressProvider config={{ shadow: false }}>
        <TestComponent />
      </ProgressProvider>
    );

    clickStart();

    const progressBar = document.querySelector(
      'div[style*="box-shadow: none"]'
    );
    expect(progressBar).toBeInTheDocument();
  });
});

describe('ProgressBar animation behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const animationSteps = [
    { time: 0, width: '0%' },
    { time: 50, width: '30%' },
    { time: 200, width: '60%' },
    { time: 400, width: '80%' },
  ];

  it('should animate progress when loading starts', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    clickStart();

    animationSteps.forEach(({ time, width }) => {
      if (time > 0) {
        act(() =>
          vi.advanceTimersByTime(
            time -
              (animationSteps[animationSteps.indexOf({ time, width }) - 1]
                ?.time || 0)
          )
        );
      }
      expectProgressBar(width);
    });
  });

  it('should complete progress animation when complete is called', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    clickStart();

    act(() => vi.advanceTimersByTime(100));

    clickComplete();

    expectProgressBar('100%');

    act(() => vi.advanceTimersByTime(200));

    const resetProgress = document.querySelector('div[style*="width: 0%"]');
    const hiddenProgress = document.querySelector('div[style*="opacity: 0"]');

    expect(
      resetProgress ||
        hiddenProgress ||
        !document.querySelector('div[style*="position: fixed"]')
    ).toBeTruthy();
  });

  it('should handle rapid start/complete cycles', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    const { startBtn, completeBtn } = getTestElements();

    act(() => {
      startBtn.click();
      completeBtn.click();
      startBtn.click();
      completeBtn.click();
    });

    expect(() => {
      act(() => vi.advanceTimersByTime(500));
    }).not.toThrow();
  });

  it('should handle edge case with opacity when progress becomes 0', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    clickStart();

    act(() => vi.advanceTimersByTime(50));

    clickComplete();

    let progressContainer = document.querySelector(
      'div[style*="position: fixed"]'
    );
    expect(progressContainer).toBeInTheDocument();

    expectProgressBar('100%');

    act(() => vi.advanceTimersByTime(199));

    progressContainer = document.querySelector('div[style*="position: fixed"]');
    expect(progressContainer).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));

    progressContainer = document.querySelector('div[style*="position: fixed"]');
    expect(progressContainer).toBeNull();
  });
});

describe('ProgressProvider configuration validation', () => {
  const configValidationTestCases = [
    {
      name: 'should merge custom config with defaults',
      config: { color: '#ff0000', height: 5 },
      expectations: [
        {
          selector: 'div[style*="background-color: rgb(255, 0, 0)"]',
          should: 'be in document',
        },
        { selector: 'div[style*="height: 5px"]', should: 'be in document' },
        {
          selector: 'div[style*="border-radius: 50%"]',
          should: 'be in document',
        }, // default showSpinner
      ],
    },
    {
      name: 'should handle empty config object',
      config: {},
      expectations: [
        { selector: 'div[style*="height: 3px"]', should: 'be in document' },
      ],
    },
    {
      name: 'should handle undefined config',
      config: undefined,
      expectations: [
        { selector: 'div[style*="height: 3px"]', should: 'be in document' },
      ],
    },
    {
      name: 'should handle partial config with shadow edge cases',
      config: { shadow: true },
      expectations: [
        { selector: 'div[style*="box-shadow"]', should: 'be in document' },
      ],
    },
  ];

  configValidationTestCases.forEach(({ name, config, expectations }) => {
    it(name, () => {
      render(
        <ProgressProvider config={config}>
          <TestComponent />
        </ProgressProvider>
      );

      clickStart();

      expectations.forEach(({ selector, should }) => {
        const element = document.querySelector(selector);
        if (should === 'be in document') {
          expect(element).toBeInTheDocument();
        } else {
          expect(element).not.toBeInTheDocument();
        }
      });
    });
  });
});
