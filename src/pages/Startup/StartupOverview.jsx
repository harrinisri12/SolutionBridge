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

const StartupOverview = () => {
  const { applications, pilots, notifications, currentUser } = useApp();
  const navigate = useNavigate();

  // Startup Metrics from live backend data
  const myApplications = applications;
  const submittedCount = myApplications.length;
  const underEvaluationCount = myApplications.filter(
    (a) => a.status === 'Under Evaluation' || a.status === 'Submitted' || a.status === 'submitted' || a.status === 'under_evaluation'
  ).length;
  const selectedCount = myApplications.filter(
    (a) => a.status === 'Selected' || a.status === 'Shortlisted' || a.status === 'selected' || a.status === 'shortlisted'
  ).length;
  const activePilot = pilots.find((p) => p.status === 'in_progress' || p.status === 'active' || p.status === 'validation') || pilots[0];
  const pilotProgress = activePilot ? (activePilot.overallProgress || activePilot.progress || 0) : 0;
  const pendingMilestonesCount = activePilot?.milestones 
    ? activePilot.milestones.filter((m) => m.status !== 'completed' && m.status !== 'verified').length 
    : 0;

  // Small Activity Chart
  const startupActivityData = {
    labels: ['Total Applied', 'Under Review', 'Selected', 'Active Pilots', 'Procured'],
    datasets: [
      {
        label: 'Engagement Count',
        data: [
          submittedCount,
          underEvaluationCount,
          selectedCount,
          pilots.length,
          pilots.filter(p => p.status === 'completed' || p.status === 'scaled').length
        ],
        backgroundColor: '#2563eb',
        borderRadius: 4
      }
    ]
  };

  const startupName = currentUser?.organization || currentUser?.user?.organization || currentUser?.user?.full_name || 'Startup Proposer';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Rocket className="w-4 h-4 text-emerald-600" />
            <span>Startup Founder Console • {startupName}</span>
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

      {/* 6 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Applications Submitted"
          value={submittedCount}
          subtitle="DPIIT Verified"
          icon={FileCheck2}
          color="blue"
          onClick={() => navigate('/startup/applications')}
        />
        <StatCard
          title="Under Evaluation"
          value={underEvaluationCount}
          subtitle="Expert Panel Review"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/startup/applications')}
        />
        <StatCard
          title="Selected Proposals"
          value={selectedCount}
          subtitle="Cleared for Pilot"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/startup/applications')}
        />
        <StatCard
          title="Active Pilots"
          value={pilots.length}
          subtitle={activePilot?.location || 'Field Deployments'}
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
          subtitle="Milestone Deliverables"
          icon={ShieldCheck}
          color="slate"
          onClick={() => navigate('/startup/pilot')}
        />
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
          {myApplications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              You have not submitted any applications yet. Browse challenges above to apply.
            </div>
          ) : (
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
                {myApplications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="font-bold text-slate-900 text-sm">
                        {app.challengeTitle || 'Technical Proposal'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Application ID: {app.id}
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-800 font-medium">
                        {app.department || 'Government Department'}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600">
                        {app.submittedDate || 'Recent'}
                      </span>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                        {app.status === 'selected' || app.status === 'Selected' ? 'Field Pilot (Stage 5)' : 'Evaluation (Stage 4)'}
                      </span>
                    </td>
                    <td>
                      <Badge status={app.status} size="sm" />
                    </td>
                    <td className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/startup/applications/${app.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupOverview;
