'use client';

import { usePathname } from 'next/navigation';

const Hero = () => {
  const pathname = usePathname();

  const getPageInfo = () => {
    switch (pathname) {
      case '/':
        return {
          title: 'Welcome to the Demo',
          subtitle:
            '🚀 Test the async navigation hook with built-in progress bars and loading states. Try navigating between pages using both the header navigation and the demo buttons below.',
        };
      case '/about':
        return {
          title: 'About Page',
          subtitle:
            '📖 Learn more about the @vooteam/next-navigation library and its capabilities for async router operations.',
        };
      case '/products':
        return {
          title: 'Products Page',
          subtitle:
            '📦 Explore demo products and test navigation with custom options like scroll control.',
        };
      case '/login':
        return {
          title: 'Login Page',
          subtitle:
            '🔐 This page demonstrates navigation.replace() functionality and form layouts.',
        };
      default:
        return {
          title: 'Navigation Demo',
          subtitle:
            '🚀 Test the async navigation hook with built-in progress bars and loading states.',
        };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div
      style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white',
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #fff, #e2e8f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: '1.125rem',
          marginBottom: '2rem',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.6',
        }}
      >
        {subtitle}
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          ⚡ Async Navigation
        </span>
        <span
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          🎯 Progress Bars
        </span>
        <span
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          📱 TypeScript Ready
        </span>
      </div>
    </div>
  );
};

export default Hero;
