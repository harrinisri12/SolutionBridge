import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  Search,
  Eye,
  Award,
  Sliders,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  Download,
  Check,
  Star,
  ShieldCheck
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';
import EmptyState from '../../components/Common/EmptyState';

const ExpertEvaluation = () => {
  const { applications, submitExpertEvaluation } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  // Scoring Form State (1–10 Scale)
  const [scores, setScores] = useState({
    technicalFeasibility: 8.5,
    innovation: 8.0,
    costEffectiveness: 8.0,
    scalability: 8.5,
    risk: 8.0
  });
  const [recommendation, setRecommendation] = useState('');

  // Calculate Weighted Overall Score (out of 10)
  const overallScore = (
    scores.technicalFeasibility * 0.25 +
    scores.innovation * 0.2 +
    scores.costEffectiveness * 0.2 +
    scores.scalability * 0.2 +
    scores.risk * 0.15
  ).toFixed(2);

  const handleOpenReview = (app) => {
    setSelectedApp(app);
    if (app.scores?.overallScore > 0) {
      setScores({
        technicalFeasibility: app.scores.technicalFeasibility || 8.5,
        innovation: app.scores.innovation || 8.0,
        costEffectiveness: app.scores.costEffectiveness || 8.0,
        scalability: app.scores.scalability || 8.5,
        risk: app.scores.risk || 8.0
      });
      setRecommendation(app.expertRecommendation || '');
    } else {
      setScores({
        technicalFeasibility: 8.0,
        innovation: 8.0,
        costEffectiveness: 8.0,
        scalability: 8.0,
        risk: 8.0
      });
      setRecommendation('');
    }
  };

  const handleScoreSubmit = (actionType) => {
    if (!selectedApp) return;
    submitExpertEvaluation(selectedApp.id, scores, recommendation, actionType);
    setSelectedApp(null);
  };

  const filteredApps = applications.filter((app) => {
    return (
      app.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <ClipboardList className="w-4 h-4 text-purple-600" />
            <span>Technical Screening Panel</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Proposal Evaluation & Scoring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit startup dossiers and score proposals across 5 dimensions using the standardized 1–10 rubric.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter assigned applications by startup or challenge..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* ASSIGNED APPLICATIONS TABLE */}
      {filteredApps.length === 0 ? (
        <EmptyState
          title="No applications in queue"
          description="All assigned proposals have been evaluated."
        />
      ) : (
        <div className="gov-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse gov-table">
              <thead>
                <tr>
                  <th>Startup</th>
                  <th>Challenge</th>
                  <th>Submission Date</th>
                  <th>Evaluation Status</th>
                  <th>Overall Score</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => {
                  const hasScore = app.scores?.overallScore > 0;
                  return (
                    <tr key={app.id}>
                      <td>
                        <div className="font-bold text-slate-900 text-sm">
                          {app.startupName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {app.id}
                        </div>
                      </td>
                      <td>
                        <div className="text-xs text-slate-800 font-medium max-w-md line-clamp-1">
                          {app.challengeTitle}
                        </div>
                        <div className="text-[10px] text-blue-700 font-semibold">
                          {app.department}
                        </div>
                      </td>
                      <td>
                        <span className="text-xs text-slate-600">
                          {app.submittedDate}
                        </span>
                      </td>
                      <td>
                        <Badge
                          status={hasScore ? 'Evaluated' : 'Pending Evaluation'}
                          size="sm"
                        />
                      </td>
                      <td>
                        {hasScore ? (
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                            <span>{app.scores.overallScore}</span>
                            <span className="text-slate-400 text-xs">/ 10</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Unscored
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <Button
                          variant={hasScore ? 'outline' : 'secondary'}
                          size="sm"
                          onClick={() => handleOpenReview(app)}
                        >
                          {hasScore ? 'Edit Scorecard' : 'Evaluate'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPLICATION REVIEW & SCORING MODAL */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Evaluation Scorecard: ${selectedApp.startupName}`}
          subtitle={`Challenge: ${selectedApp.challengeTitle} • ${selectedApp.id}`}
          maxWidth="max-w-4xl"
          footer={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">
                  Computed Weighted Score:
                </span>
                <span className="text-base font-bold text-slate-900">
                  {overallScore} / 10
                </span>
              </div>

              {/* Action Buttons: Shortlist, Reject, Recommend */}
              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleScoreSubmit('Reject')}
                >
                  Reject Proposal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-500 text-amber-800 hover:bg-amber-50"
                  onClick={() => handleScoreSubmit('Shortlist')}
                >
                  Shortlist for Presentation
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleScoreSubmit('Recommend')}
                >
                  Recommend for Pilot Award
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            {/* 1. Startup & Proposal Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Applicant Startup
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {selectedApp.startupName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Estimated Budget
                  </span>
                  <span className="text-sm font-bold text-emerald-800">
                    {selectedApp.estimatedCost}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-0.5">
                  Proposed Solution Description:
                </span>
                <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                  {selectedApp.proposedSolution}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-0.5">
                  Technical Architecture & Implementation Approach:
                </span>
                <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                  {selectedApp.technicalApproach}
                </p>
              </div>

              {/* Documents */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">
                  Attached Technical Evidence & Compliance Documents:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(selectedApp.documents || [
                    { name: 'Technical_Proposal.pdf', size: '4.2 MB' },
                    { name: 'Financial_Costing_DPR.pdf', size: '1.8 MB' }
                  ]).map((doc, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded flex items-center gap-2 text-[11px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-medium text-slate-800">{doc.name}</span>
                      <button
                        onClick={() => alert(`Simulated downloading: ${doc.name}`)}
                        className="text-blue-600 hover:text-blue-800 font-bold ml-1 cursor-pointer"
                      >
                        ↓
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. 1–10 SCORING INTERFACE ACROSS 5 DIMENSIONS */}
            <div className="gov-card p-4 border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Multi-Criteria Scoring Rubric (1 to 10 Scale)
                </h4>
                <div className="bg-slate-900 text-white px-3 py-1 rounded-md text-xs font-bold">
                  Overall: {overallScore} / 10
                </div>
              </div>

              {/* 1. Technical Feasibility (25% Weight) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    1. Technical Feasibility (Weight: 25%)
                  </span>
                  <strong className="text-blue-700 text-sm">
                    {scores.technicalFeasibility} / 10
                  </strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={scores.technicalFeasibility}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      technicalFeasibility: parseFloat(e.target.value)
                    }))
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Assesses hardware reliability, sensor accuracy, and integration readiness.
                </span>
              </div>

              {/* 2. Innovation (20% Weight) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    2. Innovation & Technology Uniqueness (Weight: 20%)
                  </span>
                  <strong className="text-indigo-700 text-sm">
                    {scores.innovation} / 10
                  </strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={scores.innovation}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      innovation: parseFloat(e.target.value)
                    }))
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Novel IP, proprietary edge algorithms, and anti-biofouling mechanisms.
                </span>
              </div>

              {/* 3. Cost Effectiveness (20% Weight) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    3. Cost Effectiveness & ROI (Weight: 20%)
                  </span>
                  <strong className="text-emerald-700 text-sm">
                    {scores.costEffectiveness} / 10
                  </strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={scores.costEffectiveness}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      costEffectiveness: parseFloat(e.target.value)
                    }))
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Capital expenditure, recurring maintenance costs vs legacy municipal methods.
                </span>
              </div>

              {/* 4. Scalability (20% Weight) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    4. Scalability & Manufacturing Capacity (Weight: 20%)
                  </span>
                  <strong className="text-purple-700 text-sm">
                    {scores.scalability} / 10
                  </strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={scores.scalability}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      scalability: parseFloat(e.target.value)
                    }))
                  }
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Statewide rollout feasibility across 100+ urban and rural zones.
                </span>
              </div>

              {/* 5. Risk & Robustness (15% Weight) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    5. Risk Mitigation & Cyber Safety (Weight: 15%)
                  </span>
                  <strong className="text-amber-700 text-sm">
                    {scores.risk} / 10
                  </strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={scores.risk}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      risk: parseFloat(e.target.value)
                    }))
                  }
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">
                  Data encryption, environmental weatherproofing, and supply chain vulnerability.
                </span>
              </div>
            </div>

            {/* 3. Evaluator Recommendation Text Field */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Official Recommendation Comments *
              </label>
              <textarea
                rows={3}
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Enter technical justification, specific pilot trial recommendations, or rejection grounds..."
                className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpertEvaluation;
