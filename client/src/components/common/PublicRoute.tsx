import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute component
 * Redirects to dashboard if user is already authenticated
 */
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // If still loading auth state, show nothing (or could show a spinner)
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from || '/dashboard';

  // If authenticated and on login/register page, redirect to dashboard
  if (user && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/')) {
    return <Navigate to={from} replace />;
  }

  // If not authenticated or on other public pages, render children
  return <>{children}</>;
};

export default PublicRoute;
