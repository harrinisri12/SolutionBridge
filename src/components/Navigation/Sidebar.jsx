import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Target,
  FileText,
  ClipboardCheck,
  Zap,
  ScrollText,
  TrendingUp,
  CreditCard,
  CheckSquare,
  TrendingUp as ScaleIcon,
  BarChart3,
  History,
  Bell,
  Settings,
  User,
  Files,
  LogOut,
  Award,
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const { currentRole, currentUser, setCurrentRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Define navigation sections based on active role
  const getNavItems = () => {
    switch (currentRole) {
      case "Government":
        return [
          { name: "Dashboard", path: "/gov/dashboard", icon: LayoutDashboard },
          { name: "Challenges", path: "/gov/challenges", icon: Target },
          { name: "Applications", path: "/gov/screening", icon: FileText },
          { name: "Evaluations (Rankings)", path: "/gov/ranking", icon: Award },
          { name: "Pilots", path: "/gov/pilots", icon: Zap },
          { name: "Contracts", path: "/gov/contracts", icon: ScrollText },
          { name: "KPIs", path: "/gov/kpis", icon: TrendingUp },
          { name: "Payments", path: "/gov/payments", icon: CreditCard },
          { name: "Validation", path: "/gov/validation", icon: ClipboardCheck },
          { name: "Scale-Up", path: "/gov/scale-up", icon: ScaleIcon },
          { name: "Reports", path: "/gov/reports", icon: BarChart3 },
          { name: "Audit Logs", path: "/gov/audit", icon: History },
          { name: "Notifications", path: "/gov/notifications", icon: Bell },
          { name: "Settings", path: "/gov/settings", icon: Settings }
        ];
      case "Startup":
        return [
          { name: "Dashboard", path: "/startup/dashboard", icon: LayoutDashboard },
          { name: "Browse Challenges", path: "/startup/challenges", icon: Target },
          { name: "My Applications", path: "/startup/applications", icon: FileText },
          { name: "My Pilots", path: "/startup/pilots", icon: Zap },
          { name: "Documents", path: "/startup/documents", icon: Files },
          { name: "Payments", path: "/startup/payments", icon: CreditCard },
          { name: "Notifications", path: "/startup/notifications", icon: Bell },
          { name: "Profile", path: "/startup/profile", icon: User }
        ];
      case "Expert":
        return [
          { name: "Dashboard", path: "/expert/dashboard", icon: LayoutDashboard },
          { name: "Assigned Evaluations", path: "/expert/evaluations", icon: ClipboardCheck },
          { name: "Startups List", path: "/expert/startups", icon: User },
          { name: "History", path: "/expert/history", icon: History },
          { name: "Notifications", path: "/expert/notifications", icon: Bell }
        ];
      case "Validator":
        return [
          { name: "Dashboard", path: "/validator/dashboard", icon: LayoutDashboard },
          { name: "Pilots Overview", path: "/validator/pilots", icon: Zap },
          { name: "Validation Tasks", path: "/validator/tasks", icon: CheckSquare },
          { name: "Reports", path: "/validator/reports", icon: BarChart3 },
          { name: "Notifications", path: "/validator/notifications", icon: Bell }
        ];
      case "Finance":
        return [
          { name: "Dashboard", path: "/finance/dashboard", icon: LayoutDashboard },
          { name: "Payment Requests", path: "/finance/requests", icon: CreditCard },
          { name: "Payment History", path: "/finance/history", icon: History },
          { name: "Reports", path: "/finance/reports", icon: BarChart3 }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen shrink-0 border-r border-slate-800">
      {/* Brand logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
          SB
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none text-white tracking-wide">GovProcure</h1>
          <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">SolutionBridge</span>
        </div>
      </div>

      {/* Active Role Label */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-850 flex flex-col gap-1">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Workspace</span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-sm text-slate-200">{currentRole} Portal</span>
        </div>
        <span className="text-xs text-slate-400 truncate mt-0.5">{currentUser.name}</span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log Out / Exit
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
