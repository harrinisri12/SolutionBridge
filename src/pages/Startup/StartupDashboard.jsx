import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Target, FileText, Zap, CreditCard, ChevronRight, DollarSign, Plus } from 'lucide-react';

const StartupDashboard = () => {
  const { challenges, applications, pilots, payments, requestMilestonePayment, addToast } = useApp();
  const navigate = useNavigate();

  const myStartupId = "startup-1"; // Fictional logged-in startup

  // 1. Calculate stats
  const availableChallenges = challenges.filter(c => c.status === "Open").length;
  const myApplications = applications.filter(a => a.startupId === myStartupId);
  const myApplicationsCount = myApplications.length;
  const shortlistedCount = myApplications.filter(a => a.status === "Shortlisted" || a.status === "🟢 Eligible").length;
  
  const myPilots = pilots.filter(p => p.startupId === myStartupId);
  const activePilotsCount = myPilots.filter(p => p.status === "Active").length;
  const completedPilotsCount = myPilots.filter(p => p.status === "Completed" || p.status === "Validated" || p.scaleUpStatus === "Scale Up").length;
  
  const totalReceivedFunds = payments
    .filter(pay => pay.startupName === "HealthTech Solutions" && pay.status === "Paid")
    .reduce((sum, pay) => sum + pay.amount, 0);

  const handleInvoiceMilestone = (pilotId, milestoneId, milestoneTitle) => {
    requestMilestonePayment(pilotId, milestoneId);
    addToast(`Invoice requested for milestone: ${milestoneTitle}`, "success");
  };

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Startup Workspace</h2>
          <p className="text-xs text-slate-400 mt-1">Review active procurement opportunities, submit solutions, invoice sandbox milestones, and track approvals.</p>
        </div>
        <button
          onClick={() => navigate('/startup/challenges')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Target className="w-4 h-4" />
          Browse Challenges
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: "Available Challenges", val: availableChallenges, icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Applications Submitted", val: myApplicationsCount, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Shortlisted Candidates", val: shortlistedCount, icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Active Sandboxes", val: activePilotsCount, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Completed Pilots", val: completedPilotsCount, icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Payments Cleared", val: `$${totalReceivedFunds.toLocaleString()}`, icon: CreditCard, color: "text-teal-600", bg: "bg-teal-50" }
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
                <span className="text-lg font-black text-slate-900 leading-none">{card.val}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Submitted Applications List */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">My Submitted Proposals</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Triage pipeline</span>
          </div>
          <div className="divide-y divide-slate-50">
            {myApplications.map((app, idx) => {
              const challenge = challenges.find(c => c.id === app.challengeId) || { title: "Challenge" };
              return (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{challenge.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Submitted: {app.submittedDate} | ID: {app.id.toUpperCase()}</p>
                    {app.screeningComment && (
                      <p className="text-[10px] text-rose-500 font-semibold italic mt-1">Feedback: "{app.screeningComment}"</p>
                    )}
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              );
            })}
            {myApplications.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold">No applications submitted yet. Browse active challenges.</div>
            )}
          </div>
        </div>

        {/* Milestone Payout Invoicing Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Active Sandbox Milestones & Invoicing</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Submit milestone claims</span>
          </div>
          <div className="p-4 space-y-4">
            {myPilots.map((p) => (
              <div key={p.id} className="space-y-3">
                <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-850 block">{p.challengeTitle}</span>
                    <span className="text-[9px] text-slate-400 font-semibold mt-0.5 block">Budget: ${p.budget.toLocaleString()} | Status: {p.status}</span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="space-y-2">
                  {p.milestones.map((m, idx) => {
                    // Check payment status from payment records
                    const payRecord = payments.find(pay => pay.pilotId === p.id && pay.milestoneId === m.id);
                    const isPaid = payRecord?.status === "Paid";
                    const isPending = payRecord?.status === "Pending Approval";
                    const isDraft = payRecord?.status === "Draft" || !payRecord;

                    return (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                        <div>
                          <span className="font-semibold text-slate-700 block">{m.title}</span>
                          <span className="text-[9px] text-slate-400">Share: ${m.budgetShare.toLocaleString()} ({m.weight}%)</span>
                        </div>
                        <div>
                          {isPaid ? (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">Paid</span>
                          ) : isPending ? (
                            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">Invoiced</span>
                          ) : (
                            <button
                              onClick={() => handleInvoiceMilestone(p.id, m.id, m.title)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 font-bold text-[9px] uppercase tracking-wider text-white rounded-md transition-colors cursor-pointer"
                            >
                              Submit Invoice
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {myPilots.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold">No active pilot sandboxes. Awaiting project selection.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

// Simple Award fallback icon
const Award = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a3 3 0 10-3 3h3zm0 0h4a2 2 0 11-2 2v-2z" />
  </svg>
);

export default StartupDashboard;
