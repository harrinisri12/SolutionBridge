import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Target,
  FileCheck2,
  Zap,
  CheckCircle2,
  Building2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';
import { StatCard } from '../../components/Common/Card';
import ChartCard from '../../components/Common/ChartCard';
import Badge from '../../components/Common/Badge';
import Button from '../../components/Common/Button';
import LifecycleStepper from '../../components/Common/LifecycleStepper';

const GovOverview = () => {
  const { challenges, applications, pilots, procurementRecords, recentActivities } = useApp();
  const navigate = useNavigate();

  // Statistic calculation or fallback to exact prompt values:
  // 12 Active Challenges, 86 Applications, 7 Pilots in Progress, 14 Completed Pilots, 5 Solutions Procured
  const activeChallengesCount = 12;
  const applicationsCount = 86;
  const pilotsInProgressCount = 7;
  const completedPilotsCount = 14;
  const solutionsProcuredCount = 5;

  // Chart 1: Challenge / Application Activity Chart
  const activityChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Applications Received',
        data: [12, 18, 24, 38, 52, 64, 76, 86],
        backgroundColor: '#2563eb',
        borderColor: '#1d4ed8',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Challenges Published',
        data: [2, 3, 5, 7, 9, 10, 11, 12],
        backgroundColor: '#0f2942',
        borderColor: '#0a1b2d',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  // Chart 2: Pilot Progress by Category
  const pilotProgressChartData = {
    labels: ['Water & Sanitation', 'Healthcare', 'Transport & ITS', 'Agriculture IoT', 'Waste Recovery', 'Clean Energy'],
    datasets: [
      {
        label: 'Completed Pilots',
        data: [4, 3, 3, 2, 1, 1],
        backgroundColor: '#059669',
        borderRadius: 4
      },
      {
        label: 'Ongoing / Validation Pilots',
        data: [2, 2, 1, 1, 1, 0],
        backgroundColor: '#2563eb',
        borderRadius: 4
      }
    ]
  };

  // Chart 3: Procurement Outcome Chart
  const procurementChartData = {
    labels: ['Scaled Across State', 'Procured (DPO Executed)', 'Procurement in Progress', 'Under Committee Review'],
    datasets: [
      {
        data: [5, 4, 3, 2],
        backgroundColor: ['#059669', '#2563eb', '#d97706', '#64748b'],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Department Title */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Government Officer Command Overview</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Innovation Procurement Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time progress across challenges, startup applications, pilot deployments, and scale-up procurement.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/gov/applications')}
          >
            Review Applications
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/gov/challenges')}
          >
            Create Challenge
          </Button>
        </div>
      </div>

      {/* Lifecycle Stepper */}
      <LifecycleStepper activeStage={0} />

      {/* Exactly 5 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Active Challenges"
          value={activeChallengesCount}
          subtitle="Across 6 Departments"
          icon={Target}
          trend="+3"
          trendLabel="this quarter"
          color="blue"
          onClick={() => navigate('/gov/challenges')}
        />
        <StatCard
          title="Applications Received"
          value={applicationsCount}
          subtitle="From DPIIT Startups"
          icon={FileCheck2}
          trend="+14"
          trendLabel="this month"
          color="purple"
          onClick={() => navigate('/gov/applications')}
        />
        <StatCard
          title="Pilots in Progress"
          value={pilotsInProgressCount}
          subtitle="Field testing & KPIs"
          icon={Zap}
          trend="7 Active"
          trendLabel="milestones underway"
          color="amber"
          onClick={() => navigate('/gov/pilots')}
        />
        <StatCard
          title="Completed Pilots"
          value={completedPilotsCount}
          subtitle="100% KPI Validated"
          icon={ShieldCheck}
          trend="92.8%"
          trendLabel="validation rate"
          color="emerald"
          onClick={() => navigate('/gov/pilots')}
        />
        <StatCard
          title="Procurement Status"
          value={`${solutionsProcuredCount} Procured`}
          subtitle="₹ 24.5 Cr deployed"
          icon={CheckCircle2}
          trend="+2"
          trendLabel="scaled statewide"
          color="slate"
          onClick={() => navigate('/gov/procurement')}
        />
      </div>

      {/* Charts Section: 3 Chart.js Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard
          title="Challenge & Application Activity"
          subtitle="Cumulative submissions across 2026"
          type="bar"
          data={activityChartData}
          height={260}
          action={
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              YTD 2026
            </span>
          }
        />
        <ChartCard
          title="Pilot Progress by Sector"
          subtitle="Completed vs Active field validations"
          type="bar"
          data={pilotProgressChartData}
          options={{
            scales: {
              x: { stacked: true },
              y: { stacked: true }
            }
          }}
          height={260}
          action={
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              21 Pilots
            </span>
          }
        />
        <ChartCard
          title="Procurement Outcomes"
          subtitle="Stage distribution for validated tech"
          type="doughnut"
          data={procurementChartData}
          height={260}
          action={
            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              14 Validated
            </span>
          }
        />
      </div>

      {/* Bottom Grid: Recent Activity Feed & Active Pilot Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 gov-card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Recent Procurement & Audit Activity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time chronological events across departments and expert evaluators
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600">
              Live Feed
            </span>
          </div>
          <div className="p-4 divide-y divide-slate-100">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    {act.type.includes('Procurement') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {act.type.includes('Evidence') && <Zap className="w-4 h-4 text-blue-600" />}
                    {act.type.includes('Milestone') && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    {act.type.includes('Evaluation') && <Award className="w-4 h-4 text-purple-600" />}
                    {act.type.includes('Application') && <FileCheck2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">
                      {act.title}
                    </div>
                    <div className="text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{act.department}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {act.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge status={act.badge} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Card */}
        <div className="gov-card p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
              <Zap className="w-3 h-3 text-blue-400" />
              <span>Active Pilot Highlight</span>
            </div>
            <h4 className="text-base font-bold text-white">
              AquaTech Solutions • Varanasi Water Works
            </h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              25 spectrophotometric nodes deployed across 5 reservoirs. Milestone 4 alert latency verified at <strong>8.5 minutes</strong> (Target: &lt;15 min).
            </p>

            <div className="mt-4 p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Overall Progress</span>
                <span className="font-bold text-emerald-400">88% (Validation)</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Independent Audit Signed</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/gov/pilots')}
            >
              Open Pilot Console
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovOverview;
