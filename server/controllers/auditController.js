import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';

/**
 * List audit logs with pagination and filters (Government / Admin Only)
 * GET /api/audit
 */
export const listAuditLogs = async (req, res) => {
  try {
    const { action, entity_type, entity_id, user_id, limit = 50, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('audit_logs')
      .select('*, profiles(full_name, email, role)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (action) {
      query = query.eq('action', action.toUpperCase());
    }

    if (entity_type) {
      query = query.eq('entity_type', entity_type.toLowerCase());
    }

    if (entity_id) {
      query = query.eq('entity_id', entity_id);
    }

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data: logs, count, error } = await query;

    if (error) {
      logger.error('Error fetching audit logs', error);
      return ApiResponse.error(res, 'Failed to retrieve audit trail', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, {
      logs: logs || [],
      total: count || 0,
      limit: Number(limit),
      offset: Number(offset)
    }, 'Audit trail retrieved successfully');
  } catch (error) {
    logger.error('Error in listAuditLogs controller', error);
    return ApiResponse.error(res, 'Failed to fetch audit logs', 500, 'SERVER_ERROR');
  }
};

/**
 * Get single audit log entry by ID (Government / Admin Only)
 * GET /api/audit/:id
 */
export const getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: log, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*, profiles(full_name, email, role, organization)')
      .eq('id', id)
      .single();

    if (error || !log) {
      return ApiResponse.error(res, 'Audit log entry not found', 404, 'NOT_FOUND');
    }

    return ApiResponse.success(res, { log }, 'Audit log entry retrieved');
  } catch (error) {
    logger.error('Error in getAuditLogById controller', error);
    return ApiResponse.error(res, 'Failed to fetch audit entry', 500, 'SERVER_ERROR');
  }
};

export default {
  listAuditLogs,
  getAuditLogById
};
