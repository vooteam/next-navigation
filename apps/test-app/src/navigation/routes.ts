// Routes configuration for the test app
export const routes = {
  // Simple string routes
  home: '/',
  about: '/about',
  products: '/products',

  // Dynamic routes with parameters
  product: {
    path: '/products/[productId]',
    params: undefined as
      | undefined
      | {
          productId: string;
        },
  },

  // Routes with typed parameters
  login: {
    path: '/login',
    params: undefined as
      | undefined
      | {
          returnUrl?: string;
          source?: 'header' | 'footer' | 'modal';
        },
  },

  // API routes
  api: {
    path: '/api/hello',
    params: undefined as
      | undefined
      | {
          message?: string;
        },
  },
} as const;

export type AppRoutes = typeof routes;
