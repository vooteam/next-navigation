'use client';

import { createNextNavigation } from '@vooteam/next-navigation';
import { routes, type AppRoutes } from './routes';

// Create the typed navigation instance with explicit type
export const { useNavigation, NextLink } = createNextNavigation<AppRoutes>({
  routes,
  enableProgress: true, // Enable progress indicator by default
});

// Export routes for direct access if needed
export { routes } from './routes';
export type { AppRoutes } from './routes';
