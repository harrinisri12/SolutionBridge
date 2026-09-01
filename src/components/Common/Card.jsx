import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = 'p-5',
  headerClassName = 'px-5 py-4 border-b border-slate-100'
}) => {
  return (
    <div className={`gov-card ${className}`}>
      {(title || action) && (
        <div className={`flex items-center justify-between ${headerClassName}`}>
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = 'blue', // blue, emerald, amber, purple, slate
  onClick
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
      bar: 'bg-blue-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      bar: 'bg-emerald-600'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      bar: 'bg-amber-600'
    },
    purple: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-100',
      bar: 'bg-indigo-600'
    },
    slate: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      bar: 'bg-slate-800'
    }
  }[color] || {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    bar: 'bg-blue-600'
  };

  return (
    <div
      onClick={onClick}
      className={`gov-card gov-card-hover p-5 relative overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorMap.bar}`} />
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>
          <h4 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap.bg} ${colorMap.text} border ${colorMap.border}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold ${
              trend.startsWith('+') ? 'text-emerald-700' : 'text-slate-600'
            }`}
          >
            {trend}
          </span>
          {trendLabel && <span className="text-slate-500">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default Card;
