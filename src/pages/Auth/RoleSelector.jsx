import React from 'react';
import { Building2, Rocket, UserCheck } from 'lucide-react';

const ROLES = [
  {
    id: 'Government',
    title: 'Government',
    description: 'Manage challenges, pilots and procurement',
    icon: Building2,
    badge: 'Officer Portal'
  },
  {
    id: 'Startup',
    title: 'Startup',
    description: 'Discover challenges and submit solutions',
    icon: Rocket,
    badge: 'DPIIT Innovator'
  },
  {
    id: 'Expert',
    title: 'Expert',
    description: 'Evaluate proposals and validate pilots',
    icon: UserCheck,
    badge: 'Evaluator Panel'
  }
];

const RoleSelector = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Select Stakeholder Role
        </label>
        <span className="text-[11px] text-slate-500 font-medium">
          Choose your workspace
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              aria-pressed={isSelected}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 text-blue-950 shadow-xs ring-1 ring-blue-600/30'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-700 text-white">
                    Active
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-400 font-medium">
                    {role.badge}
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-slate-900 leading-tight">
                {role.title}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                {role.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
