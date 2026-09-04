import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { logger } from '../utils/logger.js';

/**
 * List milestones for a pilot
 * GET /api/pilots/:pilotId/milestones
 */
export const getMilestonesByPilot = async (req, res) => {
  try {
    const { pilotId } = req.params;

    const { data: milestones, error } = await supabaseAdmin
      .from('pilot_milestones')
      .select('*, pilot_evidence(*)')
      .eq('pilot_id', pilotId)
      .order('sequence_order', { ascending: true });

    if (error) {
      logger.error('Error fetching pilot milestones', error);
      return ApiResponse.error(res, 'Failed to fetch milestones', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { milestones: milestones || [] }, 'Milestones retrieved');
  } catch (error) {
    logger.error('Error in getMilestonesByPilot controller', error);
    return ApiResponse.error(res, 'Failed to retrieve milestones', 500, 'SERVER_ERROR');
  }
};

/**
 * Create a milestone for a pilot (Government Only)
 * POST /api/pilots/:pilotId/milestones
 */
export const createMilestone = async (req, res) => {
  try {
    const { pilotId } = req.params;
    const { title, description, budget_share, target_date, sequence_order } = req.body;

    if (!title) {
      return ApiResponse.error(res, 'Milestone title is required', 422, 'VALIDATION_ERROR');
    }

    const { data: milestone, error } = await supabaseAdmin
      .from('pilot_milestones')
      .insert([
        {
          pilot_id: pilotId,
          title: title.trim(),
          description: description || null,
          budget_share: budget_share ? Number(budget_share) : null,
          target_date: target_date || null,
          sequence_order: sequence_order || 1,
          progress: 0,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      logger.error('Error creating milestone', error);
      return ApiResponse.error(res, 'Failed to create milestone', 500, 'SERVER_ERROR');
    }

    await logAudit({
      userId: req.user.id,
      action: AuditActions.MILESTONE_CREATED,
      entityType: 'pilot_milestone',
      entityId: milestone.id,
      description: `Milestone '${title}' created for pilot ${pilotId}`
    });

    return ApiResponse.success(res, { milestone }, 'Milestone created successfully', 201);
  } catch (error) {
    logger.error('Error in createMilestone controller', error);
    return ApiResponse.error(res, 'Failed to create milestone', 500, 'SERVER_ERROR');
  }
};

/**
 * Update milestone status & progress
 * PATCH /api/milestones/:id/status
 */
export const updateMilestoneStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, remarks } = req.body;

    const validStatuses = ['pending', 'in_progress', 'completed', 'verified'];
    if (status && !validStatuses.includes(status.toLowerCase())) {
      return ApiResponse.error(res, `Status must be one of: ${validStatuses.join(', ')}`, 422, 'VALIDATION_ERROR');
    }

    const updates = {
      updated_at: new Date().toISOString()
    };
    if (status) updates.status = status.toLowerCase();
    if (progress !== undefined) updates.progress = Number(progress);
    if (remarks !== undefined) updates.remarks = remarks;
    if (status === 'completed' || status === 'verified') {
      updates.completed_at = new Date().toISOString();
    }

    const { data: milestone, error } = await supabaseAdmin
      .from('pilot_milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !milestone) {
      return ApiResponse.error(res, 'Failed to update milestone', 500, 'SERVER_ERROR');
    }

    await logAudit({
      userId: req.user.id,
      action: AuditActions.MILESTONE_UPDATED,
      entityType: 'pilot_milestone',
      entityId: id,
      description: `Milestone '${milestone.title}' status updated to '${milestone.status}'`
    });

    return ApiResponse.success(res, { milestone }, `Milestone status updated to ${milestone.status}`);
  } catch (error) {
    logger.error('Error in updateMilestoneStatus controller', error);
    return ApiResponse.error(res, 'Failed to update milestone status', 500, 'SERVER_ERROR');
  }
};

/**
 * Update full milestone details (Government Only)
 * PUT /api/milestones/:id
 */
export const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, budget_share, target_date, sequence_order, progress, status } = req.body;

    const updates = {
      updated_at: new Date().toISOString()
    };
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (budget_share !== undefined) updates.budget_share = Number(budget_share);
    if (target_date !== undefined) updates.target_date = target_date;
    if (sequence_order !== undefined) updates.sequence_order = Number(sequence_order);
    if (progress !== undefined) updates.progress = Number(progress);
    if (status) {
      const validStatuses = ['pending', 'in_progress', 'completed', 'verified'];
      if (!validStatuses.includes(status.toLowerCase())) {
        return ApiResponse.error(res, `Status must be one of: ${validStatuses.join(', ')}`, 422, 'VALIDATION_ERROR');
      }
      updates.status = status.toLowerCase();
    }

    const { data: milestone, error } = await supabaseAdmin
      .from('pilot_milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !milestone) {
      return ApiResponse.error(res, 'Milestone not found or failed to update', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { milestone }, 'Milestone updated successfully');
  } catch (error) {
    logger.error('Error in updateMilestone controller', error);
    return ApiResponse.error(res, 'Failed to update milestone', 500, 'SERVER_ERROR');
  }
};

export default {
  getMilestonesByPilot,
  createMilestone,
  updateMilestone,
  updateMilestoneStatus
};

