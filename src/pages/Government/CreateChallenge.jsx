import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Common/Modal';
import { Plus, Trash2, ArrowLeft, ArrowRight, Save, UploadCloud, Eye } from 'lucide-react';

const CreateChallenge = () => {
  const { publishChallenge, addToast } = useApp();
  const navigate = useNavigate();

  // Stepper state
  const [step, setStep] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    department: "Health Department",
    sector: "Healthcare",
    location: "",
    budget: "",
    pilotDuration: "6 Months",
    submissionDeadline: "",
    problemDescription: "",
    expectedOutcome: "",
    requiredTechnology: "",
    eligibilityRequirements: "",
    kpis: [
      { name: "Patient Triage Wait Time", baseline: "120", target: "80", unit: "minutes" }
    ],
    evaluationCriteria: [
      { criterion: "Problem Understanding", weight: 0.15 },
      { criterion: "Technical Feasibility", weight: 0.20 },
      { criterion: "Innovation", weight: 0.15 },
      { criterion: "Scalability", weight: 0.15 },
      { criterion: "Cost Effectiveness", weight: 0.15 },
      { criterion: "Team Capability", weight: 0.10 },
      { criterion: "Security", weight: 0.10 }
    ]
  });

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? parseFloat(value) : "" }));
  };

  // KPI Handlers
  const handleKpiChange = (index, field, value) => {
    const updatedKpis = formData.kpis.map((kpi, idx) => {
      if (idx === index) {
        return { ...kpi, [field]: value };
      }
      return kpi;
    });
    setFormData(prev => ({ ...prev, kpis: updatedKpis }));
  };

  const addKpi = () => {
    setFormData(prev => ({
      ...prev,
      kpis: [...prev.kpis, { name: "", baseline: "", target: "", unit: "" }]
    }));
  };

  const removeKpi = (index) => {
    if (formData.kpis.length === 1) return;
    setFormData(prev => ({
      ...prev,
      kpis: prev.kpis.filter((_, idx) => idx !== index)
    }));
  };

  // Evaluation Criteria Handlers
  const handleCriteriaWeightChange = (index, val) => {
    const weightNum = parseFloat(val) || 0;
    const updatedCriteria = formData.evaluationCriteria.map((c, idx) => {
      if (idx === index) {
        return { ...c, weight: weightNum / 100 }; // Convert percentage to fraction
      }
      return c;
    });
    setFormData(prev => ({ ...prev, evaluationCriteria: updatedCriteria }));
  };

  const totalCriteriaWeight = formData.evaluationCriteria.reduce((sum, c) => sum + c.weight, 0) * 100;

  // Actions
  const handlePublish = () => {
    // Basic validation
    if (!formData.title || !formData.problemDescription || !formData.location || !formData.budget) {
      addToast("Please fill in all required fields before publishing", "warning");
      return;
    }
    if (Math.abs(totalCriteriaWeight - 100) > 0.1) {
      addToast(`Evaluation criteria weights must total 100% (currently ${totalCriteriaWeight.toFixed(0)}%)`, "error");
      return;
    }

    publishChallenge(formData);
    addToast("Challenge successfully published to the public marketplace!", "success");
    navigate('/gov/challenges');
  };

  const handleSaveDraft = () => {
    addToast("Challenge template successfully saved as Draft.", "success");
    navigate('/gov/challenges');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/gov/challenges')} className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-wide">Publish a New Challenge</h2>
          <p className="text-xs text-slate-400 mt-1">Specify procurement constraints, timelines, budgets, and measurable KPIs.</p>
        </div>
      </div>

      {/* Multi-step stepper */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
        {[
          { stepNum: 1, label: "Core Meta" },
          { stepNum: 2, label: "Problem Details" },
          { stepNum: 3, label: "KPIs & Grading" },
          { stepNum: 4, label: "Review & Publish" }
        ].map((s) => (
          <React.Fragment key={s.stepNum}>
            {s.stepNum > 1 && <div className={`flex-1 h-0.5 mx-4 ${step >= s.stepNum ? "bg-blue-600" : "bg-slate-200"}`} />}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s.stepNum
                  ? "bg-blue-600 text-white"
                  : step > s.stepNum
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-400"
              }`}>
                {s.stepNum}
              </div>
              <span className={`text-xs font-bold ${step === s.stepNum ? "text-slate-800" : "text-slate-400"}`}>{s.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Step Contents */}
      <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm text-left">
        
        {/* STEP 1: Core Meta */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Challenge Framework & Constraints</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Challenge Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTextChange}
                  placeholder="e.g. Solar-Powered Vaccine Refrigerator Grid"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleTextChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
                >
                  <option value="Health Department">Health Department</option>
                  <option value="Rural Development">Rural Development</option>
                  <option value="Municipal Administration">Municipal Administration</option>
                  <option value="Agriculture Department">Agriculture Department</option>
                  <option value="Transport Department">Transport Department</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sector *</label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleTextChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
                >
                  <option value="Healthcare">Healthcare</option>
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Municipal / Smart Cities">Municipal / Smart Cities</option>
                  <option value="Energy">Energy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location/Target District *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleTextChange}
                  placeholder="e.g. Mandya and Hubli districts"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Allocated Pilot Budget ($) *</label>
                <input
                  type="number"
                  name="budget"
                  required
                  value={formData.budget}
                  onChange={handleNumberChange}
                  placeholder="e.g. 120000"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilot Duration *</label>
                <select
                  name="pilotDuration"
                  value={formData.pilotDuration}
                  onChange={handleTextChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
                >
                  <option value="3 Months">3 Months</option>
                  <option value="4 Months">4 Months</option>
                  <option value="5 Months">5 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Submission Deadline *</label>
                <input
                  type="date"
                  name="submissionDeadline"
                  required
                  value={formData.submissionDeadline}
                  onChange={handleTextChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden"
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: Problem Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Technical & Operational Requirements</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Problem Description *</label>
                <textarea
                  name="problemDescription"
                  required
                  rows={4}
                  value={formData.problemDescription}
                  onChange={handleTextChange}
                  placeholder="Detail the operational bottlenecks. What doesn't work currently?"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Outcome *</label>
                <textarea
                  name="expectedOutcome"
                  required
                  rows={3}
                  value={formData.expectedOutcome}
                  onChange={handleTextChange}
                  placeholder="What constitutes a successful pilot outcome?"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Technologies *</label>
                  <input
                    type="text"
                    name="requiredTechnology"
                    required
                    value={formData.requiredTechnology}
                    onChange={handleTextChange}
                    placeholder="e.g. LoRaWAN, IoT Sensors, Microgrids"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Eligibility Criteria *</label>
                  <input
                    type="text"
                    name="eligibilityRequirements"
                    required
                    value={formData.eligibilityRequirements}
                    onChange={handleTextChange}
                    placeholder="e.g. DPIIT recognized, 2+ years field experience"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: KPIs & Grading */}
        {step === 3 && (
          <div className="space-y-6">
            
            {/* KPI definition */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Target KPIs & Baseline Metrics</h3>
                <button
                  type="button"
                  onClick={addKpi}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add KPI
                </button>
              </div>

              <div className="space-y-3">
                {formData.kpis.map((kpi, idx) => (
                  <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-slate-50 p-3.5 border border-slate-100 rounded-xl">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">KPI Name</label>
                      <input
                        type="text"
                        required
                        value={kpi.name}
                        onChange={(e) => handleKpiChange(idx, "name", e.target.value)}
                        placeholder="e.g. Waiting Time"
                        className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 font-semibold focus:outline-hidden"
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Baseline</label>
                      <input
                        type="number"
                        required
                        value={kpi.baseline}
                        onChange={(e) => handleKpiChange(idx, "baseline", e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 font-semibold focus:outline-hidden"
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Target</label>
                      <input
                        type="number"
                        required
                        value={kpi.target}
                        onChange={(e) => handleKpiChange(idx, "target", e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 font-semibold focus:outline-hidden"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Unit</label>
                      <input
                        type="text"
                        required
                        value={kpi.unit}
                        onChange={(e) => handleKpiChange(idx, "unit", e.target.value)}
                        placeholder="minutes"
                        className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 font-semibold focus:outline-hidden"
                      />
                    </div>
                    {formData.kpis.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKpi(idx)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors mt-4 self-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation Scorecard Grading Weights */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Proposal Grading Weights (Total 100%)</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                  Math.abs(totalCriteriaWeight - 100) < 0.1 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  Current Sum: {totalCriteriaWeight.toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.evaluationCriteria.map((c, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">{c.criterion}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        value={c.weight * 100}
                        onChange={(e) => handleCriteriaWeightChange(idx, e.target.value)}
                        className="w-16 px-2 py-1 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* STEP 4: Review & Publish */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Review Challenge Overview</h3>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><span className="text-slate-400 uppercase font-bold text-[9px] block">Title</span><span className="font-bold text-slate-800 text-sm">{formData.title || "Not defined"}</span></div>
                <div><span className="text-slate-400 uppercase font-bold text-[9px] block">Department / Sector</span><span className="font-bold text-slate-800">{formData.department} ({formData.sector})</span></div>
                <div><span className="text-slate-400 uppercase font-bold text-[9px] block">Allocated Budget</span><span className="font-bold text-blue-600 text-sm">${formData.budget}</span></div>
                <div><span className="text-slate-400 uppercase font-bold text-[9px] block">Deadline / Duration</span><span className="font-bold text-slate-800">{formData.submissionDeadline || "Not set"} ({formData.pilotDuration})</span></div>
              </div>
              <hr className="border-slate-200" />
              <div className="text-xs">
                <span className="text-slate-400 uppercase font-bold text-[9px] block">Problem Statement</span>
                <p className="text-slate-600 leading-relaxed mt-1">{formData.problemDescription || "Not defined"}</p>
              </div>
              <div className="text-xs">
                <span className="text-slate-400 uppercase font-bold text-[9px] block">Expected Outcome</span>
                <p className="text-slate-600 leading-relaxed mt-1">{formData.expectedOutcome || "Not defined"}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview Challenge Web View
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Navigation Footer Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
          className={`px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-700 transition-colors ${
            step === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer"
          }`}
        >
          Previous
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            Save Draft
          </button>
          
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors animate-pulse"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Publish Challenge
            </button>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Modal
        isOpen={isPreviewOpen}
        title="Public Marketplace Preview"
        onClose={() => setIsPreviewOpen(false)}
        confirmText="Publish Directly"
        onConfirm={() => {
          setIsPreviewOpen(false);
          handlePublish();
        }}
        confirmColor="emerald"
      >
        <div className="space-y-4">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            Previewing: {formData.sector} Sector
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{formData.title || "Challenge Title"}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Department: {formData.department} | Budget: ${formData.budget || "0"}</p>
          
          <div className="space-y-3 mt-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-800">Problem Statement</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">{formData.problemDescription || "No description provided."}</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Expected Outcome</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">{formData.expectedOutcome || "No expectations configured."}</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Technologies Required</h4>
              <p className="text-slate-600 mt-1 font-semibold">{formData.requiredTechnology || "None"}</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Target KPIs</h4>
              <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-600">
                {formData.kpis.map((kpi, idx) => (
                  <li key={idx} className="font-medium">
                    {kpi.name || "KPI"}: Target {kpi.target} {kpi.unit} (Baseline: {kpi.baseline})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default CreateChallenge;
