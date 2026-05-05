import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Wraps any route that requires authentication.
 * Redirects to /login with the current path as `returnTo` state so
 * the user can be sent back after signing in.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ returnTo: location.pathname, fromCheckout: true }}
        replace
      />
    );
  }

  return children;
}
