import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Save, Plus, Trash2, Calendar, FileText, UploadCloud, CheckSquare } from 'lucide-react';

const ApplicationForm = () => {
  const { challengeId } = useParams();
  const { challenges, submitApplication, addToast } = useApp();
  const navigate = useNavigate();

  const challengeObj = challenges.find(c => c.id === challengeId);

  // Stepper state
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    startupId: "startup-1", // Logged in startup reference
    challengeId: challengeId || "",
    companyName: "HealthTech Solutions",
    registrationDetails: "REG-987654-A (Incorporated 2021)",
    recognition: "DPIIT Recognized (DPIIT-837482)",
    sector: challengeObj?.sector || "Healthcare",
    solutionDescription: "",
    proposedTechnology: challengeObj?.requiredTechnology || "",
    implementationPlan: "",
    expectedImpact: "",
    team: [
      { name: "Dr. Aisha Rao", role: "CEO & Co-founder" },
      { name: "Mark Peterson", role: "CTO" }
    ],
    experience: "5+ years developing digital health platforms for rural and low-resource environments.",
    certifications: "ISO 27001, HIPAA Compliant",
    costProposal: [
      { item: "Hardware Kits (10 PHCs)", cost: 50000 },
      { item: "Software Licensing & Support (6 Months)", cost: 25000 },
      { item: "Field Nurse & Technical Training", cost: 15000 },
      { item: "Validation Proof & Travel Logs", cost: 10000 },
      { item: "Contingency Fund", cost: 20000 }
    ],
    declarationSigned: false
  });

  // Calculate sum of cost proposal
  const totalProposedCost = formData.costProposal.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);

  // Dynamic cost item handlers
  const handleCostItemChange = (index, field, value) => {
    const updated = formData.costProposal.map((c, idx) => {
      if (idx === index) {
        return { ...c, [field]: field === 'cost' ? (parseFloat(value) || 0) : value };
      }
      return c;
    });
    setFormData(prev => ({ ...prev, costProposal: updated }));
  };

  const addCostItem = () => {
    setFormData(prev => ({
      ...prev,
      costProposal: [...prev.costProposal, { item: "", cost: 0 }]
    }));
  };

  const removeCostItem = (index) => {
    if (formData.costProposal.length === 1) return;
    setFormData(prev => ({
      ...prev,
      costProposal: prev.costProposal.filter((_, idx) => idx !== index)
    }));
  };

  // Dynamic team handlers
  const handleTeamMemberChange = (index, field, value) => {
    const updated = formData.team.map((t, idx) => {
      if (idx === index) {
        return { ...t, [field]: value };
      }
      return t;
    });
    setFormData(prev => ({ ...prev, team: updated }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, { name: "", role: "" }]
    }));
  };

  const removeTeamMember = (index) => {
    if (formData.team.length === 1) return;
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter((_, idx) => idx !== index)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submission actions
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.declarationSigned) {
      addToast("Please read and sign the declaration agreement before submitting", "warning");
      return;
    }
    
    submitApplication(formData);
    addToast("Application proposal successfully submitted to government review panel!", "success");
    navigate('/startup/dashboard');
  };

  const handleSaveDraft = () => {
    addToast("Application draft saved successfully.", "success");
    navigate('/startup/dashboard');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/startup/challenges')} className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-650" />
        </button>
        <div className="text-left">
          <h2 className="text-xl font-bold text-slate-800 tracking-wide">Submit Solution Proposal</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Challenge: {challengeObj?.title || "Target Challenge"}</p>
        </div>
      </div>

      {/* Stepper progress */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[640px]">
          {[
            { num: 1, label: "Company Profile" },
            { num: 2, label: "Proposed Solution" },
            { num: 3, label: "Team Members" },
            { num: 4, label: "Cost Proposal" },
            { num: 5, label: "Sign & Submit" }
          ].map((s) => (
            <React.Fragment key={s.num}>
              {s.num > 1 && <div className={`flex-1 h-0.5 mx-4 ${step >= s.num ? "bg-blue-600" : "bg-slate-200"}`} />}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === s.num
                    ? "bg-blue-600 text-white"
                    : step > s.num
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}>
                  {s.num}
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${step === s.num ? "text-slate-800" : "text-slate-400"}`}>{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step panels content */}
      <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm text-left">
        
        {/* STEP 1: Company Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 1: Startup Verification Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-205 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Incorporation & Registration Details *</label>
                <input
                  type="text"
                  name="registrationDetails"
                  value={formData.registrationDetails}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-205 rounded-lg text-xs font-semibold text-slate-850"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Startup Recognition Info (DPIIT) *</label>
                <input
                  type="text"
                  name="recognition"
                  value={formData.recognition}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-205 rounded-lg text-xs font-semibold text-slate-850"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Industry Sector</label>
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  readOnly
                  className="w-full px-3.5 py-2 border border-slate-205 bg-slate-50 rounded-lg text-xs font-bold text-slate-550 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Proposed Solution */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 2: Technical Solution Architecture</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Solution Description *</label>
                <textarea
                  name="solutionDescription"
                  required
                  rows={4}
                  value={formData.solutionDescription}
                  onChange={handleInputChange}
                  placeholder="Detail your solution's core architecture, hardware kits, and local deployment mechanics."
                  className="w-full px-3.5 py-2 border border-slate-205 rounded-lg text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proposed Technologies *</label>
                <input
                  type="text"
                  name="proposedTechnology"
                  value={formData.proposedTechnology}
                  onChange={handleInputChange}
                  placeholder="e.g. Edge ML on Android, Bluetooth sensor kits"
                  className="w-full px-3.5 py-2 border border-slate-205 rounded-lg text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Implementation & Site Setup Plan (Sandbox Timeline) *</label>
                <textarea
                  name="implementationPlan"
                  required
                  rows={3}
                  value={formData.implementationPlan}
                  onChange={handleInputChange}
                  placeholder="e.g. Month 1: Hardware deployment. Month 2: Training staff. Months 3-6: Operation."
                  className="w-full px-3.5 py-2 border border-slate-205 rounded-lg text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Efficacy Impact *</label>
                <textarea
                  name="expectedImpact"
                  required
                  rows={2}
                  value={formData.expectedImpact}
                  onChange={handleInputChange}
                  placeholder="How will this directly address the challenge targets?"
                  className="w-full px-3.5 py-2 border border-slate-205 rounded-lg text-xs font-medium text-slate-850"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Team & Experience */}
        {step === 3 && (
          <div className="space-y-6">
            
            {/* Team members */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Core Team Bios</h3>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Member
                </button>
              </div>

              <div className="space-y-3">
                {formData.team.map((member, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 border border-slate-100 rounded-xl">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(idx, "name", e.target.value)}
                        className="w-full px-2 py-1 border border-slate-205 bg-white rounded-lg text-xs font-semibold text-slate-805 focus:outline-hidden"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Role / Bio</label>
                      <input
                        type="text"
                        required
                        value={member.role}
                        onChange={(e) => handleTeamMemberChange(idx, "role", e.target.value)}
                        className="w-full px-2 py-1 border border-slate-205 bg-white rounded-lg text-xs font-semibold text-slate-805 focus:outline-hidden"
                      />
                    </div>
                    {formData.team.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(idx)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors mt-4 self-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Prior Deployments & Certifications</h3>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Summarize Deployments Experience</label>
                <textarea
                  name="experience"
                  rows={2}
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-205 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Regulatory Certifications (e.g. ISO, HIPAA, CDSCO)</label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-205 rounded-lg text-xs font-semibold text-slate-850 focus:outline-hidden"
                />
              </div>
            </div>

          </div>
        )}

        {/* STEP 4: Cost Proposal */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Financial Cost Breakdown</h3>
              <button
                type="button"
                onClick={addCostItem}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Cost Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.costProposal.map((cost, idx) => (
                <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 border border-slate-150 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Budget Line Item Description</label>
                    <input
                      type="text"
                      required
                      value={cost.item}
                      onChange={(e) => handleCostItemChange(idx, "item", e.target.value)}
                      placeholder="e.g. Sensor integration kits"
                      className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 font-semibold focus:outline-hidden"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Allocated Cost ($)</label>
                    <input
                      type="number"
                      required
                      value={cost.cost}
                      onChange={(e) => handleCostItemChange(idx, "cost", e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                  </div>
                  {formData.costProposal.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCostItem(idx)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-105 transition-colors mt-4 self-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Sum total display */}
            <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl border border-slate-800 mt-6 font-semibold">
              <span className="text-xs uppercase font-bold text-slate-400">Total Proposed Budget Cost:</span>
              <span className="text-lg font-black text-blue-400">${totalProposedCost.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* STEP 5: Declaration & Submit */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 5: Review & Security Declaration</h3>
            
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-4 text-xs font-semibold text-slate-650 leading-relaxed">
              <p>
                Please verify that the proposed solution matches all required parameters:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Estimated Budget is within the challenge limits: <strong>${challengeObj?.budget.toLocaleString() || "0"}</strong></li>
                <li>Technologies meet operational mandates: <strong>{formData.proposedTechnology}</strong></li>
                <li>All documents submitted are authentic records.</li>
              </ul>
              
              <div className="border-t border-slate-200 pt-4 mt-2">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wide mb-2">Legal Covenants Checklist</h4>
                <div className="space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.declarationSigned}
                      onChange={(e) => setFormData(prev => ({ ...prev, declarationSigned: e.target.checked }))}
                      className="h-4.5 w-4.5 text-blue-650 focus:ring-blue-500 border-slate-300 rounded-sm mt-0.5 shrink-0"
                    />
                    <span className="text-slate-600 font-semibold leading-snug">
                      We declare that our company will comply with standard data governance laws, local storage mandates, and submit physical telemetry nodes for validator audit tests.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-900 leading-normal font-semibold">
                Submit this application to place it on the Government Screening Board immediately. You will receive notifications regarding updates.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Stepper control buttons */}
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
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-205 bg-white rounded-lg text-xs font-bold text-slate-705 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            Save Draft
          </button>
          
          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default ApplicationForm;
