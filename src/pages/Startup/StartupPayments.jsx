import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  FileCheck2,
  TrendingUp,
  CheckCircle2,
  Download,
  Eye,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { StatCard } from '../../components/Common/Card';
import Badge from '../../components/Common/Badge';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';

const StartupPayments = () => {
  const { applications, procurementRecords, currentUser } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Startup's application records
  const myApps = applications;

  // Startup's procurement & payment record
  const myProcurement = procurementRecords[0] || null;

  const totalDisbursed = myProcurement?.paymentMilestones
    ?.filter((p) => p.status === 'Paid' || p.status === 'released')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0) || 0;

  const totalPending = myProcurement?.paymentMilestones
    ?.filter((p) => p.status !== 'Paid' && p.status !== 'released')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Financial Disbursements & Procurement Outcomes</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Payments & Application Status Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your grant milestone releases, Treasury payment vouchers, and statewide scale-up procurement orders.
          </p>
        </div>
      </div>

      {/* Top Stat Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sanctioned Value"
          value={myProcurement?.contractValue || (myProcurement?.total_amount ? `₹ ${Number(myProcurement.total_amount).toLocaleString('en-IN')}` : '₹ 0')}
          subtitle="Pilot & Direct Procurement"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Disbursed Funds"
          value={`₹ ${totalDisbursed.toLocaleString('en-IN')}`}
          subtitle="Direct Treasury Credit"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Authorization"
          value={`₹ ${totalPending.toLocaleString('en-IN')}`}
          subtitle="Milestone In-Review"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Procurement Scale-Up"
          value={myProcurement?.scaleUpStatus || (myProcurement ? 'Approved' : 'Pending')}
          subtitle="Statewide Expansion"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* 1. APPLICATION STATUS OVERVIEW */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Submitted Innovation Proposals & Selection Results
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status of your technical challenge applications across government ministries.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Challenge Title</th>
                <th>Department</th>
                <th>Application Date</th>
                <th>Current Status</th>
                <th>Selection Result & Feedback</th>
              </tr>
            </thead>
            <tbody>
              {myApps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="font-bold text-slate-900 text-sm">
                      {app.challengeTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {app.id} • {app.category}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs text-slate-800 font-medium">
                      {app.department}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-600">
                      {app.submittedDate}
                    </span>
                  </td>
                  <td>
                    <Badge status={app.status} size="sm" />
                  </td>
                  <td>
                    <div className="text-xs text-slate-800 font-semibold">
                      {app.status === 'Selected' ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selected for Pilot Award (Score: {app.scores?.overallScore}/10)
                        </span>
                      ) : app.status === 'Shortlisted' ? (
                        <span className="text-purple-700 font-bold">
                          Shortlisted for Presentation
                        </span>
                      ) : (
                        <span className="text-slate-600">
                          {app.status}
                        </span>
                      )}
                    </div>
                    {app.expertRecommendation && (
                      <p className="text-[11px] text-slate-500 mt-0.5 italic line-clamp-1">
                        "{app.expertRecommendation}"
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. MILESTONE PAYMENTS TABLE */}
      <div className="gov-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Milestone Payment Disbursement Schedule
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phased milestone release tranches linked to verified evidence and laboratory sign-offs.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Treasury Linked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse gov-table">
            <thead>
              <tr>
                <th>Milestone Deliverable</th>
                <th>Completion</th>
                <th>Payment Amount</th>
                <th>Disbursement Status</th>
                <th className="text-right">Invoice Voucher</th>
              </tr>
            </thead>
            <tbody>
              {(myProcurement?.paymentMilestones || []).map((pm, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="font-semibold text-slate-900 text-xs">
                      {pm.milestone}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">
                        {pm.completion}
                      </span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: pm.completion }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-bold text-slate-900 text-sm">
                      {pm.amount}
                    </span>
                  </td>
                  <td>
                    <Badge status={pm.status} size="sm" />
                  </td>
                  <td className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Receipt}
                      onClick={() => setSelectedInvoice(pm)}
                    >
                      View Voucher
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. FINAL OUTCOME DASHBOARD */}
      <div className="gov-card p-6 bg-slate-900 text-white shadow-md">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Final Innovation Procurement Lifecycle Outcome
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              End-to-end verification and direct procurement scale-up status for AquaTech Solutions.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-700">
            TRL-9 Commercial Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              1. Pilot Field Result
            </span>
            <span className="text-sm font-bold text-emerald-400 block">
              100% KPI Validated
            </span>
            <span className="text-xs text-slate-300 mt-1 block">
              8.5 min alert latency (Target &lt;15 min)
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              2. Validation Status
            </span>
            <span className="text-sm font-bold text-emerald-400 block">
              Conclusively Validated
            </span>
            <span className="text-xs text-slate-300 mt-1 block">
              Signed by Dr. Ramesh Chandra
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              3. Procurement Status
            </span>
            <span className="text-sm font-bold text-blue-400 block">
              Procurement in Progress
            </span>
            <span className="text-xs text-slate-300 mt-1 block">
              DPO Issued (₹ 4.20 Cr)
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              4. Scale-Up Status
            </span>
            <span className="text-sm font-bold text-purple-400 block">
              Statewide Scale-Up
            </span>
            <span className="text-xs text-slate-300 mt-1 block">
              150 Stations across 12 Municipalities
            </span>
          </div>
        </div>
      </div>

      {/* INVOICE VOUCHER PREVIEW MODAL */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title="Government Treasury Payment Voucher"
          subtitle={`Voucher Reference: VOUCH-2026-${Math.floor(Math.random() * 9000 + 1000)}`}
          maxWidth="max-w-xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 font-mono">
                PFMS / GeM Payment Gateway Ref
              </span>
              <Button
                variant="outline"
                onClick={() => setSelectedInvoice(null)}
              >
                Close Voucher
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Payee (Startup):</span>
                <strong className="text-slate-900">AquaTech Solutions Pvt. Ltd.</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Procuring Entity:</span>
                <strong className="text-slate-900">Water Resources Department, Gov of UP</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Deliverable:</span>
                <strong className="text-slate-900">{selectedInvoice.milestone}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Gross Disbursement:</span>
                <strong className="text-emerald-700 text-sm">{selectedInvoice.amount}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursement Status:</span>
                <Badge status={selectedInvoice.status} size="sm" />
              </div>
            </div>
            <div className="text-slate-500 text-[11px] text-center italic">
              Electronically generated by SolutionBridge Financial & Procurement System.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StartupPayments;
