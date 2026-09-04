import { api } from './api';

export const challengeService = {
  /**
   * List challenges with optional filters (e.g. status, department_id, category)
   */
  async getChallenges(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/challenges${params ? `?${params}` : ''}`;
    return api.get(endpoint);
  },

  /**
   * Get challenge details by ID
   */
  async getChallengeById(id) {
    return api.get(`/challenges/${id}`);
  },

  /**
   * Create new draft challenge (Government)
   */
  async createChallenge(challengeData) {
    return api.post('/challenges', challengeData);
  },

  /**
   * Update challenge details
   */
  async updateChallenge(id, challengeData) {
    return api.put(`/challenges/${id}`, challengeData);
  },

  /**
   * Publish challenge publicly
   */
  async publishChallenge(id) {
    return api.patch(`/challenges/${id}/publish`);
  },

  /**
   * Close challenge
   */
  async closeChallenge(id) {
    return api.patch(`/challenges/${id}/close`);
  },

  /**
   * Delete challenge
   */
  async deleteChallenge(id) {
    return api.delete(`/challenges/${id}`);
  }
};

export default challengeService;
