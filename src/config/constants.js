/**
 * Static Application Configuration & Constants
 * (Non-database static lookup classifications)
 */

export const CATEGORIES = [
  "Water",
  "Healthcare",
  "Agriculture",
  "Transport",
  "Energy",
  "Waste Management",
  "Public Safety",
  "Education Tech",
  "Smart Cities"
];

export const APPLICATION_STATUSES = [
  { value: 'under_review', label: 'Under Review', color: 'blue' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'indigo' },
  { value: 'selected', label: 'Selected for Pilot', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' }
];

export const PILOT_STATUSES = [
  { value: 'approved', label: 'Approved', color: 'blue' },
  { value: 'in_progress', label: 'In Progress', color: 'amber' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'failed', label: 'Failed', color: 'red' }
];

export const EVALUATION_WEIGHTS = {
  technical_feasibility: 0.25,
  innovation_ip: 0.20,
  cost_effectiveness: 0.20,
  scalability: 0.20,
  implementation_risk: 0.15
};
