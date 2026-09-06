import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

/**
 * AdminRoute
 * Enforces that the authenticated user is a Government Officer with is_admin === true.
 * Normal government officers, startups, and experts are strictly blocked.
 */
const AdminRoute = () => {
  const { authSession, authProfile, isAuthLoading } = useApp();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <div className="text-sm font-semibold tracking-wide text-slate-200">
            Verifying Platform Administrator Credentials...
          </div>
          <p className="text-xs text-slate-400">
            Checking backend administrative authorization
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

  const isGov = (authProfile.role || '').toLowerCase() === 'government';
  const isAdmin = Boolean(authProfile.is_admin);

  // Platform Admin verification
  if (!isGov || !isAdmin) {
    const userRole = (authProfile.role || '').toLowerCase();
    if (userRole === 'government') {
      return <Navigate to="/gov/overview" replace />;
    }
    if (userRole === 'startup') {
      return <Navigate to="/startup/overview" replace />;
    }
    if (userRole === 'expert') {
      return <Navigate to="/expert/overview" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
