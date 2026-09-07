import { api } from './api';

export const applicationService = {
  /**
   * List applications
   */
  async getApplications(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/applications${params ? `?${params}` : ''}`;
    return api.get(endpoint);
  },

  /**
   * Get application details by ID
   */
  async getApplicationById(id) {
    return api.get(`/applications/${id}`);
  },

  /**
   * Get applications for a specific challenge
   */
  async getApplicationsByChallenge(challengeId) {
    return api.get(`/applications/challenge/${challengeId}`);
  },

  /**
   * Upload supporting document for startup application (Supabase Storage)
   */
  async uploadDocument(formData) {
    return api.post('/applications/upload-document', formData);
  },

  /**
   * Submit new solution proposal (Startup)
   */
  async submitApplication(applicationData) {
    return api.post('/applications', applicationData);
  },

  /**
   * Update application status (Government: under_review, shortlisted, selected, rejected)
   */
  async updateStatus(id, status, notes = '') {
    return api.patch(`/applications/${id}/status`, { status, notes });
  },

  /**
   * Assign expert to application (Government)
   */
  async assignExpert(applicationId, expertId) {
    return api.post(`/applications/${applicationId}/experts`, { expert_id: expertId });
  },

  /**
   * List experts assigned to an application
   */
  async getAssignedExperts(applicationId) {
    return api.get(`/applications/${applicationId}/experts`);
  },

  /**
   * Fetch real verified active experts from the backend (for assignment modal)
   */
  async getVerifiedExperts() {
    const response = await api.get('/users?role=expert&is_active=true');
    const users = response?.data?.users || [];
    // Only return experts where profiles.role = 'expert', profiles.is_active = true, experts.verified = true
    return users.filter((u) => {
      const expert = Array.isArray(u.expert) ? u.expert[0] : u.expert;
      return u.role === 'expert' && u.is_active !== false && expert?.verified === true;
    });
  },

  /**
   * Submit expert 5-criteria evaluation (Expert)
   */
  async submitEvaluation(applicationId, evaluationData) {
    return api.post(`/applications/${applicationId}/evaluations`, evaluationData);
  },

  /**
   * Get evaluations for an application
   */
  async getEvaluations(applicationId) {
    return api.get(`/applications/${applicationId}/evaluations`);
  }
};

export default applicationService;
