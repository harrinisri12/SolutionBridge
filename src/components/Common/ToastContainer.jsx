import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg transition-all animate-in slide-in-from-bottom-5 duration-200 ${
              isSuccess
                ? 'bg-slate-900 text-white border-slate-800'
                : isError
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {isInfo && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs leading-relaxed font-medium">
              {toast.message}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
