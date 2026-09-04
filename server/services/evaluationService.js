/**
 * Expert Evaluation Scoring Service
 * Provides standardized 5-factor weighted score calculation for proposal evaluations.
 */

export const EVALUATION_WEIGHTS = {
  technical_feasibility: 0.25,
  innovation_ip: 0.20,
  cost_effectiveness: 0.20,
  scalability: 0.20,
  implementation_risk: 0.15
};

/**
 * Calculate the official weighted evaluation score
 * @param {Object} scores
 * @param {number} scores.technical_feasibility - 0 to 10
 * @param {number} scores.innovation_ip - 0 to 10
 * @param {number} scores.cost_effectiveness - 0 to 10
 * @param {number} scores.scalability - 0 to 10
 * @param {number} scores.implementation_risk - 0 to 10
 * @param {Object} [customWeights] - Optional custom weights override
 * @returns {number} Weighted overall score formatted to 2 decimal places
 */
export const calculateWeightedScore = (scores, customWeights = EVALUATION_WEIGHTS) => {
  const tech = Number(scores.technical_feasibility) || 0;
  const innov = Number(scores.innovation_ip) || 0;
  const cost = Number(scores.cost_effectiveness) || 0;
  const scale = Number(scores.scalability) || 0;
  const risk = Number(scores.implementation_risk) || 0;

  const weighted =
    tech * (customWeights.technical_feasibility || 0.25) +
    innov * (customWeights.innovation_ip || 0.20) +
    cost * (customWeights.cost_effectiveness || 0.20) +
    scale * (customWeights.scalability || 0.20) +
    risk * (customWeights.implementation_risk || 0.15);

  return parseFloat(weighted.toFixed(2));
};

export default {
  EVALUATION_WEIGHTS,
  calculateWeightedScore
};
