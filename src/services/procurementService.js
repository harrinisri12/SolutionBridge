import { api } from './api';

export const procurementService = {
  /**
   * List direct procurement orders
   */
  async getProcurements(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/procurements${params ? `?${params}` : ''}`;
    return api.get(endpoint);
  },

  /**
   * Get procurement order details by ID
   */
  async getProcurementById(id) {
    return api.get(`/procurements/${id}`);
  },

  /**
   * Initiate direct procurement order (Government)
   */
  async createProcurement(procurementData) {
    return api.post('/procurements', procurementData);
  },

  /**
   * Update procurement status (Government: approved, in_progress, completed)
   */
  async updateStatus(id, status) {
    return api.patch(`/procurements/${id}/status`, { status });
  },

  /**
   * Upload exemption / sanction certificate
   */
  async uploadDocument(id, formData) {
    return api.post(`/procurements/${id}/documents`, formData);
  },

  /**
   * List payment milestones for a procurement
   */
  async getPayments(procurementId) {
    return api.get(`/procurements/${procurementId}/payments`);
  },

  /**
   * Add payment milestone
   */
  async createPayment(procurementId, paymentData) {
    return api.post(`/procurements/${procurementId}/payments`, paymentData);
  },

  /**
   * Update payment milestone status (Government: approve, release)
   */
  async updatePaymentStatus(paymentId, status) {
    return api.patch(`/payments/${paymentId}/status`, { status });
  }
};

export default procurementService;
