// Contexto de Autenticação
// Gerencia o estado de autenticação do usuário e seus dados
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { supabase } from '../services/supabase';

// Interface que define os tipos de dados do contexto
interface AuthContextType {
  user: User | null; // Usuário atual
  userData: any | null; // Dados do usuário do Firestore
  loading: boolean; // Estado de carregamento
  isAuthenticated: boolean; // Status de autenticação
  error: string | null; // Erros de autenticação
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Criação do contexto com valores iniciais
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAuthenticated: false,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider que gerencia o estado de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verifica se o usuário está autenticado
  const isAuthenticated = !!user;

  // Efeito que monitora mudanças no estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        setUser(user);
        if (user) {
          // Busca dados do usuário no Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } else {
          setUserData(null);
        }
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Verificar sessão atual
    const session = supabase.auth.getSession();
    if (session) {
      fetchUser(session.user.id);
    }
    setLoading(false);

    // Escutar mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUser(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser(data as User);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUser(data.user.id);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...data });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAuthenticated, error, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};