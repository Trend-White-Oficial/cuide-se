// Contexto de Autenticação
// Gerencia o estado de autenticação do usuário e seus dados
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interface que define os tipos de dados do contexto
interface AuthContextType {
  user: User | null; // Usuário atual
  userData: any | null; // Dados do usuário do Firestore
  loading: boolean; // Estado de carregamento
  isAuthenticated: boolean; // Status de autenticação
  error: string | null; // Erros de autenticação
}

// Criação do contexto com valores iniciais
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAuthenticated: false,
  error: null,
});

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Provider que gerencia o estado de autenticação
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAuthenticated, error }}>
      {children}
    </AuthContext.Provider>
  );
};