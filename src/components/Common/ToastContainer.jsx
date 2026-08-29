import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50/90 text-emerald-950';
      case 'warning':
        return 'border-amber-200 bg-amber-50/90 text-amber-950';
      case 'error':
        return 'border-rose-200 bg-rose-50/90 text-rose-950';
      default:
        return 'border-blue-200 bg-blue-50/90 text-blue-950';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-3.5 border rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-10 pointer-events-auto ${getBorderColor(toast.type)}`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 text-xs font-semibold leading-relaxed">
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
