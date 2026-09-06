import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  UploadCloud,
  FileText,
  TrendingUp,
  Download,
  AlertCircle,
  Eye,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';
import ChartCard from '../../components/Common/ChartCard';
import FileUpload from '../../components/Common/FileUpload';
import EmptyState from '../../components/Common/EmptyState';

const PILOT_TIMELINE = [
  { id: 'selected', label: 'Selected', status: 'completed' },
  { id: 'approved', label: 'Approved', status: 'completed' },
  { id: 'deployment', label: 'Deployment', status: 'completed' },
  { id: 'testing', label: 'Testing', status: 'completed' },
  { id: 'validation', label: 'Validation', status: 'active' },
  { id: 'completed', label: 'Completed', status: 'pending' }
];

const StartupPilot = () => {
  const { pilots, uploadPilotEvidence, currentUser } = useApp();
  const navigate = useNavigate();

  const myPilot = pilots[0];
  const [selectedMilestoneForUpload, setSelectedMilestoneForUpload] = useState(myPilot?.milestones?.[0]?.id || 'm-1');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (!myPilot) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Active Pilot Deployment Console</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Pilot Field Deployment Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor field deployment KPIs, upload milestone deliverables, and view expert validation progress.
            </p>
          </div>
        </div>
        <EmptyState
          icon={Zap}
          title="No Active Pilot Assigned"
          description="Your startup does not have an active pilot deployment yet. Once a submitted proposal is approved and cleared for field pilot by the government department, your pilot console will be activated here."
          actionText="Browse Open Challenges"
          onAction={() => navigate('/startup/challenges')}
        />
      </div>
    );
  }

  // Performance Chart Data (Baseline vs Target vs Current Value)
  const performanceChartData = {
    labels: ['Baseline Traditional', 'Current Actual Value', 'Government Target'],
    datasets: [
      {
        label: 'Field KPI Metric Comparison',
        data: [
          myPilot.baselineValue || 100,
          myPilot.actualValue || 8.5,
          myPilot.targetValue || 15
        ],
        backgroundColor: ['#64748b', '#059669', '#dc2626'],
        borderRadius: 4
      }
    ]
  };

  const handleEvidenceUpload = (fileData) => {
    uploadPilotEvidence(myPilot.id, selectedMilestoneForUpload, fileData);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Active Pilot Deployment Console</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            My Pilot: {myPilot?.startupName || 'AquaTech Solutions'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor field deployment KPIs, upload milestone deliverables, and view expert validation progress.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={UploadCloud}
          onClick={() => setIsUploadModalOpen(true)}
        >
          + Submit Milestone Evidence
        </Button>
      </div>

      {/* 1. PILOT OVERVIEW CARD */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-slate-500">
                {myPilot.id}
              </span>
              <Badge status={myPilot.status} size="sm" />
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {myPilot.category}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {myPilot.challengeTitle}
            </h2>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              Procuring Department: <strong className="text-slate-800">{myPilot.department}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Overall Pilot Progress
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {myPilot.overallProgress}%
              </span>
            </div>
            <div className="w-20 bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-3 rounded-full"
                style={{ width: `${myPilot.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Pilot Location
              </span>
              <span className="font-semibold text-slate-800">
                {myPilot.location}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Duration & Schedule
              </span>
              <span className="font-semibold text-slate-800">
                {myPilot.duration} ({myPilot.startDate} – {myPilot.endDate})
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Sanctioned Grant Budget
              </span>
              <span className="font-bold text-emerald-800">
                {myPilot.budget}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Deployment Status
              </span>
              <span className="font-bold text-emerald-700">
                Active in Field (99.6% Uptime)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PILOT LIFECYCLE TIMELINE */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Pilot Project Lifecycle Timeline
          </span>
          <span className="text-xs font-semibold text-blue-700">
            Current: Validation Phase (Stage 5)
          </span>
        </div>

        <div className="flex items-center justify-between overflow-x-auto gap-2 py-2">
          {PILOT_TIMELINE.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2 min-w-max">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.status === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : step.status === 'active'
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.status === 'completed' ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    step.status === 'active'
                      ? 'text-blue-900 font-bold'
                    : step.status === 'completed'
                    ? 'text-emerald-900'
                    : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < PILOT_TIMELINE.length - 1 && (
                <div className="w-8 h-0.5 bg-slate-200 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. MILESTONES SECTION */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Contractual Milestones & Deliverables ({myPilot.milestones?.length || 5})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit proof and laboratory test data for each phased milestone to release grant tranches.
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {(myPilot.milestones || []).map((m, idx) => {
            const isDone = m.progress === 100;
            const isInProgress = m.progress > 0 && m.progress < 100;

            return (
              <div
                key={m.id || idx}
                className={`p-4 rounded-lg border transition-all ${
                  isDone
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isInProgress
                    ? 'bg-blue-50/40 border-blue-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isInProgress
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {m.title}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Target Date: {m.completionDate || '2026-08-31'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge status={m.status} size="sm" />
                    <span className="text-xs font-bold text-slate-800">
                      {m.progress}%
                    </span>
                    {!isDone && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setSelectedMilestoneForUpload(m.id);
                          setIsUploadModalOpen(true);
                        }}
                      >
                        Upload Evidence
                      </Button>
                    )}
                  </div>
                </div>

                {m.description && (
                  <p className="text-xs text-slate-600 mb-2 pl-8 leading-relaxed">
                    {m.description}
                  </p>
                )}

                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden pl-8">
                  <div
                    className={`h-1.5 rounded-full ${
                      isDone ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PERFORMANCE SECTION (CHART.JS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard
            title="Measured Anomaly Latency Benchmark"
            subtitle="Baseline vs field trials vs current actual vs government target"
            type="bar"
            data={performanceChartData}
            height={280}
            action={
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                176% Target Achievement
              </span>
            }
          />
        </div>

        {/* KPI Achievement Summary Card */}
        <div className="gov-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Measured KPI Targets
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-500 font-medium">Contamination Detection Latency</div>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-slate-600">Target: &lt;15 min</span>
                  <span className="font-bold text-emerald-700 text-sm">8.5 min (Passed)</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-500 font-medium">Sensor Telemetry Uptime</div>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-slate-600">Target: 99.0%</span>
                  <span className="font-bold text-emerald-700 text-sm">99.6% (Passed)</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-500 font-medium">Accuracy vs Standard Lab Assay</div>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-slate-600">Target: 90.0%</span>
                  <span className="font-bold text-emerald-700 text-sm">94.2% (Passed)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All Target Thresholds Exceeded Successfully</span>
          </div>
        </div>
      </div>

      {/* 5. EVIDENCE SUBMISSION & UPLOADED FILES LIST */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Submitted Artifacts & Evidence Dossier
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Repository of technical test reports, field photos, and videos submitted for expert verification.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={UploadCloud}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload New File
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Artifact Name</th>
                <th>Category</th>
                <th>Milestone</th>
                <th>Uploaded Date</th>
                <th>Verification Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(myPilot.milestones || []).flatMap((m) =>
                (m.evidence || []).map((ev, i) => (
                  <tr key={`${m.id}-${i}`}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-900 text-xs">
                          {ev.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600">
                        {ev.type || 'Report'}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-slate-700">
                        {m.title.split(':')[0]}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600">{ev.date}</span>
                    </td>
                    <td>
                      <Badge status={ev.status} size="sm" />
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => alert(`Simulated Download: ${ev.name}`)}
                        className="text-xs font-semibold text-blue-600 hover:underline p-1 cursor-pointer"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EVIDENCE UPLOAD MODAL */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Submit Milestone Evidence & Telemetry Files"
        subtitle={`Uploading for ${myPilot.startupName} • ${myPilot.id}`}
        maxWidth="max-w-xl"
        footer={
          <Button
            variant="outline"
            onClick={() => setIsUploadModalOpen(false)}
          >
            Cancel
          </Button>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Select Associated Milestone *
            </label>
            <select
              value={selectedMilestoneForUpload}
              onChange={(e) => setSelectedMilestoneForUpload(e.target.value)}
              className="w-full border border-slate-300 rounded-md p-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {(myPilot.milestones || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <FileUpload onUpload={handleEvidenceUpload} />
        </div>
      </Modal>
    </div>
  );
};

export default StartupPilot;
