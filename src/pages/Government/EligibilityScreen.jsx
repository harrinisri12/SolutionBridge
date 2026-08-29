import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Modal from '../../components/Common/Modal';
import { ClipboardList, CheckCircle, XCircle, HelpCircle, FileText, ExternalLink } from 'lucide-react';

const EligibilityScreen = () => {
  const { applications, challenges, updateApplicationStatus, addToast } = useApp();

  const [selectedApp, setSelectedApp] = useState(null);
  const [commentType, setCommentType] = useState(""); // Clarify, Reject
  const [commentText, setCommentText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus, "");
    addToast(`Proposal marked as ${newStatus}`, "success");
  };

  const openCommentModal = (app, type) => {
    setSelectedApp(app);
    setCommentType(type);
    setCommentText("");
    setIsModalOpen(true);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) {
      addToast("Please provide a brief justification comment.", "warning");
      return;
    }
    const finalStatus = commentType === "Reject" ? "🔴 Not Eligible" : "🟡 Clarification Required";
    updateApplicationStatus(selectedApp.id, finalStatus, commentText);
    addToast(`Proposal status updated successfully.`, "success");
    setIsModalOpen(false);
  };

  // Build a display list that maps applications to startups and challenges
  const screeningList = applications.map(app => {
    // Fictional startup link
    const startup = {
      name: app.startupId === "startup-1" ? "HealthTech Solutions" : 
             app.startupId === "startup-2" ? "RuralCare Labs" :
             app.startupId === "startup-3" ? "MedTech Systems" : 
             app.startupId === "startup-7" ? "SafeWater Dynamics" : "Startup Proposer",
      reg: app.startupId === "startup-1" ? "REG-987654-A (DPIIT-837482)" : 
           app.startupId === "startup-2" ? "REG-123456-B" : 
           app.startupId === "startup-3" ? "REG-555112-C" : "REG-334455-W",
      certs: app.startupId === "startup-1" ? "ISO 27001, HIPAA" : 
             app.startupId === "startup-2" ? "ISO 9001, HIPAA" : 
             app.startupId === "startup-3" ? "ISO 13485" : "ISO 9001",
      techs: app.startupId === "startup-1" ? "AI/ML, IoT, Telemed" : 
             app.startupId === "startup-2" ? "Telemed, Edge ML" : 
             app.startupId === "startup-3" ? "AI/ML, SaaS" : "IoT, Spectral"
    };
    
    const challenge = challenges.find(c => c.id === app.challengeId) || { title: "Challenge" };

    return {
      ...app,
      startupName: startup.name,
      startupReg: startup.reg,
      startupCerts: startup.certs,
      startupTechs: startup.techs,
      challengeTitle: challenge.title
    };
  });

  return (
    <div className="p-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col text-left">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">Startup Eligibility Screening</h2>
        <p className="text-xs text-slate-400 mt-1">Review registrations, certifications, and compliance attachments. Validate eligibility parameters before expert routing.</p>
      </div>

      {/* Main Screening Board */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-left">
          <table className="w-full text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Startup / Challenge</th>
                <th className="px-6 py-4">Registration</th>
                <th className="px-6 py-4">Certifications</th>
                <th className="px-6 py-4">Required Tech Matching</th>
                <th className="px-6 py-4">Documents</th>
                <th className="px-6 py-4">Eligibility Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {screeningList.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Startup Column */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-800 text-sm">{app.startupName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold truncate max-w-xs">{app.challengeTitle}</span>
                    </div>
                  </td>

                  {/* Registration */}
                  <td className="px-6 py-4 font-semibold text-slate-500">
                    {app.startupReg}
                  </td>

                  {/* Certifications */}
                  <td className="px-6 py-4 font-semibold text-slate-500">
                    {app.startupCerts}
                  </td>

                  {/* Required Tech matching */}
                  <td className="px-6 py-4">
                    <span className="bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded text-[10px] text-blue-700 font-bold">
                      {app.startupTechs}
                    </span>
                  </td>

                  {/* Documents */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {app.documents && app.documents.length > 0 ? (
                        app.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 cursor-pointer font-bold">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="underline truncate max-w-[120px]">{doc.name}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">No attachments</span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                    {app.screeningComment && (
                      <p className="text-[10px] text-slate-400 italic mt-1 font-normal max-w-[140px] leading-tight">
                        Note: "{app.screeningComment}"
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* Mark Eligible Button */}
                      <button
                        onClick={() => handleStatusChange(app.id, "🟢 Eligible")}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-colors cursor-pointer"
                        title="Mark Eligible"
                      >
                        <CheckCircle className="w-4.5 h-4.5" />
                      </button>

                      {/* Request Clarification Button */}
                      <button
                        onClick={() => openCommentModal(app, "Clarify")}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-100 transition-colors cursor-pointer"
                        title="Request Clarification"
                      >
                        <HelpCircle className="w-4.5 h-4.5" />
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => openCommentModal(app, "Reject")}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                        title="Reject Proposal"
                      >
                        <XCircle className="w-4.5 h-4.5" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
              {screeningList.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No proposals submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Comment Modal */}
      <Modal
        isOpen={isModalOpen}
        title={commentType === "Reject" ? "Reject Application Justification" : "Clarification Request Notes"}
        onClose={() => setIsModalOpen(false)}
        confirmText="Confirm Status Update"
        onConfirm={handleCommentSubmit}
        confirmColor={commentType === "Reject" ? "rose" : "amber"}
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-500">
            Provide details regarding the {commentType === "Reject" ? "rejection reason" : "required clarifications"}. This feedback will be instantly visible to the startup in their portal workspace.
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Comments / Notes *</label>
            <textarea
              required
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                commentType === "Reject" 
                  ? "e.g. Applicant does not possess the mandatory ISO 27001 certification certificate."
                  : "e.g. Please upload a detailed audit report for model efficacy validation parameters."
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default EligibilityScreen;
