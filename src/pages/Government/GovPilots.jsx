import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  CheckCircle2,
  Clock,
  FileCheck2,
  Building2,
  Calendar,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Download,
  Eye,
  AlertCircle,
  MessageSquare,
  BarChart3,
  FileText
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';
import ChartCard from '../../components/Common/ChartCard';

const GovPilots = () => {
  const { pilots, submitPilotValidation } = useApp();

  const [selectedPilotId, setSelectedPilotId] = useState(pilots[0]?.id || 'PILOT-2026-001');
  const [selectedEvidenceFile, setSelectedEvidenceFile] = useState(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationComments, setValidationComments] = useState('');
  const [validationDecision, setValidationDecision] = useState('Validated');

  const currentPilot = pilots.find((p) => p.id === selectedPilotId) || pilots[0];

  // Performance Chart Data using Chart.js
  const performanceChartData = {
    labels: currentPilot?.performanceChart?.labels || ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'],
    datasets: [
      {
        label: 'Actual Measured Latency (Min - Lower is better)',
        data: currentPilot?.performanceChart?.detectionLatency || [45, 18, 12, 9, 8.5],
        backgroundColor: '#059669',
        borderColor: '#047857',
        borderWidth: 2,
        borderRadius: 4
      },
      {
        label: 'Government Target Threshold (15 Min Max)',
        data: currentPilot?.performanceChart?.targetLatency || [15, 15, 15, 15, 15],
        backgroundColor: '#dc2626',
        borderColor: '#b91c1c',
        borderWidth: 2,
        type: 'line',
        borderDash: [5, 5],
        fill: false
      }
    ]
  };

  const handleValidationSubmit = () => {
    submitPilotValidation(currentPilot.id, validationDecision, validationComments);
    setIsValidationModalOpen(false);
    setValidationComments('');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Pilot Selector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Field Trials & KPI Validation Console</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Pilot & Validation Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time milestone progress, sensor telemetry, evidence audits, and expert validation signoffs.
          </p>
        </div>

        {/* Active Pilot Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase text-slate-500 whitespace-nowrap">
            Select Pilot:
          </label>
          <select
            value={selectedPilotId}
            onChange={(e) => setSelectedPilotId(e.target.value)}
            className="text-xs font-semibold py-2 px-3 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {pilots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.startupName} ({p.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. PILOT OVERVIEW CARD */}
      <div className="gov-card p-6 bg-white shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-slate-500">
                {currentPilot.id}
              </span>
              <Badge status={currentPilot.status} size="sm" />
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {currentPilot.category}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {currentPilot.challengeTitle}
            </h2>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Selected Startup: <strong className="text-blue-800 font-bold">{currentPilot.startupName}</strong> • {currentPilot.department}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Overall Progress
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {currentPilot.overallProgress}%
              </span>
            </div>
            <div className="w-16 bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${currentPilot.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Pilot Location
              </span>
              <span className="font-semibold text-slate-800">
                {currentPilot.location}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Duration & Timeline
              </span>
              <span className="font-semibold text-slate-800">
                {currentPilot.duration} ({currentPilot.startDate} to {currentPilot.endDate})
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Sanctioned Budget
              </span>
              <span className="font-bold text-emerald-800">
                {currentPilot.budget}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Validation Status
              </span>
              <span className="font-bold text-slate-900">
                {currentPilot.expertValidation?.validationStatus || 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MILESTONES SECTION */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pilot Milestones & Deliverables ({currentPilot.milestones?.length || 5})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured phased deliverables tracked against telemetry data and evidence audits.
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {(currentPilot.milestones || []).map((m, idx) => {
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
                    : 'bg-slate-50/50 border-slate-200'
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
                      {m.completionDate && (
                        <span className="text-[11px] text-slate-500">
                          Target / Completed: {m.completionDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge status={m.status} size="sm" />
                    <span className="text-xs font-bold text-slate-800">
                      {m.progress}%
                    </span>
                  </div>
                </div>

                {m.description && (
                  <p className="text-xs text-slate-600 mb-3 pl-8 leading-relaxed">
                    {m.description}
                  </p>
                )}

                {/* Progress bar */}
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

      {/* 3. PERFORMANCE SECTION: TARGET VS ACTUAL (CHART.JS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard
            title="Performance KPI Validation: Target vs Actual"
            subtitle="Real-time measured anomaly alert latency vs government baseline target"
            type="bar"
            data={performanceChartData}
            height={280}
            action={
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Target Exceeded (8.5 min vs 15 min Target)
              </span>
            }
          />
        </div>

        {/* KPI Target vs Actual Cards */}
        <div className="gov-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Target vs Actual Metrics
            </h3>
            <div className="space-y-3 text-xs">
              {(currentPilot.kpiData || []).map((kpi, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="font-semibold text-slate-800">{kpi.metric}</div>
                  <div className="grid grid-cols-3 gap-1 mt-1 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Baseline</span>
                      <span className="text-slate-600 font-medium">{kpi.baseline}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Target</span>
                      <span className="text-blue-700 font-bold">{kpi.target}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Actual</span>
                      <span className="text-emerald-700 font-bold">{kpi.actual}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            All measured metrics independently audited by State Water Testing Directorate.
          </div>
        </div>
      </div>

      {/* 4. EVIDENCE REPOSITORY SECTION */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Submitted Pilot Evidence & Technical Artifacts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified test reports, telemetry logs, laboratory certificates, and geotagged field demonstration files.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Immutable Audit Trail
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>File Name & Type</th>
                <th>Submission Date</th>
                <th>Associated Milestone</th>
                <th>Audit Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(currentPilot.milestones || []).flatMap((m) =>
                (m.evidence || []).map((ev, i) => (
                  <tr key={`${m.id}-${i}`}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {ev.name}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">
                            {ev.type || 'Document'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 font-medium">
                        {ev.date}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-800 font-semibold">
                        {m.title.split(':')[0]}
                      </span>
                    </td>
                    <td>
                      <Badge status={ev.status} size="sm" />
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => setSelectedEvidenceFile(ev)}
                        >
                          View
                        </Button>
                        <button
                          onClick={() => alert(`Simulated downloading: ${ev.name}`)}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. VALIDATION SIGN-OFF SECTION */}
      <div className="gov-card p-6 bg-slate-900 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Expert Pilot Validation & Direct Procurement Recommendation
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Evaluator assessment by <strong className="text-white">{currentPilot.expertValidation?.expertName || 'Technical Screening Panel'}</strong>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge status={currentPilot.expertValidation?.validationStatus || 'Pending'} />
            <span className="text-xs text-slate-400">
              Signed: {currentPilot.expertValidation?.validationDate || '2026-08-29'}
            </span>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-slate-800/80 border border-slate-700 text-xs leading-relaxed text-slate-200">
          <strong className="text-white block mb-1">Expert Evaluator Finding & Audit Summary:</strong>
          {currentPilot.expertValidation?.comments ||
            'The pilot has validated all mandatory KPIs. Sensor accuracy and telemetry latency beat baseline targets. Recommended for direct procurement.'}
        </div>

        {/* Validation Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Government Procuring Entity Sign-off Actions:
          </span>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="border-amber-500 text-amber-300 hover:bg-amber-950/40"
              icon={MessageSquare}
              onClick={() => {
                setValidationDecision('Needs Clarification');
                setIsValidationModalOpen(true);
              }}
            >
              Request Clarification
            </Button>
            <Button
              variant="success"
              size="sm"
              icon={CheckCircle2}
              onClick={() => {
                setValidationDecision('Validated');
                setIsValidationModalOpen(true);
              }}
            >
              Validate & Approve for Procurement
            </Button>
          </div>
        </div>
      </div>

      {/* VALIDATION CONFIRMATION / CLARIFICATION MODAL */}
      <Modal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        title={
          validationDecision === 'Validated'
            ? 'Sign-off Pilot Validation'
            : 'Request Technical Clarification'
        }
        subtitle={`${currentPilot.id} • ${currentPilot.startupName}`}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsValidationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={validationDecision === 'Validated' ? 'success' : 'secondary'}
              onClick={handleValidationSubmit}
            >
              Confirm {validationDecision}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-700">
            {validationDecision === 'Validated'
              ? 'By signing off on this pilot, you certify that all KPI benchmarks have been conclusively verified and this solution is eligible for Direct Procurement Order (DPO) issuance.'
              : 'Specify the technical parameters, calibration logs, or additional evidence required from the startup.'}
          </p>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Officer Comments / Instructions *
            </label>
            <textarea
              rows={4}
              value={validationComments}
              onChange={(e) => setValidationComments(e.target.value)}
              placeholder="Enter official sign-off remarks or clarification points..."
              className="w-full border border-slate-300 rounded-md p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* EVIDENCE VIEWER MODAL */}
      {selectedEvidenceFile && (
        <Modal
          isOpen={!!selectedEvidenceFile}
          onClose={() => setSelectedEvidenceFile(null)}
          title={`Evidence Inspection: ${selectedEvidenceFile.name}`}
          subtitle={`Submitted on ${selectedEvidenceFile.date} • Type: ${selectedEvidenceFile.type || 'Document'}`}
          maxWidth="max-w-2xl"
          footer={
            <Button
              variant="outline"
              onClick={() => setSelectedEvidenceFile(null)}
            >
              Close Preview
            </Button>
          }
        >
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-3">
            <FileText className="w-12 h-12 text-blue-600 mx-auto" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedEvidenceFile.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Digitally signed and cryptographically verified on GovCloud Storage.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Authenticity (SHA-256 Hash Match)
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GovPilots;
