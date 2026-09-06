import { api } from './api';

export const auditService = {
  async getAuditLogs(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/audit${params ? `?${params}` : ''}`;
    return api.get(endpoint);
  },
  async getAuditLogById(id) {
    return api.get(`/audit/${id}`);
  }
};

export default auditService;
