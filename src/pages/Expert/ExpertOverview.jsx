import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Award,
  ClipboardList,
  ShieldCheck,
  Clock,
  Zap,
  CheckCircle2,
  FileCheck2,
  Building2,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { StatCard } from '../../components/Common/Card';
import ChartCard from '../../components/Common/ChartCard';
import Badge from '../../components/Common/Badge';
import Button from '../../components/Common/Button';
import LifecycleStepper from '../../components/Common/LifecycleStepper';

const ExpertOverview = () => {
  const { applications, pilots, recentActivities, currentUser } = useApp();
  const navigate = useNavigate();

  const assignedEvaluations = applications.length;
  const pendingEvaluations = applications.filter((a) => !a.scores?.overallScore || a.status === 'Submitted' || a.status === 'Under Evaluation' || a.status === 'submitted' || a.status === 'under_evaluation').length;
  const activePilots = pilots.length;
  const pendingValidationRequests = pilots.filter((p) => p.status === 'Validation' || p.status === 'Ongoing' || p.status === 'in_progress' || p.status === 'active').length;

  const expertQueue = applications.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Technical Screening & Evaluation Panel</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Expert Evaluator Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate incoming startup proposals on technical feasibility and validate pilot field KPIs for government procurement.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/expert/validation')}
          >
            Review Pilot Validations
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/expert/evaluation')}
          >
            Start Proposal Evaluation
          </Button>
        </div>
      </div>

      {/* Lifecycle Stepper */}
      <LifecycleStepper activeStage={3} />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Evaluations"
          value={assignedEvaluations}
          subtitle="Proposals across 4 Sectors"
          icon={ClipboardList}
          color="blue"
          onClick={() => navigate('/expert/evaluation')}
        />
        <StatCard
          title="Pending Evaluations"
          value={pendingEvaluations}
          subtitle="Action Required"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/expert/evaluation')}
        />
        <StatCard
          title="Active Field Pilots"
          value={activePilots}
          subtitle="Under Scientific Monitoring"
          icon={Zap}
          color="purple"
          onClick={() => navigate('/expert/validation')}
        />
        <StatCard
          title="Pending Validation Requests"
          value={pendingValidationRequests}
          subtitle="Milestone Audits"
          icon={ShieldCheck}
          color="emerald"
          onClick={() => navigate('/expert/validation')}
        />
      </div>

      {/* Main Grid: Priority Evaluation Queue & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Priority Evaluation Queue */}
        <div className="lg:col-span-2 gov-card p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Priority Technical Evaluation Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Proposals pending 1–10 multi-criteria evaluation scorecards.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/expert/evaluation')}
            >
              View All ({applications.length})
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {expertQueue.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No assigned applications pending evaluation.
              </div>
            ) : (
              expertQueue.map((app) => (
              <div
                key={app.id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {app.startupName}
                    </span>
                    <Badge status={app.status} size="sm" />
                  </div>
                  <div className="text-slate-600 mt-1 font-medium line-clamp-1">
                    {app.challengeTitle}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Submitted on {app.submittedDate} • Dept: {app.department}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {app.scores?.overallScore > 0 ? (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Score</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {app.scores.overallScore} / 10
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Scoring Pending
                    </span>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/expert/evaluation')}
                  >
                    Evaluate
                  </Button>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Recent Evaluator Activity */}
        <div className="gov-card p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Evaluator Activity Log
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Audit
            </span>
          </div>

          <div className="space-y-3">
            {recentActivities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
              >
                <div className="font-bold text-slate-800 text-xs">
                  {act.title}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{act.department}</span>
                  <span>{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertOverview;
