import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Building2,
  DollarSign,
  Download,
  Eye,
  FileCheck2,
  BarChart3,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Plus
} from 'lucide-react';
import { StatCard } from '../../components/Common/Card';
import ChartCard from '../../components/Common/ChartCard';
import Badge from '../../components/Common/Badge';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';

const GovProcurement = () => {
  const {
    procurementRecords,
    approveProcurement,
    updateMilestonePayment
  } = useApp();

  const [selectedRecord, setSelectedRecord] = useState(procurementRecords[0] || null);
  const [isDPOModalOpen, setIsDPOModalOpen] = useState(false);

  // Overview Counts
  const readyForProcurement = procurementRecords.filter((p) => p.procurementStatus === 'Approved' || p.status === 'approved').length;
  const inProgress = procurementRecords.filter((p) => p.procurementStatus === 'Procurement in Progress' || p.status === 'pending' || p.status === 'in_progress').length;
  const completedProcurement = procurementRecords.filter((p) => p.procurementStatus === 'Procured' || p.procurementStatus === 'Scaled' || p.status === 'paid').length;
  const solutionsScaled = procurementRecords.filter((p) => (p.scaleUpStatus || '').includes('Scaled') || (p.scaleUpStatus || '').includes('Expansion')).length;

  // Chart 1: Challenges by Category
  const categoryChartData = {
    labels: ['Water', 'Healthcare', 'Transport', 'Agriculture', 'Energy', 'Waste Management'],
    datasets: [
      {
        data: [4, 5, 3, 3, 2, 2],
        backgroundColor: ['#2563eb', '#059669', '#d97706', '#8b5cf6', '#0f2942', '#ec4899'],
        borderWidth: 0
      }
    ]
  };

  // Chart 2: Application Success Rate
  const applicationRateChartData = {
    labels: ['Submitted', 'Eligible / Screened', 'Shortlisted', 'Pilot Selected', 'Procured'],
    datasets: [
      {
        label: 'Proposals Funnel',
        data: [86, 72, 28, 14, 9],
        backgroundColor: '#2563eb',
        borderRadius: 4
      }
    ]
  };

  // Chart 3: Pilot Success Rate
  const pilotRateChartData = {
    labels: ['Total Pilots (21)', 'Passed All KPIs (19)', 'Procurement Sanctioned (14)', 'Statewide Scale (7)'],
    datasets: [
      {
        label: 'Validation Progression',
        data: [21, 19, 14, 7],
        backgroundColor: '#059669',
        borderRadius: 4
      }
    ]
  };

  // Chart 4: Procurement Budget & Impact
  const impactChartData = {
    labels: ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026 (Est.)'],
    datasets: [
      {
        label: 'Procurement Sanctions (₹ Cr)',
        data: [4.2, 8.5, 14.8, 24.5],
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Scale-up & Direct Procurement Portal</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Procurement & Scale-Up Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue Direct Procurement Orders (DPO) for validated startup solutions and manage milestone disbursements.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={() => alert('Simulated Export: Complete Innovation Procurement Dossier & Financial Audit Report (PDF)')}
        >
          Export Comprehensive Audit Dossier
        </Button>
      </div>

      {/* 1. PROCUREMENT OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Solutions Ready for Procurement"
          value={readyForProcurement}
          subtitle="100% KPI Validated"
          icon={ShieldCheck}
          trend="+2"
          trendLabel="newly cleared"
          color="emerald"
        />
        <StatCard
          title="Procurement in Progress"
          value={inProgress}
          subtitle="Tender Exemption Sanc."
          icon={CreditCard}
          trend="₹ 11.0 Cr"
          trendLabel="in active processing"
          color="blue"
        />
        <StatCard
          title="Completed Procurement"
          value={completedProcurement}
          subtitle="DPO Orders Executed"
          icon={CheckCircle2}
          trend="₹ 16.1 Cr"
          trendLabel="disbursed to startups"
          color="purple"
        />
        <StatCard
          title="Solutions Scaled"
          value={solutionsScaled}
          subtitle="Across Multiple Districts"
          icon={TrendingUp}
          trend="7.4x"
          trendLabel="citizen reach expansion"
          color="slate"
        />
      </div>

      {/* 2. PROCUREMENT TABLE */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Direct Procurement & Scale-up Register
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Government procurement contracts awarded under Direct Procurement Orders for validated innovations.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            {procurementRecords.length} Active Contracts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Startup & Solution</th>
                <th>Department</th>
                <th>Pilot Result</th>
                <th>Contract Value</th>
                <th>Procurement Status</th>
                <th>Scale-up Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {procurementRecords.map((pr) => (
                <tr key={pr.id}>
                  <td>
                    <div className="font-bold text-slate-900 text-sm">
                      {pr.startupName}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {pr.solutionName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {pr.id} • {pr.units}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs text-slate-800 font-medium">
                      {pr.department}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {pr.pilotResult.split('(')[0]}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-slate-900 text-sm">
                      {pr.contractValue}
                    </span>
                  </td>
                  <td>
                    <Badge status={pr.procurementStatus} size="sm" />
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-slate-700">
                      {pr.scaleUpStatus}
                    </span>
                  </td>
                  <td className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRecord(pr)}
                    >
                      Manage Payments
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. PAYMENT SECTION: MILESTONE-BASED DISBURSEMENTS */}
      {selectedRecord && (
        <div className="gov-card p-6 shadow-xs bg-slate-50/50 border-2 border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Milestone-Based Disbursement Schedule
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {selectedRecord.startupName} • {selectedRecord.solutionName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total Sanctioned Contract Value: <strong className="text-slate-900">{selectedRecord.contractValue}</strong>
              </p>
            </div>

            {selectedRecord.procurementStatus !== 'Procured' && selectedRecord.procurementStatus !== 'Scaled' && (
              <Button
                variant="success"
                size="sm"
                icon={CheckCircle2}
                onClick={() => setIsDPOModalOpen(true)}
              >
                Execute Direct Procurement Order (DPO)
              </Button>
            )}
          </div>

          <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse gov-table">
              <thead>
                <tr>
                  <th>Milestone & Deliverable</th>
                  <th>Amount</th>
                  <th>Completion</th>
                  <th>Payment Status</th>
                  <th className="text-right">Authorization</th>
                </tr>
              </thead>
              <tbody>
                {(selectedRecord.paymentMilestones || []).map((pm, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="font-semibold text-slate-900 text-xs">
                        {pm.milestone}
                      </div>
                    </td>
                    <td>
                      <span className="font-bold text-slate-900 text-xs">
                        {pm.amount}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700">
                          {pm.completion}
                        </span>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: pm.completion }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge status={pm.status} size="sm" />
                    </td>
                    <td className="text-right">
                      {pm.status === 'Approved' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => updateMilestonePayment(selectedRecord.id, idx, 'Paid')}
                        >
                          Disburse Treasury Funds
                        </Button>
                      ) : pm.status === 'Pending' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateMilestonePayment(selectedRecord.id, idx, 'Approved')}
                        >
                          Authorize Payment
                        </Button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

        

      {/* DPO EXECUTION CONFIRMATION MODAL */}
      <Modal
        isOpen={isDPOModalOpen}
        onClose={() => setIsDPOModalOpen(false)}
        title="Execute Direct Procurement Order (DPO)"
        subtitle={`Award scale-up contract to ${selectedRecord?.startupName}`}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsDPOModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => {
                approveProcurement(selectedRecord.id);
                setIsDPOModalOpen(false);
              }}
            >
              Confirm DPO Execution
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-700">
          <p>
            Under the Innovation Procurement Framework, successful pilot validation allows exemption from traditional repetitive tendering.
          </p>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div>
              <strong>Contractor:</strong> {selectedRecord?.startupName}
            </div>
            <div>
              <strong>Solution:</strong> {selectedRecord?.solutionName}
            </div>
            <div>
              <strong>Sanctioned Value:</strong> {selectedRecord?.contractValue}
            </div>
            <div>
              <strong>Scope:</strong> {selectedRecord?.units}
            </div>
          </div>
          <p className="text-slate-500 italic">
            This action generates a legally binding digital procurement order and notifies the State Treasury and Auditor General.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default GovProcurement;
