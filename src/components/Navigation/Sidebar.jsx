import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  CreditCard,
  LogOut,
  Building2,
  Rocket,
  Shield,
  ShieldAlert,
  UserCog,
  ScrollText,
  Target,
  FileCheck2,
  Zap,
  CheckCircle2
} from 'lucide-react';

const Sidebar = () => {
  const { currentRole, currentUser, authProfile, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // STRICT Navigation Divisions:
  // Admin: platform administration only
  // Government: 5 divisions
  // Startup: 4 divisions
  // Expert: 3 divisions
  const getNavItems = () => {
    switch (currentRole) {
      case 'Admin':
        return [
          { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
          { name: 'Government Officers', path: '/admin/government-officers', icon: UserCog },
          { name: 'Experts', path: '/admin/experts', icon: ShieldCheck },
          { name: 'Startups', path: '/admin/startups', icon: Rocket },
          { name: 'Departments', path: '/admin/departments', icon: Building2 },
          { name: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText }
        ];
      case 'Government':
        return [
          ...(authProfile?.is_admin ? [{ name: 'Platform Admin', path: '/admin/overview', icon: ShieldAlert }] : []),
          { name: 'Overview', path: '/gov/overview', icon: LayoutDashboard },
          { name: 'Challenges', path: '/gov/challenges', icon: Target },
          { name: 'Applications & Evaluation', path: '/gov/applications', icon: FileCheck2 },
          { name: 'Pilot & Validation', path: '/gov/pilots', icon: Zap },
          { name: 'Procurement & Reports', path: '/gov/procurement', icon: CheckCircle2 }
        ];
      case 'Startup':
        return [
          { name: 'Overview', path: '/startup/overview', icon: LayoutDashboard },
          { name: 'Challenges', path: '/startup/challenges', icon: Target },
          { name: 'My Pilot', path: '/startup/pilot', icon: Zap },
          { name: 'Payments & Status', path: '/startup/payments', icon: CreditCard }
        ];
      case 'Expert':
        return [
          { name: 'Overview', path: '/expert/overview', icon: LayoutDashboard },
          { name: 'Evaluation', path: '/expert/evaluation', icon: ClipboardList },
          { name: 'Pilot Validation', path: '/expert/validation', icon: ShieldCheck }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen shrink-0 border-r border-slate-800 shadow-md">
      {/* Top Brand Identity */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0 border border-blue-400/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-sm leading-tight text-white tracking-wide truncate">
            SolutionBridge
          </h1>
          <span className="text-[10px] text-blue-300 font-medium tracking-wide truncate block">
            From Problems to Proven Solution
          </span>
        </div>
      </div>

      {/* Role Context Ribbon */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Active Portal
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-900/60 text-blue-200 border border-blue-700/50">
            {currentRole}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-200 truncate mt-1">
          {currentUser.name}
        </p>
        <p className="text-[11px] text-slate-400 truncate">
          {currentUser.designation || currentUser.department || currentUser.startupName}
        </p>
      </div>

      {/* Strict Role Navigation Menu */}
      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
        Main Navigation ({navItems.length})
      </div>
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Role Switcher for SIH Presentation */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          SIH Prototype Role Switch
        </span>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => {
              setCurrentRole('Government');
              navigate('/gov/overview');
            }}
            className={`px-1.5 py-1 rounded text-[10px] font-medium text-center transition-colors cursor-pointer ${
              currentRole === 'Government'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch to Government Portal"
          >
            Govt
          </button>
          <button
            onClick={() => {
              setCurrentRole('Startup');
              navigate('/startup/overview');
            }}
            className={`px-1.5 py-1 rounded text-[10px] font-medium text-center transition-colors cursor-pointer ${
              currentRole === 'Startup'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch to Startup Portal"
          >
            Startup
          </button>
          <button
            onClick={() => {
              setCurrentRole('Expert');
              navigate('/expert/overview');
            }}
            className={`px-1.5 py-1 rounded text-[10px] font-medium text-center transition-colors cursor-pointer ${
              currentRole === 'Expert'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch to Expert Portal"
          >
            Expert
          </button>
        </div>
      </div>

      {/* Logout / Exit */}
      <div className="p-3 border-t border-slate-800 bg-slate-900">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit / Return to Login</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
