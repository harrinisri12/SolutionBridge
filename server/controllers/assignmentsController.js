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
    const applicationId = req.params.id || req.body.application_id || req.body.applicationId;
    const { expert_id } = req.body;

    if (!applicationId || !expert_id) {
      return ApiResponse.error(res, 'application_id and expert_id are required', 422, 'VALIDATION_ERROR');
    }

    // 1. Authorization: Only Government Officers and Admins
    const userRole = req.user?.role?.toLowerCase();
    if (userRole !== 'government') {
      return ApiResponse.error(res, 'Access denied: Only Government Officers and Platform Admins can assign experts.', 403, 'FORBIDDEN');
    }

    // 2. Verify application exists
    const { data: app, error: appError } = await supabaseAdmin
      .from('applications')
      .select('id, challenge_id, status, challenges(id, title, department_id), startups(id, name)')
      .eq('id', applicationId)
      .single();

    if (appError || !app) {
      return ApiResponse.error(res, 'Application not found', 404, 'NOT_FOUND');
    }

    // 3. Verify expert exists with corresponding profile
    let expert = null;
    const { data: expById } = await supabaseAdmin
      .from('experts')
      .select('id, user_id, verified, expertise, organization, profiles(id, full_name, email, role, is_active)')
      .eq('id', expert_id)
      .maybeSingle();

    if (expById) {
      expert = expById;
    } else {
      const { data: expByUser } = await supabaseAdmin
        .from('experts')
        .select('id, user_id, verified, expertise, organization, profiles(id, full_name, email, role, is_active)')
        .eq('user_id', expert_id)
        .maybeSingle();
      if (expByUser) expert = expByUser;
    }

    if (!expert) {
      return ApiResponse.error(res, 'Selected expert not found', 404, 'NOT_FOUND');
    }

    // 4. Verify expert profile role = expert
    if (!expert.profiles || expert.profiles.role !== 'expert') {
      return ApiResponse.error(res, 'The selected user is not registered as an expert evaluator', 400, 'INVALID_EXPERT_ROLE');
    }

    // 5. Verify expert profile is_active = true
    if (expert.profiles.is_active === false) {
      return ApiResponse.error(res, 'This expert account is currently inactive', 400, 'EXPERT_INACTIVE');
    }

    // 6. Verify expert record verified = true
    if (!expert.verified) {
      return ApiResponse.error(res, 'This expert must be verified by Platform Administration before assignment', 400, 'EXPERT_NOT_VERIFIED');
    }

    // 7. Verify application does not already have an active assignment
    const { data: existing } = await supabaseAdmin
      .from('expert_assignments')
      .select('id, expert_id, status')
      .eq('application_id', applicationId)
      .maybeSingle();

    if (existing) {
      return ApiResponse.error(res, 'An expert is already assigned to this application.', 409, 'ALREADY_ASSIGNED');
    }

    // 8. Create assignment record with assigned_by = authenticated government officer's ID
    const { data: assignment, error: assignError } = await supabaseAdmin
      .from('expert_assignments')
      .insert([
        {
          application_id: applicationId,
          expert_id: expert.id,
          assigned_by: req.user.id,
          status: 'assigned',
          created_at: new Date().toISOString()
        }
      ])
      .select('*, experts(id, expertise, organization, verified, profiles(id, full_name, email, role, is_active))')
      .single();

    if (assignError) {
      logger.error('Error assigning expert to application', assignError);
      return ApiResponse.error(res, 'Failed to assign expert to application', 500, 'SERVER_ERROR');
    }

    const expertName = expert.profiles?.full_name || 'Expert Evaluator';
    const challengeTitle = app.challenges?.title || 'Challenge Proposal';

    // 9. Audit Log
    try {
      await logAudit({
        userId: req.user.id,
        action: AuditActions.EXPERT_ASSIGNED,
        entityType: 'application',
        entityId: applicationId,
        description: `Government Officer assigned ${expertName} as expert evaluator.`
      });
    } catch (auditErr) {
      logger.warn('Failed to log audit for expert assignment', auditErr);
    }

    // 10. Notification for the assigned expert
    if (expert.user_id) {
      try {
        await createNotification({
          userId: expert.user_id,
          role: 'expert',
          title: 'New Application Assigned',
          message: `You have been assigned as the expert evaluator for "${challengeTitle}".`,
          type: 'info'
        });
      } catch (notifErr) {
        logger.warn('Failed to send notification to expert', notifErr);
      }
    }

    return ApiResponse.success(
      res,
      {
        assignment: {
          ...assignment,
          expert_name: expertName,
          expert_organization: expert.organization || expert.profiles?.organization || 'Technical Expert'
        }
      },
      'Expert assigned to application successfully',
      201
    );
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
