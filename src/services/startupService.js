import { api } from './api';

export const startupService = {
  async getStartups(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/startups${params ? `?${params}` : ''}`;
    return api.get(endpoint);
  },
  async getMyStartup() {
    return api.get('/startups/me');
  },
  async getStartupById(id) {
    return api.get(`/startups/${id}`);
  },
  async createStartupProfile(data) {
    return api.post('/startups', data);
  },
  async updateMyStartup(data) {
    return api.put('/startups/me', data);
  },
  async verifyStartup(id, verified = true) {
    return api.patch(`/startups/${id}/verify`, { verified });
  }
};

export default startupService;
