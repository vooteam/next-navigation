// Authentication types
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthConfig {
  baseUrl: string;
  secret?: string;
  providers?: AuthProvider[];
}

export interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'credentials';
  clientId?: string;
  clientSecret?: string;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Session management
export class AuthSession {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async signIn(credentials: {
    email: string;
    password: string;
  }): Promise<User | null> {
    // Mock implementation - replace with your auth logic
    if (credentials.email && credentials.password) {
      return {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
      };
    }
    return null;
  }

  async signOut(): Promise<void> {
    // Implement sign out logic
    console.log('User signed out');
  }

  async getSession(): Promise<User | null> {
    // Implement session retrieval logic using the config
    // This would typically check cookies/tokens with the baseUrl from config
    console.log('Getting session from:', this.config.baseUrl);
    return null;
  }

  async refreshToken(): Promise<string | null> {
    // Implement token refresh logic using the config
    console.log('Refreshing token for:', this.config.baseUrl);
    return null;
  }
}

// Utility functions for Next.js integration
export function createAuthConfig(options: Partial<AuthConfig>): AuthConfig {
  return {
    baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    secret: process.env.NEXTAUTH_SECRET,
    ...options,
  };
}

// Hook-like function for auth state (can be used with React)
export function useAuthState(): AuthState {
  // This would typically use React hooks in a real implementation
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
}
