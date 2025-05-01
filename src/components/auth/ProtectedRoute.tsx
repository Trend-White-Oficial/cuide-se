// Componente ProtectedRoute
// Componente que protege rotas privadas, garantindo que apenas usuários autenticados possam acessar
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  // Usuário não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuário autenticado - renderiza o componente protegido
  return <>{children}</>;
};