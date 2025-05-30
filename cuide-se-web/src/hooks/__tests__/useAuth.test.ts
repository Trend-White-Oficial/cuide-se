import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../useAuth';
import { authService } from '../../services/authService';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../services/authService', () => ({
    authService: {
        login: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn()
    }
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

    it('should login successfully', async () => {
        const mockUser = { id: 1, email: 'test@example.com' };
        (authService.login as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            user: mockUser,
            error: null
        });

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            await result.current.login('test@example.com', 'password');
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.error).toBeNull();
    });

    it('should handle login error', async () => {
        const mockError = new Error('Invalid credentials');
        (authService.login as ReturnType<typeof vi.fn>).mockRejectedValueOnce(mockError);

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            await result.current.login('test@example.com', 'wrong-password');
        });

        expect(result.current.user).toBeNull();
        expect(result.current.error).toBe(mockError);
    });

    it('should logout successfully', async () => {
        (authService.logout as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            await result.current.logout();
        });

        expect(result.current.user).toBeNull();
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