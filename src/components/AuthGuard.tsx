import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard = ({ children, fallback, requireAuth = true }: AuthGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return fallback || (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-400">Please log in to access this feature.</div>
      </div>
    );
  }

  return <>{children}</>;
};
