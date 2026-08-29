import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", cancelText = "Cancel", confirmColor = "blue" }) => {
  if (!isOpen) return null;

  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
    emerald: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white",
    rose: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white",
    slate: "bg-slate-600 hover:bg-slate-700 focus:ring-slate-500 text-white"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-800 text-base">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 text-sm text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${colorClasses[confirmColor] || colorClasses.blue}`}
            >
              {confirmText}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Modal;
