import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  Building2,
  Calendar,
  MapPin,
  TrendingUp,
  MessageSquare,
  Award,
  Check
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';
import ChartCard from '../../components/Common/ChartCard';
import EmptyState from '../../components/Common/EmptyState';

const ExpertValidation = () => {
  const { pilots, verifyEvidence, submitPilotValidation, currentUser } = useApp();
  const navigate = useNavigate();

  const [selectedPilotId, setSelectedPilotId] = useState(pilots[0]?.id || '');
  const [validationResult, setValidationResult] = useState('Validated');
  const [validationComments, setValidationComments] = useState('');
  const [selectedEvidencePreview, setSelectedEvidencePreview] = useState(null);

  const currentPilot = pilots.find((p) => p.id === selectedPilotId) || pilots[0];

  if (!currentPilot) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Independent Scientific Validation Console</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Pilot Field Validation & Audit Sign-Off
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Audit empirical telemetry data, verify submitted evidence artifacts, and issue final validation recommendations.
            </p>
          </div>
        </div>
        <EmptyState
          icon={ShieldCheck}
          title="No Pilot Validations Assigned"
          description="You currently have no field pilots assigned for independent scientific validation. Validations will appear here when assigned by the government department."
          actionText="Review Evaluations"
          onAction={() => navigate('/expert/evaluation')}
        />
      </div>
    );
  }

  // Baseline vs Target vs Actual Chart using Chart.js
  const kpiComparisonChartData = {
    labels: [
      'Contamination Latency (Min)',
      'Telemetry Uptime (%)',
      'Accuracy vs Lab (%)',
      'Cost Reduction (%)'
    ],
    datasets: [
      {
        label: 'Baseline (Traditional Method)',
        data: [2880 / 60, 75.0, 60.0, 0], // in hours/percentage
        backgroundColor: '#64748b',
        borderRadius: 4
      },
      {
        label: 'Government Target Benchmark',
        data: [15 / 60, 99.0, 90.0, 30.0],
        backgroundColor: '#2563eb',
        borderRadius: 4
      },
      {
        label: 'Actual Validated Performance',
        data: [8.5 / 60, 99.6, 94.2, 38.5],
        backgroundColor: '#059669',
        borderRadius: 4
      }
    ]
  };

  const handleFinalValidationSubmit = (e) => {
    e.preventDefault();
    submitPilotValidation(currentPilot.id, validationResult, validationComments);
    setValidationComments('');
  };

  return (
    <div className="space-y-6">
      {/* Top Title Banner & Pilot Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Independent Scientific Validation Console</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Pilot Field Validation & Audit Sign-Off
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit empirical telemetry data, verify submitted evidence artifacts, and issue final validation recommendations.
          </p>
        </div>

        {/* Pilot Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase text-slate-500 whitespace-nowrap">
            Audit Target:
          </label>
          <select
            value={selectedPilotId}
            onChange={(e) => setSelectedPilotId(e.target.value)}
            className="text-xs font-semibold py-2 px-3 border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {pilots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.startupName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. PILOT INFORMATION CARD */}
      <div className="gov-card p-6 shadow-xs">
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
              Contractor: <strong className="text-blue-800 font-bold">{currentPilot.startupName}</strong> • {currentPilot.department}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Field Progress
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {currentPilot.overallProgress}%
              </span>
            </div>
            <div className="w-16 bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-3 rounded-full"
                style={{ width: `${currentPilot.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

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
                Duration & Schedule
              </span>
              <span className="font-semibold text-slate-800">
                {currentPilot.duration} ({currentPilot.startDate} – {currentPilot.endDate})
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Grant Budget
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
                Current Audit State
              </span>
              <span className="font-bold text-emerald-700">
                {currentPilot.expertValidation?.validationStatus || 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MILESTONES COMPLETION AUDIT */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Milestone Completion & Verification Audit ({currentPilot.milestones?.length || 5})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify completion claims for each milestone before validating final pilot reports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {(currentPilot.milestones || []).map((m, idx) => {
            const isDone = m.progress === 100;
            return (
              <div
                key={m.id || idx}
                className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{m.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Target Date: {m.completionDate || '2026-08-31'}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge status={m.status} size="sm" />
                  <span className="text-[11px] font-bold text-slate-700 block mt-1">
                    {m.progress}% Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PERFORMANCE: BASELINE VS TARGET VS ACTUAL (CHART.JS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard
            title="Scientific Performance Audit: Baseline vs Target vs Actual"
            subtitle="Comparison of empirical field metrics against government tender benchmarks"
            type="bar"
            data={kpiComparisonChartData}
            height={280}
            action={
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                100% KPI Benchmark Pass
              </span>
            }
          />
        </div>

        {/* Detailed KPI Card */}
        <div className="gov-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Empirical Field Results
            </h3>
            <div className="space-y-3 text-xs">
              {(currentPilot.kpiData || []).map((kpi, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="font-semibold text-slate-800">{kpi.metric}</div>
                  <div className="grid grid-cols-3 gap-1 mt-1 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Baseline</span>
                      <span className="text-slate-600 font-medium">{kpi.baseline}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Target</span>
                      <span className="text-blue-700 font-bold">{kpi.target}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Actual</span>
                      <span className="text-emerald-700 font-bold">{kpi.actual}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Passed All Minimum Public Procurement Thresholds</span>
          </div>
        </div>
      </div>

      {/* 4. EVIDENCE REVIEW LIST WITH VERIFY / CLARIFY / REJECT ACTIONS */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Submitted Artifacts & Evidence Inspection
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect raw files, test logs, and photos. Mark each artifact as Verified, Needs Clarification, or Rejected.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Evidence File</th>
                <th>Milestone</th>
                <th>Submitted Date</th>
                <th>Verification Status</th>
                <th className="text-right">Audit Actions</th>
              </tr>
            </thead>
            <tbody>
              {(currentPilot.milestones || []).flatMap((m) =>
                (m.evidence || []).map((ev, i) => (
                  <tr key={`${m.id}-${i}`}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">
                            {ev.name}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase">
                            {ev.type || 'Document'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-slate-800">
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
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEvidencePreview(ev)}
                        >
                          View
                        </Button>
                        <button
                          onClick={() => verifyEvidence(currentPilot.id, m.id, ev.name, 'Verified')}
                          className="px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Verify"
                        >
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => verifyEvidence(currentPilot.id, m.id, ev.name, 'Needs Clarification')}
                          className="px-2 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                          title="Request Clarification"
                        >
                          💬 Clarify
                        </button>
                        <button
                          onClick={() => verifyEvidence(currentPilot.id, m.id, ev.name, 'Rejected')}
                          className="px-2 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Reject"
                        >
                          ✗ Reject
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

      {/* 5. FINAL VALIDATION REPORT SUBMISSION */}
      <div className="gov-card p-6 bg-slate-900 text-white shadow-md">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Final Pilot Validation Result & Procurement Recommendation
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Submit your formal evaluator sign-off to authorize or withhold direct government procurement.
            </p>
          </div>
        </div>

        <form onSubmit={handleFinalValidationSubmit} className="space-y-4 text-xs">
          {/* Options: Validated, Needs Clarification, Not Validated */}
          <div>
            <label className="block font-bold text-slate-300 uppercase mb-2">
              Pilot Validation Result *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Validated', label: 'Validated (Cleared for DPO)', desc: 'Meets/exceeds all mandatory KPIs' },
                { id: 'Needs Clarification', label: 'Needs Clarification', desc: 'Additional data or tests required' },
                { id: 'Not Validated', label: 'Not Validated (Failed)', desc: 'Did not meet baseline benchmarks' }
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
                    validationResult === opt.id
                      ? 'border-blue-500 bg-blue-950/60 ring-2 ring-blue-500/20 text-white'
                      : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{opt.label}</span>
                    <input
                      type="radio"
                      name="validationResult"
                      value={opt.id}
                      checked={validationResult === opt.id}
                      onChange={(e) => setValidationResult(e.target.value)}
                      className="accent-blue-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Comments field */}
          <div>
            <label className="block font-bold text-slate-300 uppercase mb-1">
              Official Evaluator Assessment & Findings *
            </label>
            <textarea
              rows={4}
              value={validationComments}
              onChange={(e) => setValidationComments(e.target.value)}
              placeholder="Detail the telemetry conclusions, accuracy vs standard lab assays, uptime observations, and justification for procurement recommendation..."
              className="w-full border border-slate-700 rounded-md p-2.5 text-xs text-white bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Evaluator: <strong>{currentUser.name}</strong> (Technical Screening Committee)
            </span>
            <Button
              type="submit"
              variant="success"
              icon={Check}
            >
              Submit Final Validation Report
            </Button>
          </div>
        </form>
      </div>

      {/* EVIDENCE PREVIEW MODAL */}
      {selectedEvidencePreview && (
        <Modal
          isOpen={!!selectedEvidencePreview}
          onClose={() => setSelectedEvidencePreview(null)}
          title={`Evidence Preview: ${selectedEvidencePreview.name}`}
          subtitle={`Submitted ${selectedEvidencePreview.date} • Type: ${selectedEvidencePreview.type || 'Document'}`}
          maxWidth="max-w-xl"
          footer={
            <Button
              variant="outline"
              onClick={() => setSelectedEvidencePreview(null)}
            >
              Close
            </Button>
          }
        >
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-2 text-xs">
            <FileText className="w-10 h-10 text-blue-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">
              {selectedEvidencePreview.name}
            </h4>
            <p className="text-slate-500">
              Audit status: <strong>{selectedEvidencePreview.status}</strong>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpertValidation;
