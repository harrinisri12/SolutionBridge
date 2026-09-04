import { api } from './api';

export const pilotService = {
  /**
   * List pilots with optional filters
   */
  async getPilots(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/pilots${params ? `?${params}` : ''}`;
    return api.get(endpoint);
  },

  /**
   * Get pilot by ID with milestones, evidence, and telemetry
   */
  async getPilotById(id) {
    return api.get(`/pilots/${id}`);
  },

  /**
   * Get calculated performance analytics for a pilot
   */
  async getPilotPerformance(id) {
    return api.get(`/pilots/${id}/performance`);
  },

  /**
   * Create new sandbox pilot from selected application (Government)
   */
  async createPilot(pilotData) {
    return api.post('/pilots', pilotData);
  },

  /**
   * Update pilot status (Government)
   */
  async updateStatus(id, status) {
    return api.patch(`/pilots/${id}/status`, { status });
  },

  /**
   * Get pilot milestones
   */
  async getMilestones(pilotId) {
    return api.get(`/pilots/${pilotId}/milestones`);
  },

  /**
   * Add milestone to pilot
   */
  async createMilestone(pilotId, milestoneData) {
    return api.post(`/pilots/${pilotId}/milestones`, milestoneData);
  },

  /**
   * Update milestone progress / status
   */
  async updateMilestoneStatus(milestoneId, data) {
    return api.patch(`/milestones/${milestoneId}/status`, data);
  },

  /**
   * Upload pilot evidence document (Startup)
   */
  async uploadEvidence(pilotId, formData) {
    return api.post(`/pilots/${pilotId}/evidence`, formData);
  },

  /**
   * List uploaded evidence for a pilot
   */
  async getEvidence(pilotId) {
    return api.get(`/pilots/${pilotId}/evidence`);
  },

  /**
   * Verify / Reject evidence (Government or Expert)
   */
  async verifyEvidence(evidenceId, status, comments = '') {
    return api.patch(`/evidence/${evidenceId}/verify`, { status, verification_comments: comments });
  },

  /**
   * Record telemetry metric data point
   */
  async logTelemetry(pilotId, telemetryData) {
    return api.post(`/pilots/${pilotId}/telemetry`, telemetryData);
  },

  /**
   * Get telemetry series for a pilot
   */
  async getTelemetry(pilotId) {
    return api.get(`/pilots/${pilotId}/telemetry`);
  },

  /**
   * Submit independent expert pilot validation sign-off (Expert)
   */
  async submitValidation(pilotId, validationData) {
    return api.post(`/pilots/${pilotId}/validation`, validationData);
  },

  /**
   * Get validation report for a pilot
   */
  async getValidation(pilotId) {
    return api.get(`/pilots/${pilotId}/validation`);
  }
};

export default pilotService;
