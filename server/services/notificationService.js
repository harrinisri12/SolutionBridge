import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Create an in-app notification.
 *
 * Notifications are stored per user.
 *
 * Supported:
 *   - userId: send to one specific user
 *   - role: send to all active users having that role
 *
 * IMPORTANT:
 * The notifications table does NOT contain a role column.
 * Therefore role-based notifications are expanded into
 * individual user notifications before insertion.
 *
 * @param {Object} params
 * @param {string} [params.userId]
 * @param {string} [params.role]
 * @param {string} params.title
 * @param {string} params.message
 * @param {string} [params.type]
 */
export const createNotification = async ({
  userId = null,
  role = null,
  title,
  message,
  type = 'info'
}) => {
  try {

    /*
     * Basic validation
     */
    if (!title || !message) {
      logger.warn(
        'Notification skipped: title and message are required.'
      );
      return;
    }

    /*
     * ---------------------------------------------------------
     * CASE 1: Notification to a specific user
     * ---------------------------------------------------------
     */
    if (userId) {

      const { error } =
        await supabaseAdmin
          .from('notifications')
          .insert({
            user_id: userId,
            title,
            message,
            is_read: false,
            created_at: new Date().toISOString()
          });

      if (error) {
        logger.error(
          'Failed to create user notification',
          error
        );
        return;
      }

      logger.info(
        `[NOTIFICATION CREATED] '${title}' sent to user ${userId}`
      );

      return;
    }


    /*
     * ---------------------------------------------------------
     * CASE 2: Notification to everyone with a specific role
     * ---------------------------------------------------------
     *
     * Example:
     *
     * role = 'government'
     *
     * Find all active government users and create
     * one notification per user.
     */
    if (role) {

      const validRoles = [
        'government',
        'startup',
        'expert'
      ];

      if (!validRoles.includes(role)) {
        logger.warn(
          `Invalid notification role: ${role}`
        );
        return;
      }

      const {
        data: users,
        error: usersError
      } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('role', role)
        .eq('is_active', true);

      if (usersError) {
        logger.error(
          'Failed to find notification recipients',
          usersError
        );
        return;
      }

      /*
       * No users with that role.
       */
      if (!users || users.length === 0) {

        logger.info(
          `[NOTIFICATION SKIPPED] No active ${role} users found.`
        );

        return;
      }

      /*
       * Create one notification for every user.
       */
      const notifications = users.map((user) => ({
        user_id: user.id,
        title,
        message,
        is_read: false,
        created_at: new Date().toISOString()
      }));

      const { error: insertError } =
        await supabaseAdmin
          .from('notifications')
          .insert(notifications);

      if (insertError) {
        logger.error(
          'Failed to create role notifications',
          insertError
        );
        return;
      }

      logger.info(
        `[NOTIFICATION CREATED] '${title}' sent to ${users.length} ${role} user(s)`
      );

      return;
    }


    /*
     * ---------------------------------------------------------
     * CASE 3: No recipient supplied
     * ---------------------------------------------------------
     */
    logger.warn(
      'Notification skipped: no userId or role supplied.'
    );

  } catch (error) {

    /*
     * Notifications should never break the main
     * business operation.
     *
     * For example, startup registration should still
     * succeed even if notification creation fails.
     */
    logger.error(
      'Unexpected error in createNotification',
      error
    );
  }
};


export default {
  createNotification
};