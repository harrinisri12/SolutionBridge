import { api } from './api';

export const notificationService = {
  /**
   * Get user notifications
   */
  async getNotifications() {
    return api.get('/notifications');
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id) {
    return api.patch(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    return api.patch('/notifications/read-all');
  }
};

export default notificationService;
