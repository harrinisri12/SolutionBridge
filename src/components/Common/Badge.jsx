import React from 'react';

const Badge = ({ status, size = "md", className = "" }) => {
  if (!status) return null;

  const normalized = status.toString().toLowerCase().trim();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";
  let dotColor = "bg-slate-500";

  if (
    normalized.includes("validated") ||
    normalized.includes("procured") ||
    normalized.includes("selected") ||
    normalized.includes("eligible") ||
    normalized.includes("approved") ||
    normalized.includes("completed") ||
    normalized.includes("passed") ||
    normalized.includes("paid") ||
    normalized.includes("scaled") ||
    normalized.includes("recommend")
  ) {
    styles = "bg-emerald-50 text-emerald-800 border-emerald-200";
    dotColor = "bg-emerald-600";
  } else if (
    normalized.includes("under evaluation") ||
    normalized.includes("shortlisted") ||
    normalized.includes("ongoing") ||
    normalized.includes("validation") ||
    normalized.includes("in progress") ||
    normalized.includes("pending") ||
    normalized.includes("clarification") ||
    normalized.includes("under review") ||
    normalized.includes("procurement in progress")
  ) {
    styles = "bg-amber-50 text-amber-800 border-amber-200";
    dotColor = "bg-amber-600";
  } else if (
    normalized.includes("rejected") ||
    normalized.includes("ineligible") ||
    normalized.includes("failed") ||
    normalized.includes("closed")
  ) {
    styles = "bg-rose-50 text-rose-800 border-rose-200";
    dotColor = "bg-rose-600";
  } else if (
    normalized.includes("published") ||
    normalized.includes("submitted") ||
    normalized.includes("active") ||
    normalized.includes("open")
  ) {
    styles = "bg-blue-50 text-blue-800 border-blue-200";
    dotColor = "bg-blue-600";
  } else if (normalized.includes("draft") || normalized.includes("not started")) {
    styles = "bg-slate-100 text-slate-700 border-slate-300";
    dotColor = "bg-slate-400";
  }

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${styles} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

export default Badge;
