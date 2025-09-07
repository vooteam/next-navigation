import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Import the actual components
import { ProgressProvider, useProgress } from './progress-provider';

// Create a test component that uses the useProgress hook
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

// Test component without provider
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

    const loadingState = screen.getByTestId('loading-state');
    const startBtn = screen.getByTestId('start-btn');
    const completeBtn = screen.getByTestId('complete-btn');

    expect(loadingState.textContent).toBe('idle');

    // Test that no-op functions don't throw errors
    expect(() => {
      startBtn.click();
      completeBtn.click();
    }).not.toThrow();

    expect(loadingState.textContent).toBe('idle'); // Should remain idle
  });

  it('should work correctly with ProgressProvider', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    const loadingState = screen.getByTestId('loading-state');
    const startBtn = screen.getByTestId('start-btn');
    const completeBtn = screen.getByTestId('complete-btn');

    // Initial state should be idle
    expect(loadingState.textContent).toBe('idle');

    // Start loading
    act(() => {
      startBtn.click();
    });

    expect(loadingState.textContent).toBe('loading');

    // Complete loading
    act(() => {
      completeBtn.click();
    });

    expect(loadingState.textContent).toBe('idle');
  });

  it('should handle multiple start/complete calls correctly', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    const loadingState = screen.getByTestId('loading-state');
    const startBtn = screen.getByTestId('start-btn');
    const completeBtn = screen.getByTestId('complete-btn');

    // Multiple starts should work
    act(() => {
      startBtn.click();
      startBtn.click();
    });

    expect(loadingState.textContent).toBe('loading');

    // Complete should reset to idle
    act(() => {
      completeBtn.click();
    });

    expect(loadingState.textContent).toBe('idle');
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

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Progress bar should be rendered when loading
    const progressElements = document.querySelectorAll(
      'div[style*="position: fixed"]'
    );
    expect(progressElements.length).toBeGreaterThan(0);
  });

  it('should render with custom configuration', () => {
    const customConfig = {
      color: '#ff0000',
      height: 5,
      showSpinner: false,
      easing: 'linear',
      speed: 100,
      shadow: false,
    };

    render(
      <ProgressProvider config={customConfig}>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Check if custom color is applied
    const progressBar = document.querySelector(
      'div[style*="background-color: rgb(255, 0, 0)"]'
    );
    expect(progressBar).toBeInTheDocument();
  });

  it('should show spinner when showSpinner is true', () => {
    render(
      <ProgressProvider config={{ showSpinner: true }}>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Check for spinner
    const spinner = document.querySelector('div[style*="border-radius: 50%"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should not show spinner when showSpinner is false', () => {
    render(
      <ProgressProvider config={{ showSpinner: false }}>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Check that spinner is not rendered
    const spinner = document.querySelector('div[style*="border-radius: 50%"]');
    expect(spinner).not.toBeInTheDocument();
  });

  it('should apply custom height configuration', () => {
    render(
      <ProgressProvider config={{ height: 10 }}>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Check for custom height
    const progressContainer = document.querySelector(
      'div[style*="height: 10px"]'
    );
    expect(progressContainer).toBeInTheDocument();
  });

  it('should apply shadow when shadow is true', () => {
    render(
      <ProgressProvider config={{ shadow: true, color: '#3b82f6' }}>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Check for box-shadow
    const progressBar = document.querySelector('div[style*="box-shadow"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should not apply shadow when shadow is false', () => {
    render(
      <ProgressProvider config={{ shadow: false }}>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Check that box-shadow is none
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

  it('should animate progress when loading starts', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Initially progress should be 0%
    let progressBar = document.querySelector('div[style*="width: 0%"]');
    expect(progressBar).toBeInTheDocument();

    // After 50ms should be 30%
    act(() => {
      vi.advanceTimersByTime(50);
    });

    progressBar = document.querySelector('div[style*="width: 30%"]');
    expect(progressBar).toBeInTheDocument();

    // After 200ms should be 60%
    act(() => {
      vi.advanceTimersByTime(150);
    });

    progressBar = document.querySelector('div[style*="width: 60%"]');
    expect(progressBar).toBeInTheDocument();

    // After 400ms should be 80%
    act(() => {
      vi.advanceTimersByTime(200);
    });

    progressBar = document.querySelector('div[style*="width: 80%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should complete progress animation when complete is called', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');
    const completeBtn = screen.getByTestId('complete-btn');

    act(() => {
      startBtn.click();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      completeBtn.click();
    });

    // Should jump to 100%
    const progressBar = document.querySelector('div[style*="width: 100%"]');
    expect(progressBar).toBeInTheDocument();

    // After 200ms the progress should be reset (either hidden or width 0)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Check that progress is either reset to 0% or the container is hidden
    const resetProgress = document.querySelector('div[style*="width: 0%"]');
    const hiddenProgress = document.querySelector('div[style*="opacity: 0"]');

    // At least one of these conditions should be true
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

    const startBtn = screen.getByTestId('start-btn');
    const completeBtn = screen.getByTestId('complete-btn');

    // Rapid cycles
    act(() => {
      startBtn.click();
      completeBtn.click();
      startBtn.click();
      completeBtn.click();
    });

    // Should handle without errors
    expect(() => {
      vi.advanceTimersByTime(500);
    }).not.toThrow();
  });

  it('should handle edge case with opacity when progress becomes 0', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');
    const completeBtn = screen.getByTestId('complete-btn');

    // Start loading
    act(() => {
      startBtn.click();
    });

    // Let it progress a bit
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Complete loading - this sets isLoading to false and starts the completion timer
    act(() => {
      completeBtn.click();
    });

    // At this point isLoading = false, progress should be 100%
    let progressContainer = document.querySelector(
      'div[style*="position: fixed"]'
    );
    expect(progressContainer).toBeInTheDocument();

    // Progress should be 100% with opacity 1
    const progressBar = document.querySelector('div[style*="width: 100%"]');
    expect(progressBar).toBeInTheDocument();

    // Now advance time by exactly 199ms (just before the 200ms timeout that resets progress to 0)
    act(() => {
      vi.advanceTimersByTime(199);
    });

    // Progress should still be 100%
    progressContainer = document.querySelector('div[style*="position: fixed"]');
    expect(progressContainer).toBeInTheDocument();

    // Now advance by 1ms more to trigger the progress reset to 0
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Now isLoading = false AND progress = 0, so component should return null
    progressContainer = document.querySelector('div[style*="position: fixed"]');
    expect(progressContainer).toBeNull();
  });
});

describe('ProgressProvider configuration validation', () => {
  it('should merge custom config with defaults', () => {
    const customConfig = {
      color: '#ff0000',
      height: 5,
    };

    render(
      <ProgressProvider config={customConfig}>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Custom color should be applied
    const progressBar = document.querySelector(
      'div[style*="background-color: rgb(255, 0, 0)"]'
    );
    expect(progressBar).toBeInTheDocument();

    // Custom height should be applied
    const progressContainer = document.querySelector(
      'div[style*="height: 5px"]'
    );
    expect(progressContainer).toBeInTheDocument();

    // Default showSpinner should still work
    const spinner = document.querySelector('div[style*="border-radius: 50%"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should handle empty config object', () => {
    render(
      <ProgressProvider config={{}}>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Should use defaults
    const progressContainer = document.querySelector(
      'div[style*="height: 3px"]'
    );
    expect(progressContainer).toBeInTheDocument();
  });

  it('should handle undefined config', () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Should use defaults
    const progressContainer = document.querySelector(
      'div[style*="height: 3px"]'
    );
    expect(progressContainer).toBeInTheDocument();
  });

  it('should handle partial config with shadow edge cases', () => {
    render(
      <ProgressProvider config={{ shadow: true }}>
        <TestComponent />
      </ProgressProvider>
    );

    const startBtn = screen.getByTestId('start-btn');

    act(() => {
      startBtn.click();
    });

    // Should use default color with shadow
    const progressBar = document.querySelector('div[style*="box-shadow"]');
    expect(progressBar).toBeInTheDocument();

    // The shadow should include the default color
    const shadowStyle = progressBar?.getAttribute('style');
    expect(shadowStyle).toContain('box-shadow');
  });
});
