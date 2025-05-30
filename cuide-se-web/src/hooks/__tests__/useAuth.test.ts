import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { authService } from '@/services/api';

// Mock do authService
vi.mock('@/services/api', () => ({
  authService: {
    login: vi.fn(() => Promise.resolve({ data: { token: 'test-token', user: { id: 1, name: 'Test User' } } })),
    logout: vi.fn(() => Promise.resolve()),
  },
  api: {
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com o estado padrão', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve fazer login com sucesso', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockToken = 'test-token';
    (authService.login as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser, token: mockToken },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro no login', async () => {
    const errorMessage = 'Credenciais inválidas';
    (authService.login as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'wrong-password');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('deve fazer logout com sucesso', async () => {
    (authService.logout as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth());

    // Primeiro faz login
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    // Depois faz logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve limpar o erro', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});