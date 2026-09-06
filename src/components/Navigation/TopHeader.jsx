import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  ChevronRight,
  HelpCircle,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Building2,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

const TopHeader = () => {
  const {
    currentRole,
    currentUser,
    authProfile,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getBreadcrumbs = () => {
    const p = location.pathname;
    if (p.includes('/challenges')) {
      const parts = p.split('/');
      const challengeId = parts.length > 3 ? parts[3] : null;
      return [
        { label: 'Government Portal', path: '/gov/overview' },
        { label: 'Challenges', path: '/gov/challenges' },
        ...(challengeId ? [{ label: `#${challengeId}`, isCurrent: true }] : [{ label: 'All Challenges', isCurrent: true }])
      ];
    }
    if (p.includes('/applications')) {
      return [
        { label: 'Government Portal', path: '/gov/overview' },
        { label: 'Applications & Evaluation', isCurrent: true }
      ];
    }
    if (p.includes('/pilots') || p.includes('/pilot')) {
      return [
        { label: 'Government Portal', path: '/gov/overview' },
        { label: 'Pilot Sandbox & Validation', isCurrent: true }
      ];
    }
    if (p.includes('/procurement')) {
      return [
        { label: 'Government Portal', path: '/gov/overview' },
        { label: 'Procurement & Scale-up', isCurrent: true }
      ];
    }
    if (p.includes('/admin')) {
      return [
        { label: 'Administration', path: '/admin/overview' },
        { label: 'Platform Security & Audit', isCurrent: true }
      ];
    }
    return [
      { label: 'Government Portal', path: '/gov/overview' },
      { label: 'Overview & Intelligence', isCurrent: true }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#e2e8f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      {/* Official Top National Banner Stripe */}
      <div className="gov-header-stripe" />

      {/* Main Bar */}
      <div className="px-6 h-14 flex items-center justify-between gap-4">
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 text-xs text-[#43474d] min-w-0">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#74777e] shrink-0" />}
              {crumb.path ? (
                <Link
                  to={crumb.path}
                  className="hover:text-[#001428] font-medium transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className={`truncate ${crumb.isCurrent ? 'text-[#001428] font-bold' : ''}`}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-[#74777e] pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search challenges, startups, applications..."
              className="w-full h-9 pl-9 pr-14 bg-white border border-[#e2e8f0] rounded-md text-xs text-[#0d1c2e] placeholder:text-[#74777e] focus:outline-none focus:border-[#045eb2] focus:ring-1 focus:ring-[#045eb2] shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
            />
            <kbd className="absolute right-2.5 bg-[#eff4ff] border border-[#c3c6ce] px-1.5 py-0.5 rounded text-[10px] font-mono text-[#43474d] pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* NIC Cloud Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#eff4ff] border border-[#d5e3fc] px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#0d9488] inline-block animate-pulse"></span>
            <span className="text-[11px] font-semibold text-[#003971] tracking-wide">
              NIC Cloud: Active
            </span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-1.5 text-[#43474d] hover:text-[#0d1c2e] hover:bg-[#eff4ff] rounded-md transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#ba1a1a] text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white border border-[#e2e8f0] rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-1.5 border-b border-[#eff4ff] flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0d1c2e]">
                    Notifications ({notifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] font-semibold text-[#045eb2] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#eff4ff]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#74777e]">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-[#eff4ff] ${
                          !notif.read ? 'bg-[#e6eeff]/50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-[#0d1c2e] mb-0.5">
                          <span>{notif.title}</span>
                          <span className="text-[10px] font-normal text-[#74777e]">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#43474d] leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={() => {}}
            className="p-1.5 text-[#43474d] hover:text-[#0d1c2e] hover:bg-[#eff4ff] rounded-md transition-colors cursor-pointer hidden sm:block"
            title="Help & Support"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative ml-1" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 p-1 rounded-md hover:bg-[#eff4ff] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#045eb2]/30"
              title="Account Menu"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-[#0f2942] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-[#7991af]/40">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#0d9488] ring-2 ring-white"></span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#74777e]" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#e2e8f0] rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                {/* User Identity Header */}
                <div className="px-4 py-3 border-b border-[#eff4ff] bg-[#f8f9ff]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0f2942] text-white font-bold text-sm flex items-center justify-center shrink-0 border border-[#7991af]/40">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-[#001428] truncate">
                        {currentUser?.name || 'Officer'}
                      </span>
                      <span className="text-xs text-[#045eb2] font-semibold truncate">
                        {currentUser?.designation || currentUser?.role || 'Government Officer'}
                      </span>
                      <span className="text-[10px] text-[#74777e] truncate">
                        {currentUser?.email || authProfile?.email || 'officer@gov.in'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-semibold bg-[#eff4ff] border border-[#d5e3fc] px-2.5 py-1 rounded">
                    <span className="text-[#003971] truncate">{currentUser?.department || 'Ministry / Authority'}</span>
                    <span className="text-[#0d9488] flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Account Navigation Options */}
                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (currentRole === 'Government') navigate('/gov/overview');
                      else if (currentRole === 'Startup') navigate('/startup/overview');
                      else if (currentRole === 'Expert') navigate('/expert/overview');
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-[#0d1c2e] hover:bg-[#eff4ff] transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#045eb2]" />
                    <span>My Profile & Nodal Role</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (currentRole === 'Government') navigate('/gov/challenges');
                      else if (currentRole === 'Startup') navigate('/startup/challenges');
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-[#0d1c2e] hover:bg-[#eff4ff] transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-[#74777e]" />
                    <span>Department Information</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/admin/audit-logs');
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-[#0d1c2e] hover:bg-[#eff4ff] transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0d9488]" />
                    <span>Security & Audit Trails</span>
                  </button>
                </div>

                {/* Logout Action */}
                <div className="pt-1 mt-1 border-t border-[#eff4ff]">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-[#ba1a1a]" />
                    <span>Sign Out of Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
