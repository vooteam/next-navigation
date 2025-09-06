import './global.css';
import { NavigationLogProvider } from './context/NavigationLogContext';
import { ProgressProvider } from '@vooteam/next-navigation';
import NextTopLoader from 'nextjs-toploader';
import Header from './components/Header';
import NavigationLogger from './components/NavigationLogger';

export const metadata = {
  title: '@vooteam/next-navigation - Async Navigation Hook for Next.js',
  description:
    'A Next.js navigation hook library for async router operations with built-in loading states and TypeScript support.',
  keywords: [
    'nextjs',
    'navigation',
    'router',
    'react',
    'hook',
    'async',
    'vooteam',
  ],
  authors: [{ name: 'Vooteam' }],
  openGraph: {
    title: '@vooteam/next-navigation',
    description:
      'A Next.js navigation hook library for async router operations',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{ margin: 0, minHeight: '100vh', backgroundColor: '#f9fafb' }}
      >
        {/* NextTopLoader for route changes not handled by our hook */}
        <NextTopLoader
          color="#3b82f6"
          height={3}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 20px #3b82f6"
        />

        {/* Our custom progress provider for hook-based navigation */}
        <ProgressProvider
          config={{
            color: '#10b981',
            height: 4,
            showSpinner: true,
            easing: 'ease',
            speed: 300,
            shadow: true,
          }}
        >
          <NavigationLogProvider>
            <Header />
            <main style={{ minHeight: 'calc(100vh - 4rem)' }}>
              <div
                style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  padding: '2rem',
                }}
              >
                {children}
                <NavigationLogger />
              </div>
            </main>
          </NavigationLogProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
