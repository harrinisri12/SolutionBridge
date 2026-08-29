import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      // Eligibility / Application Statuses
      case 'Eligible':
      case '🟢 Eligible':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Clarification Required':
      case '🟡 Clarification Required':
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Not Eligible':
      case '🔴 Not Eligible':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-600 border-slate-200';
        
      // Challenge & Pilot Statuses
      case 'Open':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Planning':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Active':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Validated':
      case 'Verified':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Unverified':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Scaled':
      case '🟢 Scale Up':
      case 'Scale Up':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Improve & Retest':
      case '🟡 Improve & Retest':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Pilot Selected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        
      // Payments Statuses
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PASSED':
        return 'bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded';
      case 'FAILED':
        return 'bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded';
        
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
