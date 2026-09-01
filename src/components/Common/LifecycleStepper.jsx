import React from 'react';
import {
  HelpCircle,
  FileQuestion,
  FileCheck,
  Award,
  Zap,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const STAGES = [
  { id: 'problem', label: 'Gov Problem', icon: FileQuestion, desc: 'Department identifies operational challenge' },
  { id: 'challenge', label: 'Challenge', icon: FileCheck, desc: 'Public challenge published with KPIs' },
  { id: 'application', label: 'Application', icon: FileQuestion, desc: 'Startups submit technical proposals' },
  { id: 'evaluation', label: 'Evaluation', icon: Award, desc: 'Expert scoring on 1-10 multi-criteria' },
  { id: 'pilot', label: 'Pilot Project', icon: Zap, desc: 'Field milestone trials & telemetry' },
  { id: 'validation', label: 'Validation', icon: ShieldCheck, desc: 'Independent audit against KPI targets' },
  { id: 'procurement', label: 'Procurement', icon: CheckCircle2, desc: 'Direct Procurement Order execution' },
  { id: 'scale', label: 'Scale-Up', icon: TrendingUp, desc: 'Statewide / national rollout' }
];

export const LifecycleStepper = ({ activeStage = 'pilot', className = '' }) => {
  const getStageIndex = (id) => STAGES.findIndex((s) => s.id === id);
  const activeIdx = typeof activeStage === 'number' ? activeStage : getStageIndex(activeStage);

  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-3 shadow-xs ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Government Innovation Procurement Lifecycle
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
          Stage {activeIdx + 1} of {STAGES.length}: <strong className="text-slate-800">{STAGES[activeIdx]?.label || 'Active Workflow'}</strong>
        </span>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex items-center justify-between min-w-[720px] gap-1">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < activeIdx;
            const isCurrent = idx === activeIdx;

            return (
              <React.Fragment key={stage.id}>
                <div
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all ${
                    isCurrent
                      ? 'bg-blue-50 border border-blue-300 text-blue-900 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50/60 text-emerald-800'
                      : 'text-slate-400'
                  }`}
                  title={stage.desc}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ${isCurrent ? 'text-blue-900' : isCompleted ? 'text-emerald-900' : 'text-slate-500'}`}>
                    {stage.label}
                  </span>
                </div>
                {idx < STAGES.length - 1 && (
                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      idx < activeIdx ? 'text-emerald-500' : 'text-slate-300'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LifecycleStepper;
