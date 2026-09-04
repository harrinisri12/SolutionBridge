import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * Assign Expert to Pilot Validation (Government Only)
 * POST /api/pilots/:pilotId/experts
 */
export const assignExpertToPilot = async (req, res) => {
  try {
    const { pilotId } = req.params;
    const { expert_id, notes } = req.body;

    if (!expert_id) {
      return ApiResponse.error(res, 'expert_id is required', 422, 'VALIDATION_ERROR');
    }

    // 1. Verify pilot exists
    const { data: pilot, error: pilotError } = await supabaseAdmin
      .from('pilots')
      .select('id, startups(name), challenges(title)')
      .eq('id', pilotId)
      .single();

    if (pilotError || !pilot) {
      return ApiResponse.error(res, 'Pilot not found', 404, 'NOT_FOUND');
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
      .from('pilot_expert_assignments')
      .select('id')
      .eq('pilot_id', pilotId)
      .eq('expert_id', expert_id)
      .maybeSingle();

    if (existing) {
      return ApiResponse.error(res, 'This expert is already assigned to this pilot', 409, 'ALREADY_ASSIGNED');
    }

    // 4. Create assignment
    const { data: assignment, error: assignError } = await supabaseAdmin
      .from('pilot_expert_assignments')
      .insert([
        {
          pilot_id: pilotId,
          expert_id,
          assigned_by: req.user.id,
          notes: notes || null,
          created_at: new Date().toISOString()
        }
      ])
      .select('*, experts(*, profiles(full_name, email))')
      .single();

    if (assignError) {
      logger.error('Error assigning expert to pilot', assignError);
      return ApiResponse.error(res, 'Failed to assign expert to pilot', 500, 'SERVER_ERROR');
    }

    // 5. Audit Log
    await logAudit({
      userId: req.user.id,
      action: AuditActions.EXPERT_ASSIGNED,
      entityType: 'pilot_expert_assignment',
      entityId: assignment.id,
      description: `Assigned expert '${expert.profiles?.full_name}' to validate pilot for '${pilot.startups?.name}'`
    });

    // 6. Notify Expert
    if (expert.profile_id) {
      await createNotification({
        userId: expert.profile_id,
        role: 'expert',
        title: 'Assigned to Pilot Validation',
        message: `You have been appointed to audit and validate the pilot for '${pilot.challenges?.title}'.`,
        type: 'info'
      });
    }

    return ApiResponse.success(res, { assignment }, 'Expert assigned to pilot successfully', 201);
  } catch (error) {
    logger.error('Error in assignExpertToPilot controller', error);
    return ApiResponse.error(res, 'Failed to assign expert', 500, 'SERVER_ERROR');
  }
};

/**
 * List experts assigned to a pilot
 * GET /api/pilots/:pilotId/experts
 */
export const listPilotExperts = async (req, res) => {
  try {
    const { pilotId } = req.params;

    const { data: assignments, error } = await supabaseAdmin
      .from('pilot_expert_assignments')
      .select('*, experts(*, profiles(full_name, email, phone, organization))')
      .eq('pilot_id', pilotId);

    if (error) {
      logger.error('Error fetching pilot expert assignments', error);
      return ApiResponse.error(res, 'Failed to retrieve expert assignments', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { assignments: assignments || [] }, 'Pilot expert assignments retrieved');
  } catch (error) {
    logger.error('Error in listPilotExperts controller', error);
    return ApiResponse.error(res, 'Failed to list assignments', 500, 'SERVER_ERROR');
  }
};

/**
 * Remove expert from pilot validation (Government Only)
 * DELETE /api/pilots/:pilotId/experts/:expertId
 */
export const removePilotExpertAssignment = async (req, res) => {
  try {
    const { pilotId, expertId } = req.params;

    const { error } = await supabaseAdmin
      .from('pilot_expert_assignments')
      .delete()
      .eq('pilot_id', pilotId)
      .eq('expert_id', expertId);

    if (error) {
      logger.error('Error removing expert from pilot', error);
      return ApiResponse.error(res, 'Failed to remove expert assignment', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { success: true }, 'Pilot expert assignment removed');
  } catch (error) {
    logger.error('Error in removePilotExpertAssignment controller', error);
    return ApiResponse.error(res, 'Failed to remove assignment', 500, 'SERVER_ERROR');
  }
};

/**
 * Submit Pilot Validation Sign-off (Assigned Expert Only)
 * POST /api/pilots/:id/validation
 */
export const submitPilotValidation = async (req, res) => {
  try {
    const { id: pilotId } = req.params;
    const userId = req.user.id;
    const {
      evidence_verified = true,
      performance_verified = true,
      final_result = 'approved',
      comments
    } = req.body;

    // 1. Verify expert identity
    const { data: expert, error: expertError } = await supabaseAdmin
      .from('experts')
      .select('id, profile_id, profiles(full_name)')
      .eq('profile_id', userId)
      .single();

    if (expertError || !expert) {
      return ApiResponse.error(res, 'Expert profile not found', 403, 'EXPERT_REQUIRED');
    }

    // 2. Verify expert is assigned to this pilot
    const { data: assignment, error: assignError } = await supabaseAdmin
      .from('pilot_expert_assignments')
      .select('id')
      .eq('pilot_id', pilotId)
      .eq('expert_id', expert.id)
      .maybeSingle();

    if (assignError || !assignment) {
      return ApiResponse.error(res, 'You are not assigned to validate this pilot', 403, 'NOT_ASSIGNED_TO_PILOT');
    }

    const validResults = ['approved', 'needs_improvement', 'rejected'];
    if (!validResults.includes(final_result.toLowerCase())) {
      return ApiResponse.error(res, `final_result must be one of: ${validResults.join(', ')}`, 422, 'VALIDATION_ERROR');
    }

    // 3. Upsert validation record
    const { data: validation, error: valError } = await supabaseAdmin
      .from('validations')
      .upsert([
        {
          pilot_id: pilotId,
          expert_id: expert.id,
          evidence_verified: Boolean(evidence_verified),
          performance_verified: Boolean(performance_verified),
          final_result: final_result.toLowerCase(),
          comments: comments || null,
          signed_at: new Date().toISOString()
        }
      ])
      .select('*, pilots(startup_id, startups(name, profile_id), challenges(title))')
      .single();

    if (valError) {
      logger.error('Error saving pilot validation', valError);
      return ApiResponse.error(res, 'Failed to submit pilot validation report', 500, 'SERVER_ERROR');
    }

    // 4. Audit Log
    await logAudit({
      userId,
      action: AuditActions.VALIDATION_SUBMITTED,
      entityType: 'validation',
      entityId: validation.id,
      description: `Expert '${expert.profiles?.full_name}' validated pilot (${final_result}) for '${validation.pilots?.startups?.name}'`
    });

    // 5. Notify Government Officers
    await createNotification({
      role: 'government',
      title: 'Pilot Validation Report Submitted',
      message: `${expert.profiles?.full_name} completed independent validation for ${validation.pilots?.startups?.name} (Result: ${final_result.toUpperCase()}).`,
      type: final_result === 'approved' ? 'success' : 'warning'
    });

    return ApiResponse.success(res, { validation }, 'Pilot validation report recorded successfully', 201);
  } catch (error) {
    logger.error('Error in submitPilotValidation controller', error);
    return ApiResponse.error(res, 'Failed to submit validation', 500, 'SERVER_ERROR');
  }
};

/**
 * Get validation report for a pilot
 * GET /api/pilots/:id/validation
 */
export const getPilotValidation = async (req, res) => {
  try {
    const { id: pilotId } = req.params;

    const { data: validations, error } = await supabaseAdmin
      .from('validations')
      .select('*, experts(*, profiles(full_name, email, organization))')
      .eq('pilot_id', pilotId)
      .order('signed_at', { ascending: false });

    if (error) {
      logger.error('Error fetching pilot validations', error);
      return ApiResponse.error(res, 'Failed to fetch validations', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { validations: validations || [] }, 'Pilot validation reports retrieved');
  } catch (error) {
    logger.error('Error in getPilotValidation controller', error);
    return ApiResponse.error(res, 'Failed to retrieve validation report', 500, 'SERVER_ERROR');
  }
};

/**
 * Update Validation Report (Assigned Expert Only)
 * PUT /api/validations/:id
 */
export const updateValidation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      evidence_verified,
      performance_verified,
      final_result,
      comments
    } = req.body;

    const { data: expert } = await supabaseAdmin
      .from('experts')
      .select('id')
      .eq('profile_id', userId)
      .single();

    if (!expert) {
      return ApiResponse.error(res, 'Expert profile not found', 403, 'FORBIDDEN');
    }

    const { data: existing, error: findError } = await supabaseAdmin
      .from('validations')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return ApiResponse.error(res, 'Validation record not found', 404, 'NOT_FOUND');
    }

    if (existing.expert_id !== expert.id && !req.user.is_admin) {
      return ApiResponse.error(res, 'You can only update your own validation report', 403, 'FORBIDDEN');
    }

    const updates = {};
    if (evidence_verified !== undefined) updates.evidence_verified = Boolean(evidence_verified);
    if (performance_verified !== undefined) updates.performance_verified = Boolean(performance_verified);
    if (final_result) {
      const validResults = ['approved', 'needs_improvement', 'rejected'];
      if (!validResults.includes(final_result.toLowerCase())) {
        return ApiResponse.error(res, `final_result must be one of: ${validResults.join(', ')}`, 422, 'VALIDATION_ERROR');
      }
      updates.final_result = final_result.toLowerCase();
    }
    if (comments !== undefined) updates.comments = comments;
    updates.signed_at = new Date().toISOString();

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('validations')
      .update(updates)
      .eq('id', id)
      .select('*, experts(*, profiles(full_name))')
      .single();

    if (updateError) {
      logger.error('Error updating validation', updateError);
      return ApiResponse.error(res, 'Failed to update validation', 500, 'SERVER_ERROR');
    }

    await logAudit({
      userId,
      action: AuditActions.VALIDATION_SUBMITTED,
      entityType: 'validation',
      entityId: id,
      description: `Updated validation report (Result: ${updated.final_result})`
    });

    return ApiResponse.success(res, { validation: updated }, 'Validation updated successfully');
  } catch (error) {
    logger.error('Error in updateValidation controller', error);
    return ApiResponse.error(res, 'Failed to update validation', 500, 'SERVER_ERROR');
  }
};

export default {
  assignExpertToPilot,
  listPilotExperts,
  removePilotExpertAssignment,
  submitPilotValidation,
  getPilotValidation,
  updateValidation
};

