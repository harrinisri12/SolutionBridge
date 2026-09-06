import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { applicationService } from '../../services/applicationService';
import {
  ArrowLeft,
  FileCheck2,
  Building2,
  Calendar,
  IndianRupee,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  ExternalLink,
  Download,
  Award,
  Layers,
  CheckCircle2,
  Scale,
  Printer,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Sparkles,
  Briefcase
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';

const LIFECYCLE_STAGES = [
  { key: 'submitted', label: 'Application Submitted', desc: 'Proposal registered' },
  { key: 'review', label: 'Government Review', desc: 'Eligibility & DPIIT check' },
  { key: 'evaluation', label: 'Expert Evaluation', desc: 'Technical & feasibility scoring' },
  { key: 'shortlisted', label: 'Shortlisted', desc: 'Candidate for sandbox' },
  { key: 'selected', label: 'Selected for Pilot', desc: 'Sanction & grant awarded' }
];

const StartupApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, normalizeApplication } = useApp();

  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchApp = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Fetch full application with details and signed docs from backend API
        const res = await applicationService.getApplicationById(id);
        const appData = res?.data?.application;
        if (appData && isMounted) {
          setApplication(normalizeApplication ? normalizeApplication(appData) : appData);
        } else {
          const found = applications.find((a) => String(a.id) === String(id));
          if (found && isMounted) {
            setApplication(found);
          } else {
            setError('Application record could not be found.');
          }
        }
      } catch (err) {
        console.error('Error loading application details:', err);
        const found = applications.find((a) => String(a.id) === String(id));
        if (found && isMounted) {
          setApplication(found);
        } else {
          setError(err.message || 'Failed to retrieve application details.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchApp();

    return () => {
      isMounted = false;
    };
  }, [id, applications, normalizeApplication]);

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-slate-200 shadow-xs max-w-2xl mx-auto my-12">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-900">Loading Application Dossier...</h3>
        <p className="text-xs text-slate-500 mt-1">Retrieving verified proposal records from database.</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-slate-200 shadow-xs max-w-lg mx-auto my-12 space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Application Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">{error || 'This application does not exist or you do not have permission to view it.'}</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/startup/applications')}>
          Return to Applications
        </Button>
      </div>
    );
  }

  const shortId = application.id ? `#APP-${application.id.slice(0, 8).toUpperCase()}` : 'N/A';
  const docsList = application.documents || application.application_documents || [];
  const evalScores = application.scores;
  const rawStatus = (application.rawStatus || application.status || '').toLowerCase();
  const isRejected = rawStatus === 'rejected';

  // Determine stage progression index (0 to 4)
  let currentStageIndex = 0; // 0 = Submitted
  if (rawStatus === 'selected') {
    currentStageIndex = 4;
  } else if (rawStatus === 'shortlisted') {
    currentStageIndex = 3;
  } else if (evalScores && evalScores.overallScore > 0) {
    currentStageIndex = 2; // Evaluation completed
  } else if (application.expertAssigned || (application.expert_assignments && application.expert_assignments.length > 0)) {
    currentStageIndex = 2; // Expert assigned / evaluation in progress
  } else {
    currentStageIndex = 1; // Government review in progress
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 text-left">
      
      {/* 1. Top Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/startup/applications')}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Back to Applications"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {shortId}
                </span>
                <Badge status={application.status || application.rawStatus} size="sm" />
                {application.dpiitVerified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>DPIIT Verified</span>
                  </span>
                )}
              </div>
              <h1 className="text-lg font-bold text-slate-900 mt-1">
                {application.solutionTitle || application.challenges?.title || 'Technical Innovation Proposal'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={() => window.print()}
              className="hidden sm:inline-flex"
            >
              Print Dossier
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/startup/applications')}
            >
              Back to Applications
            </Button>
          </div>
        </div>

        {/* Challenge & Submission Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-md border border-slate-200 text-xs text-slate-700">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Application ID</span>
            <span className="font-mono font-bold text-slate-900">{shortId}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Challenge</span>
            <span className="font-bold text-slate-900 line-clamp-1">{application.challengeTitle}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Government Department</span>
            <span className="font-semibold text-blue-800">{application.department}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Submission Date</span>
            <span className="font-semibold text-slate-800">{application.submittedDate || 'Recent'}</span>
          </div>
        </div>
      </div>

      {/* 2. Visual Evaluation Progress Lifecycle */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Procurement Lifecycle & Evaluation Progress</span>
          </h2>
          {isRejected && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Application Closed / Rejected</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isCompleted = !isRejected && idx <= currentStageIndex;
            const isCurrent = !isRejected && idx === currentStageIndex;
            const isFailed = isRejected && idx === currentStageIndex;

            return (
              <div
                key={stage.key}
                className={`p-3 rounded-md border transition-all text-left ${
                  isFailed
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : isCurrent
                    ? 'bg-blue-50 border-blue-300 text-blue-900 ring-1 ring-blue-400'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold font-mono">STEP 0{idx + 1}</span>
                  {isFailed ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="text-xs font-bold leading-tight">{stage.label}</div>
                <div className="text-[10px] opacity-75 mt-0.5 leading-snug">{stage.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Expert Evaluation Status & Scorecard */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Evaluation Status & Independent Assessment
            </h2>
          </div>
          <div>
            {evalScores && evalScores.overallScore > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Evaluation Completed</span>
              </span>
            ) : application.expertAssigned ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-200">
                <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                <span>Expert Assigned / In Progress</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Evaluation Pending</span>
              </span>
            )}
          </div>
        </div>

        {evalScores && evalScores.overallScore > 0 ? (
          <div className="space-y-4">
            {/* Score Summary Box */}
            <div className="p-4 bg-slate-900 text-white rounded-lg shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">Overall Weighted Evaluation Score</span>
                  <span className="text-xs text-slate-400">Calculated by independent domain experts based on standard procurement rubrics.</span>
                </div>
                <div className="flex items-baseline gap-1 bg-white/10 px-3.5 py-1.5 rounded-md border border-white/10">
                  <span className="text-2xl font-black text-amber-400">{evalScores.overallScore}</span>
                  <span className="text-xs text-slate-300">/ 10.0</span>
                </div>
              </div>

              {/* 5-Criteria Score Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 text-xs">
                <div className="bg-white/5 p-2.5 rounded border border-white/10">
                  <span className="text-[10px] text-slate-300 block">Technical Feasibility</span>
                  <strong className="text-sm text-white font-bold">{evalScores.technicalFeasibility}/10</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded border border-white/10">
                  <span className="text-[10px] text-slate-300 block">Innovation / IP</span>
                  <strong className="text-sm text-white font-bold">{evalScores.innovation}/10</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded border border-white/10">
                  <span className="text-[10px] text-slate-300 block">Cost Effectiveness</span>
                  <strong className="text-sm text-white font-bold">{evalScores.costEffectiveness}/10</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded border border-white/10">
                  <span className="text-[10px] text-slate-300 block">Scalability</span>
                  <strong className="text-sm text-white font-bold">{evalScores.scalability}/10</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded border border-white/10">
                  <span className="text-[10px] text-slate-300 block">Implementation Risk</span>
                  <strong className="text-sm text-white font-bold">{evalScores.risk}/10</strong>
                </div>
              </div>
            </div>

            {/* Recommendation & Comments */}
            {(application.expertRecommendation || application.evaluationComments) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {application.expertRecommendation && (
                  <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-md">
                    <span className="text-[10px] font-bold uppercase text-blue-900 block mb-1">Expert Recommendation</span>
                    <p className="text-slate-800 font-medium">{application.expertRecommendation}</p>
                  </div>
                )}
                {application.evaluationComments && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block mb-1">Evaluation Remarks / Feedback</span>
                    <p className="text-slate-700">{application.evaluationComments}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">
              {application.expertAssigned
                ? 'An expert evaluator has been assigned and is currently reviewing your proposal and technical architecture.'
                : 'Your proposal is currently queued for expert committee assignment and technical screening.'}
            </p>
            <p className="text-[11px] text-slate-500">
              Evaluation scores across technical feasibility, innovation, cost effectiveness, and scalability will be displayed here once finalized by the evaluation committee.
            </p>
          </div>
        )}
      </div>

      {/* 4. Complete Proposal Dossier Sections */}
      <div className="space-y-5">
        
        {/* Section 1: Solution Architecture & Executive Summary */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>1. Solution Overview & Technical Architecture</span>
          </h2>

          <div className="space-y-3 text-xs text-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Solution Title</span>
              <div className="font-bold text-slate-900 text-sm">{application.solutionTitle || 'N/A'}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Executive Summary / Proposal</span>
              <p className="mt-0.5 text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                {application.proposalText || application.proposal || 'N/A'}
              </p>
            </div>

            {application.problemUnderstanding && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Problem Understanding</span>
                <p className="mt-0.5 text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                  {application.problemUnderstanding}
                </p>
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Technical Solution</span>
              <p className="mt-0.5 text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                {application.technicalSolution || application.proposalText || 'N/A'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Technology Used</span>
                <span className="font-semibold text-slate-900">{application.technologyUsed || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Innovation / USP</span>
                <span className="font-semibold text-slate-900">{application.innovationUsp || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Expected Outcomes & KPIs */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>2. Expected Outcome & Key Performance Indicators (KPIs)</span>
          </h2>

          <div className="space-y-3 text-xs text-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Outcome & Measurable Results</span>
              <p className="mt-0.5 text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                {application.expectedOutcome || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Key Performance Indicators (KPIs)</span>
              <pre className="mt-0.5 text-slate-800 font-mono text-xs leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                {application.kpis || 'N/A'}
              </pre>
            </div>
          </div>
        </div>

        {/* Section 3: Implementation & Deployment Plan */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>3. Implementation Plan & Sandbox Timeline</span>
          </h2>

          <div className="space-y-3 text-xs text-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Implementation Plan</span>
              <p className="mt-0.5 text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                {application.implementationPlan || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Implementation Timeline</span>
              <p className="mt-0.5 text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                {application.implementationTimeline || 'N/A'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Infrastructure Requirements</span>
                <p className="mt-0.5 text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                  {application.infrastructureRequirements || 'Standard cloud / edge computing infrastructure.'}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Team & Resources</span>
                <p className="mt-0.5 text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                  {application.teamResources || 'Dedicated project development team.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Cost & Commercial Proposal */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>4. Cost & Commercial Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-800">
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Estimated Cost</span>
              <span className="text-base font-bold text-emerald-700">{application.estimatedCost}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Proposed Pilot Duration</span>
              <span className="text-sm font-bold text-slate-900">{application.pilotDurationDays || 180} Days</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Annual Maintenance Cost</span>
              <span className="text-sm font-bold text-slate-900">
                ₹ {Number(application.maintenanceCost || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {application.costBreakdown && (
              <div className="sm:col-span-3 bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost Breakdown Details</span>
                <p className="mt-0.5 text-slate-800 whitespace-pre-line leading-relaxed">{application.costBreakdown}</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Experience & Credentials */}
        {application.previousExperience && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-600" />
              <span>5. Experience & Credentials</span>
            </h2>

            <div className="text-xs text-slate-800 bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed whitespace-pre-line">
              {application.previousExperience}
            </div>
          </div>
        )}

        {/* Section 6: Attached Supporting Documents */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>6. Supporting Documents ({docsList.length})</span>
          </h2>

          {docsList.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded text-center text-xs text-slate-400">
              No documents attached with this submission.
            </div>
          ) : (
            <div className="space-y-2">
              {docsList.map((doc, idx) => {
                const downloadHref = doc.downloadUrl || doc.file_url;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">{doc.file_name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {doc.document_type || 'Attachment'}
                        </div>
                      </div>
                    </div>

                    {downloadHref && (
                      <a
                        href={downloadHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white text-blue-700 hover:bg-blue-50 border border-slate-200 font-semibold text-xs shadow-2xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StartupApplicationDetail;
