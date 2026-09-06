import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { logger } from '../utils/logger.js';

/**
 * Log real-time telemetry reading for a pilot
 * POST /api/pilots/:pilotId/telemetry
 */
export const logTelemetry = async (req, res) => {
  try {
    const { pilotId } = req.params;
    const { metric_name, metric_value, unit, recorded_at } = req.body;

    if (!metric_name || metric_value === undefined) {
      return ApiResponse.error(res, 'metric_name and metric_value are required', 422, 'VALIDATION_ERROR');
    }

    const val = Number(metric_value);
    if (isNaN(val)) {
      return ApiResponse.error(res, 'metric_value must be a valid number', 422, 'VALIDATION_ERROR');
    }

    const { data: telemetry, error } = await supabaseAdmin
      .from('pilot_telemetry')
      .insert([
        {
          pilot_id: pilotId,
          metric_name: metric_name.trim(),
          metric_value: val,
          unit: unit || '%',
          recorded_at: recorded_at || new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      logger.error('Error inserting telemetry log', error);
      return ApiResponse.error(res, 'Failed to record telemetry data', 500, 'SERVER_ERROR');
    }

    // Update actual_value on the parent pilot record
    await supabaseAdmin
      .from('pilots')
      .update({ actual_value: val })
      .eq('id', pilotId);

    await logAudit({
      userId: req.user.id,
      action: AuditActions.TELEMETRY_LOGGED,
      entityType: 'pilot_telemetry',
      entityId: telemetry.id,
      description: `Telemetry logged: ${metric_name}=${val}${unit || ''} for pilot ${pilotId}`
    });

    return ApiResponse.success(res, { telemetry }, 'Telemetry data point recorded successfully', 201);
  } catch (error) {
    logger.error('Error in logTelemetry controller', error);
    return ApiResponse.error(res, 'Failed to log telemetry', 500, 'SERVER_ERROR');
  }
};

/**
 * Get telemetry data points for a pilot
 * GET /api/pilots/:pilotId/telemetry
 */
export const getPilotTelemetry = async (req, res) => {
  try {
    const { pilotId } = req.params;
    const { metric_name, limit = 50 } = req.query;

    let query = supabaseAdmin
      .from('pilot_telemetry')
      .select('*')
      .eq('pilot_id', pilotId)
      .order('recorded_at', { ascending: true })
      .limit(Number(limit) || 50);

    if (metric_name) {
      query = query.eq('metric_name', metric_name);
    }

    const { data: telemetry, error } = await query;

    if (error) {
      logger.error('Error fetching pilot telemetry', error);
      return ApiResponse.error(res, 'Failed to fetch telemetry data', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { telemetry: telemetry || [] }, 'Telemetry readings retrieved');
  } catch (error) {
    logger.error('Error in getPilotTelemetry controller', error);
    return ApiResponse.error(res, 'Failed to retrieve telemetry', 500, 'SERVER_ERROR');
  }
};

export default {
  logTelemetry,
  getPilotTelemetry
};
