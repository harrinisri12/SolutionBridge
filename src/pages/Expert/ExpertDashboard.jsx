import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { ClipboardCheck, FileText, CheckCircle, Award } from 'lucide-react';

const ExpertDashboard = () => {
  const { applications, evaluations, challenges } = useApp();
  const navigate = useNavigate();

  // Filter proposals waiting expert evaluation
  const pendingEvaluations = applications.filter(a => a.status === "🟢 Eligible" || a.status === "Shortlisted" || a.status === "Submitted" || a.status === "Under Review" || a.status === "submitted" || a.status === "under_evaluation");
  
  // Completed evaluations by this expert
  const completedEvaluations = evaluations;

  const avgScore = completedEvaluations.length > 0 
    ? Math.round(completedEvaluations.reduce((sum, e) => sum + (e.overallScore || (e.weighted_score ? e.weighted_score * 10 : 0) || 0), 0) / completedEvaluations.length) 
    : 0;

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Expert Review Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">Review assigned startup proposals, submit weighted scorecard grades, and recommend pilots.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {[
          { label: "Assigned Proposals Awaiting Review", val: pendingEvaluations.length, icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Completed Evaluations", val: completedEvaluations.length, icon: ClipboardCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Average Graded Score Issued", val: `${avgScore}/100`, icon: Award, color: "text-blue-600", bg: "bg-blue-50" }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{card.label}</span>
                <span className="text-2xl font-black text-slate-900 mt-2 block leading-none">{card.val}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Evaluations List */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Pending Technical Evaluations</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {pendingEvaluations.map((app) => {
            const challenge = challenges.find(c => c.id === app.challengeId) || { title: "Challenge" };
            const startupName = app.startupId === "startup-1" ? "HealthTech Solutions" : 
                                app.startupId === "startup-2" ? "RuralCare Labs" : 
                                app.startupId === "startup-3" ? "MedTech Systems" : "Startup Proposer";
            return (
              <div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{challenge.title}</h4>
                  <p className="text-[10px] text-slate-405 font-semibold mt-1">
                    Proposer: {startupName} | Submitted: {app.submittedDate} | Sector: {challenge.sector}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/expert/evaluate/${app.id}`)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 font-bold text-[10px] uppercase tracking-wider text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Grade Proposal
                </button>
              </div>
            );
          })}
          {pendingEvaluations.length === 0 && (
            <div className="p-12 text-center text-slate-405 text-xs font-semibold">No assigned proposals awaiting review.</div>
          )}
        </div>
      </div>

      {/* Evaluation History Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Completed Reviews History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Startup Partner</th>
                <th className="px-6 py-4">Evaluator Comments</th>
                <th className="px-6 py-4 text-center">Score Issued</th>
                <th className="px-6 py-4 text-center">Directive</th>
                <th className="px-6 py-4 text-right">Audit Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {completedEvaluations.map((ev) => {
                const app = applications.find(a => a.id === ev.applicationId);
                const startupName = app?.startupId === "startup-1" ? "HealthTech Solutions" : "Startup Partner";
                return (
                  <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{startupName}</td>
                    <td className="px-6 py-4 max-w-sm truncate text-slate-500 font-semibold">{ev.comments}</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">{ev.overallScore} / 100</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.recommendation === 'Recommend' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {ev.recommendation === 'Recommend' ? "Recommend Pilot" : "Reject"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-405">{ev.submittedDate}</td>
                  </tr>
                );
              })}
              {completedEvaluations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-405 text-sm font-semibold">No graded history recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ExpertDashboard;
