<<<<<<< HEAD
=======
// Componente ProtectedRoute
// Componente que protege rotas privadas, garantindo que apenas usuários autenticados possam acessar
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

<<<<<<< HEAD
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

=======
// Interface que define as propriedades do componente
interface ProtectedRouteProps {
  children: React.ReactNode; // Componente filho protegido
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Estado de autenticação e carregamento
  const { isAuthenticated, isLoading } = useAuth();
  // Localização atual para redirecionamento
  const location = useLocation();

  // Estado de carregamento
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

<<<<<<< HEAD
=======
  // Usuário não autenticado
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

<<<<<<< HEAD
  return <>{children}</>;
}; 
=======
  // Usuário autenticado - renderiza o componente protegido
  return <>{children}</>;
};
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
