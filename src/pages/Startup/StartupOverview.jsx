import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Rocket,
  Target,
  FileCheck2,
  Zap,
  CreditCard,
  Bell,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { StatCard } from '../../components/Common/Card';
import ChartCard from '../../components/Common/ChartCard';
import Badge from '../../components/Common/Badge';
import Button from '../../components/Common/Button';
import LifecycleStepper from '../../components/Common/LifecycleStepper';

const StartupOverview = () => {
  const { applications, pilots, notifications, currentUser } = useApp();
  const navigate = useNavigate();

  // Startup Metrics
  const myApplications = applications.filter(
    (a) => a.startupName === 'AquaTech Solutions' || a.startupId === 'startup-1'
  );
  const submittedCount = myApplications.length || 3;
  const underEvaluationCount = myApplications.filter((a) => a.status === 'Under Evaluation' || a.status === 'Submitted').length || 1;
  const selectedCount = myApplications.filter((a) => a.status === 'Selected' || a.status === 'Shortlisted').length || 2;
  const activePilot = pilots[0]; // AquaTech Solutions pilot
  const pilotProgress = activePilot?.overallProgress || 88;
  const pendingMilestonesCount = activePilot?.milestones.filter((m) => m.progress < 100).length || 2;

  // Small Activity Chart
  const startupActivityData = {
    labels: ['May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Telemetry Readings (10k)',
        data: [18, 45, 88, 120],
        backgroundColor: '#2563eb',
        borderRadius: 4
      },
      {
        label: 'Milestone Progress (%)',
        data: [20, 45, 70, 88],
        backgroundColor: '#059669',
        borderRadius: 4
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Rocket className="w-4 h-4 text-emerald-600" />
            <span>Startup Founder Console • {currentUser.startupName || 'AquaTech Solutions'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Startup Innovation Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your challenge applications, active pilot deployment telemetry, milestone verifications, and treasury payments.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/startup/pilot')}
          >
            Go to My Pilot
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/startup/challenges')}
          >
            Browse New Challenges
          </Button>
        </div>
      </div>

      {/* Lifecycle Stepper */}
      <LifecycleStepper activeStage={4} />

      {/* 6 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Applications Submitted"
          value={submittedCount}
          subtitle="DPIIT Verified"
          icon={FileCheck2}
          color="blue"
          onClick={() => navigate('/startup/challenges')}
        />
        <StatCard
          title="Under Evaluation"
          value={underEvaluationCount}
          subtitle="Expert Panel Review"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/startup/payments')}
        />
        <StatCard
          title="Selected Proposals"
          value={selectedCount}
          subtitle="Cleared for Pilot"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/startup/payments')}
        />
        <StatCard
          title="Active Pilots"
          value="1 Active"
          subtitle="Varanasi Water Works"
          icon={Zap}
          color="purple"
          onClick={() => navigate('/startup/pilot')}
        />
        <StatCard
          title="Pilot Progress"
          value={`${pilotProgress}%`}
          subtitle="Validation Phase"
          icon={TrendingUp}
          color="emerald"
          onClick={() => navigate('/startup/pilot')}
        />
        <StatCard
          title="Pending Milestones"
          value={`${pendingMilestonesCount} Left`}
          subtitle="Final Audit Underway"
          icon={ShieldCheck}
          color="slate"
          onClick={() => navigate('/startup/pilot')}
        />
      </div>

      {/* Middle Grid: Mini Activity Chart & Active Pilot Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard
            title="Monthly Telemetry Volume & Milestone Velocity"
            subtitle="Sensor telemetry submissions vs milestone completion progress"
            type="bar"
            data={startupActivityData}
            height={260}
            action={
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                88% Complete
              </span>
            }
          />
        </div>

        {/* Recent Notifications */}
        <div className="gov-card p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Notifications & Alerts
            </h3>
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Recent
            </span>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 4).map((notif) => (
              <div
                key={notif.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{notif.title}</span>
                  <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Application & Pilot Status Pipeline */}
      <div className="gov-card p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Active Innovation Engagements & Status Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current state of your applications and pilot awards across government departments.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Challenge / Project</th>
                <th>Government Department</th>
                <th>Submission Date</th>
                <th>Stage</th>
                <th>Current Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="font-bold text-slate-900 text-sm">
                    Real-time Potable Water Quality Monitoring in Municipal Reservoirs
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    CH-2026-001 • Pilot ID: PILOT-2026-001
                  </div>
                </td>
                <td>
                  <span className="text-xs text-slate-800 font-medium">
                    Water Resources Department
                  </span>
                </td>
                <td>
                  <span className="text-xs text-slate-600">2026-07-20</span>
                </td>
                <td>
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                    Field Pilot (Stage 5)
                  </span>
                </td>
                <td>
                  <Badge status="Validation" size="sm" />
                </td>
                <td className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/startup/pilot')}
                  >
                    Open Pilot
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="font-bold text-slate-900 text-sm">
                    Autonomous High-Throughput Optical Municipal Dry Waste Segregation
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    CH-2026-004 • Proposal ID: APP-2026-006
                  </div>
                </td>
                <td>
                  <span className="text-xs text-slate-800 font-medium">
                    Municipal Administration & Urban Development
                  </span>
                </td>
                <td>
                  <span className="text-xs text-slate-600">2026-08-10</span>
                </td>
                <td>
                  <span className="px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-800 font-semibold border border-purple-200">
                    Evaluation (Stage 4)
                  </span>
                </td>
                <td>
                  <Badge status="Shortlisted" size="sm" />
                </td>
                <td className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/startup/payments')}
                  >
                    View Status
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StartupOverview;
