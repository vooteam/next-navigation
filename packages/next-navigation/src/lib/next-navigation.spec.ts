import {
  AuthSession,
  createAuthConfig,
  useAuthState,
} from './next-navigation.js';

describe('auth-lib', () => {
  it('should create auth config', () => {
    const config = createAuthConfig({ baseUrl: 'http://localhost:3000' });
    expect(config.baseUrl).toEqual('http://localhost:3000');
  });

  it('should create auth session', () => {
    const config = createAuthConfig({ baseUrl: 'http://localhost:3000' });
    const session = new AuthSession(config);
    expect(session).toBeInstanceOf(AuthSession);
  });

  it('should return initial auth state', () => {
    const authState = useAuthState();
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.user).toBe(null);
    expect(authState.isLoading).toBe(false);
  });
});
