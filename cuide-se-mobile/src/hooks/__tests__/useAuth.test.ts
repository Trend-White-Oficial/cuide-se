import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { authService } from '@/services/api';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do authService
vi.mock('@/services/api', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com o estado padrão', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => children,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve fazer login com sucesso', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockToken = 'test-token';
    (authService.login as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { user: mockUser, token: mockToken },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => children,
    });

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
    (authService.login as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => children,
    });

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
    (authService.logout as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => children,
    });

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
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => children,
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
}); 