import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { CreditCard, DollarSign, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';

const FinanceDashboard = () => {
  const { payments, updatePaymentStatus, addToast } = useApp();

  const [activeTab, setActiveTab] = useState("requests"); // requests, history

  // Filter payments
  const pendingRequests = payments.filter(p => p.status === "Pending Approval");
  const completedPayments = payments.filter(p => p.status === "Paid");

  // Calculations
  const totalPaidSum = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingSum = pendingRequests.reduce((sum, p) => sum + p.amount, 0);
  const completedCount = completedPayments.length;

  const handleClearPayment = (payId, startupName, amount) => {
    updatePaymentStatus(payId, "Paid");
    addToast(`Transaction successful: $${amount.toLocaleString()} paid to ${startupName}`, "success");
  };

  const handleRejectPayment = (payId, startupName) => {
    updatePaymentStatus(payId, "Rejected");
    addToast(`Invoice rejected and returned to ${startupName}.`, "warning");
  };

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">Finance & Payout Workspace</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Review invoiced milestone payment requests, clear sandboxed funds, and inspect transaction ledgers.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {[
          { label: "Total Funds Disbursed", val: `$${totalPaidSum.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Payout Requests", val: `$${pendingSum.toLocaleString()}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Payments Cleared", val: completedCount, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Payout Requests", val: payments.length, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{card.label}</span>
                <span className="text-2xl font-black text-slate-900 mt-2 block leading-none">{card.val}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 flex text-xs font-bold uppercase tracking-wider text-slate-400">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-5 py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "requests" ? "border-blue-600 text-blue-700 bg-white" : "border-transparent hover:text-slate-600"
            }`}
          >
            Payment Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "history" ? "border-blue-600 text-blue-700 bg-white" : "border-transparent hover:text-slate-600"
            }`}
          >
            Cleared Payout History ({completedPayments.length})
          </button>
        </div>

        <div className="p-6">
          
          {/* TAB 1: Requests */}
          {activeTab === "requests" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Milestones Awaiting Clearance</h4>
              
              <div className="space-y-3 text-xs font-semibold text-slate-650">
                {pendingRequests.map((pay) => (
                  <div key={pay.id} className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/20 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        Invoice ID: {pay.id.toUpperCase()}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{pay.pilotTitle}</h4>
                      <p className="text-[10px] text-slate-400">
                        Proposer: {pay.startupName} | Milestone: {pay.milestoneTitle} ({pay.percentage}%)
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center">
                      <span className="text-base font-extrabold text-blue-650">${pay.amount.toLocaleString()}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRejectPayment(pay.id, pay.startupName)}
                          className="px-3.5 py-1.5 border border-slate-200 font-bold text-[10px] uppercase tracking-wider text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          Reject Invoice
                        </button>
                        <button
                          onClick={() => handleClearPayment(pay.id, pay.startupName, pay.amount)}
                          className="px-4 py-1.5 bg-emerald-650 hover:bg-emerald-700 font-bold text-[10px] uppercase tracking-wider text-white rounded-lg shadow-sm cursor-pointer transition-colors"
                        >
                          Approve & Pay
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingRequests.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-sm font-semibold">No pending payment requests. All transactions cleared.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: History */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transaction History</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Startup Partner</th>
                      <th className="px-6 py-4">Pilot Challenge</th>
                      <th className="px-6 py-4">Milestone</th>
                      <th className="px-6 py-4 text-center">Amount Released</th>
                      <th className="px-6 py-4 text-right">Cleared Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {completedPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">{pay.startupName}</td>
                        <td className="px-6 py-4 text-slate-500 font-semibold">{pay.pilotTitle}</td>
                        <td className="px-6 py-4 text-slate-500 font-semibold">{pay.milestoneTitle}</td>
                        <td className="px-6 py-4 text-center font-bold text-emerald-600">${pay.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-slate-450">{pay.paidDate}</td>
                      </tr>
                    ))}
                    {completedPayments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-405 text-sm font-semibold">No cleared payouts found in historical ledger.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default FinanceDashboard;
