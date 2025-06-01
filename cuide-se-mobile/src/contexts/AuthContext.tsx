import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { authService } from '../services/supabase';
import { User } from '@supabase/supabase-js';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    // Verificar sessão atual
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.signIn(email, password);
      showToast(t('auth.signInSuccess'), 'success');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('auth.signInError'));
      showToast(t('auth.signInError'), 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.signUp(email, password, name);
      showToast(t('auth.signUpSuccess'), 'success');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('auth.signUpError'));
      showToast(t('auth.signUpError'), 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.signOut();
      showToast(t('auth.signOutSuccess'), 'success');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('auth.signOutError'));
      showToast(t('auth.signOutError'), 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.resetPassword(email);
      showToast(t('auth.resetPasswordSuccess'), 'success');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('auth.resetPasswordError'));
      showToast(t('auth.resetPasswordError'), 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showToast(t('auth.passwordUpdateSuccess'), 'success');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('auth.passwordUpdateError'));
      showToast(t('auth.passwordUpdateError'), 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        resetPassword,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 