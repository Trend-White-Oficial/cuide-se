import { renderHook } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { vi } from 'vitest';

vi.mock('@/services/api', () => ({
  authService: {
    login: vi.fn(() => Promise.resolve({ data: { token: 'test-token', user: { id: 1, name: 'Test User' } } })),
    logout: vi.fn(() => Promise.resolve()),
  },
  notificationsService: {
    getAll: vi.fn(() => Promise.resolve([])),
  },
}));

describe('useAuth', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(true);
  });

  it('should handle login successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await result.current.login({ email: 'test@example.com', password: 'password' });
    await waitForNextUpdate();

    expect(result.current.user).toEqual({ id: 1, name: 'Test User' });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await result.current.logout();

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});