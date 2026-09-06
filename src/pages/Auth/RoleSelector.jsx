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
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#001428]">
          Select Stakeholder Role
        </label>
        <span className="text-[11px] text-[#64748b] font-medium">
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
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#045eb2] focus:ring-offset-1 ${
                isSelected
                  ? 'border-[#045eb2] bg-[#eff4ff] text-[#001428] shadow-2xs ring-1 ring-[#045eb2]/40'
                  : 'border-[#e2e8f0] bg-white hover:bg-[#f8f9ff] text-[#43474d] hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#045eb2] text-white'
                      : 'bg-[#f1f5f9] text-[#475569]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#045eb2] text-white">
                    Active
                  </span>
                ) : (
                  <span className="text-[9px] text-[#64748b] font-medium">
                    {role.badge}
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-[#001428] leading-tight">
                {role.title}
              </div>
              <p className="text-[10px] text-[#64748b] mt-1 line-clamp-2 leading-snug">
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
