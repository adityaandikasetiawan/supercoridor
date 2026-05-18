import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  const allowed = allowedRoles ?? ['super_admin', 'content', 'hr'];

  if (!isAuthenticated || !user || !user.role || !allowed.includes(user.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
