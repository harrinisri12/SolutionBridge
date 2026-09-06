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
  FileCheck2,
  Zap,
  Settings,
  HelpCircle,
  Flag,
  FileText,
  Scale,
  X
} from 'lucide-react';

const Sidebar = ({ isMobileOpen = false, onClose }) => {
  const { currentRole, currentUser, authProfile, logout, challenges, applications, pilots, procurementRecords } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavItems = () => {
    switch (currentRole) {
      case 'Admin':
        return [
          { name: 'OVERVIEW', path: '/admin/overview', icon: LayoutDashboard },
          { name: 'GOVERNMENT OFFICERS', path: '/admin/government-officers', icon: UserCog },
          { name: 'EXPERTS', path: '/admin/experts', icon: ShieldCheck },
          { name: 'STARTUPS', path: '/admin/startups', icon: Rocket },
          { name: 'DEPARTMENTS', path: '/admin/departments', icon: Building2 },
          { name: 'AUDIT LOGS', path: '/admin/audit-logs', icon: ScrollText }
        ];
      case 'Government':
        return [
          ...(authProfile?.is_admin ? [{ name: 'PLATFORM ADMIN', path: '/admin/overview', icon: ShieldAlert }] : []),
          { name: 'OVERVIEW', path: '/gov/overview', icon: LayoutDashboard },
          { name: 'CHALLENGES', path: '/gov/challenges', icon: Flag, count: challenges?.length },
          { name: 'APPLICATIONS & EVALUATION', path: '/gov/applications', icon: FileText, count: applications?.length },
          { name: 'PILOTS & VALIDATION', path: '/gov/pilots', icon: Zap, count: pilots?.length },
          { name: 'PROCUREMENT & REPORTS', path: '/gov/procurement', icon: Scale, count: procurementRecords?.length }
        ];
      case 'Startup':
        return [
          { name: 'OVERVIEW', path: '/startup/overview', icon: LayoutDashboard },
          { name: 'CHALLENGES', path: '/startup/challenges', icon: Flag, count: challenges?.length },
          { name: 'APPLICATIONS & EVALUATION', path: '/startup/applications', icon: FileCheck2, count: applications?.length },
          { name: 'MY PILOT', path: '/startup/pilot', icon: Zap, count: pilots?.length },
          { name: 'PAYMENTS & STATUS', path: '/startup/payments', icon: CreditCard }
        ];
      case 'Expert':
        return [
          { name: 'OVERVIEW', path: '/expert/overview', icon: LayoutDashboard },
          { name: 'EVALUATION', path: '/expert/evaluation', icon: ClipboardList, count: applications?.length },
          { name: 'PILOT VALIDATION', path: '/expert/validation', icon: ShieldCheck, count: pilots?.length }
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
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#ffffff] text-[#0d1c2e] flex flex-col h-screen shrink-0 border-r border-[#e2e8f0] shadow-2xl lg:shadow-[0_1px_8px_rgba(0,0,0,0.04)] justify-between overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Identity */}
        <div className="flex flex-col">
          <div className="px-4 py-3 flex items-center justify-between gap-2 bg-[#eff4ff] border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded bg-[#0f2942] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Shield className="w-4 h-4 text-[#89f5e7]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#001428] leading-tight truncate">
                  SolutionBridge
                </span>
                <span className="text-[10px] font-semibold text-[#43474d] uppercase tracking-wider leading-tight truncate">
                  National Portal
                </span>
              </div>
            </div>

            {/* Mobile Drawer Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-[#43474d] hover:text-[#001428] hover:bg-[#dce9ff] transition-colors cursor-pointer"
              title="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col py-2 px-1.5 gap-0.5">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={`${item.name}-${idx}`}
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors text-xs ${
                    isActive
                      ? 'bg-[#0f2942] text-white font-medium border-l-4 border-[#045eb2]'
                      : 'text-[#43474d] hover:bg-[#dce9ff]/60 hover:text-[#0d1c2e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#67a4fd]' : 'text-[#74777e]'
                      }`}
                    />
                    <span className="text-[12px] font-medium tracking-wide">{item.name}</span>
                  </div>
                  {item.count !== undefined && item.count !== null && item.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums ${
                        isActive
                          ? 'bg-[#003971] text-[#d5e3ff]'
                          : 'bg-[#d5e3fc] text-[#003971]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile, Settings & Role Switcher */}
        <div className="flex flex-col bg-[#eff4ff] border-t border-[#e2e8f0]">
          {/* Settings and Help */}
          <div className="flex flex-col py-1.5 px-1.5 gap-0.5">
            <button
              onClick={() => {}}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-[#43474d] hover:bg-[#dce9ff]/60 hover:text-[#0d1c2e] transition-colors text-left cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#74777e]" />
              <span className="text-[12px]">Settings</span>
            </button>
            <button
              onClick={() => {}}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-[#43474d] hover:bg-[#dce9ff]/60 hover:text-[#0d1c2e] transition-colors text-left cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#74777e]" />
              <span className="text-[12px]">Help & Support</span>
            </button>
          </div>

          {/* User profile footer card */}
          <div className="px-3.5 py-2.5 bg-[#e6eeff] flex items-center justify-between gap-2 border-t border-[#e2e8f0]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#0f2942] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-[#7991af]/40">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-bold text-[#0d1c2e] truncate">
                  {currentUser?.name || 'Officer'}
                </span>
                <span className="text-[10px] text-[#43474d] truncate">
                  {currentUser?.designation || currentUser?.department || currentUser?.role || 'Procurement Authority'}
                </span>
                <span className="text-[9px] font-semibold text-[#74777e] truncate uppercase">
                  {currentUser?.department || 'Govt of India'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-[#74777e] hover:text-[#ba1a1a] rounded hover:bg-[#dce9ff] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
