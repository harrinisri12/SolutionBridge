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
  const isAdmin = Boolean(authProfile.is_admin) || userRole === 'platform_admin';
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  // Role check with Admin override for Government portal
  const isAuthorized =
    normalizedAllowed.includes(userRole) ||
    (isAdmin && normalizedAllowed.includes('government'));

  if (normalizedAllowed.length > 0 && !isAuthorized) {
    // Redirect to the user's rightful portal
    if (userRole === 'startup') {
      return <Navigate to="/startup/overview" replace />;
    }
    if (userRole === 'expert') {
      return <Navigate to="/expert/overview" replace />;
    }
    if (userRole === 'government' || userRole === 'platform_admin' || isAdmin) {
      return <Navigate to="/gov/overview" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
