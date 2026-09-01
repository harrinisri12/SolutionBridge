import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  Search,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  FileCheck2,
  DollarSign,
  UploadCloud,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';
import EmptyState from '../../components/Common/EmptyState';

const CATEGORY_CHIPS = [
  'All',
  'Water',
  'Healthcare',
  'Agriculture',
  'Transport',
  'Energy',
  'Waste Management',
  'Public Safety'
];

const StartupChallenges = () => {
  const { challenges, DEPARTMENTS, applications, submitApplication, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  // Modal States
  const [viewChallenge, setViewChallenge] = useState(null);
  const [applyChallenge, setApplyChallenge] = useState(null);

  // Application Form State
  const [appForm, setAppForm] = useState({
    startupName: currentUser.startupName || 'AquaTech Solutions',
    startupId: currentUser.startupId || 'startup-1',
    solutionDescription: '',
    technicalApproach: '',
    expectedImpact: '',
    estimatedCost: '₹ 80,00,000',
    documents: [
      { name: 'Technical_Proposal_Deck.pdf', size: '3.8 MB' },
      { name: 'DPIIT_Registration_Certificate.pdf', size: '1.2 MB' }
    ]
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!appForm.solutionDescription || !appForm.technicalApproach) {
      alert('Please fill out the Solution Description and Technical Approach.');
      return;
    }

    submitApplication({
      challengeId: applyChallenge.id,
      challengeTitle: applyChallenge.title,
      department: applyChallenge.department,
      category: applyChallenge.category,
      startupName: appForm.startupName,
      startupId: appForm.startupId,
      proposedSolution: appForm.solutionDescription,
      technicalApproach: appForm.technicalApproach,
      expectedImpact: appForm.expectedImpact,
      estimatedCost: appForm.estimatedCost,
      documents: appForm.documents
    });

    setApplyChallenge(null);
    setViewChallenge(null);
    setAppForm({
      startupName: currentUser.startupName || 'AquaTech Solutions',
      startupId: currentUser.startupId || 'startup-1',
      solutionDescription: '',
      technicalApproach: '',
      expectedImpact: '',
      estimatedCost: '₹ 80,00,000',
      documents: [
        { name: 'Technical_Proposal_Deck.pdf', size: '3.8 MB' },
        { name: 'DPIIT_Registration_Certificate.pdf', size: '1.2 MB' }
      ]
    });
  };

  // Filtered Challenges
  const filteredChallenges = challenges.filter((ch) => {
    const matchesSearch =
      ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.problemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategoryChip === 'All' || ch.category === selectedCategoryChip;
    const matchesDept =
      selectedDeptFilter === 'All' || ch.department === selectedDeptFilter;

    return matchesSearch && matchesCategory && matchesDept;
  });

  // Check if startup already applied
  const getApplicationStatus = (challengeId) => {
    const existing = applications.find(
      (a) =>
        a.challengeId === challengeId &&
        (a.startupName === currentUser.startupName || a.startupId === currentUser.startupId)
    );
    return existing ? existing.status : null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Innovation Procurement Discovery</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Government Challenges & Problem Statements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover verified public sector problems with sanctioned pilot funding and scale-up procurement potential.
          </p>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Filter by Sector Category:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setSelectedCategoryChip(chip)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategoryChip === chip
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Department Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search challenges by keyword or problem statement..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      {filteredChallenges.length === 0 ? (
        <EmptyState
          title="No challenges found in this category"
          description="Try selecting 'All' or adjust your keyword search."
          actionLabel="View All Challenges"
          onAction={() => {
            setSelectedCategoryChip('All');
            setSearchTerm('');
            setSelectedDeptFilter('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChallenges.map((ch) => {
            const appStatus = getApplicationStatus(ch.id);

            return (
              <div
                key={ch.id}
                className="gov-card gov-card-hover p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {ch.category}
                    </span>
                    {appStatus ? (
                      <Badge status={appStatus} size="sm" />
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Open for Applications
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {ch.title}
                  </h3>

                  <p className="text-xs font-semibold text-blue-700 mt-1">
                    {ch.department}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 mt-2.5 leading-relaxed">
                    {ch.problemDescription}
                  </p>

                  {/* Eligibility Snippet */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                    <strong className="text-slate-900 block mb-0.5">Eligibility:</strong>
                    <span className="line-clamp-2">{ch.eligibilityCriteria || 'DPIIT recognized startups with proven prototypes.'}</span>
                  </div>
                </div>

                {/* Footer Metadata & CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline: <strong>{ch.deadline}</strong></span>
                    </div>
                    <div className="font-bold text-emerald-800">
                      {ch.budget}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-semibold text-xs"
                    icon={Eye}
                    onClick={() => setViewChallenge(ch)}
                  >
                    View Challenge
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHALLENGE DETAILS MODAL */}
      {viewChallenge && (
        <Modal
          isOpen={!!viewChallenge}
          onClose={() => setViewChallenge(null)}
          title={viewChallenge.title}
          subtitle={`${viewChallenge.id} • ${viewChallenge.department}`}
          maxWidth="max-w-3xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                onClick={() => setViewChallenge(null)}
              >
                Close
              </Button>

              {getApplicationStatus(viewChallenge.id) ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">
                    Application Status:
                  </span>
                  <Badge status={getApplicationStatus(viewChallenge.id)} size="sm" />
                </div>
              ) : (
                <Button
                  variant="secondary"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => {
                    setApplyChallenge(viewChallenge);
                  }}
                >
                  Apply for Challenge
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Category
                </span>
                <span className="font-semibold text-slate-800 text-sm">
                  {viewChallenge.category}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Deadline
                </span>
                <span className="font-semibold text-slate-800 text-sm">
                  {viewChallenge.deadline}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Sanctioned Pilot Budget
                </span>
                <span className="font-semibold text-emerald-800 text-sm">
                  {viewChallenge.budget}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Pilot Duration
                </span>
                <span className="font-semibold text-slate-800 text-sm">
                  {viewChallenge.pilotDuration || '6 Months'}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                Problem Statement & Operational Bottlenecks
              </h4>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
                {viewChallenge.problemDescription}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                Expected Solution & Deliverables
              </h4>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
                {viewChallenge.expectedSolution || 'High-accuracy automated telemetry and diagnostic hardware/software.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Eligibility Criteria
                </h4>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700">
                  {viewChallenge.eligibilityCriteria || 'DPIIT recognized startups with TRL-7 prototype.'}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Required Technology
                </h4>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700">
                  {viewChallenge.requiredTechnology || 'IoT, Edge AI, Telemetry, Cloud'}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                Pilot Information & Scope
              </h4>
              <div className="bg-blue-50/60 p-3 rounded border border-blue-200 text-blue-900 leading-relaxed">
                {viewChallenge.pilotRequirements || `Deployment in ${viewChallenge.location} for ${viewChallenge.pilotDuration}.`}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* APPLICATION FORM MODAL */}
      {applyChallenge && (
        <Modal
          isOpen={!!applyChallenge}
          onClose={() => setApplyChallenge(null)}
          title={`Submit Innovation Proposal`}
          subtitle={`Applying for: ${applyChallenge.title}`}
          maxWidth="max-w-3xl"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setApplyChallenge(null)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleApplySubmit}
              >
                Submit Application
              </Button>
            </>
          }
        >
          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            {/* Startup Details */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Applicant Startup Details (DPIIT Verified)
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <strong>Startup Name:</strong> {appForm.startupName}
                </div>
                <div>
                  <strong>Target Department:</strong> {applyChallenge.department}
                </div>
              </div>
            </div>

            {/* Solution Description */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Proposed Solution Description *
              </label>
              <textarea
                rows={3}
                value={appForm.solutionDescription}
                onChange={(e) =>
                  setAppForm((prev) => ({ ...prev, solutionDescription: e.target.value }))
                }
                placeholder="Describe your proprietary technology, core mechanism, and how it directly solves the challenge..."
                className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Technical Approach */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Technical Approach & Architecture *
              </label>
              <textarea
                rows={3}
                value={appForm.technicalApproach}
                onChange={(e) =>
                  setAppForm((prev) => ({ ...prev, technicalApproach: e.target.value }))
                }
                placeholder="Detail the hardware sensors, edge inference, network telemetry, and cloud dashboard architecture..."
                className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Expected Impact & Estimated Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Expected Measurable Impact
                </label>
                <textarea
                  rows={2}
                  value={appForm.expectedImpact}
                  onChange={(e) =>
                    setAppForm((prev) => ({ ...prev, expectedImpact: e.target.value }))
                  }
                  placeholder="e.g., 90% reduction in manual sampling, early warning <10 min..."
                  className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Estimated Total Cost (₹)
                </label>
                <input
                  type="text"
                  value={appForm.estimatedCost}
                  onChange={(e) =>
                    setAppForm((prev) => ({ ...prev, estimatedCost: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Sanctioned challenge budget: {applyChallenge.budget}
                </span>
              </div>
            </div>

            {/* Supporting Documents Upload Mock */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Supporting Documents (Pitch Deck, DPR, Certifications)
              </label>
              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
                {appForm.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white p-2 rounded border border-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-slate-800">{doc.name}</span>
                      <span className="text-slate-400 text-[10px]">({doc.size})</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Attached
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StartupChallenges;
