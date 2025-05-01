import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfessional?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireProfessional = false 
}: ProtectedRouteProps) => {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireProfessional && userData?.role !== 'professional') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 