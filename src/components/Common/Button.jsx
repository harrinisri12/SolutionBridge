import React from 'react';

const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, success, ghost
  size = 'md', // sm, md, lg
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-4.5 py-2.5 text-base gap-2.5'
  }[size] || 'px-3.5 py-2 text-sm gap-2';

  const variantClasses = {
    primary:
      'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 focus:ring-slate-500 shadow-sm',
    secondary:
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-sm',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus:ring-slate-400',
    success:
      'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 focus:ring-emerald-500 shadow-sm',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 shadow-sm',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-400'
  }[variant] || 'bg-slate-900 text-white hover:bg-slate-800';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};

export default Button;
