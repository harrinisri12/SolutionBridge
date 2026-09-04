import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';

/**
 * List notifications for the authenticated user
 * GET /api/notifications
 */
export const listNotifications = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    // Fetch user-specific notifications OR role-targeted notifications
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},and(user_id.is.null,role.eq.${role}),role.eq.all`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      logger.error('Error fetching notifications', error);
      return ApiResponse.error(res, 'Failed to fetch notifications', 500, 'SERVER_ERROR');
    }

    const unreadCount = (notifications || []).filter(n => !n.is_read).length;

    return ApiResponse.success(res, {
      notifications: notifications || [],
      unread_count: unreadCount
    }, 'Notifications retrieved');
  } catch (error) {
    logger.error('Error in listNotifications controller', error);
    return ApiResponse.error(res, 'Failed to retrieve notifications', 500, 'SERVER_ERROR');
  }
};

/**
 * Mark a single notification as read
 * PATCH /api/notifications/:id/read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const { data: notification, error: findError } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !notification) {
      return ApiResponse.error(res, 'Notification not found', 404, 'NOT_FOUND');
    }

    if (notification.user_id && notification.user_id !== userId) {
      return ApiResponse.error(res, 'Access denied', 403, 'FORBIDDEN');
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      logger.error('Error marking notification as read', updateError);
      return ApiResponse.error(res, 'Failed to update notification', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { notification: updated }, 'Notification marked as read');
  } catch (error) {
    logger.error('Error in markAsRead controller', error);
    return ApiResponse.error(res, 'Failed to update notification', 500, 'SERVER_ERROR');
  }
};

/**
 * Mark all user notifications as read
 * PATCH /api/notifications/read-all
 */
export const markAllAsRead = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      logger.error('Error marking all notifications as read', error);
      return ApiResponse.error(res, 'Failed to mark all as read', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { success: true }, 'All notifications marked as read');
  } catch (error) {
    logger.error('Error in markAllAsRead controller', error);
    return ApiResponse.error(res, 'Failed to mark notifications as read', 500, 'SERVER_ERROR');
  }
};

export default {
  listNotifications,
  markAsRead,
  markAllAsRead
};
