import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Modal from '../../components/Common/Modal';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

const ScaleDecision = () => {
  const { pilots, submitScaleUpDecision, addToast } = useApp();

  const [selectedPilotId, setSelectedPilotId] = useState(pilots[0]?.id || "");
  const [decisionType, setDecisionType] = useState(""); // Scale Up, Retest, Reject
  const [comments, setComments] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const activePilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  // Calculations for overall scorecard
  const getReadinessScore = (pilot) => {
    if (!pilot) return 0;
    
    // 1. KPI Achievement average
    let kpiRatesSum = 0;
    let loggedKpis = 0;
    (pilot.kpis || []).forEach(k => {
      const baseline = parseFloat(k.baseline) || 0;
      const target = parseFloat(k.target) || 0;
      const actual = parseFloat(k.actual);
      
      if (!isNaN(actual)) {
        loggedKpis++;
        const targetDelta = Math.abs(target - baseline);
        const actualDelta = target > baseline ? (actual - baseline) : (baseline - actual);
        if (targetDelta > 0) {
          const rate = (actualDelta / targetDelta) * 100;
          kpiRatesSum += Math.min(rate, 120); // Cap individual KPI weight at 120%
        } else {
          kpiRatesSum += 100;
        }
      }
    });

    const kpiRateAvg = loggedKpis > 0 ? (kpiRatesSum / loggedKpis) : 80;

    // 2. Validation Multiplier
    const valStatus = pilot.validationDetails?.status;
    const validationScore = valStatus === "Verified" || valStatus === "Validated" ? 100 : 
                            valStatus === "Not Verified" || valStatus === "Rejected" ? 40 : 70;

    // 3. Other sub-scores (Static mock metrics for realism)
    const securityScore = 95;
    const userSatisfaction = 88;
    const costEffectiveness = 84;

    // Weighted average
    const finalScore = Math.round(
      (kpiRateAvg * 0.4) +
      (validationScore * 0.3) +
      (securityScore * 0.1) +
      (userSatisfaction * 0.1) +
      (costEffectiveness * 0.1)
    );

    return Math.min(finalScore, 100);
  };

  const handleDecisionClick = (type) => {
    setDecisionType(type);
    setComments("");
    setIsConfirmOpen(true);
  };

  const handleConfirmDecision = () => {
    if (!comments.trim()) {
      addToast("Please provide decision reasoning notes.", "warning");
      return;
    }
    submitScaleUpDecision(activePilot.id, decisionType, comments);
    addToast(`Scale-up decision '${decisionType}' submitted successfully.`, "success");
    setIsConfirmOpen(false);
  };

  const score = activePilot ? getReadinessScore(activePilot) : 0;

  return (
    <div className="p-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col text-left">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">Procurement Scaling Decision</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Review final pilot performance logs, independent audit reports, security parameters, and issue scaling authorization.</p>
      </div>

      {pilots.length === 0 ? (
        <div className="bg-white border border-slate-100 p-8 rounded-2xl text-center text-slate-400 text-sm text-left">
          No pilots available for scaling decisions. Initialize a pilot sandbox first.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
          
          {/* Pilots Sidebar Selector */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sandbox Trials</h3>
            <div className="space-y-1.5">
              {pilots.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPilotId(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-50/50 ${
                    selectedPilotId === p.id 
                      ? "border-blue-600 bg-blue-50/20" 
                      : "border-slate-200"
                  }`}
                >
                  <span className="font-bold text-xs text-slate-800 block truncate">{p.challengeTitle}</span>
                  <span className="text-[10px] text-slate-400 font-semibold truncate block mt-0.5">{p.startupName}</span>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-bold">Scaling status:</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      p.scaleUpStatus === 'Scale Up' 
                        ? "bg-emerald-100 text-emerald-800" 
                        : p.scaleUpStatus === 'Under Review' 
                          ? "bg-slate-100 text-slate-700" 
                          : "bg-amber-100 text-amber-800"
                    }`}>
                      {p.scaleUpStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Decision Form Panel */}
          {activePilot && (
            <div className="lg:col-span-3 space-y-6">
              
              {/* Scorecard Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Readiness Score */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs md:col-span-1 flex flex-col justify-between items-center text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Calculated Readiness Score</span>
                  <div className="relative w-28 h-28 flex items-center justify-center border-4 border-blue-500/20 rounded-full my-3">
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin duration-3000"></div>
                    <span className="text-3xl font-black text-white">{score}%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold leading-normal">Required Threshold: 85% for direct scaling</span>
                </div>

                {/* Performance Matrices */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs md:col-span-2 space-y-4">
                  <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100 pb-1.5">Readiness Matrix Breakdown</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[10px] block uppercase">Technical Performance</span>
                      <div className="flex items-center justify-between">
                        <span>92 / 100</span>
                        <span className="text-emerald-500 font-bold">Excellent</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[10px] block uppercase">KPI Achievement Rate</span>
                      <div className="flex items-center justify-between">
                        <span>95% Average</span>
                        <span className="text-emerald-500 font-bold">Passed</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[10px] block uppercase">Cost Effectiveness</span>
                      <div className="flex items-center justify-between">
                        <span>84 / 100</span>
                        <span className="text-blue-500 font-bold">Optimal</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[10px] block uppercase">Validation Audit Status</span>
                      <div className="flex items-center justify-between">
                        <span>{activePilot.validationDetails.status}</span>
                        <span className={`font-bold ${
                          activePilot.validationDetails.status === 'Verified' ? "text-emerald-500" : "text-amber-500"
                        }`}>
                          {activePilot.validationDetails.status === 'Verified' ? "Audited" : "Pending Audit"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[10px] block uppercase">Cybersecurity Compliance</span>
                      <div className="flex items-center justify-between">
                        <span>Passed Audit</span>
                        <span className="text-emerald-500 font-bold">ISO Certified</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[10px] block uppercase">User / Client Satisfaction</span>
                      <div className="flex items-center justify-between">
                        <span>88 / 100</span>
                        <span className="text-blue-500 font-bold">High</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Buttons Panel */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Procurement Action Directives</h3>
                
                {activePilot.scaleUpStatus === "Under Review" ? (
                  <div className="flex flex-wrap gap-4">
                    
                    {/* Scale Up directive */}
                    <button
                      onClick={() => handleDecisionClick("Scale Up")}
                      className="flex-1 flex flex-col items-center gap-2 p-4 border border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/50 rounded-2xl cursor-pointer text-center transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xs text-emerald-900 uppercase tracking-wide">Scale Up Deployment</span>
                      <span className="text-[10px] text-slate-400 font-medium leading-normal">Incorporate into national supply networks & unlock scale budgets.</span>
                    </button>

                    {/* Retest directive */}
                    <button
                      onClick={() => handleDecisionClick("Improve & Retest")}
                      className="flex-1 flex flex-col items-center gap-2 p-4 border border-amber-200 bg-amber-50/20 hover:bg-amber-50/50 rounded-2xl cursor-pointer text-center transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xs text-amber-900 uppercase tracking-wide">Improve & Retest</span>
                      <span className="text-[10px] text-slate-400 font-medium leading-normal">Requires code adjustments or localized pilot extension.</span>
                    </button>

                    {/* Reject directive */}
                    <button
                      onClick={() => handleDecisionClick("Reject")}
                      className="flex-1 flex flex-col items-center gap-2 p-4 border border-rose-200 bg-rose-50/20 hover:bg-rose-50/50 rounded-2xl cursor-pointer text-center transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xs text-rose-900 uppercase tracking-wide">Reject Proposal</span>
                      <span className="text-[10px] text-slate-400 font-medium leading-normal">Pilot did not meet criteria, archive solution repository.</span>
                    </button>

                  </div>
                ) : (
                  <div className="p-5 border border-slate-150 bg-slate-50 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800">Final Procurement Verdict Issued:</span>
                      <StatusBadge status={activePilot.scaleUpStatus} />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Reasoning Notes: "{activePilot.scaleUpComments || "No notes provided."}"
                    </p>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        title={`Confirm Procurement Decision: ${decisionType}`}
        onClose={() => setIsConfirmOpen(false)}
        confirmText="Execute Decision"
        onConfirm={handleConfirmDecision}
        confirmColor={decisionType === 'Scale Up' ? 'emerald' : decisionType === 'Reject' ? 'rose' : 'amber'}
      >
        <div className="space-y-4 text-left">
          <div className="flex gap-3 bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-800 font-semibold">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p>
              Warning: Submitting this final procurement verdict will log a secure auditor transaction and lock subsequent sandbox parameters.
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Provide Decision Justification Notes *</label>
            <textarea
              required
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide a detailed summary of why this decision was made, including target KPI review notes."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ScaleDecision;
