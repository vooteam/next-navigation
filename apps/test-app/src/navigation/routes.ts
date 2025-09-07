// Routes configuration for the test app
export const routes = {
  // Simple string routes
  home: '/',
  about: '/about',
  products: '/products',

  // Dynamic routes with parameters
  product: {
    path: '/products/[productId]',
    params: {} as {
      productId: string;
    },
  },

  // Routes with typed parameters
  login: {
    path: '/login',
    params: {} as {
      returnUrl?: string;
      source?: 'header' | 'footer' | 'modal';
    },
  },

  // API routes
  api: {
    path: '/api/hello',
    params: {} as {
      message?: string;
    },
  },
} as const;

export type AppRoutes = typeof routes;
