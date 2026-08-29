import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, ChevronDown, RefreshCw, User, HelpCircle, Check } from 'lucide-react';

const TopHeader = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  
  const roleRef = useRef();
  const notifRef = useRef();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter notifications for the active role
  const roleNotifs = notifications.filter(n => n.role === currentRole);
  const unreadNotifs = roleNotifs.filter(n => !n.read);

  // Generate breadcrumb path based on route
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    if (pathnames.length === 0) return ["Home"];
    
    // Capitalize first letter
    return pathnames.map(
      (name) => name.charAt(0).toUpperCase() + name.slice(1).replace("-", " ")
    );
  };

  const breadcrumbs = getBreadcrumbs();

  const handleRoleSwitch = (role) => {
    setCurrentRole(role);
    setShowRoleDropdown(false);
    
    // Redirect to corresponding dashboard
    if (role === "Government") navigate("/gov/dashboard");
    else if (role === "Startup") navigate("/startup/dashboard");
    else if (role === "Expert") navigate("/expert/dashboard");
    else if (role === "Validator") navigate("/validator/dashboard");
    else if (role === "Finance") navigate("/finance/dashboard");
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shadow-xs shrink-0 select-none z-40 relative">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-slate-400 text-xs">/</span>}
            <span className={`text-sm ${idx === breadcrumbs.length - 1 ? "font-semibold text-slate-800" : "text-slate-500"}`}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        
        {/* Simulator Switcher Panel */}
        <div className="relative" ref={roleRef}>
          <div className="flex items-center gap-1 bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 rounded-lg p-1 px-3 transition-colors cursor-pointer" onClick={() => setShowRoleDropdown(!showRoleDropdown)}>
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase font-bold text-blue-600 tracking-wider">Impersonation Simulator</span>
              <span className="text-xs font-semibold text-blue-900">{currentRole} Portal</span>
            </div>
            <ChevronDown className="w-4 h-4 text-blue-600 ml-1" />
          </div>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1">
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Switch Simulation Role</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Toggle users to test end-to-end data pipeline flow.</p>
              </div>
              <ul className="text-sm font-medium">
                {[
                  { id: "Government", label: "Government Officer", desc: "Publish challenges, review proposals, deploy pilots" },
                  { id: "Startup", label: "Startup User", desc: "Discover challenges, submit solutions, report KPIs" },
                  { id: "Expert", label: "Expert Evaluator", desc: "Grade proposals with weighted criteria scores" },
                  { id: "Validator", label: "Independent Validator", desc: "Audit and verify pilot outcome claims" },
                  { id: "Finance", label: "Finance Officer", desc: "Approve milestone payments, review reports" }
                ].map((role) => (
                  <li key={role.id}>
                    <button
                      onClick={() => handleRoleSwitch(role.id)}
                      className={`flex w-full items-start justify-between px-4 py-2.5 hover:bg-slate-50 text-left transition-colors cursor-pointer ${
                        currentRole === role.id ? "bg-blue-50/50 text-blue-700" : "text-slate-700"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm block">{role.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal leading-normal">{role.desc}</span>
                      </div>
                      {currentRole === role.id && <Check className="w-4 h-4 text-blue-600 mt-1 shrink-0" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center relative cursor-pointer"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="font-bold text-slate-800 text-sm">Notifications ({unreadNotifs.length})</span>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {roleNotifs.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No notifications for {currentRole}
                  </div>
                ) : (
                  roleNotifs.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3.5 border-b border-slate-100 flex flex-col gap-0.5 cursor-pointer hover:bg-slate-50/50 transition-colors ${
                        !notif.read ? "bg-blue-50/20 font-medium" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{notif.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
                <span className="text-xs font-semibold text-slate-500 hover:text-slate-600 block cursor-pointer">
                  View Notification Center
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-1 leading-none">{currentUser.email}</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopHeader;
