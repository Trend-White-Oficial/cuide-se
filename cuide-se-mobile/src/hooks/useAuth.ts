import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const [storedUser, storedToken] = await Promise.all([
        SecureStore.getItemAsync('user'),
        SecureStore.getItemAsync('token'),
      ]);

      if (storedUser && storedToken) {
        setState({
          user: JSON.parse(storedUser),
          token: storedToken,
          loading: false,
        });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }

  async function signIn(email: string, password: string) {
    try {
      // Implementar chamada à API de login
      const response = await fetch('https://api.cuide-se.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      await Promise.all([
        SecureStore.setItemAsync('user', JSON.stringify(data.user)),
        SecureStore.setItemAsync('token', data.token),
      ]);

      setState({
        user: data.user,
        token: data.token,
        loading: false,
      });

      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync('user'),
        SecureStore.deleteItemAsync('token'),
      ]);

      setState({
        user: null,
        token: null,
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  async function updateUser(userData: Partial<User>) {
    try {
      if (!state.user) {
        throw new Error('Usuário não autenticado');
      }

      // Implementar chamada à API para atualizar usuário
      const response = await fetch(`https://api.cuide-se.com/users/${state.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar usuário');
      }

      const updatedUser = { ...state.user, ...data.user };
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));

      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  return {
    user: state.user,
    token: state.token,
    loading: state.loading,
    signIn,
    signOut,
    updateUser,
  };
} 