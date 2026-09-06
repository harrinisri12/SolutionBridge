import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  User,
  Shield,
  ChevronDown,
  ExternalLink,
  Check,
  Building2,
  Rocket,
  Award
} from 'lucide-react';

const TopHeader = () => {
  const {
    currentRole,
    currentUser,
    setCurrentRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Derive human-readable page title
  const getPageInfo = () => {
    const p = location.pathname;
    if (p.includes('/admin')) return 'Platform Administration & Security';
    if (p.includes('/overview') || p.includes('/dashboard')) return 'Overview & Analytics';
    if (p.includes('/challenges')) return 'Government Challenges';
    if (p.includes('/applications')) return 'Applications & Evaluation Management';
    if (p.includes('/pilots') || p.includes('/pilot')) return 'Pilot Deployment & Validation';
    if (p.includes('/procurement')) return 'Direct Procurement & Impact Reports';
    if (p.includes('/payments')) return 'Milestone Disbursements & Status';
    if (p.includes('/evaluation')) return 'Expert Screening & Scoring';
    if (p.includes('/validation')) return 'Independent Pilot Validation';
    return 'Innovation Procurement Portal';
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Official Top National Banner Stripe */}
      <div className="gov-header-stripe" />

      {/* Main Bar */}
      <div className="px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Portal & Ministry Identity */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              <span>SolutionBridge</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-700 font-semibold">From Problems to Proven Solution</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {getPageInfo()}
            </h2>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Pill for Demo */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              {currentRole === 'Government' && <Building2 className="w-3.5 h-3.5 text-blue-600" />}
              {currentRole === 'Startup' && <Rocket className="w-3.5 h-3.5 text-emerald-600" />}
              {currentRole === 'Expert' && <Award className="w-3.5 h-3.5 text-purple-600" />}
              <span>Role: <strong className="text-slate-900">{currentRole}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                  Switch Active Portal Role
                </div>
                <button
                  onClick={() => {
                    setCurrentRole('Government');
                    navigate('/gov/overview');
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs text-left hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-800">Government Officer</div>
                      <div className="text-[10px] text-slate-500">Ministry of Water / Health</div>
                    </div>
                  </div>
                  {currentRole === 'Government' && <Check className="w-4 h-4 text-blue-600" />}
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('Startup');
                    navigate('/startup/overview');
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs text-left hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-slate-800">Startup Founder</div>
                      <div className="text-[10px] text-slate-500">AquaTech Solutions</div>
                    </div>
                  </div>
                  {currentRole === 'Startup' && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('Expert');
                    navigate('/expert/overview');
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-xs text-left hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-semibold text-slate-800">Expert Evaluator</div>
                      <div className="text-[10px] text-slate-500">Technical Screening Panel</div>
                    </div>
                  </div>
                  {currentRole === 'Expert' && <Check className="w-4 h-4 text-purple-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Notifications ({notifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                          !notif.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-0.5">
                          <span>{notif.title}</span>
                          <span className="text-[10px] font-normal text-slate-400">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
              {currentUser.avatar || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-none">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 leading-none mt-1">
                {currentUser.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
