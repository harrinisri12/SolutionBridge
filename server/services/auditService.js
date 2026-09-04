import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export const AuditActions = {
  USER_CREATED: 'USER_CREATED',
  STARTUP_CREATED: 'STARTUP_CREATED',
  STARTUP_UPDATED: 'STARTUP_UPDATED',
  STARTUP_VERIFIED: 'STARTUP_VERIFIED',
  DEPARTMENT_CREATED: 'DEPARTMENT_CREATED',
  CHALLENGE_CREATED: 'CHALLENGE_CREATED',
  CHALLENGE_UPDATED: 'CHALLENGE_UPDATED',
  CHALLENGE_PUBLISHED: 'CHALLENGE_PUBLISHED',
  CHALLENGE_CLOSED: 'CHALLENGE_CLOSED',
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  APPLICATION_STATUS_UPDATED: 'APPLICATION_STATUS_UPDATED',
  EXPERT_ASSIGNED: 'EXPERT_ASSIGNED',
  EXPERT_REMOVED: 'EXPERT_REMOVED',
  EVALUATION_SUBMITTED: 'EVALUATION_SUBMITTED',
  PILOT_CREATED: 'PILOT_CREATED',
  PILOT_STATUS_UPDATED: 'PILOT_STATUS_UPDATED',
  MILESTONE_CREATED: 'MILESTONE_CREATED',
  MILESTONE_UPDATED: 'MILESTONE_UPDATED',
  EVIDENCE_UPLOADED: 'EVIDENCE_UPLOADED',
  EVIDENCE_VERIFIED: 'EVIDENCE_VERIFIED',
  TELEMETRY_LOGGED: 'TELEMETRY_LOGGED',
  VALIDATION_SUBMITTED: 'VALIDATION_SUBMITTED',
  PROCUREMENT_CREATED: 'PROCUREMENT_CREATED',
  PROCUREMENT_APPROVED: 'PROCUREMENT_APPROVED',
  PAYMENT_CREATED: 'PAYMENT_CREATED',
  PAYMENT_RELEASED: 'PAYMENT_RELEASED'
};

/**
 * Record an immutable audit log entry
 * @param {Object} params
 * @param {string} params.userId - Authenticated user who performed the action
 * @param {string} params.action - One of AuditActions enum
 * @param {string} params.entityType - e.g. 'challenge', 'application', 'pilot', 'procurement'
 * @param {string} params.entityId - Primary key ID of the entity
 * @param {string} params.description - Human-readable explanation of the action
 * @param {Object} [params.metadata] - Optional additional payload
 */
export const logAudit = async ({ userId, action, entityType, entityId, description, metadata = null }) => {
  try {
    const entry = {
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description,
      created_at: new Date().toISOString()
    };

    if (metadata) {
      entry.metadata = metadata;
    }

    const { error } = await supabaseAdmin.from('audit_logs').insert([entry]);

    if (error) {
      logger.error(`Failed to write audit log for action: ${action}`, error);
    } else {
      logger.info(`[AUDIT LOGGED] ${action} on ${entityType}:${entityId} by user ${userId}`);
    }
  } catch (err) {
    logger.error('Unexpected error in logAudit', err);
  }
};

export default {
  AuditActions,
  logAudit
};
