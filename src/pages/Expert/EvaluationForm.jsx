import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Save, Star, Award, ShieldAlert } from 'lucide-react';

const EvaluationForm = () => {
  const { applicationId } = useParams();
  const { applications, challenges, submitEvaluation, addToast } = useApp();
  const navigate = useNavigate();

  const app = applications.find(a => a.id === applicationId) || applications[0];
  const challenge = challenges.find(c => c.id === app?.challengeId) || {
    title: "Challenge",
    evaluationCriteria: [
      { criterion: "Problem Understanding", weight: 0.15 },
      { criterion: "Technical Feasibility", weight: 0.20 },
      { criterion: "Innovation", weight: 0.15 },
      { criterion: "Scalability", weight: 0.15 },
      { criterion: "Cost Effectiveness", weight: 0.15 },
      { criterion: "Team Capability", weight: 0.10 },
      { criterion: "Security", weight: 0.10 }
    ]
  };

  const startupName = app?.startupName || (app?.startups?.name) || "Startup Proposer";

  // Score states
  const [scores, setScores] = useState({
    problemUnderstanding: 85,
    technicalFeasibility: 80,
    innovation: 85,
    scalability: 85,
    costEffectiveness: 80,
    teamCapability: 90,
    security: 85
  });

  const [comments, setComments] = useState("");
  const [recommendation, setRecommendation] = useState("Recommend"); // Recommend, Reject

  const handleScoreChange = (criterionKey, val) => {
    const valNum = Math.min(Math.max(parseInt(val) || 0, 0), 100);
    setScores(prev => ({ ...prev, [criterionKey]: valNum }));
  };

  // Helper mapping key to criteria weights
  const getWeight = (criterionName) => {
    const critObj = challenge.evaluationCriteria.find(
      c => c.criterion.toLowerCase().replace(/\s/g, '') === criterionName.toLowerCase().replace(/\s/g, '')
    );
    return critObj ? critObj.weight : 0.15;
  };

  // Calculate Overall Weighted Score
  const calculateOverallScore = () => {
    const s = scores;
    const weightedSum =
      (s.problemUnderstanding * getWeight("Problem Understanding")) +
      (s.technicalFeasibility * getWeight("Technical Feasibility")) +
      (s.innovation * getWeight("Innovation")) +
      (s.scalability * getWeight("Scalability")) +
      (s.costEffectiveness * getWeight("Cost Effectiveness")) +
      (s.teamCapability * getWeight("Team Capability")) +
      (s.security * getWeight("Security"));
    return Math.round(weightedSum);
  };

  const overallScore = calculateOverallScore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      addToast("Please provide summary evaluation feedback remarks", "warning");
      return;
    }

    const evalData = {
      applicationId: app?.id,
      scores,
      comments,
      recommendation,
      overallScore
    };

    submitEvaluation(evalData);
    addToast(`Evaluation submitted. Total Weighted Score: ${overallScore}/100`, "success");
    navigate('/expert/dashboard');
  };

  const handleSaveDraft = () => {
    addToast("Evaluation scorecard draft successfully saved.", "success");
    navigate('/expert/dashboard');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-left">
      
      {/* Title */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/expert/dashboard')} className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-650" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-wide">Expert Proposal Evaluation</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Proposer: {startupName} | Challenge: {challenge.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Proposal Details block */}
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Proposal Overview</h3>
          <div className="text-xs font-semibold text-slate-600 space-y-3">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Proposed Solution Description</span>
              <p className="text-slate-700 leading-relaxed mt-1">{app?.solutionDescription || "A low-bandwidth telemedicine kit."}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-slate-400 text-[10px] block uppercase">Technology Stack</span><span className="text-slate-800">{app?.proposedTechnology}</span></div>
              <div><span className="text-slate-400 text-[10px] block uppercase">Implementation sandbox</span><span className="text-slate-800">{app?.implementationPlan}</span></div>
            </div>
          </div>
        </div>

        {/* Scoring Grid */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-850 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-blue-600" />
              Scoring Matrix (Scale 0-100)
            </h3>
            
            <span className="text-sm font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl">
              Weighted Grade: {overallScore} / 100
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: "problemUnderstanding", label: "Problem Understanding", weight: getWeight("Problem Understanding") },
              { key: "technicalFeasibility", label: "Technical Feasibility", weight: getWeight("Technical Feasibility") },
              { key: "innovation", label: "Innovation & Originality", weight: getWeight("Innovation") },
              { key: "scalability", label: "Operational Scalability", weight: getWeight("Scalability") },
              { key: "costEffectiveness", label: "Cost Effectiveness", weight: getWeight("Cost Effectiveness") },
              { key: "teamCapability", label: "Team & Deploy Capability", weight: getWeight("Team Capability") },
              { key: "security", label: "Cybersecurity & Data Privacy", weight: getWeight("Security") }
            ].map((crit) => (
              <div key={crit.key} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="font-bold text-slate-800 text-xs block leading-none">{crit.label}</span>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-1.5 uppercase">Weight: {(crit.weight * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    value={scores[crit.key]}
                    onChange={(e) => handleScoreChange(crit.key, e.target.value)}
                    className="w-16 px-2 py-1 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-800 text-center focus:outline-hidden"
                  />
                  <span className="text-xs text-slate-400 font-semibold">/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback comments */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Expert Feedback Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Directive selection */}
            <div className="md:col-span-1 space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Directive</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer text-xs font-bold hover:bg-slate-50">
                  <input
                    type="radio"
                    name="recommendation"
                    checked={recommendation === "Recommend"}
                    onChange={() => setRecommendation("Recommend")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  Recommend Pilot
                </label>
                <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer text-xs font-bold hover:bg-slate-50">
                  <input
                    type="radio"
                    name="recommendation"
                    checked={recommendation === "Reject"}
                    onChange={() => setRecommendation("Reject")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  Reject Proposal
                </label>
              </div>
            </div>

            {/* Feedback textarea */}
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Review Summary Remarks *</label>
              <textarea
                required
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide a brief review summary detailing technical compliance, cost concerns, or security limitations."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500"
              />
            </div>

          </div>
        </div>

        {/* Controls footer */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 border border-slate-200 bg-white font-bold text-xs uppercase tracking-wider text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-md cursor-pointer transition-colors"
          >
            Submit Scorecard
          </button>
        </div>

      </form>

    </div>
  );
};

export default EvaluationForm;
