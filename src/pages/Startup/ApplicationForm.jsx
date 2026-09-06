import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { applicationService } from '../../services/applicationService';
import { challengeService } from '../../services/challengeService';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UploadCloud,
  CheckSquare,
  Building2,
  Calendar,
  IndianRupee,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Eye,
  Info,
  Lock
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';

const DOCUMENT_CATEGORIES = [
  'Technical Proposal',
  'Company Profile',
  'Previous Project Evidence',
  'Financial/Cost Document',
  'Product Brochure',
  'Architecture Document',
  'Other'
];

const STEPS = [
  { num: 1, label: 'Basic Info', desc: 'Solution profile & summary' },
  { num: 2, label: 'Outcomes', desc: 'Expected results & KPIs' },
  { num: 3, label: 'Implementation', desc: 'Timeline & site plan' },
  { num: 4, label: 'Cost & Budget', desc: 'Commercial proposal' },
  { num: 5, label: 'Experience', desc: 'Track record & credentials' },
  { num: 6, label: 'Documents', desc: 'Supporting attachments' },
  { num: 7, label: 'Review & Submit', desc: 'Verify and declare' }
];

const ApplicationForm = () => {
  const { challengeId: paramChallengeId, id: paramId } = useParams();
  const challengeId = paramChallengeId || paramId;
  const navigate = useNavigate();

  const {
    challenges,
    applications,
    currentUser,
    submitApplication,
    addToast
  } = useApp();

  const [step, setStep] = useState(1);
  const [challenge, setChallenge] = useState(null);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Document upload temporary state
  const [selectedDocFile, setSelectedDocFile] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState('Technical Proposal');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    solution_title: '',
    proposal: '',
    problem_understanding: '',
    technical_solution: '',
    technology_used: '',
    innovation_usp: '',

    // Step 2: Expected Outcome
    expected_outcome: '',
    kpis: '',

    // Step 3: Implementation Plan
    implementation_plan: '',
    implementation_timeline: '',
    infrastructure_requirements: '',
    team_resources: '',

    // Step 4: Cost & Commercial
    estimated_cost: '',
    cost_breakdown: '',
    maintenance_cost: '',
    pilot_duration_days: '180',

    // Step 5: Experience
    previous_experience: '',

    // Step 6: Documents
    documents: [],

    // Step 7: Confirmation
    confirmation_checked: false
  });

  const [errors, setErrors] = useState({});

  // 1. Fetch Challenge Data
  useEffect(() => {
    let isMounted = true;

    const loadChallenge = async () => {
      setIsLoadingChallenge(true);
      try {
        // First check in-context challenges
        const matched = challenges.find((c) => String(c.id) === String(challengeId));
        if (matched) {
          if (isMounted) setChallenge(matched);
        } else if (challengeId) {
          const res = await challengeService.getChallengeById(challengeId);
          if (res?.data?.challenge && isMounted) {
            setChallenge(res.data.challenge);
          }
        }
      } catch (err) {
        console.error('Failed to load challenge for application:', err);
      } finally {
        if (isMounted) setIsLoadingChallenge(false);
      }
    };

    loadChallenge();

    return () => {
      isMounted = false;
    };
  }, [challengeId, challenges]);

  // Check if startup already applied to this challenge
  const alreadyAppliedApp = applications.find(
    (a) =>
      String(a.challengeId || a.challenge_id) === String(challengeId) &&
      (a.startupId === currentUser?.startupId || a.startup_id === currentUser?.startupId || a.startupName === currentUser?.startupName)
  );

  // Determine DPIIT verification status
  const isDpiitVerified = Boolean(
    currentUser?.dpiitVerified ||
    currentUser?.startup?.verified ||
    currentUser?.verified
  );

  // Field change handler
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Step Validation logic
  const validateStep = (currentStepNum) => {
    const newErrors = {};

    if (currentStepNum === 1) {
      if (!formData.solution_title.trim()) newErrors.solution_title = 'Solution title is required.';
      if (!formData.proposal.trim()) newErrors.proposal = 'Executive summary / proposal is required.';
      if (!formData.problem_understanding.trim()) newErrors.problem_understanding = 'Problem understanding is required.';
      if (!formData.technical_solution.trim()) newErrors.technical_solution = 'Technical solution architecture is required.';
      if (!formData.technology_used.trim()) newErrors.technology_used = 'Technology stack / components used is required.';
      if (!formData.innovation_usp.trim()) newErrors.innovation_usp = 'Innovation & USP description is required.';
    }

    if (currentStepNum === 2) {
      if (!formData.expected_outcome.trim()) newErrors.expected_outcome = 'Expected outcome is required.';
      if (!formData.kpis.trim()) newErrors.kpis = 'Key Performance Indicators (KPIs) are required.';
    }

    if (currentStepNum === 3) {
      if (!formData.implementation_plan.trim()) newErrors.implementation_plan = 'Implementation plan is required.';
      if (!formData.implementation_timeline.trim()) newErrors.implementation_timeline = 'Implementation timeline is required.';
    }

    if (currentStepNum === 4) {
      if (!formData.estimated_cost || String(formData.estimated_cost).trim() === '') {
        newErrors.estimated_cost = 'Estimated total cost is required.';
      } else {
        const num = Number(String(formData.estimated_cost).replace(/[^0-9.-]+/g, ''));
        if (isNaN(num) || num < 0) {
          newErrors.estimated_cost = 'Estimated cost must be a valid non-negative number.';
        }
      }

      if (formData.maintenance_cost && String(formData.maintenance_cost).trim() !== '') {
        const maintNum = Number(String(formData.maintenance_cost).replace(/[^0-9.-]+/g, ''));
        if (isNaN(maintNum) || maintNum < 0) {
          newErrors.maintenance_cost = 'Maintenance cost must be a non-negative number.';
        }
      }

      if (!formData.pilot_duration_days || String(formData.pilot_duration_days).trim() === '') {
        newErrors.pilot_duration_days = 'Proposed pilot duration in days is required.';
      } else {
        const days = parseInt(formData.pilot_duration_days, 10);
        if (isNaN(days) || days <= 0) {
          newErrors.pilot_duration_days = 'Pilot duration must be greater than 0 days.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 7));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToast('Please complete all required fields with valid values.', 'warning');
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Document Upload
  const handleUploadDocument = async () => {
    if (!selectedDocFile) {
      setUploadError('Please choose a file to upload.');
      return;
    }

    // Size limit: 15MB
    if (selectedDocFile.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15 MB limit.');
      return;
    }

    setIsUploadingDoc(true);
    setUploadError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedDocFile);
      uploadFormData.append('document_type', selectedDocType);

      const res = await applicationService.uploadDocument(uploadFormData);
      const uploadedDoc = res?.data;

      if (uploadedDoc) {
        setFormData((prev) => ({
          ...prev,
          documents: [
            ...prev.documents,
            {
              file_name: uploadedDoc.file_name || selectedDocFile.name,
              file_url: uploadedDoc.file_url,
              downloadUrl: uploadedDoc.downloadUrl || uploadedDoc.file_url,
              document_type: selectedDocType,
              file_size: uploadedDoc.file_size || `${(selectedDocFile.size / (1024 * 1024)).toFixed(2)} MB`
            }
          ]
        }));
        setSelectedDocFile(null);
        addToast(`Uploaded ${selectedDocFile.name} successfully`, 'success');
      }
    } catch (err) {
      console.error('Document upload error:', err);
      setUploadError(err.message || 'Failed to upload document to Supabase storage.');
      addToast('Document upload failed. Please try again.', 'error');
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleRemoveDoc = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Final Submission
  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    // Validate all required steps
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setStep(s);
        addToast(`Please review and fill required fields in Step ${s}.`, 'warning');
        return;
      }
    }

    if (!formData.confirmation_checked) {
      addToast('Please check the legal declaration confirmation before submitting.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        challenge_id: challenge?.id || challengeId,
        proposal: formData.proposal.trim(),
        technical_solution: formData.technical_solution.trim(),
        estimated_cost: Number(String(formData.estimated_cost).replace(/[^0-9.-]+/g, '')) || 0,
        details: {
          solution_title: formData.solution_title.trim(),
          problem_understanding: formData.problem_understanding.trim(),
          technology_used: formData.technology_used.trim(),
          innovation_usp: formData.innovation_usp.trim(),
          expected_outcome: formData.expected_outcome.trim(),
          implementation_plan: formData.implementation_plan.trim(),
          implementation_timeline: formData.implementation_timeline.trim(),
          infrastructure_requirements: formData.infrastructure_requirements.trim(),
          team_resources: formData.team_resources.trim(),
          cost_breakdown: formData.cost_breakdown.trim(),
          maintenance_cost: Number(String(formData.maintenance_cost).replace(/[^0-9.-]+/g, '')) || 0,
          pilot_duration_days: parseInt(formData.pilot_duration_days, 10) || 180,
          kpis: formData.kpis.trim(),
          previous_experience: formData.previous_experience.trim()
        },
        documents: formData.documents.map((d) => ({
          file_name: d.file_name,
          file_url: d.file_url,
          document_type: d.document_type
        }))
      };

      await submitApplication(payload);
      addToast('Application submitted successfully to Government Review Panel!', 'success');
      navigate('/startup/applications');
    } catch (err) {
      console.error('Application submission error:', err);
      addToast(err.message || 'Unable to submit application. Please check your data and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Loading State
  if (isLoadingChallenge) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-slate-200 shadow-xs max-w-2xl mx-auto my-12">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-900">Loading Challenge Details...</h3>
        <p className="text-xs text-slate-500 mt-1">Retrieving official procurement parameters from database.</p>
      </div>
    );
  }

  // 3. Challenge Not Found State
  if (!challenge) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-slate-200 shadow-xs max-w-lg mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900 mb-1">Challenge Not Found</h2>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          The requested challenge could not be loaded. Please return to the challenge catalog.
        </p>
        <Button variant="primary" onClick={() => navigate('/startup/challenges')}>
          Browse Challenges
        </Button>
      </div>
    );
  }

  // 4. Duplicate Application Prevention View
  if (alreadyAppliedApp) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-slate-200 shadow-xs max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Application Already Submitted
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-2">
            Your startup has already applied for this challenge
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Challenge: <strong>{challenge.title}</strong>
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Application ID:</span>
            <span className="font-mono font-bold text-slate-800">{alreadyAppliedApp.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Current Status:</span>
            <Badge status={alreadyAppliedApp.status} size="sm" />
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Submitted On:</span>
            <span className="text-slate-800">{alreadyAppliedApp.submittedDate || 'Recent'}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate('/startup/challenges')}>
            Browse Other Challenges
          </Button>
          <Button variant="primary" onClick={() => navigate('/startup/applications')}>
            View My Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-left">
      
      {/* 1. Header & Challenge Anchor Dossier */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/startup/challenges')}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Return to Challenges"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Official Government Procurement Application Form
              </span>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Submit Solution Proposal
              </h1>
            </div>
          </div>

          {/* DPIIT Verification Badge */}
          <div>
            {isDpiitVerified ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>DPIIT Verified Startup</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded text-xs font-semibold" title="DPIIT verification is verified on server side">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>DPIIT Verification Pending</span>
              </span>
            )}
          </div>
        </div>

        {/* Target Challenge Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 text-xs grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Target Challenge & Problem Statement
            </span>
            <div className="font-bold text-slate-900 text-sm line-clamp-1">{challenge.title}</div>
            <div className="text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              {challenge.problemDescription || challenge.problem_statement || challenge.description}
            </div>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Department
              </span>
              <span className="font-semibold text-blue-800">
                {challenge.department || challenge.government_departments?.name || 'Government Department'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-slate-700">
              <span>Budget Ceiling:</span>
              <strong className="text-emerald-700 font-bold">{challenge.budget || '₹ 75,00,000'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Step Progression Indicator */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[720px] gap-2">
          {STEPS.map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <React.Fragment key={s.num}>
                {s.num > 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 transition-colors ${
                      step >= s.num ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    // Allow clicking previous steps or validated forward
                    if (s.num < step) setStep(s.num);
                  }}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-left transition-all ${
                    s.num < step ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <div className="hidden sm:block">
                    <div
                      className={`text-xs font-bold whitespace-nowrap leading-tight ${
                        isCurrent ? 'text-blue-900' : isDone ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none">{s.desc}</div>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. Multi-Step Form Panels */}
      <form onSubmit={handleSubmitApplication} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 shadow-xs">
          
          {/* ========================================================================= */}
          {/* STEP 1: BASIC APPLICATION INFORMATION */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Step 1 of 7
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Basic Application Information & Technical Architecture
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define your proposal title, executive summary, core mechanism, and underlying technology stack.
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. Solution Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Solution Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.solution_title}
                    onChange={(e) => handleChange('solution_title', e.target.value)}
                    placeholder="e.g., AI-Driven Early Disease Outbreak Detection & Micro-Cluster Surveillance Platform"
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.solution_title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.solution_title && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.solution_title}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.solution_title</code>
                  </span>
                </div>

                {/* 2. Proposal / Executive Summary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Proposal / Executive Summary <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.proposal}
                    onChange={(e) => handleChange('proposal', e.target.value)}
                    placeholder="Provide a high-level executive summary of your proposed solution, target beneficiaries, operational readiness, and high-impact value proposition..."
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed ${
                      errors.proposal ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.proposal && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.proposal}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">applications.proposal</code>
                  </span>
                </div>

                {/* 3. Problem Understanding */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Problem Understanding & Public Sector Context <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.problem_understanding}
                    onChange={(e) => handleChange('problem_understanding', e.target.value)}
                    placeholder="Articulate your understanding of the government department's core challenges, current bottlenecks, and operational pain points..."
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed ${
                      errors.problem_understanding ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.problem_understanding && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.problem_understanding}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.problem_understanding</code>
                  </span>
                </div>

                {/* 4. Technical Solution */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Technical Solution Architecture & Mechanics <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.technical_solution}
                    onChange={(e) => handleChange('technical_solution', e.target.value)}
                    placeholder="Detail the technical architecture, algorithms, data pipelines, edge deployment mechanisms, and telemetry transmission protocols..."
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed ${
                      errors.technical_solution ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.technical_solution && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.technical_solution}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">applications.technical_solution</code>
                  </span>
                </div>

                {/* 5. Technology Used */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Technology Used & Software/Hardware Stack <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.technology_used}
                    onChange={(e) => handleChange('technology_used', e.target.value)}
                    placeholder="e.g. Edge ML on TensorFlow Lite, LoRaWAN Gateway, PostgreSQL, React Dashboard, Docker"
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.technology_used ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.technology_used && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.technology_used}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.technology_used</code>
                  </span>
                </div>

                {/* 6. Innovation / USP */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Innovation & Unique Selling Proposition (USP) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.innovation_usp}
                    onChange={(e) => handleChange('innovation_usp', e.target.value)}
                    placeholder="What makes your proprietary solution distinctly superior to legacy alternatives? Highlight patents, novel algorithms, cost reduction, or unique accuracy."
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed ${
                      errors.innovation_usp ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.innovation_usp && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.innovation_usp}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.innovation_usp</code>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: EXPECTED OUTCOME */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Step 2 of 7
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Expected Outcome & Key Performance Indicators (KPIs)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Describe what will improve, how success will be measured, and expected quantitative results.
                </p>
              </div>

              <div className="space-y-4">
                {/* 7. Expected Outcome */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Expected Measurable Outcome & Public Impact <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.expected_outcome}
                    onChange={(e) => handleChange('expected_outcome', e.target.value)}
                    placeholder="Describe direct improvements: e.g., 85% reduction in manual inspection time, early detection within 4 hours, estimated annual public savings of ₹2.4 Crores..."
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed ${
                      errors.expected_outcome ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.expected_outcome && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.expected_outcome}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.expected_outcome</code>
                  </span>
                </div>

                {/* 8. KPIs */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Key Performance Indicators (KPIs) Matrix <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.kpis}
                    onChange={(e) => handleChange('kpis', e.target.value)}
                    placeholder={`Define concrete KPI metrics:
1. Detection Latency: < 4 hours from sensor anomaly
2. Model Precision: > 92.5% accuracy in field test
3. Hardware Uptime: 99.2% continuous operational availability
4. Cost Efficiency: > 40% cheaper than traditional sampling`}
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed font-mono ${
                      errors.kpis ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.kpis && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.kpis}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.kpis</code>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: IMPLEMENTATION PLAN */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Step 3 of 7
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Implementation Plan & Sandbox Site Deployment
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Structure your deployment roadmap, milestone schedule, team allocation, and infrastructure requirements.
                </p>
              </div>

              <div className="space-y-4">
                {/* 9. Implementation Plan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Implementation Plan & Phased Methodology <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.implementation_plan}
                    onChange={(e) => handleChange('implementation_plan', e.target.value)}
                    placeholder="Detail phased execution: Site assessment, hardware provisioning, calibration, field deployment, staff training, live testing, telemetry integration, and final validation sign-off..."
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed ${
                      errors.implementation_plan ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.implementation_plan && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.implementation_plan}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.implementation_plan</code>
                  </span>
                </div>

                {/* 10. Implementation Timeline */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Implementation Timeline & Milestone Schedule <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.implementation_timeline}
                    onChange={(e) => handleChange('implementation_timeline', e.target.value)}
                    placeholder="e.g. Month 1: Hardware fabrication & Site reconnaissance. Month 2: On-site sandbox sensor installation. Months 3-4: Live telemetry sampling & AI calibration. Months 5-6: Third-party expert audit & final DPR submission."
                    className={`w-full px-3 py-2 text-xs border rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed ${
                      errors.implementation_timeline ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.implementation_timeline && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.implementation_timeline}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.implementation_timeline</code>
                  </span>
                </div>

                {/* 11. Infrastructure Requirements (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Infrastructure & Site Requirements <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.infrastructure_requirements}
                    onChange={(e) => handleChange('infrastructure_requirements', e.target.value)}
                    placeholder="List department facilities needed: Physical testbed access, AC power points, NIC cloud VPS server, or local telemetry network access..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.infrastructure_requirements</code>
                  </span>
                </div>

                {/* 12. Team Resources (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Team & Key Resource Allocation <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.team_resources}
                    onChange={(e) => handleChange('team_resources', e.target.value)}
                    placeholder="Key personnel: Principal Investigator, Lead ML Engineer, Embedded Firmware Engineer, Field Deployment Supervisor..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.team_resources</code>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: COST AND COMMERCIAL INFORMATION */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Step 4 of 7
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Cost & Commercial Proposal
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify your total pilot cost, line-item breakdown, estimated maintenance cost, and duration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 13. Estimated Total Cost */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Estimated Total Cost (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.estimated_cost}
                      onChange={(e) => handleChange('estimated_cost', e.target.value)}
                      placeholder="e.g. 5000000"
                      className={`w-full pl-8 pr-3 py-2 text-xs border rounded-md text-slate-900 bg-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors.estimated_cost ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.estimated_cost && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.estimated_cost}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">applications.estimated_cost</code> (Numeric)
                  </span>
                </div>

                {/* 16. Proposed Pilot Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Proposed Pilot Duration (Days) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="730"
                      value={formData.pilot_duration_days}
                      onChange={(e) => handleChange('pilot_duration_days', e.target.value)}
                      placeholder="e.g. 180"
                      className={`w-full pl-8 pr-3 py-2 text-xs border rounded-md text-slate-900 bg-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors.pilot_duration_days ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.pilot_duration_days && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.pilot_duration_days}</p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.pilot_duration_days</code> (Integer)
                  </span>
                </div>

                {/* 15. Expected Maintenance Cost */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Expected Annual Maintenance / O&M Cost (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.maintenance_cost}
                      onChange={(e) => handleChange('maintenance_cost', e.target.value)}
                      placeholder="e.g. 350000"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-md text-slate-900 bg-white font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.maintenance_cost</code> (Numeric)
                  </span>
                </div>

                {/* 14. Cost Breakdown */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Detailed Cost Breakdown & Budget Line Items <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.cost_breakdown}
                    onChange={(e) => handleChange('cost_breakdown', e.target.value)}
                    placeholder="Provide categorized budget: e.g. Hardware & Sensor Kits: ₹25,00,000 | Software Platform & API: ₹15,00,000 | Field Deployment & Staff: ₹10,00,000 | Audit & Testing: ₹5,00,000"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Database: <code className="font-mono">application_details.cost_breakdown</code>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: EXPERIENCE AND CREDENTIALS */}
          {/* ========================================================================= */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Step 5 of 7
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Experience & Track Record Credentials
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Summarize previous deployments, similar projects, enterprise clients, and technical achievements.
                </p>
              </div>

              <div>
                {/* 17. Previous Experience */}
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Previous Project Deployments & Relevant Technical Experience <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={5}
                  value={formData.previous_experience}
                  onChange={(e) => handleChange('previous_experience', e.target.value)}
                  placeholder={`Detail relevant credentials:
• Prior Government / Public Enterprise Sandbox pilots completed
• Similar technology deployments in healthcare, smart cities, or agriculture
• Published patents, proprietary algorithms, or ISO/CDSCO/CERT-In certifications
• Client references and key performance outcomes achieved`}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Database: <code className="font-mono">application_details.previous_experience</code>
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: SUPPORTING DOCUMENTS */}
          {/* ========================================================================= */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Step 6 of 7
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Supporting Documents & Proposals
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload pitch decks, detailed project reports (DPRs), certifications, and architecture schematics to Supabase storage.
                </p>
              </div>

              {/* Uploader Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Document Type
                    </label>
                    <select
                      value={selectedDocType}
                      onChange={(e) => setSelectedDocType(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {DOCUMENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Select File (.pdf, .docx, .png, .jpg, max 15MB)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                      onChange={(e) => {
                        setSelectedDocFile(e.target.files[0] || null);
                        setUploadError('');
                      }}
                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-600 font-medium">{uploadError}</p>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    icon={UploadCloud}
                    disabled={!selectedDocFile || isUploadingDoc}
                    onClick={handleUploadDocument}
                  >
                    {isUploadingDoc ? 'Uploading to Storage...' : 'Attach Document'}
                  </Button>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Attached Application Documents ({formData.documents.length})
                </span>

                {formData.documents.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-md text-center text-xs text-slate-400">
                    No documents attached yet. Documents are optional but highly recommended during expert evaluation.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-md shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-slate-800">{doc.file_name}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                                {doc.document_type}
                              </span>
                              {doc.file_size && <span>{doc.file_size}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {doc.downloadUrl && (
                            <a
                              href={doc.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-blue-600 hover:bg-blue-50 text-xs inline-flex items-center gap-1 font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(idx)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 text-xs transition-colors cursor-pointer"
                            title="Remove Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-[10px] text-slate-400 block">
                  Database: <code className="font-mono">application_documents</code>
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 7: REVIEW BEFORE SUBMISSION */}
          {/* ========================================================================= */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Step 7 of 7
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Review Application & Legal Declaration
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify the entire solution submission before final lodgement on the Government Review Board.
                </p>
              </div>

              {/* Review Sections */}
              <div className="space-y-4 text-xs">
                
                {/* 1. Basic Information Review */}
                <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      1. Basic Information & Solution Architecture
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Solution Title</span>
                      <span className="font-bold text-slate-900">{formData.solution_title || 'N/A'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Proposal Summary</span>
                      <p className="text-slate-800 leading-relaxed whitespace-pre-line">{formData.proposal || 'N/A'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Problem Understanding</span>
                      <p className="text-slate-800 leading-relaxed whitespace-pre-line">{formData.problem_understanding || 'N/A'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Technical Solution</span>
                      <p className="text-slate-800 leading-relaxed whitespace-pre-line">{formData.technical_solution || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Technology Stack</span>
                      <span className="font-semibold text-slate-800">{formData.technology_used || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Innovation / USP</span>
                      <span className="font-semibold text-slate-800">{formData.innovation_usp || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Expected Outcomes Review */}
                <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      2. Expected Outcomes & Key Performance Indicators
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-2 text-slate-700 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Expected Outcome</span>
                      <p className="text-slate-800 leading-relaxed">{formData.expected_outcome || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Key Performance Indicators</span>
                      <p className="text-slate-800 font-mono whitespace-pre-line leading-relaxed bg-white p-2 rounded border border-slate-200">
                        {formData.kpis || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Implementation Review */}
                <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      3. Implementation Plan & Sandbox Deployment
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-2 text-slate-700 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Implementation Plan</span>
                      <p className="text-slate-800 leading-relaxed">{formData.implementation_plan || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Implementation Timeline</span>
                      <p className="text-slate-800 leading-relaxed">{formData.implementation_timeline || 'N/A'}</p>
                    </div>
                    {formData.infrastructure_requirements && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Infrastructure Requirements</span>
                        <p className="text-slate-800 leading-relaxed">{formData.infrastructure_requirements}</p>
                      </div>
                    )}
                    {formData.team_resources && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Team Allocation</span>
                        <p className="text-slate-800 leading-relaxed">{formData.team_resources}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Cost Review */}
                <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      4. Cost & Commercial Proposal
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Total Cost</span>
                      <span className="text-base font-bold text-emerald-700">
                        ₹ {Number(formData.estimated_cost || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Proposed Pilot Duration</span>
                      <span className="font-bold text-slate-800">{formData.pilot_duration_days} Days</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Maintenance</span>
                      <span className="font-bold text-slate-800">
                        ₹ {Number(formData.maintenance_cost || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    {formData.cost_breakdown && (
                      <div className="sm:col-span-3">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Cost Breakdown</span>
                        <p className="text-slate-800">{formData.cost_breakdown}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Experience Review */}
                {formData.previous_experience && (
                  <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                        5. Previous Experience & Credentials
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(5)}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed pt-1">
                      {formData.previous_experience}
                    </p>
                  </div>
                )}

                {/* 6. Documents Review */}
                <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      6. Attached Supporting Documents ({formData.documents.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(6)}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  {formData.documents.length === 0 ? (
                    <p className="text-slate-400 italic text-xs pt-1">No documents attached.</p>
                  ) : (
                    <ul className="divide-y divide-slate-200 text-xs pt-1">
                      {formData.documents.map((d, i) => (
                        <li key={i} className="py-1.5 flex justify-between items-center">
                          <span className="font-semibold text-slate-800">{d.file_name}</span>
                          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {d.document_type}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Legal Confirmation Box */}
                <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-blue-950">Statutory Legal Undertaking</h4>
                      <p className="text-[11px] text-blue-900 leading-relaxed mt-0.5">
                        By submitting this application, you certify that all technical specifications, cost estimations, and credentials represent authentic, auditable records.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 pt-2 border-t border-blue-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmation_checked}
                      onChange={(e) => handleChange('confirmation_checked', e.target.checked)}
                      className="h-4.5 w-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5 shrink-0 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-900 leading-snug">
                      I confirm that the information provided is accurate and complete.
                    </span>
                  </label>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* 4. Navigation Buttons */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={step === 1 || isSubmitting}
            onClick={handlePrevStep}
          >
            Previous Step
          </Button>

          <div className="flex items-center gap-3">
            {step < 7 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNextStep}
              >
                <span>Continue to {STEPS[step]?.label}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!formData.confirmation_checked || isSubmitting}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6"
              >
                {isSubmitting ? (
                  <span>Submitting your application...</span>
                ) : (
                  <span>Submit Application</span>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
