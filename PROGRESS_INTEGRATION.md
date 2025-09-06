# Progress Integration Guide

Your `@vooteam/next-navigation` package now includes built-in progress bar support! Here are several ways you can integrate progress indicators:

## Option 1: Built-in Progress Provider (Recommended)

Use our built-in `ProgressProvider` for a seamless experience:

```tsx
// layout.tsx
import { ProgressProvider } from '@vooteam/next-navigation';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ProgressProvider
          config={{
            color: '#10b981', // Green color
            height: 4, // 4px height
            showSpinner: true, // Show spinner in corner
            easing: 'ease', // CSS easing
            speed: 300, // Animation speed
            shadow: true, // Add glow effect
          }}
        >
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
```

```tsx
// Your component
import { useNavigation } from '@vooteam/next-navigation';

function MyComponent() {
  const navigation = useNavigation({ enableProgress: true });

  const handleNavigate = async () => {
    await navigation.push('/about'); // Progress bar shows automatically
  };

  return (
    <button onClick={handleNavigate} disabled={navigation.isPending}>
      Navigate
    </button>
  );
}
```

## Option 2: Integration with NextJS TopLoader

For routes not handled by your hook, you can use `nextjs-toploader` alongside:

```bash
npm install nextjs-toploader
```

```tsx
// layout.tsx
import { ProgressProvider } from '@vooteam/next-navigation';
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* For regular Next.js navigation */}
        <NextTopLoader color="#3b82f6" height={3} showSpinner={true} />

        {/* For hook-based navigation */}
        <ProgressProvider
          config={{
            color: '#10b981',
            height: 4,
            showSpinner: true,
          }}
        >
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
```

## Option 3: Manual Progress Control

For fine-grained control, use the progress hooks directly:

```tsx
import { useProgress, useNavigation } from '@vooteam/next-navigation';

function AdvancedComponent() {
  const progress = useProgress();
  const navigation = useNavigation({ enableProgress: false }); // Disable automatic progress

  const handleCustomNavigation = async () => {
    try {
      progress.start();

      // Your custom loading logic
      await someApiCall();
      await navigation.push('/dashboard');

      progress.complete();
    } catch (error) {
      progress.complete(); // Always complete on error
      console.error('Navigation failed:', error);
    }
  };

  return (
    <div>
      {progress.isLoading && <div>Custom loading indicator...</div>}
      <button onClick={handleCustomNavigation}>Advanced Navigate</button>
    </div>
  );
}
```

## Configuration Options

### ProgressProvider Config

| Option        | Type    | Default   | Description                     |
| ------------- | ------- | --------- | ------------------------------- |
| `color`       | string  | `#3b82f6` | Progress bar color              |
| `height`      | number  | `3`       | Progress bar height in pixels   |
| `showSpinner` | boolean | `true`    | Show spinner indicator          |
| `easing`      | string  | `ease`    | CSS transition easing           |
| `speed`       | number  | `200`     | Animation speed in milliseconds |
| `shadow`      | boolean | `true`    | Add glow shadow effect          |

### useNavigation Config

| Option           | Type    | Default | Description                             |
| ---------------- | ------- | ------- | --------------------------------------- |
| `enableProgress` | boolean | `true`  | Enable automatic progress on navigation |

## Multiple Progress Bars

You can have different colored progress bars for different purposes:

- **Blue bar**: NextTopLoader for regular Next.js navigation
- **Green bar**: Built-in ProgressProvider for hook-based navigation
- **Custom**: Manual progress control for specific operations

This approach gives you maximum flexibility while maintaining a great user experience!
