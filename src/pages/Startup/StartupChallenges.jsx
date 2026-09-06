import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FileText,
  SlidersHorizontal,
  ShieldCheck,
  Award
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import EmptyState from '../../components/Common/EmptyState';
import GovChallengeDetail from '../Government/GovChallengeDetail';

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
  const { challenges, departments, applications, currentUser } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [viewChallenge, setViewChallenge] = useState(null);

  // Filtered Challenges
  const filteredChallenges = (challenges || []).filter((ch) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (ch.title && ch.title.toLowerCase().includes(term)) ||
      (ch.problemDescription && ch.problemDescription.toLowerCase().includes(term)) ||
      (ch.department && ch.department.toLowerCase().includes(term));
    const matchesCategory =
      selectedCategoryChip === 'All' || ch.category === selectedCategoryChip;
    const matchesDept =
      selectedDeptFilter === 'All' || ch.department === selectedDeptFilter;

    return matchesSearch && matchesCategory && matchesDept;
  });

  if (viewChallenge) {
    return (
      <GovChallengeDetail
        challenge={viewChallenge}
        onBack={() => setViewChallenge(null)}
      />
    );
  }

  // Check if startup already applied to this challenge
  const getAppliedApplication = (challengeId) => {
    return (applications || []).find(
      (a) => String(a.challengeId || a.challenge_id) === String(challengeId)
    );
  };

  const deptList = Array.from(
    new Set([
      ...(departments || []).map((d) => d.name || d),
      ...(challenges || []).map((c) => c.department).filter(Boolean)
    ])
  );

  return (
    <div className="space-y-6 text-left">
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

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        {/* Category Filter Chips */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Filter by Sector
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setSelectedCategoryChip(chip)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
              {deptList.map((dept) => (
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
          title="No challenges found"
          description="Try adjusting your category filter or search keyword."
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
            const appliedApp = getAppliedApplication(ch.id);

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
                    {appliedApp ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
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
                    {ch.problemDescription || ch.problemStatement}
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

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full font-semibold text-xs justify-center"
                      icon={Eye}
                      onClick={() => setViewChallenge(ch)}
                    >
                      View Details
                    </Button>

                    {appliedApp ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full font-semibold text-xs justify-center bg-slate-900 hover:bg-slate-800 text-white"
                        onClick={() => navigate(`/startup/applications/${appliedApp.id}`)}
                      >
                        My Proposal
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full font-semibold text-xs justify-center bg-blue-600 hover:bg-blue-700 text-white"
                        icon={ArrowRight}
                        iconPosition="right"
                        onClick={() => navigate(`/startup/challenges/${ch.id}/apply`)}
                      >
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StartupChallenges;
