import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, BellOff, CheckCircle2, Trash2 } from 'lucide-react';

const GovNotifications = () => {
  const { 
    currentRole, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useApp();

  const roleNotifs = notifications.filter(n => n.role === currentRole);
  const unreadCount = roleNotifs.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 text-left">
      
      {/* Title & Actions */}
      <div className="flex justify-between items-center bg-slate-50 p-6 border border-slate-100 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-wide flex items-center gap-2">
            <Bell className="w-5.5 h-5.5 text-blue-600" />
            Notification Center ({unreadCount} unread)
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Track updates related to your active {currentRole} session.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1 px-4 py-2 border border-slate-205 bg-white rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100">
        {roleNotifs.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markNotificationRead(notif.id)}
            className={`p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/40 transition-colors ${
              !notif.read ? "bg-blue-50/15" : ""
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${!notif.read ? "bg-blue-600" : "bg-transparent"}`} />
                <h4 className={`text-xs ${!notif.read ? "font-bold text-slate-850" : "font-semibold text-slate-600"}`}>
                  {notif.title}
                </h4>
              </div>
              <p className="text-xs text-slate-550 leading-relaxed pl-4">{notif.message}</p>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold shrink-0">{notif.date}</span>
          </div>
        ))}

        {roleNotifs.length === 0 && (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <BellOff className="w-10 h-10 text-slate-300" />
            <span className="text-sm font-semibold">No notifications recorded for {currentRole} role.</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default GovNotifications;
