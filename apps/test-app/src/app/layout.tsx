import './global.css';
import { NavigationLogProvider } from './context/NavigationLogContext';

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
      <body>
        <NavigationLogProvider>{children}</NavigationLogProvider>
      </body>
    </html>
  );
}
