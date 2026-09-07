import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Plus, Trash2, Calendar, DollarSign, CheckSquare, Save } from 'lucide-react';

const PilotCreator = () => {
  const { challenges, applications, createPilot, addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected startup/challenge from router state
  const prefilled = location.state?.prefilledApp || null;

  // State
  const [selectedChallengeId, setSelectedChallengeId] = useState(prefilled?.challengeId || "");
  const [selectedStartupId, setSelectedStartupId] = useState(prefilled?.startupId || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(prefilled?.budget || 0);
  const [objectives, setObjectives] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [kpis, setKpis] = useState([]);
  const [milestones, setMilestones] = useState([
    { id: "m-1", title: "Requirement Gathering & Site Setup", weight: 20, budgetShare: 0, dueDate: "", status: "Draft" },
    { id: "m-2", title: "Hardware Deploy & Staff Training", weight: 20, budgetShare: 0, dueDate: "", status: "Draft" },
    { id: "m-3", title: "Live Pilot Run & Triage Optimization", weight: 30, budgetShare: 0, dueDate: "", status: "Draft" },
    { id: "m-4", title: "Final Evaluation & Validator Audit", weight: 30, budgetShare: 0, dueDate: "", status: "Draft" }
  ]);

  // Update KPIs and budget when challenge changes
  useEffect(() => {
    if (selectedChallengeId) {
      const ch = challenges.find(c => c.id === selectedChallengeId);
      if (ch) {
        setBudget(ch.budget);
        // Map KPIs from challenge
        setKpis(ch.kpis.map(k => ({ ...k, actual: "" })));
      }
    }
  }, [selectedChallengeId, challenges]);

  // Re-calculate budget shares when budget or milestone weights change
  useEffect(() => {
    setMilestones(prev => prev.map(m => ({
      ...m,
      budgetShare: Math.round((budget * m.weight) / 100)
    })));
  }, [budget]);

  const handleMilestoneWeightChange = (index, val) => {
    const weightNum = parseInt(val) || 0;
    const updated = milestones.map((m, idx) => {
      if (idx === index) {
        return {
          ...m,
          weight: weightNum,
          budgetShare: Math.round((budget * weightNum) / 100)
        };
      }
      return m;
    });
    setMilestones(updated);
  };

  const handleMilestoneTitleChange = (index, val) => {
    setMilestones(prev => prev.map((m, idx) => idx === index ? { ...m, title: val } : m));
  };

  const handleMilestoneDueDateChange = (index, val) => {
    setMilestones(prev => prev.map((m, idx) => idx === index ? { ...m, dueDate: val } : m));
  };

  const addMilestone = () => {
    setMilestones(prev => [
      ...prev,
      { id: `m-${prev.length + 1}`, title: "", weight: 0, budgetShare: 0, dueDate: "", status: "Draft" }
    ]);
  };

  const removeMilestone = (index) => {
    if (milestones.length === 1) return;
    setMilestones(prev => prev.filter((_, idx) => idx !== index));
  };

  const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChallengeId || !selectedStartupId) {
      addToast("Please select a target challenge and startup", "warning");
      return;
    }

    const challenge = challenges.find(c => c.id === selectedChallengeId);
    
    // Look up application
    const appMatch = applications.find(
      a => a.challengeId === selectedChallengeId && (a.startupId === selectedStartupId || a.id === selectedStartupId)
    ) || applications.find(a => a.startupId === selectedStartupId || a.id === selectedStartupId);

    if (!appMatch) {
      addToast("No matching application proposal found for this startup and challenge", "error");
      return;
    }

    const startupName = appMatch.startupName || "Selected Startup";

    const pilotPayload = {
      application_id: appMatch.id,
      location: challenge?.location || objectives || 'Municipal Pilot Zone',
      duration_days: 180,
      baseline_value: 20,
      target_value: 15,
      milestones: milestones.map(m => ({
        title: m.title,
        description: m.description || null,
        target_date: m.dueDate || null
      }))
    };

    try {
      await createPilot(pilotPayload);
      addToast(`Successfully initiated pilot deployment for ${startupName}`, "success");
      navigate('/gov/pilots');
    } catch (err) {
      addToast(err.message || "Failed to create pilot", "error");
    }
  };

  // Get eligible startups for dropdown
  const eligibleApplications = applications.filter(
    a => a.status === "selected" || a.status === "Selected" || a.status === "shortlisted" || a.status === "Shortlisted"
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/gov/applications')} className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-wide">Initialize a Sandbox Pilot</h2>
          <p className="text-xs text-slate-400 mt-1">Configure pilot parameters, milestone timelines, objectives, and unlock compliance terms.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        
        {/* Core Settings */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            Core Deployment Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Challenge selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Challenge *</label>
              <select
                value={selectedChallengeId}
                onChange={(e) => setSelectedChallengeId(e.target.value)}
                disabled={!!prefilled}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden"
              >
                <option value="">Select Challenge...</option>
                {challenges.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Startup selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deploying Startup Partner *</label>
              <select
                value={selectedStartupId}
                onChange={(e) => setSelectedStartupId(e.target.value)}
                disabled={!!prefilled}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden"
              >
                <option value="">Select Startup...</option>
                {prefilled ? (
                  <option value={prefilled.startupId}>{prefilled.startupName}</option>
                ) : (
                  eligibleApplications.map(a => (
                    <option key={a.id} value={a.startupId || a.id}>
                      {a.startupName} ({a.id}) - {a.challengeTitle?.slice(0, 24)}...
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date *</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Date *</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Total Budget */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Budget ($)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Objectives */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilot Scope & Objectives</label>
              <textarea
                rows={3}
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="What parameters will be operationalized? Include site locations."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
              />
            </div>

            {/* Responsibilities */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cybersecurity & Operational Responsibilities</label>
              <textarea
                rows={2}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="e.g. Startup supplies hardware backup, government provides clinic access."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
              />
            </div>

          </div>
        </div>

        {/* Milestones Payout Setup */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Milestone Payment Schedule
            </h3>
            <button
              type="button"
              onClick={addMilestone}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Milestone
            </button>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-slate-50 p-3.5 border border-slate-150 rounded-xl">
                
                {/* Title */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Milestone Deliverable</label>
                  <input
                    type="text"
                    required
                    value={m.title}
                    onChange={(e) => handleMilestoneTitleChange(idx, e.target.value)}
                    placeholder="Deliverable details"
                    className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 font-semibold focus:outline-hidden"
                  />
                </div>

                {/* Weight */}
                <div className="w-20">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Weight (%)</label>
                  <input
                    type="number"
                    required
                    value={m.weight}
                    onChange={(e) => handleMilestoneWeightChange(idx, e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 font-bold focus:outline-hidden"
                  />
                </div>

                {/* Calculated Share */}
                <div className="w-28">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Fund Share ($)</label>
                  <div className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 font-bold">
                    ${m.budgetShare.toLocaleString()}
                  </div>
                </div>

                {/* Due Date */}
                <div className="w-32">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={m.dueDate}
                    onChange={(e) => handleMilestoneDueDateChange(idx, e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-850 font-bold focus:outline-hidden"
                  />
                </div>

                {/* Remove */}
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(idx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors mt-4 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

              </div>
            ))}
          </div>

          <div className="flex justify-end pr-4 text-xs font-bold">
            <span className={`${totalWeight === 100 ? "text-emerald-600" : "text-rose-600"}`}>
              Total Weights: {totalWeight}% / 100%
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/gov/ranking')}
            className="px-4 py-2.5 border border-slate-200 bg-white font-bold text-xs uppercase tracking-wider text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-md cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            Launch & Save Pilot
          </button>
        </div>

      </form>

    </div>
  );
};

export default PilotCreator;
