import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // TODO: Implementar lógica de autenticação
  const isAuthenticated = true; // Temporariamente sempre true para desenvolvimento
  const isAdmin = true; // Temporariamente sempre true para desenvolvimento

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 