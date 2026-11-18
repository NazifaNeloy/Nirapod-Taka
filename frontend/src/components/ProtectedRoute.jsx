import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner } from './Spinner.jsx';

/**
 * Route protection guard redirecting unauthenticated users to /login with original location state.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Protected children.
 * @returns {JSX.Element} Protected component or redirect.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
