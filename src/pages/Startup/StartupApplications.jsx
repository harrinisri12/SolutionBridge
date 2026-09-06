import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Search,
  Calendar,
  IndianRupee,
  Clock,
  Eye,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Award,
  Layers,
  Building2,
  ArrowRight,
  Filter,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import EmptyState from '../../components/Common/EmptyState';
import { StatCard } from '../../components/Common/Card';

const STATUS_TABS = [
  { key: 'all', label: 'All Applications' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'selected', label: 'Selected for Pilot' },
  { key: 'rejected', label: 'Rejected' }
];

const StartupApplications = () => {
  const { applications, currentUser, isDataLoading } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');

  const myApps = applications || [];

  // Metrics from REAL backend/Supabase data
  const totalCount = myApps.length;
  const underReviewCount = myApps.filter((a) => a.status === 'under_review' || a.rawStatus === 'under_review' || a.status === 'Submitted').length;
  const shortlistedCount = myApps.filter((a) => a.status === 'shortlisted' || a.rawStatus === 'shortlisted' || a.status === 'Shortlisted').length;
  const selectedCount = myApps.filter((a) => a.status === 'selected' || a.rawStatus === 'selected' || a.status === 'Selected').length;
  const rejectedCount = myApps.filter((a) => a.status === 'rejected' || a.rawStatus === 'rejected' || a.status === 'Rejected').length;

  // Filtered applications
  const filteredApps = myApps.filter((app) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (app.challengeTitle && app.challengeTitle.toLowerCase().includes(term)) ||
      (app.solutionTitle && app.solutionTitle.toLowerCase().includes(term)) ||
      (app.id && app.id.toLowerCase().includes(term)) ||
      (app.department && app.department.toLowerCase().includes(term));

    const appStatus = (app.rawStatus || app.status || '').toLowerCase();
    const matchesTab =
      selectedStatusTab === 'all' ||
      appStatus === selectedStatusTab ||
      (selectedStatusTab === 'under_review' && (appStatus === 'submitted' || appStatus === 'under_review')) ||
      (selectedStatusTab === 'selected' && appStatus === 'selected') ||
      (selectedStatusTab === 'shortlisted' && appStatus === 'shortlisted') ||
      (selectedStatusTab === 'rejected' && appStatus === 'rejected');

    return matchesSearch && matchesTab;
  });

  const renderEvaluationBadge = (app) => {
    if (app.scores && app.scores.overallScore > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          <Award className="w-3 h-3 text-blue-600" />
          <span>Evaluation Completed ({app.scores.overallScore}/10)</span>
        </span>
      );
    }
    if (app.status === 'selected' || app.rawStatus === 'selected') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Evaluation Completed</span>
        </span>
      );
    }
    if (app.status === 'shortlisted' || app.rawStatus === 'shortlisted') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
          <TrendingUp className="w-3 h-3 text-purple-600" />
          <span>Shortlisted</span>
        </span>
      );
    }
    if (app.status === 'rejected' || app.rawStatus === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
    }
    if (app.expertAssigned || (app.expert_assignments && app.expert_assignments.length > 0)) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
          <UserCheck className="w-3 h-3 text-cyan-600" />
          <span>Expert Assigned</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>Evaluation Pending</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            <span>Startup Portal</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Applications & Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your submitted proposals, evaluation progress, expert assessment status, and selection outcomes.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/startup/challenges')}
            className="w-full sm:w-auto justify-center"
          >
            Browse New Challenges
          </Button>
        </div>
      </div>

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <StatCard
          title="Total Applications"
          value={totalCount}
          subtitle="All Challenge Submissions"
          icon={FileCheck2}
          color="blue"
          onClick={() => setSelectedStatusTab('all')}
        />
        <StatCard
          title="Under Review"
          value={underReviewCount}
          subtitle="Expert Panel Screening"
          icon={Clock}
          color="amber"
          onClick={() => setSelectedStatusTab('under_review')}
        />
        <StatCard
          title="Shortlisted"
          value={shortlistedCount}
          subtitle="Presentations Stage"
          icon={TrendingUp}
          color="purple"
          onClick={() => setSelectedStatusTab('shortlisted')}
        />
        <StatCard
          title="Selected for Pilot"
          value={selectedCount}
          subtitle="Awarded Sandbox Grants"
          icon={Award}
          color="emerald"
          onClick={() => setSelectedStatusTab('selected')}
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          subtitle="Non-Sanctioned"
          icon={AlertCircle}
          color="slate"
          onClick={() => setSelectedStatusTab('rejected')}
        />
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedStatusTab(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedStatusTab === tab.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, department, or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Applications Table / Loading / Empty State */}
      {isDataLoading ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200 shadow-xs">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-600">Loading submitted applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <EmptyState
          title="No applications found"
          description={
            totalCount === 0
              ? 'You have not submitted any applications yet. Discover open government challenges and submit your innovation proposal.'
              : 'No applications match your active filter criteria.'
          }
          actionLabel={totalCount === 0 ? 'Explore Challenges' : 'Show All Applications'}
          onAction={() => {
            if (totalCount === 0) {
              navigate('/startup/challenges');
            } else {
              setSelectedStatusTab('all');
              setSearchTerm('');
            }
          }}
        />
      ) : (
        <div className="gov-card p-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse gov-table">
              <thead>
                <tr>
                  <th>Application ID & Challenge</th>
                  <th>Solution Title</th>
                  <th>Submitted Date</th>
                  <th>Estimated Cost</th>
                  <th>Application Status</th>
                  <th>Evaluation Status</th>
                  <th>Last Updated</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => {
                  const shortId = app.id ? `#APP-${app.id.slice(0, 8).toUpperCase()}` : 'N/A';
                  return (
                    <tr key={app.id}>
                      {/* ID & Challenge */}
                      <td>
                        <div className="font-bold text-slate-900 text-sm max-w-xs line-clamp-1">
                          {app.challengeTitle}
                        </div>
                        <div className="text-[10px] text-blue-700 font-semibold mt-0.5 flex items-center gap-2">
                          <span className="font-mono text-slate-600 bg-slate-100 px-1 rounded">{shortId}</span>
                          <span className="text-slate-300">•</span>
                          <span>{app.department}</span>
                        </div>
                      </td>

                      {/* Solution Title */}
                      <td>
                        <div className="text-xs font-semibold text-slate-800 max-w-xs line-clamp-2 leading-snug">
                          {app.solutionTitle || app.proposalText?.slice(0, 60) || 'Proprietary Solution Proposal'}
                        </div>
                      </td>

                      {/* Submission Date */}
                      <td>
                        <div className="text-xs text-slate-600 font-medium">
                          {app.submittedDate || 'Recent'}
                        </div>
                      </td>

                      {/* Estimated Cost */}
                      <td>
                        <div className="text-xs font-bold text-slate-900">
                          {app.estimatedCost || 'To be determined'}
                        </div>
                      </td>

                      {/* Application Status */}
                      <td>
                        <Badge status={app.status || app.rawStatus} size="sm" />
                      </td>

                      {/* Evaluation Status */}
                      <td>
                        {renderEvaluationBadge(app)}
                      </td>

                      {/* Last Updated */}
                      <td>
                        <div className="text-[11px] text-slate-500">
                          {app.updatedDate || app.submittedDate || 'Recent'}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => navigate(`/startup/applications/${app.id}`)}
                        >
                          View Details
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
    </div>
  );
};

export default StartupApplications;

