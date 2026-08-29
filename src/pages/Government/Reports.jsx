import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Award, Users, CheckCircle } from 'lucide-react';

const Reports = () => {
  const { challenges, applications, pilots, payments } = useApp();

  // Calculations
  const totalChallenges = challenges.length;
  const totalStartups = 7; // Mock startups length
  const totalApplications = applications.length;
  const selectionRate = totalApplications > 0 ? Math.round((pilots.length / totalApplications) * 100) : 0;
  
  const activePilots = pilots.filter(p => p.status === 'Active').length;
  const successfulPilots = pilots.filter(p => p.scaleUpStatus === 'Scale Up').length;
  const failedPilots = pilots.filter(p => p.scaleUpStatus === 'Reject').length;
  
  const totalPilotSpending = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const avgEvaluationScore = 84; // Mock avg evaluation
  const avgPilotDuration = "5.2 Months";
  const scaleUpRate = pilots.length > 0 ? Math.round((successfulPilots / pilots.length) * 100) : 0;

  // Chart data 1: Spending over time
  const spendingOverTime = [
    { month: 'Sep 26', Spending: 24000 },
    { month: 'Oct 26', Spending: 24000 },
    { month: 'Nov 26', Spending: 48000 },
    { month: 'Dec 26', Spending: 48000 },
    { month: 'Jan 27', Spending: 84000 }
  ];

  // Chart data 2: Selection ratios
  const selectionData = [
    { name: 'Health Department', Applications: 3, Pilots: 1 },
    { name: 'Rural Development', Applications: 1, Pilots: 0 },
    { name: 'Municipal Admin', Applications: 2, Pilots: 0 },
    { name: 'Agriculture Dept', Applications: 1, Pilots: 0 }
  ];

  return (
    <div className="p-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col text-left">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">Procurement Analytics & Reports</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Compile national innovation pipeline records, selection indexes, sandboxed spends, and scale-up indicators.</p>
      </div>

      {/* KPI Card Grids */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        
        {[
          { label: "Total Challenges", val: totalChallenges, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Startups", val: totalStartups, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Proposals Selection Rate", val: `${selectionRate}%`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Sandbox Payouts", val: `$${totalPilotSpending.toLocaleString()}`, icon: DollarSign, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Successful Scale-ups", val: successfulPilots, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Failed Pilots", val: failedPilots, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Average Expert Grade", val: `${avgEvaluationScore}/100`, icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Procurement Scaling Rate", val: `${scaleUpRate}%`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{card.label}</span>
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

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        
        {/* Payouts Trend */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Cumulative Pilot Sandbox Funds Disbursed ($)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="Spending" stroke="#0d9488" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selection Rate per Department */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Proposals Submitted vs Selected Pilots</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pilots" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

// Simple visual fallback for XCircle if import is tricky
const XCircle = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Reports;
