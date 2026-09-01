import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Scale,
  Award,
  Building2,
  Download,
  FileText,
  ShieldCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';
import EmptyState from '../../components/Common/EmptyState';
import ChartCard from '../../components/Common/ChartCard';

const GovApplications = () => {
  const {
    applications,
    challenges,
    STARTUPS,
    updateApplicationStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('list'); // list, comparison
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChallengeFilter, setSelectedChallengeFilter] = useState('All');
  const [selectedEligibilityFilter, setSelectedEligibilityFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Drawer / Modal States
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusUpdateComment, setStatusUpdateComment] = useState('');

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChallenge =
      selectedChallengeFilter === 'All' || app.challengeId === selectedChallengeFilter;
    const matchesEligibility =
      selectedEligibilityFilter === 'All' || app.eligibility === selectedEligibilityFilter;
    const matchesStatus =
      selectedStatusFilter === 'All' || app.status === selectedStatusFilter;

    return matchesSearch && matchesChallenge && matchesEligibility && matchesStatus;
  });

  // Shortlisted Startups for Comparison Matrix
  const shortlistedApps = applications.filter(
    (app) => app.status === 'Shortlisted' || app.status === 'Selected' || app.scores?.overallScore > 0
  );

  const handleStatusChange = (newStatus) => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, newStatus, statusUpdateComment);
    setSelectedApp(prev => ({ ...prev, status: newStatus }));
    setStatusUpdateComment('');
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            <span>Applications & Expert Evaluations</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Applications & Evaluation Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Screen technical proposals, inspect expert scorecards, and compare shortlisted startups.
          </p>
        </div>

        {/* Tab switch between Applications Table & Startup Comparison */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Applications Table ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Startup Comparison ({shortlistedApps.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <>
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by startup or challenge..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Challenge Filter */}
              <div>
                <select
                  value={selectedChallengeFilter}
                  onChange={(e) => setSelectedChallengeFilter(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="All">All Challenges ({challenges.length})</option>
                  {challenges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.title.slice(0, 32)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Eligibility Filter */}
              <div>
                <select
                  value={selectedEligibilityFilter}
                  onChange={(e) => setSelectedEligibilityFilter(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="All">All Eligibility</option>
                  <option value="Eligible">Eligible</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Ineligible">Ineligible</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="All">All Application Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Evaluation">Under Evaluation</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                Showing <strong>{filteredApps.length}</strong> of{' '}
                <strong>{applications.length}</strong> Startup Proposals
              </div>
              {(searchTerm || selectedChallengeFilter !== 'All' || selectedEligibilityFilter !== 'All' || selectedStatusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedChallengeFilter('All');
                    setSelectedEligibilityFilter('All');
                    setSelectedStatusFilter('All');
                  }}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* APPLICATION TABLE */}
          {filteredApps.length === 0 ? (
            <EmptyState
              title="No applications match your filter criteria"
              description="Adjust the filter settings or search query to find startup submissions."
            />
          ) : (
            <div className="gov-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse gov-table">
                  <thead>
                    <tr>
                      <th>Startup</th>
                      <th>Challenge</th>
                      <th>Application Date</th>
                      <th>Eligibility</th>
                      <th>Expert Score</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((app) => {
                      const score = app.scores?.overallScore || 0;
                      return (
                        <tr key={app.id}>
                          {/* Startup */}
                          <td>
                            <div className="font-bold text-slate-900 text-sm">
                              {app.startupName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {app.id}
                            </div>
                          </td>

                          {/* Challenge */}
                          <td>
                            <div className="text-xs text-slate-800 font-medium max-w-xs line-clamp-1">
                              {app.challengeTitle}
                            </div>
                            <div className="text-[10px] text-blue-700 font-semibold">
                              {app.department}
                            </div>
                          </td>

                          {/* Application Date */}
                          <td>
                            <span className="text-xs text-slate-600 font-medium">
                              {app.submittedDate}
                            </span>
                          </td>

                          {/* Eligibility */}
                          <td>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                app.eligibility === 'Eligible'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : app.eligibility === 'Ineligible'
                                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {app.eligibility}
                            </span>
                          </td>

                          {/* Expert Score */}
                          <td>
                            {score > 0 ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-sm">
                                  {score}
                                </span>
                                <span className="text-xs text-slate-400">/10</span>
                                {score >= 8.5 && (
                                  <Award className="w-3.5 h-3.5 text-amber-500" />
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                Pending Scoring
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td>
                            <Badge status={app.status} size="sm" />
                          </td>

                          {/* Action */}
                          <td className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Eye}
                              onClick={() => setSelectedApp(app)}
                            >
                              Review
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
        </>
      ) : (
        /* STARTUP COMPARISON INTERFACE FOR SHORTLISTED APPLICANTS */
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-blue-950">
                  Shortlisted Startups Multi-Criteria Comparison Matrix
                </h3>
                <p className="text-xs text-blue-800 mt-0.5">
                  Side-by-side evaluation comparison on Technical Feasibility, Innovation, Cost Effectiveness, Scalability, and Risk.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-white text-blue-900 font-bold text-xs border border-blue-300">
              {shortlistedApps.length} Candidates
            </span>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {shortlistedApps.map((app) => {
              const s = app.scores || {};
              const startupInfo = STARTUPS.find((st) => st.id === app.startupId) || {};

              return (
                <div
                  key={app.id}
                  className="gov-card p-5 flex flex-col justify-between border-2 border-slate-200 hover:border-blue-400 transition-all shadow-xs"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {app.id}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">
                          {app.startupName}
                        </h3>
                        <p className="text-[11px] text-blue-700 font-semibold">
                          {startupInfo.recognition || 'DPIIT Startup'}
                        </p>
                      </div>
                      <Badge status={app.status} size="sm" />
                    </div>

                    <div className="text-xs text-slate-600 line-clamp-2 mt-1 mb-3">
                      <strong>Challenge:</strong> {app.challengeTitle}
                    </div>

                    {/* Overall Score Badge */}
                    <div className="bg-slate-900 text-white rounded-lg p-3 flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Weighted Overall Score
                        </span>
                        <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                          {s.overallScore || 'N/A'}
                          <span className="text-xs text-slate-400 font-normal">/ 10</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Est. Cost</span>
                        <span className="text-xs font-bold text-emerald-400">
                          {app.estimatedCost}
                        </span>
                      </div>
                    </div>

                    {/* Multi-Criteria Score Breakdown */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-600 mb-0.5">
                          <span>Technical Feasibility</span>
                          <strong className="text-slate-900">{s.technicalFeasibility || 0}/10</strong>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${(s.technicalFeasibility || 0) * 10}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 mb-0.5">
                          <span>Innovation & Uniqueness</span>
                          <strong className="text-slate-900">{s.innovation || 0}/10</strong>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${(s.innovation || 0) * 10}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 mb-0.5">
                          <span>Cost Effectiveness</span>
                          <strong className="text-slate-900">{s.costEffectiveness || 0}/10</strong>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-emerald-600 h-1.5 rounded-full"
                            style={{ width: `${(s.costEffectiveness || 0) * 10}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 mb-0.5">
                          <span>Scalability & Deployment</span>
                          <strong className="text-slate-900">{s.scalability || 0}/10</strong>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: `${(s.scalability || 0) * 10}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 mb-0.5">
                          <span>Risk & Robustness</span>
                          <strong className="text-slate-900">{s.risk || 0}/10</strong>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-amber-600 h-1.5 rounded-full"
                            style={{ width: `${(s.risk || 0) * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recommendation snippet */}
                    {app.expertRecommendation && (
                      <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 italic">
                        "{app.expertRecommendation}"
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setSelectedApp(app)}
                    >
                      View Full Dossier
                    </Button>
                    {app.status !== 'Selected' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          updateApplicationStatus(app.id, 'Selected');
                        }}
                      >
                        Select for Pilot
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* APPLICATION DETAILS MODAL / DRAWER */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Proposal Dossier: ${selectedApp.startupName}`}
          subtitle={`${selectedApp.id} • ${selectedApp.challengeTitle}`}
          maxWidth="max-w-4xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  Current Status:
                </span>
                <Badge status={selectedApp.status} size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApp(null)}
                >
                  Close
                </Button>
                {selectedApp.status !== 'Shortlisted' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-500 text-amber-800 hover:bg-amber-50"
                    onClick={() => handleStatusChange('Shortlisted')}
                  >
                    Shortlist
                  </Button>
                )}
                {selectedApp.status !== 'Selected' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStatusChange('Selected')}
                  >
                    Select for Pilot Award
                  </Button>
                )}
                {selectedApp.status !== 'Rejected' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStatusChange('Rejected')}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            {/* Startup Information Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Startup Information
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Startup Entity</span>
                  <span className="font-semibold text-slate-900">{selectedApp.startupName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">DPIIT Status</span>
                  <span className="font-semibold text-emerald-700">Verified (DPIIT Recognized)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Eligibility Result</span>
                  <Badge status={selectedApp.eligibility} size="sm" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Estimated Pilot Cost</span>
                  <span className="font-bold text-slate-900">{selectedApp.estimatedCost}</span>
                </div>
              </div>
            </div>

            {/* Problem & Proposed Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Problem Addressed
                </h4>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedApp.challengeTitle}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Proposed Solution
                </h4>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedApp.proposedSolution}
                </div>
              </div>
            </div>

            {/* Technical Details & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Technical Architecture & Approach
                </h4>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedApp.technicalApproach}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Expected Operational Impact
                </h4>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedApp.expectedImpact}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Attached Technical Documents & Certifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(selectedApp.documents || [
                  { name: 'Technical_Proposal.pdf', size: '4.2 MB' },
                  { name: 'Financial_Costing_DPR.pdf', size: '1.8 MB' },
                  { name: 'DPIIT_Registration.pdf', size: '1.1 MB' }
                ]).map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-medium text-slate-800 truncate text-xs">
                        {doc.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{doc.size || '2.4 MB'}</div>
                    </div>
                    <button
                      onClick={() => alert(`Simulated Download: ${doc.name}`)}
                      className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Expert Evaluation & Scores Breakdown */}
            <div className="bg-slate-900 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="font-bold uppercase tracking-wider text-xs text-white">
                    Expert Evaluation Scorecard
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Evaluated by: <strong className="text-white">{selectedApp.evaluatedBy || 'Technical Committee'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-3 text-center">
                <div className="bg-slate-800 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block uppercase">Tech Feasibility</span>
                  <span className="text-base font-bold text-white">{selectedApp.scores?.technicalFeasibility || 0}</span>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block uppercase">Innovation</span>
                  <span className="text-base font-bold text-white">{selectedApp.scores?.innovation || 0}</span>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block uppercase">Cost Effect.</span>
                  <span className="text-base font-bold text-white">{selectedApp.scores?.costEffectiveness || 0}</span>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block uppercase">Scalability</span>
                  <span className="text-base font-bold text-white">{selectedApp.scores?.scalability || 0}</span>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block uppercase">Risk</span>
                  <span className="text-base font-bold text-white">{selectedApp.scores?.risk || 0}</span>
                </div>
                <div className="bg-blue-600 p-2 rounded text-white">
                  <span className="text-[10px] text-blue-200 block uppercase font-bold">Overall Score</span>
                  <span className="text-base font-bold text-white">{selectedApp.scores?.overallScore || 0} / 10</span>
                </div>
              </div>

              {selectedApp.expertRecommendation && (
                <div className="text-xs text-slate-200 bg-slate-800/80 p-2.5 rounded border border-slate-700">
                  <strong>Evaluator Recommendation:</strong> {selectedApp.expertRecommendation}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GovApplications;
