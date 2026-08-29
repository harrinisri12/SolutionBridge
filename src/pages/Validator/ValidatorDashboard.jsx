import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { ClipboardCheck, FileText, CheckCircle, XCircle, AlertTriangle, Upload } from 'lucide-react';

const ValidatorDashboard = () => {
  const { pilots, submitValidation, addToast } = useApp();

  const [selectedPilotId, setSelectedPilotId] = useState(pilots[0]?.id || "");
  const [comments, setComments] = useState("");
  const [auditedResult, setAuditedResult] = useState("");
  const [claimText, setClaimText] = useState("");

  const activePilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  const handleVerify = (status) => {
    if (!activePilot) return;
    if (!comments.trim()) {
      addToast("Please provide validation auditor notes.", "warning");
      return;
    }
    
    // Default claim text if blank
    const claim = claimText.trim() || `Startup claimed: 40% improvement. Audited actual: ${auditedResult || "37%"} improvement.`;
    const result = auditedResult.trim() || "37% validated improvement rate";
    
    submitValidation(activePilot.id, claim, result, comments, status);
    addToast(`Audit completed. Pilot status marked as: ${status}`, "success");
    setComments("");
    setAuditedResult("");
    setClaimText("");
  };

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">Independent Validation Workspace</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Audit real-world pilot metrics, compare startup outcome claims, and issue verification seals.</p>
      </div>

      {pilots.length === 0 ? (
        <div className="bg-white border border-slate-105 p-8 rounded-2xl text-center text-slate-400 text-sm">
          No sandbox pilots available for verification auditing. Initialize a pilot first.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Pilots Sidebar */}
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
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Audit:</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      p.validationDetails.status === 'Verified' 
                        ? "bg-emerald-55 text-emerald-800" 
                        : "bg-amber-55 text-amber-800"
                    }`}>
                      {p.validationDetails.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main audit panel */}
          {activePilot && (
            <div className="lg:col-span-3 space-y-6">
              
              {/* Pilot Meta */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-1">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  Auditee: {activePilot.startupName}
                </span>
                <h3 className="font-bold text-slate-800 text-base">{activePilot.challengeTitle}</h3>
                <p className="text-xs text-slate-400 font-semibold">Location: {activePilot.location} | Active Dates: {activePilot.startDate} to {activePilot.endDate}</p>
              </div>

              {/* Side by side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* KPI Performance Audits */}
                <div className="bg-white border border-slate-105 p-5 rounded-2xl shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Claimed KPI Telemetry Logs</h3>
                  <div className="space-y-3">
                    {activePilot.kpis.map((kpi, idx) => (
                      <div key={idx} className="bg-slate-50 p-3.5 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                        <span className="font-bold text-slate-800 block mb-1">{kpi.name}</span>
                        <div className="grid grid-cols-3 gap-2 mt-1.5 font-bold text-[10px] text-slate-500 text-center">
                          <div><span className="text-[9px] text-slate-400 block uppercase font-normal">Baseline</span>{kpi.baseline} {kpi.unit}</div>
                          <div><span className="text-[9px] text-slate-400 block uppercase font-normal">Target</span>{kpi.target} {kpi.unit}</div>
                          <div><span className="text-[9px] text-slate-450 block uppercase font-normal text-blue-600">Startup Claim</span>{kpi.actual || "No log"} {kpi.unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Actions Form */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Verification Audit Form</h3>
                  
                  {activePilot.validationDetails.status === "Unverified" ? (
                    <div className="space-y-4 text-xs font-semibold text-slate-650">
                      
                      {/* Startup claim notes */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Startup Claim Summary</label>
                        <input
                          type="text"
                          value={claimText}
                          onChange={(e) => setClaimText(e.target.value)}
                          placeholder="e.g. Startup claims 40% patient wait reduction (72m vs 120m)."
                          className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-semibold focus:outline-hidden"
                        />
                      </div>

                      {/* Audited outcome numbers */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Audited Actual Outcome *</label>
                        <input
                          type="text"
                          required
                          value={auditedResult}
                          onChange={(e) => setAuditedResult(e.target.value)}
                          placeholder="e.g. 37% verified patient waiting reduction rate"
                          className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-semibold focus:outline-hidden"
                        />
                      </div>

                      {/* Comments */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Auditor Remarks *</label>
                        <textarea
                          required
                          rows={3}
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="Provide notes detailing physical checks or data validation parameters."
                          className="w-full px-3 py-2 border border-slate-205 rounded-lg text-xs font-semibold focus:outline-hidden"
                        />
                      </div>

                      {/* Upload PDF */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Validation Report Document</label>
                        <div className="flex items-center gap-2 border border-dashed border-slate-200 rounded-lg p-2 bg-slate-50 cursor-pointer">
                          <Upload className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <span className="text-[10px] text-slate-400">Independent_Audit_Report.pdf (Attached)</span>
                        </div>
                      </div>

                      {/* Decision buttons */}
                      <div className="flex gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => handleVerify("Not Verified")}
                          className="flex-1 flex justify-center items-center gap-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold uppercase rounded-lg border border-rose-105 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" /> Reject Audit
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleVerify("Verified")}
                          className="flex-1 flex justify-center items-center gap-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" /> Verify Efficacy
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="p-4 border border-slate-105 bg-slate-50 rounded-xl text-xs space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">Verification Outcome:</span>
                        <StatusBadge status={activePilot.validationDetails.status} />
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Startup Outcome Statement</span>
                        <p className="text-slate-700 leading-relaxed font-semibold">{activePilot.validationDetails.validatorClaimant}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Auditor Verification Remarks</span>
                        <p className="text-slate-700 leading-relaxed font-semibold">"{activePilot.validationDetails.validatorComments}"</p>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ValidatorDashboard;
