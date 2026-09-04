import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * Assign an Expert to an Application (Government Only)
 * POST /api/applications/:id/experts
 */
export const assignExpertToApplication = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { expert_id, notes } = req.body;

    if (!expert_id) {
      return ApiResponse.error(res, 'expert_id is required', 422, 'VALIDATION_ERROR');
    }

    // 1. Verify application exists
    const { data: app, error: appError } = await supabaseAdmin
      .from('applications')
      .select('id, challenge_id, challenges(title), startups(name)')
      .eq('id', applicationId)
      .single();

    if (appError || !app) {
      return ApiResponse.error(res, 'Application not found', 404, 'NOT_FOUND');
    }

    // 2. Verify expert exists
    const { data: expert, error: expertError } = await supabaseAdmin
      .from('experts')
      .select('id, profile_id, profiles(full_name, email)')
      .eq('id', expert_id)
      .single();

    if (expertError || !expert) {
      return ApiResponse.error(res, 'Expert not found', 404, 'NOT_FOUND');
    }

    // 3. Prevent duplicate assignment
    const { data: existing } = await supabaseAdmin
      .from('expert_assignments')
      .select('id')
      .eq('application_id', applicationId)
      .eq('expert_id', expert_id)
      .maybeSingle();

    if (existing) {
      return ApiResponse.error(res, 'This expert is already assigned to this application', 409, 'ALREADY_ASSIGNED');
    }

    // 4. Create assignment
    const { data: assignment, error: assignError } = await supabaseAdmin
      .from('expert_assignments')
      .insert([
        {
          application_id: applicationId,
          expert_id,
          assigned_by: req.user.id,
          notes: notes || null,
          created_at: new Date().toISOString()
        }
      ])
      .select('*, experts(*, profiles(full_name, email))')
      .single();

    if (assignError) {
      logger.error('Error assigning expert to application', assignError);
      return ApiResponse.error(res, 'Failed to assign expert', 500, 'SERVER_ERROR');
    }

    // 5. Audit Log
    await logAudit({
      userId: req.user.id,
      action: AuditActions.EXPERT_ASSIGNED,
      entityType: 'expert_assignment',
      entityId: assignment.id,
      description: `Assigned expert '${expert.profiles?.full_name}' to application '${app.startups?.name}' for '${app.challenges?.title}'`
    });

    // 6. Notify Expert
    if (expert.profile_id) {
      await createNotification({
        userId: expert.profile_id,
        role: 'expert',
        title: 'New Proposal Assigned for Evaluation',
        message: `You have been assigned to evaluate a proposal by ${app.startups?.name} for '${app.challenges?.title}'.`,
        type: 'info'
      });
    }

    return ApiResponse.success(res, { assignment }, 'Expert assigned to application successfully', 201);
  } catch (error) {
    logger.error('Error in assignExpertToApplication controller', error);
    return ApiResponse.error(res, 'Failed to assign expert', 500, 'SERVER_ERROR');
  }
};

/**
 * List experts assigned to an application
 * GET /api/applications/:id/experts
 */
export const listApplicationExperts = async (req, res) => {
  try {
    const { id: applicationId } = req.params;

    const { data: assignments, error } = await supabaseAdmin
      .from('expert_assignments')
      .select('*, experts(*, profiles(full_name, email, phone, organization))')
      .eq('application_id', applicationId);

    if (error) {
      logger.error('Error fetching application expert assignments', error);
      return ApiResponse.error(res, 'Failed to retrieve expert assignments', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { assignments: assignments || [] }, 'Expert assignments retrieved');
  } catch (error) {
    logger.error('Error in listApplicationExperts controller', error);
    return ApiResponse.error(res, 'Failed to list expert assignments', 500, 'SERVER_ERROR');
  }
};

/**
 * Remove an expert assignment (Government Only)
 * DELETE /api/applications/:id/experts/:expertId
 */
export const removeExpertAssignment = async (req, res) => {
  try {
    const { id: applicationId, expertId } = req.params;

    const { error } = await supabaseAdmin
      .from('expert_assignments')
      .delete()
      .eq('application_id', applicationId)
      .eq('expert_id', expertId);

    if (error) {
      logger.error('Error deleting expert assignment', error);
      return ApiResponse.error(res, 'Failed to remove expert assignment', 500, 'SERVER_ERROR');
    }

    await logAudit({
      userId: req.user.id,
      action: AuditActions.EXPERT_REMOVED,
      entityType: 'expert_assignment',
      entityId: applicationId,
      description: `Removed expert ${expertId} from application ${applicationId} by ${req.user.email}`
    });

    return ApiResponse.success(res, { success: true }, 'Expert assignment removed');
  } catch (error) {
    logger.error('Error in removeExpertAssignment controller', error);
    return ApiResponse.error(res, 'Failed to remove assignment', 500, 'SERVER_ERROR');
  }
};

export default {
  assignExpertToApplication,
  listApplicationExperts,
  removeExpertAssignment
};
