// Progress Provider Setup Example
import { ProgressProvider } from '@vooteam/next-navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <ProgressProvider
          config={{
            color: '#3b82f6',      // Blue progress bar
            height: 3,             // 3px height
            showSpinner: true,     // Show loading spinner
            speed: 200,            // 200ms animation
            easing: 'ease',        // CSS easing
            shadow: true,          // Glowing shadow effect
          }}
        >
          <main>{children}</main>
        </ProgressProvider>
      </body>
    </html>
  );
}
