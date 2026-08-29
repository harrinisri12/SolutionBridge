import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import {
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  Clock,
  MessageSquare,
  AlertOctagon,
  FileText,
  Send,
  Plus,
  Compass
} from 'lucide-react';

const GovPilots = () => {
  const { pilots, addToast } = useApp();
  const navigate = useNavigate();

  const [selectedPilotId, setSelectedPilotId] = useState(pilots[0]?.id || "");
  const [activeTab, setActiveTab] = useState("milestones"); // milestones, reports, issues, comms, docs

  // Chat message state
  const [chatMessage, setChatMessage] = useState("");
  const [chats, setChats] = useState([
    { sender: "Startup (HealthTech)", msg: "Equipment kits deployed at Mandya and Hubli clinics. Initial triage sync is running.", time: "Today, 10:15 AM" },
    { sender: "Govt Officer (Health)", msg: "Confirmed. Receptors are displaying telemetry on command room dash.", time: "Today, 11:30 AM" }
  ]);

  // Issues state
  const [issueTitle, setIssueTitle] = useState("");
  const [issues, setIssues] = useState([
    { title: "Internet drop at PHC #4", status: "Resolved", date: "2026-09-08" },
    { title: "Solar battery draining prematurely", status: "Active", date: "2026-10-12" }
  ]);

  const activePilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChats(prev => [
      ...prev,
      { sender: "Govt Officer (Health)", msg: chatMessage, time: "Just now" }
    ]);
    setChatMessage("");
    addToast("Message transmitted.", "success");
  };

  const handleAddIssue = (e) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;
    setIssues(prev => [
      ...prev,
      { title: issueTitle, status: "Active", date: new Date().toISOString().split('T')[0] }
    ]);
    setIssueTitle("");
    addToast("New issue ticket filed.", "warning");
  };

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-6 border border-slate-150 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-wide">Pilot Sandboxes Control Room</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Monitor real-time sandbox deployments, track milestone payouts, log technical issues, and audit telemetry logs.</p>
        </div>
        <button
          onClick={() => navigate('/gov/create-pilot')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Initialize Pilot
        </button>
      </div>

      {pilots.length === 0 ? (
        <div className="bg-white border border-slate-100 p-12 rounded-2xl text-center text-slate-400 text-sm">
          No pilots initiated yet. Select a candidate from the Rankings page to launch.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Pilots Sidebar */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3 h-fit">
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
                    <StatusBadge status={p.status} />
                    <span className="text-[9px] text-slate-500 font-bold">${p.budget.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Pilot Detail Control Dashboard */}
          {activePilot && (
            <div className="lg:col-span-3 space-y-6">
              
              {/* Pilot Info Summary Card */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Compass className="w-48 h-48" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:justify-between gap-6">
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                        Ref: {activePilot.id.toUpperCase()}
                      </span>
                      <StatusBadge status={activePilot.status} />
                    </div>
                    <h3 className="font-extrabold text-white text-lg tracking-wide">{activePilot.challengeTitle}</h3>
                    <p className="text-xs text-slate-400 font-semibold">Proposer: {activePilot.startupName}</p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold text-slate-300 mt-4">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {activePilot.location || "Multiple sites"}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-400" /> Duration: {activePilot.startDate} to {activePilot.endDate}</span>
                      <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-blue-400" /> Budget: ${activePilot.budget.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Objective Summary */}
                  <div className="md:w-72 bg-white/5 border border-white/10 rounded-xl p-4 text-xs space-y-1.5 shrink-0 self-start">
                    <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Triage Scope</span>
                    <p className="text-slate-300 leading-relaxed font-semibold">
                      {activePilot.objectives || "Objectives details not configured."}
                    </p>
                  </div>

                </div>
              </div>

              {/* Tabs Panel Navigation */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/50 flex flex-wrap text-xs font-bold uppercase tracking-wider text-slate-400">
                  {[
                    { id: 'milestones', label: 'Milestones Timeline' },
                    { id: 'reports', label: 'Progress Reports' },
                    { id: 'issues', label: 'Issues & Bugs' },
                    { id: 'docs', label: 'Audit Proofs' },
                    { id: 'comms', label: 'Communication Hub' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-3 border-b-2 transition-all cursor-pointer ${
                        activeTab === tab.id 
                          ? "border-blue-600 text-blue-700 bg-white" 
                          : "border-transparent hover:text-slate-600"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  
                  {/* TAB 1: Milestones */}
                  {activeTab === 'milestones' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Milestone Completion Grid</h4>
                      <div className="space-y-2">
                        {activePilot.milestones.map((m, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                m.status === 'Paid'
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-250"
                                  : "bg-slate-100 text-slate-500 border border-slate-205"
                              }`}>
                                {idx + 1}
                              </div>
                              <div>
                                <span className="font-bold text-xs text-slate-800 block">{m.title}</span>
                                <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Due Date: {m.dueDate} | Weight: {m.weight}%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-blue-600">${m.budgetShare.toLocaleString()}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.status === 'Paid'
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}>
                                {m.status === 'Paid' ? "Completed & Paid" : "Awaiting Payout Review"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Progress Reports */}
                  {activeTab === 'reports' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Submitted Pilot Progress Reports</h4>
                      <div className="space-y-3">
                        {[
                          { title: "Deployment Report - Month 1", author: "HealthTech Solutions", date: "2026-09-30", desc: "Successfully shipped diagnostic hubs to all 10 target Primary Health Centers (PHCs). Community worker registration completed." },
                          { title: "Integration Report - Month 2", author: "HealthTech Solutions", date: "2026-10-31", desc: "Conducted nurse validation checks and local network integrations. 120 preliminary consult trial runs finalized." }
                        ].map((rep, idx) => (
                          <div key={idx} className="p-4 border border-slate-100 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-xs text-slate-800 block">{rep.title}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{rep.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                              {rep.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Issues */}
                  {activeTab === 'issues' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filed Issues Log</h4>
                      </div>

                      {/* Add issue form */}
                      <form onSubmit={handleAddIssue} className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={issueTitle}
                          onChange={(e) => setIssueTitle(e.target.value)}
                          placeholder="Describe new technical issue/bug..."
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-colors"
                        >
                          Report Issue
                        </button>
                      </form>

                      <div className="divide-y divide-slate-100">
                        {issues.map((iss, idx) => (
                          <div key={idx} className="py-3 flex justify-between items-center">
                            <div>
                              <span className="font-bold text-xs text-slate-800 block">{iss.title}</span>
                              <span className="text-[9px] text-slate-400 font-semibold">Reported: {iss.date}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              iss.status === 'Resolved' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {iss.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Documents */}
                  {activeTab === 'docs' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Audit-Ready Documentation Logs</h4>
                      <div className="space-y-2">
                        {[
                          { name: "Safety_Deployment_Audit.pdf", size: "2.1 MB", uploader: "Govt Inspector" },
                          { name: "ECG_Telemetry_Performance_Data.csv", size: "12.4 MB", uploader: "Startup Partner" }
                        ].map((doc, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span>{doc.name} ({doc.size})</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Uploaded by: {doc.uploader}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: Comms */}
                  {activeTab === 'comms' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Secure Message Board</h4>
                      
                      {/* Messages grid */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 h-48 overflow-y-auto space-y-3 font-semibold text-xs text-slate-650">
                        {chats.map((c, idx) => (
                          <div key={idx} className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">{c.sender}</span>
                              <span className="text-[9px] text-slate-400 font-normal">{c.time}</span>
                            </div>
                            <p className="text-slate-600 bg-white border border-slate-100 p-2.5 rounded-lg leading-relaxed shadow-xs max-w-lg mt-0.5">
                              {c.msg}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Chat input */}
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Type communication message..."
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
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

export default GovPilots;
