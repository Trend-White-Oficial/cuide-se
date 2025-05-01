import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, api } from '@/services/api';
import type { User, LoginCredentials, RegisterData } from '@/types/api';

interface AuthError {
  message: string;
  code?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const { data: responseData } = await authService.login(credentials);
          const { user, token } = responseData.data;
          
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ 
            error: { 
              message: error.response?.data?.message || 'Erro ao fazer login',
              code: error.response?.data?.code
            }, 
            isLoading: false 
          });
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const { data: responseData } = await authService.register(data);
          const { user, token } = responseData.data;
          
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ 
            error: { 
              message: error.response?.data?.message || 'Erro ao registrar',
              code: error.response?.data?.code
            }, 
            isLoading: false 
          });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 