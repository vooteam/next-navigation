'use client';

import { createNextNavigation } from '@vooteam/next-navigation';
import { routes } from './routes';

// Create the typed navigation instance
export const { useNavigation, NextLink } = createNextNavigation({
  routes,
  enableProgress: true, // Enable progress indicator by default
});

// Export routes for direct access if needed
export { routes } from './routes';
export type { AppRoutes } from './routes';
