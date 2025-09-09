// Type-Safe Routes Example
import { createNextNavigation } from '@vooteam/next-navigation';

// Define your routes with type safety
const routes = {
  home: '/',
  about: '/about',
  products: '/products',
  user: { 
    path: '/users/[id]', 
    params: { id: '' } as { id: string } 
  },
  blog: { 
    path: '/blog/[category]/[slug]',
    params: { 
      category: '', 
      slug: '' 
    } as { 
      category: string; 
      slug: string; 
    }
  },
  dashboard: {
    path: '/dashboard/[section]',
    params: {} as {
      section: 'analytics' | 'settings' | 'users';
      tab?: 'overview' | 'details';
    }
  }
} as const;

// Create typed navigation instance
export const { useNavigation, NextLink } = createNextNavigation({
  routes,
  enableProgress: true
});

// Export route type for use in other files
export type AppRoutes = typeof routes;
