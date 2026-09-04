/**
 * Pilot Performance & Metric Analytics Service
 */

/**
 * Calculate KPI achievement percentage against historical baseline and target
 * @param {number} baseline - Pre-pilot baseline value
 * @param {number} target - Government target benchmark
 * @param {number} actual - Measured field trial value
 * @returns {number|null} Performance percentage (e.g. 100% means target reached)
 */
export const calculatePerformancePercentage = (baseline, target, actual) => {
  const b = Number(baseline);
  const t = Number(target);
  const a = Number(actual);

  if (isNaN(b) || isNaN(t) || isNaN(a)) {
    return null;
  }

  const denominator = t - b;

  // Protect against division by zero
  if (denominator === 0) {
    return a >= t ? 100.0 : 0.0;
  }

  const percentage = ((a - b) / denominator) * 100;
  return parseFloat(percentage.toFixed(2));
};

/**
 * Calculate overall pilot progress based on milestone completion
 * @param {Array} milestones - List of pilot milestones with status and progress
 * @returns {number} Aggregated percentage (0 to 100)
 */
export const aggregateMilestoneProgress = (milestones = []) => {
  if (!milestones || milestones.length === 0) return 0;

  const totalProgress = milestones.reduce((sum, m) => {
    if (m.status === 'completed' || m.status === 'verified') return sum + 100;
    return sum + (Number(m.progress) || 0);
  }, 0);

  return Math.round(totalProgress / milestones.length);
};

export default {
  calculatePerformancePercentage,
  aggregateMilestoneProgress
};
