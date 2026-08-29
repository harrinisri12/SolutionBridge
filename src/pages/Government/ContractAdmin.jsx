import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Modal from '../../components/Common/Modal';
import { ScrollText, Download, CheckCircle, HelpCircle, ArrowRight, Eye, ShieldAlert } from 'lucide-react';

const ContractAdmin = () => {
  const { pilots, approveContract, requestContractChanges, addToast } = useApp();

  const [selectedPilotId, setSelectedPilotId] = useState(pilots[0]?.id || "");
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [changeNotes, setChangeNotes] = useState("");
  const [isContractPreviewOpen, setIsContractPreviewOpen] = useState(false);

  const activePilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  const handleApprove = () => {
    if (!activePilot) return;
    approveContract(activePilot.id);
    addToast(`Contract approved. Pilot status is now ACTIVE.`, "success");
  };

  const handleRequestChangesSubmit = () => {
    if (!changeNotes.trim()) {
      addToast("Please provide details for the required amendments.", "warning");
      return;
    }
    requestContractChanges(activePilot.id, changeNotes);
    addToast("Revision request transmitted to Startup.", "success");
    setIsNotesModalOpen(false);
  };

  const handleDownload = () => {
    addToast("Simulating PDF download: Innovation_Procurement_Agreement.pdf", "info");
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col text-left">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">Contract & Compliance Administration</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Review and execute sandboxed procurement agreements, IP covenants, and cybersecurity audits.</p>
      </div>

      {pilots.length === 0 ? (
        <div className="bg-white border border-slate-100 p-8 rounded-2xl text-center text-slate-400 text-sm">
          No active pilot contracts found. Create a pilot first.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
          
          {/* Pilots Sidebar list */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pilot Contracts</h3>
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
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">${p.budget.toLocaleString()}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      p.contractApproved 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {p.contractApproved ? "Approved" : "Pending Signature"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Contract Terms Sheet */}
          {activePilot && (
            <div className="lg:col-span-3 space-y-6">
              
              {/* Pilot Meta Summary */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    Ref: {activePilot.id.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-slate-800 text-base">{activePilot.challengeTitle}</h3>
                  <p className="text-xs text-slate-400 font-semibold">Proposer: {activePilot.startupName} | Operational Scope: {activePilot.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsContractPreviewOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 font-bold text-[10px] uppercase tracking-wider text-slate-700 rounded-lg cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Read Document
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 font-bold text-[10px] uppercase tracking-wider text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Compliance Clauses */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Compliance and Governance Clauses</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  {/* IP Clause */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">IP Rights & Innovations</span>
                    <p className="text-slate-500 leading-relaxed">
                      All intellectual property developed exclusively under this pilot remains with the Startup. The Government retains a non-exclusive, royalty-free, perpetual license to run, operate, and modify the solution for public-sector use.
                    </p>
                  </div>

                  {/* Data Governance */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Data Governance & Ownership</span>
                    <p className="text-slate-500 leading-relaxed">
                      All patient records, operational telemetry, and citizen databases remain the exclusive property of the Government. Data must be stored on local government cloud directories and conform to local data compliance acts.
                    </p>
                  </div>

                  {/* Cyber Security */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Cybersecurity & Risk Audit</span>
                    <p className="text-slate-500 leading-relaxed">
                      The solution must undergo a third-party cybersecurity audit before deployment. Support tunnels must employ end-to-end TLS encryption. Continuous telemetry logs must be open to independent validator auditing.
                    </p>
                  </div>

                  {/* Operational Terms */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Milestone Payment Releases</span>
                    <p className="text-slate-500 leading-relaxed">
                      Disbursements are mapped to milestone achievements. Independent validators must verify results before Finance officers can clear pending milestones. Change requests will hold all subsequent payout schedules.
                    </p>
                  </div>

                </div>

                {activePilot.contractNotes && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 text-xs">
                    <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                    <div>
                      <span className="font-bold text-rose-900">Amendment Note Request:</span>
                      <p className="text-rose-700 leading-relaxed mt-0.5">"{activePilot.contractNotes}"</p>
                    </div>
                  </div>
                )}

                {/* Status and Action bar */}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-slate-400">Contract Execution Status:</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      activePilot.contractApproved 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {activePilot.contractApproved ? "ACTIVE & SIGNED" : "AWAITING APPROVAL"}
                    </span>
                  </div>
                  
                  {!activePilot.contractApproved && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsNotesModalOpen(true)}
                        className="px-3.5 py-1.5 border border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        Request Amendments
                      </button>
                      <button
                        onClick={handleApprove}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase tracking-wider text-white rounded-lg cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Execute Agreement
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* Amendments Input Modal */}
      <Modal
        isOpen={isNotesModalOpen}
        title="Specify Contract Amendments"
        onClose={() => setIsNotesModalOpen(false)}
        confirmText="Transmit Revision Request"
        onConfirm={handleCommentSubmit || handleRequestChangesSubmit}
        confirmColor="rose"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-500">
            Detail the changes requested in the agreement terms (e.g. revisions to payment splits or security audits).
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amendment Requirements *</label>
            <textarea
              required
              rows={4}
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="e.g. Requesting Milestone 2 budget share to be adjusted to 25% with matching schedule updates."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      </Modal>

      {/* Contract Agreement Preview Modal */}
      <Modal
        isOpen={isContractPreviewOpen}
        title="INNOVATION SANDBOX PILOT AGREEMENT"
        onClose={() => setIsContractPreviewOpen(false)}
        confirmText="Close Document"
        onConfirm={() => setIsContractPreviewOpen(false)}
        confirmColor="slate"
      >
        <div className="space-y-4 text-left font-serif text-[11px] leading-relaxed text-slate-700">
          <div className="text-center font-bold text-slate-900 uppercase">
            MEMORANDUM OF PROCUREMENT UNDERSTANDING
          </div>
          <p>
            This agreement is entered into on this day of execution between the **Department of Innovation & Procurement** and the selected startup party **{activePilot?.startupName || "Startup Partner"}**.
          </p>
          <div>
            <h4 className="font-bold text-slate-800 uppercase">1. OBJECTIVE & SCOPE</h4>
            <p>
              The startup partner shall deploy and test **{activePilot?.challengeTitle || "the solution"}** in the designated municipal sandbox: **{activePilot?.location || "Designated pilot locations"}**.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 uppercase">2. MILESTONE RELEASES</h4>
            <p>
              Payments will be disbursed across {activePilot?.milestones.length || 4} phases. Each phase requires an audit certificate issued by the **Independent Validator Agency** confirming target KPIs are achieved within reasonable tolerances.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 uppercase">3. INTELLECTUAL PROPERTY & SECURITY</h4>
            <p>
              The startup asserts that the solution does not infringe on third-party licenses. Security guidelines require isolated sandboxes and local data tenancy.
            </p>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ContractAdmin;
