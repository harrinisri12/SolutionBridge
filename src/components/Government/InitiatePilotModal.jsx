import React, { useState, useEffect } from 'react';
import {
  Zap,
  Building2,
  Calendar,
  MapPin,
  Target,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  FileCheck2,
  DollarSign
} from 'lucide-react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Badge from '../Common/Badge';
import { useApp } from '../../context/AppContext';

const InitiatePilotModal = ({ isOpen, onClose, application, onPilotCreated }) => {
  const { createPilot, addToast } = useApp();

  const [location, setLocation] = useState('');
  const [durationDays, setDurationDays] = useState(180);
  const [baselineValue, setBaselineValue] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [milestones, setMilestones] = useState([
    {
      title: 'Phase 1: Environment Setup & Baseline Calibration',
      description: 'Deploy hardware/software infrastructure at test site and calibrate baseline metrics.',
      target_date: ''
    },
    {
      title: 'Phase 2: Live Deployment & Telemetry Data Ingestion',
      description: 'Operationalize pilot in real field conditions and stream continuous sensor telemetry.',
      target_date: ''
    },
    {
      title: 'Phase 3: Final Efficacy Benchmarking & Validation Audit',
      description: 'Complete pilot run, verify KPI targets against baseline, and submit evidence for expert validation.',
      target_date: ''
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (application) {
      setLocation(application.location || 'Municipal Pilot Zone');
      setDurationDays(application.pilotDurationDays || 180);
      setBaselineValue('20');
      setTargetValue('15');
      setErrorMsg('');
    }
  }, [application]);

  if (!application) return null;

  const handleMilestoneChange = (index, field, value) => {
    setMilestones((prev) =>
      prev.map((m, idx) => (idx === index ? { ...m, [field]: value } : m))
    );
  };

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        title: `Phase ${prev.length + 1}: Custom Deliverable`,
        description: '',
        target_date: ''
      }
    ]);
  };

  const removeMilestone = (index) => {
    if (milestones.length <= 1) return;
    setMilestones((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!location || !location.trim()) {
      setErrorMsg('Please specify a pilot deployment location.');
      return;
    }

    const durationNum = Number(durationDays);
    if (!durationNum || durationNum <= 0) {
      setErrorMsg('Duration must be a positive integer in days.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createPilot({
        application_id: application.id,
        applicationId: application.id,
        location: location.trim(),
        duration_days: durationNum,
        durationDays: durationNum,
        baseline_value: baselineValue !== '' ? Number(baselineValue) : null,
        target_value: targetValue !== '' ? Number(targetValue) : null,
        milestones
      });

      if (onPilotCreated) {
        onPilotCreated(created);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to initiate pilot deployment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Initiate Sandbox Pilot Deployment"
      subtitle={`Application: ${application.id} • ${application.startupName}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] text-slate-500">
            Pilot will be initialized in <strong className="text-slate-700">Not Started</strong> state for formal sanction.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Zap}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Initiating Pilot...' : 'Confirm & Launch Pilot'}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Selected Application Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Selected Startup Proposal
              </span>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                {application.startupName}
              </h4>
              <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                {application.challengeTitle}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Status</span>
              <Badge status={application.status} size="sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-slate-600 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 block">Department:</span>
              <span className="font-semibold text-slate-800">{application.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">DPIIT Status:</span>
              <span className="font-semibold text-emerald-700">
                {application.dpiitVerified ? 'Verified Startup' : 'Registered'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Estimated Cost:</span>
              <span className="font-semibold text-slate-900">{application.estimatedCost}</span>
            </div>
          </div>
        </div>

        {/* 2. Pilot Parameters */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            Pilot Operational Parameters
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Field Deployment Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ward 12 Municipal Water Station, Zone 3"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Pilot Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                max="730"
                required
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Baseline Metric Value</span>
                <span className="text-[10px] text-slate-400 font-normal">(Current State)</span>
              </label>
              <input
                type="number"
                step="any"
                value={baselineValue}
                onChange={(e) => setBaselineValue(e.target.value)}
                placeholder="e.g. 20 (Baseline Min/Hours/Error)"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Target KPI Benchmark *</span>
                <span className="text-[10px] text-blue-600 font-normal">(Required Goal)</span>
              </label>
              <input
                type="number"
                step="any"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="e.g. 15 (Target Benchmark)"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Milestones Setup */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Pilot Deliverable Milestones ({milestones.length})
            </h4>
            <button
              type="button"
              onClick={addMilestone}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phase</span>
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                      placeholder="Milestone Deliverable Title"
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div className="w-36">
                    <input
                      type="date"
                      value={m.target_date}
                      onChange={(e) => handleMilestoneChange(idx, 'target_date', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs text-slate-800"
                    />
                  </div>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Remove Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={m.description}
                  onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                  placeholder="Deliverable description or verification criteria..."
                  className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-[11px] text-slate-600"
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default InitiatePilotModal;
