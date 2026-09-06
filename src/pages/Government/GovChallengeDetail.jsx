import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Lock,
  Info,
  FileText,
  FileDown,
  ShieldCheck,
  Building2,
  User,
  Tags,
  BadgeCheck,
  TrendingUp,
  Activity,
  Layers,
  Calendar,
  Printer,
  Download,
  Fingerprint,
  ExternalLink,
  Edit3,
  Trash2
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';

const GovChallengeDetail = ({ challenge: propChallenge, onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    challenges,
    applications,
    currentUser,
    currentRole,
    addToast,
    canManageChallenge,
    updateChallenge,
    deleteChallenge,
    CATEGORIES = ['Transport', 'Water', 'Healthcare', 'Energy', 'Agriculture', 'Urban']
  } = useApp();

  // Find the challenge from props, URL param, or fallback to first available
  const challenge = propChallenge || (id ? challenges.find((c) => String(c.id) === String(id)) : null) || challenges[0];

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: challenge?.title || '',
    category: challenge?.category || 'General',
    problemDescription: challenge?.problemDescription || challenge?.problemStatement || '',
    technicalRequirements: challenge?.technicalRequirements || '',
    eligibilityCriteria: challenge?.eligibilityCriteria || '',
    pilotGuidelines: challenge?.pilotGuidelines || challenge?.pilotRequirements || '',
    status: challenge?.status || 'Published'
  });

  const canManage = canManageChallenge(challenge, currentUser);

  const handleOpenEdit = () => {
    if (!canManage) {
      alert(`Permission Denied: You can only edit problem statements for your assigned department (${currentUser?.department || 'Your Department'}).`);
      return;
    }
    setEditFormData({
      title: challenge?.title || '',
      category: challenge?.category || 'General',
      problemDescription: challenge?.problemDescription || challenge?.problemStatement || '',
      technicalRequirements: challenge?.technicalRequirements || '',
      eligibilityCriteria: challenge?.eligibilityCriteria || '',
      pilotGuidelines: challenge?.pilotGuidelines || challenge?.pilotRequirements || '',
      status: challenge?.status || 'Published'
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e?.preventDefault();
    if (!editFormData.title || !editFormData.problemDescription) {
      alert('Problem Title and Statement are required.');
      return;
    }
    try {
      await updateChallenge(challenge.id, editFormData);
      setIsEditOpen(false);
    } catch (err) {
      console.error('Failed to update challenge', err);
    }
  };

  if (!challenge) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-[#e2e8f0] shadow-xs max-w-lg mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#045eb2] flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#001428] mb-1">Challenge Not Found</h2>
        <p className="text-xs text-[#43474d] mb-4 leading-relaxed">
          The requested innovation challenge could not be loaded from active records.
        </p>
        <Button variant="primary" onClick={() => (onBack ? onBack() : navigate(currentRole === 'Startup' ? '/startup/challenges' : '/gov/challenges'))}>
          Return to Challenges
        </Button>
      </div>
    );
  }

  // Format short ID
  const formattedId = challenge.id && challenge.id.length > 12
    ? `#${challenge.id.slice(0, 8).toUpperCase()}`
    : `#${challenge.id || 'N/A'}`;

  // Filter actual applications for this challenge
  const challengeApps = applications.filter(
    (a) => String(a.challengeId) === String(challenge.id) || String(a.challenge_id) === String(challenge.id)
  );
  const totalAppsCount = challenge.applicationsCount !== undefined ? challenge.applicationsCount : challengeApps.length;
  const compliantAppsCount = challengeApps.filter((a) => a.status !== 'Rejected' && a.status !== 'rejected').length || (totalAppsCount > 0 ? totalAppsCount : 0);
  const underEvalCount = challengeApps.filter(
    (a) => a.status === 'under_review' || a.status === 'Submitted' || a.status === 'shortlisted'
  ).length || compliantAppsCount;
  const rejectedCount = challengeApps.filter((a) => a.status === 'Rejected' || a.status === 'rejected').length;

  // Format technical specifications list from real data
  const parseTechSpecs = () => {
    const raw = challenge.technicalRequirements || challenge.requiredTechnology || challenge.technical_requirements;
    if (raw && typeof raw === 'string') {
      const items = raw.split(/[,;\n•]+/).map((s) => s.trim()).filter(Boolean);
      if (items.length > 0) return items;
    }
    return [
      'Real-time IoT telemetry and edge-sensor array integration',
      'AI/ML analytical model with defined precision & low false-positive rate',
      'Geospatial mapping with standardized GIS coordinate layers',
      'Open REST API architecture compatible with National Data Exchange standards',
      'End-to-end encrypted telemetry transmission with role-based supervisory access',
      'Automated alert escalation and enterprise audit logging'
    ];
  };

  // Format eligibility list from real data
  const parseEligibility = () => {
    const raw = challenge.eligibilityCriteria || challenge.eligibility_criteria;
    if (raw && typeof raw === 'string') {
      const items = raw.split(/[,;\n•]+/).map((s) => s.trim()).filter(Boolean);
      if (items.length > 0) return items;
    }
    return [
      'Recognized by DPIIT as an eligible Startup entity or technology MSME',
      'Demonstrated prototype / TRL-7+ operational technology readiness',
      'Compliance with mandatory Indian data localization and CERT-In security norms',
      'Financial solvency clearance and non-debarment declaration',
      'Written undertaking for on-ground deployment in designated pilot test zone'
    ];
  };

  const techSpecsList = parseTechSpecs();
  const eligibilityList = parseEligibility();

  // Documents list
  const documents = [
    { title: 'Tender Sanction Order & Problem Statement', meta: 'Official RFP • PDF', size: '1.4 MB' },
    { title: 'Technical Architecture & Telemetry Matrix', meta: 'Tech Spec • PDF', size: '840 KB' },
    { title: 'Expert Evaluation Rubric & Weightage Spec', meta: 'Rubric v1.2 • PDF', size: '420 KB' },
    { title: 'Sandbox Pilot Deployment Guidelines', meta: 'Site Spec • PDF', size: '1.1 MB' },
    { title: 'Data Security & Indian Localization Mandate', meta: 'CERT-In Compliance • PDF', size: '512 KB' }
  ];

  const handleDownloadDoc = (docTitle) => {
    addToast?.(`Downloading document: ${docTitle}`, 'success');
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(currentRole === 'Startup' ? '/startup/challenges' : '/gov/challenges');
    }
  };

  const handleReviewApplications = () => {
    navigate('/gov/applications');
  };

  const nodalOfficerName = challenge.nodalOfficer || challenge.nodal_officer || (challenge.department ? `Nodal Officer (${challenge.department})` : 'Nodal Procurement Authority');

  return (
    <div className="flex flex-col w-full space-y-4 text-[#0d1c2e] font-sans antialiased max-w-[1600px] mx-auto">
      {/* 1 & 2. Top Sovereign Institutional Alignment Strip */}
      <section className="w-full bg-[#eff4ff] border border-[#d5e3fc] px-4 py-2.5 rounded-md flex flex-wrap items-center justify-between gap-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-[#43474d] font-medium min-w-0">
          <button
            onClick={handleBack}
            className="text-[#43474d] hover:text-[#001428] font-medium transition-colors cursor-pointer"
          >
            {currentRole === 'Startup' ? 'Startup Portal' : 'Government Portal'}
          </button>
          <span className="text-[#74777e]">•</span>
          <button
            onClick={handleBack}
            className="text-[#43474d] hover:text-[#001428] font-medium transition-colors cursor-pointer"
          >
            Challenges
          </button>
          <span className="text-[#74777e]">•</span>
          <span className="text-[#001428] font-bold tracking-tight font-mono" title={challenge.id}>
            {formattedId}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-[#43474d] tracking-wider uppercase">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#045eb2]"></span>
            <span>MISSION KARMAYOGI</span>
          </span>
          <span className="text-[#c3c6ce] hidden sm:inline">•</span>
          <span className="hidden sm:inline">NITI AAYOG ALIGNED</span>
          <span className="text-[#c3c6ce] hidden md:inline">•</span>
          <span className="hidden md:inline">DG OF PROCUREMENT</span>
          <span className="text-[#c3c6ce]">•</span>
          <span className="bg-[#d5e3fc] text-[#003971] px-2 py-0.5 rounded font-mono text-[10px] font-bold">
            GFR RULE 194
          </span>
        </div>
      </section>

      {/* 3. Page Header Dossier Anchor */}
      <header className="w-full bg-white border border-[#e2e8f0] rounded-md p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex flex-col gap-2.5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1 text-[#045eb2] hover:text-[#003971] text-xs font-semibold transition-colors cursor-pointer mr-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Challenges</span>
              </button>
              <span
                className="bg-[#0f2942] text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded"
                title={challenge.id}
              >
                {formattedId}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#d5e3ff] text-[#001b3c] px-2 py-0.5 rounded text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#045eb2] inline-block animate-pulse"></span>
                Stage 3: Expert Evaluation
              </span>
              <Badge status={challenge.status || 'Published'} size="sm" />

              {/* Department Authorization Status Tag */}
              {currentRole !== 'Startup' && (
                canManage ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Your Department Authority</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Read-Only ({challenge.department})</span>
                  </span>
                )
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#001428] tracking-tight leading-snug">
              {challenge.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-xs text-[#43474d]">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#74777e] shrink-0" />
                <span>Dept:</span>
                <strong className="text-[#0d1c2e] font-semibold">{challenge.department}</strong>
              </span>
              <span className="text-[#c3c6ce]">•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#74777e] shrink-0" />
                <span>Nodal Authority:</span>
                <strong className="text-[#0d1c2e] font-semibold">{nodalOfficerName}</strong>
              </span>
              <span className="text-[#c3c6ce]">•</span>
              <span className="flex items-center gap-1">
                <Tags className="w-3.5 h-3.5 text-[#74777e] shrink-0" />
                <span>Domain:</span>
                <strong className="text-[#0d1c2e] font-semibold">{challenge.category}</strong>
              </span>
              <span className="text-[#c3c6ce] hidden md:inline">•</span>
              <span className="inline-flex items-center gap-1 bg-[#dce9ff] text-[#314863] px-2 py-0.5 rounded text-[11px] font-medium">
                <BadgeCheck className="w-3 h-3 text-[#045eb2]" /> ISO 27001 • GeM / PFMS Ready
              </span>
            </div>
          </div>

          {/* 4. Financial & Timetable Quick Ledger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center justify-between sm:justify-start gap-4 bg-[#eff4ff] border border-[#d5e3fc] px-4 py-3 rounded-md">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#43474d] uppercase tracking-wider">
                  Pilot Budget Allocation
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#001428] tabular-nums">
                  {challenge.budget || '₹ 75,00,000'}
                </span>
              </div>
              <div className="w-px h-8 bg-[#c3c6ce]"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#43474d] uppercase tracking-wider">
                  Proposal Deadline
                </span>
                <span className="text-sm font-bold text-[#0d1c2e]">
                  {challenge.deadline || '2026-11-30'}
                </span>
                <span className="text-[10px] text-[#74777e]">
                  Open for Evaluation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canManage && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleOpenEdit}
                  icon={Edit3}
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  Edit Statement
                </Button>
              )}
              {currentRole !== 'Startup' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleReviewApplications}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-[#0f2942] hover:bg-[#001428] text-white flex-1 sm:flex-none justify-center"
                >
                  Review Applications ({totalAppsCount})
                </Button>
              )}
              <Button
                variant="outline"
                size="md"
                onClick={handleExportPDF}
                icon={Printer}
                className="hidden sm:inline-flex"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Read-Only Department Notice for Non-Department Officers */}
      {currentRole !== 'Startup' && !canManage && (
        <div className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-md flex items-center justify-between text-xs text-slate-600 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              <strong>Department Scope:</strong> This problem statement belongs to <strong>{challenge.department}</strong>. As an officer of <strong>{currentUser?.department || 'your department'}</strong>, you have <strong>read-only access</strong>. Editing and removal are restricted to assigned department personnel.
            </span>
          </div>
          <span className="text-[10px] font-bold font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded shrink-0">
            READ-ONLY
          </span>
        </div>
      )}

      {/* 5. Horizontal Stage Progression Track (Procurement Lifecycle) */}
      <section className="w-full bg-white border border-[#e2e8f0] rounded-md p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#43474d] uppercase tracking-wider">
            National Innovation Procurement Lifecycle
          </span>
          <span className="text-xs font-semibold text-[#045eb2]">
            Stage 3 of 5 • Active Evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 relative">
          {/* Stage 1 */}
          <div className="bg-[#eff4ff] border border-[#d5e3fc] p-3 rounded-md flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#43474d] uppercase">01 • DEFINITION</span>
              <span className="w-4 h-4 rounded-full bg-[#0d9488] text-white flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
            </div>
            <span className="text-xs font-bold text-[#0d1c2e]">Problem Statement</span>
            <span className="text-[10px] text-[#74777e]">Completed • Sanctioned</span>
          </div>

          {/* Stage 2 */}
          <div className="bg-[#eff4ff] border border-[#d5e3fc] p-3 rounded-md flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#43474d] uppercase">02 • SUBMISSIONS</span>
              <span className="w-4 h-4 rounded-full bg-[#0d9488] text-white flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
            </div>
            <span className="text-xs font-bold text-[#0d1c2e]">Startup Applications</span>
            <span className="text-[10px] text-[#74777e]">{totalAppsCount} Submissions Received</span>
          </div>

          {/* Stage 3 (Active) */}
          <div className="bg-[#0f2942] text-white border-2 border-[#045eb2] p-3 rounded-md flex flex-col gap-1 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#67a4fd] uppercase">03 • ACTIVE STAGE</span>
              <span className="w-2 h-2 rounded-full bg-[#67a4fd] animate-ping"></span>
            </div>
            <span className="text-xs font-bold text-white">Expert Evaluation</span>
            <span className="text-[10px] text-[#7991af]">{compliantAppsCount} Proposals in Review</span>
          </div>

          {/* Stage 4 */}
          <div className="bg-[#f8f9ff] border border-[#e2e8f0] p-3 rounded-md flex flex-col gap-1 opacity-75">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#74777e] uppercase">04 • PILOT & VALIDATION</span>
              <Lock className="w-3 h-3 text-[#74777e]" />
            </div>
            <span className="text-xs font-semibold text-[#0d1c2e]">Sandbox Pilot</span>
            <span className="text-[10px] text-[#74777e]">{challenge.pilotDuration || '6 Months'} • {challenge.location || 'Pilot Zone'}</span>
          </div>

          {/* Stage 5 */}
          <div className="bg-[#f8f9ff] border border-[#e2e8f0] p-3 rounded-md flex flex-col gap-1 opacity-75">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#74777e] uppercase">05 • PROCUREMENT</span>
              <Lock className="w-3 h-3 text-[#74777e]" />
            </div>
            <span className="text-xs font-semibold text-[#0d1c2e]">Direct Procurement</span>
            <span className="text-[10px] text-[#74777e]">Commercial Scale-up via GeM</span>
          </div>
        </div>

        <div className="mt-3 bg-[#eff4ff] border border-[#d5e3fc] px-3.5 py-2.5 rounded flex items-center gap-2.5 text-xs text-[#0d1c2e]">
          <Info className="w-4 h-4 text-[#045eb2] shrink-0" />
          <span>
            <strong>Active Stage Advisory:</strong> {compliantAppsCount} eligible startup proposals are under evaluation across technical screening panels under standard GFR-194 procedures.
          </span>
        </div>
      </section>

      {/* Split-Panel Architecture: 60% Left Dossier / 40% Right Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT PRIMARY DOSSIER COLUMN (7 COLS ~ 58.3%) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* 6. Challenge Overview Card */}
          <section className="bg-white border border-[#e2e8f0] rounded-md p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e6eeff]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#045eb2]" />
                <h2 className="text-base font-bold text-[#001428]">Challenge Overview & Objectives</h2>
              </div>
              <div className="flex items-center gap-2">
                {canManage && (
                  <button
                    onClick={handleOpenEdit}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Statement</span>
                  </button>
                )}
                <span className="text-[11px] font-mono text-[#74777e] uppercase">
                  Sanction Ref: SANCT-{formattedId.replace('#', '')}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <h3 className="text-xs font-bold text-[#43474d] uppercase tracking-wider mb-1.5">
                  Problem Statement
                </h3>
                <p className="text-xs sm:text-sm text-[#0d1c2e] leading-relaxed">
                  {challenge.problemDescription || challenge.problemStatement || 'Operational problem statement defined by the nodal department for open innovation procurement.'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#43474d] uppercase tracking-wider mb-1.5">
                  Expected Procurement Outcome
                </h3>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                  {challenge.expectedSolution || 'Deploy an enterprise-grade, interoperable solution meeting departmental benchmarks with automated telemetry, real-time alert escalation, and secure data integration.'}
                </p>
              </div>
            </div>

            {/* 7. KPI / Metric Target Cards Grid */}
            <div>
              <h3 className="text-xs font-bold text-[#43474d] uppercase tracking-wider mb-2.5">
                Target Acceptance KPI Benchmarks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#eff4ff] border border-[#d5e3fc] p-3.5 rounded-md flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#43474d] uppercase">Efficiency Target</span>
                  <span className="text-2xl font-bold text-[#001428] my-1 tabular-nums">≥ 25%</span>
                  <span className="text-[11px] text-[#74777e]">Operational enhancement delta</span>
                </div>
                <div className="bg-[#eff4ff] border border-[#d5e3fc] p-3.5 rounded-md flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#43474d] uppercase">Diagnostic Accuracy</span>
                  <span className="text-2xl font-bold text-[#001428] my-1 tabular-nums">≥ 92%</span>
                  <span className="text-[11px] text-[#74777e]">Verified in sandbox environment</span>
                </div>
                <div className="bg-[#eff4ff] border border-[#d5e3fc] p-3.5 rounded-md flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-[#43474d] uppercase">Service Uptime SLA</span>
                  <span className="text-2xl font-bold text-[#001428] my-1 tabular-nums">99.5%</span>
                  <span className="text-[11px] text-[#74777e]">Continuous availability benchmark</span>
                </div>
              </div>
            </div>
          </section>

          {/* 8 & 9. Technical Requirements & Startup Eligibility Grid */}
          <section className="bg-white border border-[#e2e8f0] rounded-md p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e6eeff]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#045eb2]" />
                <h2 className="text-base font-bold text-[#001428]">
                  Technical Specifications & Startup Eligibility
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#74777e] uppercase">
                GFR-194 Criteria
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 8. Technical Spec */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#045eb2]"></span>
                  <h3 className="text-xs font-bold text-[#001428] uppercase tracking-wider">
                    Mandatory Technical Capabilities
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-[#0d1c2e]">
                  {techSpecsList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[#eff4ff] p-2.5 rounded border border-[#d5e3fc]/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#045eb2] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 9. Startup Qualification */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#0d9488]"></span>
                  <h3 className="text-xs font-bold text-[#001428] uppercase tracking-wider">
                    Startup Eligibility Criteria
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-[#0d1c2e]">
                  {eligibilityList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[#eff4ff] p-2.5 rounded border border-[#d5e3fc]/60">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#0d9488] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 10. Pilot Requirements & Sandbox Specification */}
          <section className="bg-white border border-[#e2e8f0] rounded-md p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e6eeff]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#045eb2]" />
                <h2 className="text-base font-bold text-[#001428]">
                  Sandbox Pilot Specifications
                </h2>
              </div>
              <span className="bg-[#89f5e7] text-[#00201d] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                Field Deployment Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 bg-[#eff4ff] border border-[#d5e3fc] rounded-md space-y-1">
                <span className="text-[10px] font-bold text-[#43474d] uppercase">Pilot Testing Window</span>
                <div className="text-sm font-bold text-[#001428]">{challenge.pilotDuration || '6 Months (180 Calendar Days)'}</div>
                <div className="text-[11px] text-[#74777e]">Daily operational telemetry validation</div>
              </div>

              <div className="p-3.5 bg-[#eff4ff] border border-[#d5e3fc] rounded-md space-y-1">
                <span className="text-[10px] font-bold text-[#43474d] uppercase">Designated Sandbox Site</span>
                <div className="text-sm font-bold text-[#001428]">{challenge.location || 'Municipal Pilot Zone'}</div>
                <div className="text-[11px] text-[#74777e]">Field infrastructure access & supervisory oversight</div>
              </div>

              <div className="p-3.5 bg-[#eff4ff] border border-[#d5e3fc] rounded-md space-y-1">
                <span className="text-[10px] font-bold text-[#43474d] uppercase">Milestone Grant Budget</span>
                <div className="text-sm font-bold text-[#001428] tabular-nums">{challenge.budget || '₹ 75,00,000 Maximum'}</div>
                <div className="text-[11px] text-[#74777e]">Disbursed against verified milestone deliverables</div>
              </div>

              <div className="p-3.5 bg-[#eff4ff] border border-[#d5e3fc] rounded-md space-y-1">
                <span className="text-[10px] font-bold text-[#43474d] uppercase">Deployment Scope Obligation</span>
                <div className="text-sm font-bold text-[#001428]">Turnkey Deployment</div>
                <div className="text-[11px] text-[#74777e]">End-to-end sandbox staging and telemetry linkage</div>
              </div>
            </div>

            <div className="bg-[#dce9ff]/40 border border-[#d5e3fc] p-3.5 rounded-md">
              <span className="text-[10px] font-bold text-[#43474d] uppercase tracking-wider block mb-2">
                Official Validation Acceptance Metrics
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#0d1c2e]">
                <div>• Precision Accuracy: <strong>High</strong></div>
                <div>• Mean Response: <strong>&lt; 12 Hours</strong></div>
                <div>• Target Cost Delta: <strong>≥ 20%</strong></div>
                <div>• Telemetry Uptime: <strong>≥ 99.5%</strong></div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT OPERATIONAL, EVALUATION & GOVERNANCE SIDEBAR (5 COLS ~ 41.7%) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* 11. Application Funnel & Status Card */}
          <section className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#e6eeff]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#045eb2]" />
                <h3 className="text-base font-bold text-[#001428]">Application Funnel</h3>
              </div>
              <span className="text-xs font-bold bg-[#d5e3fc] text-[#003971] px-2.5 py-0.5 rounded">
                {totalAppsCount} Submissions
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-[#eff4ff] p-3 rounded-md border border-[#d5e3fc]/60">
                <span className="text-[10px] font-bold text-[#43474d] block uppercase">Total Submissions</span>
                <span className="text-2xl font-bold text-[#001428] tabular-nums mt-0.5 block">{totalAppsCount}</span>
              </div>
              <div className="bg-[#eff4ff] p-3 rounded-md border border-[#d5e3fc]/60">
                <span className="text-[10px] font-bold text-[#43474d] block uppercase">Eligible Proposals</span>
                <span className="text-2xl font-bold text-[#045eb2] tabular-nums mt-0.5 block">{compliantAppsCount}</span>
              </div>
              <div className="bg-[#d5e3ff]/50 p-3 rounded-md border border-[#045eb2]/30">
                <span className="text-[10px] font-bold text-[#004689] block uppercase">Under Evaluation</span>
                <span className="text-2xl font-bold text-[#045eb2] tabular-nums mt-0.5 block">{underEvalCount}</span>
              </div>
              <div className="bg-[#eff4ff] p-3 rounded-md border border-[#d5e3fc]/60">
                <span className="text-[10px] font-bold text-[#43474d] block uppercase">Disqualified</span>
                <span className="text-2xl font-bold text-[#ba1a1a] tabular-nums mt-0.5 block">{rejectedCount}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {currentRole !== 'Startup' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleReviewApplications}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full justify-center bg-[#0f2942] hover:bg-[#001428] text-white py-2"
                >
                  Review Applications ({totalAppsCount})
                </Button>
              )}
              <button
                onClick={() => handleDownloadDoc('Full_Tender_Dossier_Pack.zip')}
                className="w-full h-9 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0d1c2e] text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#d5e3fc]"
              >
                <Download className="w-3.5 h-3.5 text-[#045eb2]" />
                <span>Download Dossier Pack (ZIP)</span>
              </button>
            </div>
          </section>

          {/* 12. Evaluation Criteria & Rubric Weightage */}
          <section className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#e6eeff]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#045eb2]" />
                <h3 className="text-base font-bold text-[#001428]">Evaluation Rubric</h3>
              </div>
              <span className="text-xs font-bold text-[#0d9488] bg-[#eff4ff] px-2 py-0.5 rounded">
                Passing: ≥ 75%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[#0d1c2e] mb-1">
                  <span className="font-medium">Technical Feasibility & Architecture</span>
                  <strong className="text-[#001428] tabular-nums font-bold">25%</strong>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#045eb2]" style={{ width: '25%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#0d1c2e] mb-1">
                  <span className="font-medium">Innovation & Proprietary IP</span>
                  <strong className="text-[#001428] tabular-nums font-bold">20%</strong>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#045eb2]" style={{ width: '20%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#0d1c2e] mb-1">
                  <span className="font-medium">Commercial Cost Effectiveness & Value</span>
                  <strong className="text-[#001428] tabular-nums font-bold">15%</strong>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#045eb2]" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#0d1c2e] mb-1">
                  <span className="font-medium">Scalability & Enterprise API Integration</span>
                  <strong className="text-[#001428] tabular-nums font-bold">15%</strong>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#045eb2]" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#0d1c2e] mb-1">
                  <span className="font-medium">Execution Capability & Team Track Record</span>
                  <strong className="text-[#001428] tabular-nums font-bold">15%</strong>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#045eb2]" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#0d1c2e] mb-1">
                  <span className="font-medium">Security & Indian Data Localization (CERT-In)</span>
                  <strong className="text-[#001428] tabular-nums font-bold">10%</strong>
                </div>
                <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#045eb2]" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-[#e6eeff] flex justify-between items-center text-xs text-[#74777e]">
              <span>Total Aggregate Weight: <strong className="text-[#001428]">100%</strong></span>
              <button
                onClick={() => handleDownloadDoc('Evaluation_Rubric_Specification.pdf')}
                className="text-[#045eb2] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span>Full Rubric PDF</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </section>

          {/* 13. Procurement Milestone Timeline */}
          <section className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#e6eeff]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#045eb2]" />
                <h3 className="text-base font-bold text-[#001428]">Milestone Schedule</h3>
              </div>
              <span className="text-xs font-bold text-[#74777e] uppercase">Schedule</span>
            </div>

            <div className="relative pl-5 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d5e3fc]">
              <div className="relative">
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#0d9488] ring-4 ring-white"></span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#74777e] uppercase">Tender Sanctioned</span>
                  <span className="text-xs font-bold text-[#0d1c2e]">Problem Statement Published</span>
                  <span className="text-[10px] text-[#0d9488] font-semibold">Completed</span>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#0d9488] ring-4 ring-white"></span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#74777e] uppercase">
                    {challenge.deadline || '2026-11-30'}
                  </span>
                  <span className="text-xs font-bold text-[#0d1c2e]">Applications Intake Window</span>
                  <span className="text-[10px] text-[#0d9488] font-semibold">{totalAppsCount} Submissions Logged</span>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#045eb2] ring-4 ring-[#d5e3ff] animate-pulse"></span>
                <div className="flex flex-col bg-[#eff4ff] p-2.5 rounded -ml-1 pl-2.5 border border-[#d5e3fc]">
                  <span className="text-[10px] font-bold text-[#045eb2] uppercase">ACTIVE STAGE</span>
                  <span className="text-xs font-bold text-[#001428]">Expert Technical Evaluation</span>
                  <span className="text-[10px] text-[#045eb2] font-semibold">Panel scoring & shortlist in progress</span>
                </div>
              </div>

              <div className="relative opacity-75">
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#74777e] ring-4 ring-white"></span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#74777e] uppercase">Upcoming</span>
                  <span className="text-xs font-semibold text-[#0d1c2e]">Sandbox Pilot & Validation</span>
                  <span className="text-[10px] text-[#74777e]">{challenge.pilotDuration || '6 Months'} Deployment Window</span>
                </div>
              </div>

              <div className="relative opacity-75">
                <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#74777e] ring-4 ring-white"></span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#74777e] uppercase">Final Stage</span>
                  <span className="text-xs font-semibold text-[#0d1c2e]">Direct Procurement & Scale-up</span>
                  <span className="text-[10px] text-[#74777e]">GeM Direct Purchase Order under GFR-194</span>
                </div>
              </div>
            </div>
          </section>

          {/* 14. Official Documents & Evidence Repository */}
          <section className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#e6eeff]">
              <div className="flex items-center gap-2">
                <FileDown className="w-4 h-4 text-[#045eb2]" />
                <h3 className="text-base font-bold text-[#001428]">Tender Documents</h3>
              </div>
              <span className="text-xs font-bold text-[#74777e] uppercase">
                {documents.length} Certified Files
              </span>
            </div>

            <div className="space-y-2">
              {documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-[#eff4ff] rounded border border-[#d5e3fc] hover:bg-[#dce9ff]/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#ba1a1a] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-[#0d1c2e] truncate">{doc.title}</span>
                      <span className="text-[10px] text-[#74777e]">{doc.meta} • {doc.size}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDoc(doc.title)}
                    className="p-1.5 text-[#045eb2] hover:text-[#003971] hover:bg-white/60 rounded cursor-pointer transition-colors"
                    title={`Download ${doc.title}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 15. Audit Trail & Cryptographic Governance Record */}
          <section className="bg-white border border-[#e2e8f0] rounded-md p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#e6eeff]">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#045eb2]" />
                <h3 className="text-base font-bold text-[#001428]">Audit & Governance</h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0d9488] bg-[#eff4ff] border border-[#d5e3fc] px-2 py-0.5 rounded">
                <Lock className="w-3 h-3 text-[#0d9488]" /> IMMUTABLE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#eff4ff]">
                <span className="text-[#74777e]">Audit Reference:</span>
                <span className="font-mono font-bold text-[#001428]">AUD-{formattedId.replace('#', '')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#eff4ff]">
                <span className="text-[#74777e]">Nodal Department:</span>
                <span className="font-medium text-[#0d1c2e] truncate max-w-[200px]">{challenge.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#eff4ff]">
                <span className="text-[#74777e]">Sanction Token:</span>
                <span className="font-mono text-[#0d1c2e]">MOUD-{formattedId.replace('#', '')}-9921</span>
              </div>
              <div className="flex flex-col py-1 border-b border-[#eff4ff] gap-0.5">
                <span className="text-[#74777e]">Latest Governance Event:</span>
                <span className="text-xs text-[#0d1c2e]">Evaluation gate dispatched to independent technical expert jury</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#74777e]">Verification Hash:</span>
                <span className="text-[#045eb2] font-mono text-[11px] truncate max-w-[160px]" title="0x8a91f4d920bb314c99e120aa447d">
                  0x8a91f4d...447d
                </span>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-[#e6eeff]">
              <Link
                to="/admin/audit-logs"
                className="inline-flex items-center gap-1 text-[#045eb2] hover:text-[#003971] text-xs font-semibold"
              >
                <span>View Complete NIC Cloud Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* 16. Contained Bottom Action Footer Bar */}
      <footer className="w-full mt-6 bg-white border border-[#e2e8f0] rounded-md p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-[#045eb2] hover:text-[#003971] text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Challenges</span>
          </button>
          <span className="text-[#c3c6ce]">|</span>
          <button
            onClick={handleExportPDF}
            className="h-8 px-3 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0d1c2e] border border-[#d5e3fc] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#045eb2]" />
            <span>Export Summary PDF</span>
          </button>
          <span className="text-xs text-[#74777e] hidden sm:inline">
            Viewing <strong className="font-mono">{formattedId}</strong> • {challenge.department}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canManage && (
            <Button
              variant="outline"
              size="md"
              onClick={handleOpenEdit}
              icon={Edit3}
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              Edit Statement
            </Button>
          )}
          {currentRole !== 'Startup' && (
            <Button
              variant="primary"
              size="md"
              onClick={handleReviewApplications}
              icon={ArrowRight}
              iconPosition="right"
              className="bg-[#0f2942] hover:bg-[#001428] text-white"
            >
              Review Applications ({totalAppsCount})
            </Button>
          )}
        </div>
      </footer>

      {/* EDIT PROBLEM STATEMENT MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Problem Statement"
        subtitle={`Editing statement for: ${challenge.department}`}
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSubmit}
            >
              Save Statement Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          {/* Department Identification */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-md flex items-center justify-between text-emerald-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Assigned Department: <strong>{challenge.department}</strong>
              </span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded font-mono">
              DEPARTMENT MODIFICATION AUTHORIZED
            </span>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              name="title"
              value={editFormData.title}
              onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Sector & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Sector / Category
              </label>
              <select
                name="category"
                value={editFormData.category}
                onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-slate-300 rounded-md p-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Challenge Status
              </label>
              <select
                name="status"
                value={editFormData.status}
                onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-slate-300 rounded-md p-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Published">Published (Open for Startup Proposals)</option>
                <option value="Draft">Draft (Internal Working Copy)</option>
                <option value="Closed">Closed (Submissions Concluded)</option>
              </select>
            </div>
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Problem Statement & Operational Challenge *
            </label>
            <textarea
              name="problemDescription"
              rows={4}
              value={editFormData.problemDescription}
              onChange={(e) => setEditFormData(prev => ({ ...prev, problemDescription: e.target.value }))}
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Technical Specifications */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Technical Requirements & Specifications
            </label>
            <textarea
              name="technicalRequirements"
              rows={3}
              value={editFormData.technicalRequirements}
              onChange={(e) => setEditFormData(prev => ({ ...prev, technicalRequirements: e.target.value }))}
              placeholder="e.g., IoT Telemetry, AI Edge Detection, GIS Integration, REST APIs..."
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Eligibility Criteria */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Startup Eligibility Criteria
            </label>
            <textarea
              name="eligibilityCriteria"
              rows={2}
              value={editFormData.eligibilityCriteria}
              onChange={(e) => setEditFormData(prev => ({ ...prev, eligibilityCriteria: e.target.value }))}
              placeholder="e.g., DPIIT Recognized, TRL-7+, ISO 9001, CERT-In compliance..."
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Pilot Guidelines */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Pilot Sandbox Guidelines & Target Deployments
            </label>
            <textarea
              name="pilotGuidelines"
              rows={2}
              value={editFormData.pilotGuidelines}
              onChange={(e) => setEditFormData(prev => ({ ...prev, pilotGuidelines: e.target.value }))}
              placeholder="e.g., Field testing deployment specs, target SLAs, milestone acceptance benchmarks..."
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GovChallengeDetail;

