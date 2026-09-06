import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute
 * Restricts access to authenticated users with specified role(s).
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { authSession, authProfile, isAuthLoading } = useApp();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <div className="text-sm font-semibold tracking-wide text-slate-200">
            Verifying SolutionBridge Authentication...
          </div>
          <p className="text-xs text-slate-400">
            Restoring encrypted session credentials
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!authSession || !authProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Active check
  if (authProfile.is_active === false) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (authProfile.role || '').toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  // Role check
  if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(userRole)) {
    // Redirect to the user's rightful portal
    if (userRole === 'startup') {
      return <Navigate to="/startup/overview" replace />;
    }
    if (userRole === 'expert') {
      return <Navigate to="/expert/overview" replace />;
    }
    if (userRole === 'government') {
      return <Navigate to="/gov/overview" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
