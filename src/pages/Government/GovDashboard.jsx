import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Target, FileText, Zap, Award, CreditCard, ArrowUpRight, Plus } from 'lucide-react';

const GovDashboard = () => {
  const { challenges, applications, pilots, payments } = useApp();
  const navigate = useNavigate();

  // 1. Calculate stats
  const activeChallengesCount = challenges.filter(c => c.status === "Open" || c.status === "Pilot Selected").length;
  const applicationCount = applications.length;
  const activePilotsCount = pilots.filter(p => p.status === "Active").length;
  const completedPilotsCount = pilots.filter(p => p.status === "Completed" || p.status === "Validated" || p.status === "Scaled").length;
  const pendingEvalsCount = applications.filter(a => a.status === "Submitted" || a.status === "Under Review").length;
  const pendingPaymentsCount = payments.filter(p => p.status === "Pending Approval").length;

  // 2. Prepare charts data
  // Sector distribution of challenges
  const sectorCounts = challenges.reduce((acc, c) => {
    acc[c.sector] = (acc[c.sector] || 0) + 1;
    return acc;
  }, {});
  
  const sectorData = Object.keys(sectorCounts).map(name => ({
    name,
    value: sectorCounts[name]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Budgets per Pilot Chart
  const pilotBudgetData = pilots.map(p => ({
    name: (p.startupName || 'Startup').split(' ')[0],
    budget: p.budget || 0,
    milestonePaid: p.milestones ? p.milestones.reduce((sum, m) => m.status === 'Paid' || m.status === 'completed' ? sum + (m.budgetShare || 0) : sum, 0) : 0
  }));



  return (
    <div className="p-6 space-y-6">
      
      {/* Welcome banner & CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Government Officer Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">Manage innovation procurement lifecycles, eligibility verification, and pilot tracking.</p>
        </div>
        <button
          onClick={() => navigate('/gov/challenges', { state: { openCreateModal: true } })}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold text-xs uppercase tracking-wider text-white rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Challenge
        </button>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: "Active Challenges", val: activeChallengesCount, color: "text-blue-600", bg: "bg-blue-50", icon: Target },
          { label: "Startup Applications", val: applicationCount, color: "text-amber-600", bg: "bg-amber-50", icon: FileText },
          { label: "Active Pilots", val: activePilotsCount, color: "text-indigo-600", bg: "bg-indigo-50", icon: Zap },
          { label: "Completed Pilots", val: completedPilotsCount, color: "text-emerald-600", bg: "bg-emerald-50", icon: Zap },
          { label: "Pending Evaluations", val: pendingEvalsCount, color: "text-purple-600", bg: "bg-purple-50", icon: Award },
          { label: "Pending Payments", val: pendingPaymentsCount, color: "text-rose-600", bg: "bg-rose-50", icon: CreditCard }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-normal">{card.label}</span>
                <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-black text-slate-900 leading-none">{card.val}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pilot Budgets comparison */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Pilot Budgets & Released Milestone Funds ($)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pilotBudgetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="budget" name="Total Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="milestonePaid" name="Funds Disbursed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Distribution */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Challenges by Sector</h3>
          <div className="h-48 relative flex items-center justify-center">
            {sectorData.length === 0 ? (
              <span className="text-slate-400 text-xs">No challenge data</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2">
            {sectorData.map((d, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Triage / Listings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Applications Awaiting Screening */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Applications Awaiting Eligibility Screening</h3>
            <button onClick={() => navigate('/gov/screening')} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
              View all screening <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {applications.slice(0, 4).map((app, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{app.solutionDescription ? app.solutionDescription.slice(0, 50) + "..." : "Proposal"}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Submitted on: {app.submittedDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                  <button
                    onClick={() => navigate('/gov/screening')}
                    className="px-2.5 py-1 border border-slate-200 text-[10px] font-bold text-slate-700 rounded-md hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Screen
                  </button>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400">No applications found.</div>
            )}
          </div>
        </div>

        {/* Active Pilots Monitoring */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Active Pilots Tracker</h3>
            <button onClick={() => navigate('/gov/pilots')} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
              View all pilots <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {pilots.slice(0, 4).map((pilot, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{pilot.challengeTitle}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Partner: {pilot.startupName} | Budget: ${pilot.budget}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={pilot.status} />
                  <button
                    onClick={() => navigate('/gov/kpis')}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Track KPIs
                  </button>
                </div>
              </div>
            ))}
            {pilots.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400">No pilots initiated.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default GovDashboard;
