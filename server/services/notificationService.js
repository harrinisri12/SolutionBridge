import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Dispatch an in-app notification to a specific user or role
 * @param {Object} params
 * @param {string} [params.userId] - Recipient user ID (optional if broadcasting to role)
 * @param {string} [params.role] - Target role ('government', 'startup', 'expert')
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message body
 * @param {string} [params.type] - 'info', 'success', 'warning', 'action'
 */
export const createNotification = async ({ userId = null, role = null, title, message, type = 'info' }) => {
  try {
    const payload = {
      title,
      message,
      type,
      read: false,
      created_at: new Date().toISOString()
    };

    if (userId) payload.user_id = userId;
    if (role) payload.role = role;

    const { error } = await supabaseAdmin.from('notifications').insert([payload]);

    if (error) {
      logger.error('Failed to create notification', error);
    } else {
      logger.info(`[NOTIFICATION CREATED] '${title}' sent to ${userId ? `user ${userId}` : `role ${role}`}`);
    }
  } catch (err) {
    logger.error('Unexpected error in createNotification', err);
  }
};

export default {
  createNotification
};
