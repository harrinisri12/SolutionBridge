import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { calculatePerformancePercentage, aggregateMilestoneProgress } from '../services/pilotService.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * List Pilots based on user role
 * GET /api/pilots
 */
export const listPilots = async (req, res) => {
  try {
    const user = req.user;
    const { status, department_id } = req.query;

    let query = supabaseAdmin
      .from('pilots')
      .select('*, applications(id, challenge_id, proposal, estimated_cost, challenges(id, title, category, department_id, government_departments(name))), startups(id, name, dpiit_number, sector, verified), pilot_milestones(*), validations(*)')
      .order('created_at', { ascending: false });

    // Scoping for startups
    if (user.role === 'startup') {
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!startup) {
        return ApiResponse.success(res, { pilots: [] }, 'No startup profile found');
      }

      query = query.eq('startup_id', startup.id);
    } else if (user.role === 'expert') {
      // Find pilots assigned to expert (via expert_assignments or validations)
      const { data: expert } = await supabaseAdmin
        .from('experts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!expert) {
        return ApiResponse.success(res, { pilots: [] }, 'No expert profile found');
      }

      const { data: assignments } = await supabaseAdmin
        .from('expert_assignments')
        .select('application_id')
        .eq('expert_id', expert.id);

      const assignedAppIds = (assignments || []).map((a) => a.application_id);

      const { data: expertValidations } = await supabaseAdmin
        .from('validations')
        .select('pilot_id')
        .eq('expert_id', expert.id);

      const validatedPilotIds = (expertValidations || []).map((v) => v.pilot_id);

      if (assignedAppIds.length === 0 && validatedPilotIds.length === 0) {
        return ApiResponse.success(res, { pilots: [] }, 'No assigned pilots');
      }

      // Filter by application_id in assignedAppIds or id in validatedPilotIds
      if (assignedAppIds.length > 0) {
        query = query.in('application_id', assignedAppIds);
      } else {
        query = query.in('id', validatedPilotIds);
      }
    }

    if (status) {
      query = query.eq('status', status.toLowerCase());
    }
    if (department_id) {
      query = query.eq('department_id', department_id);
    }

    const { data: pilots, error } = await query;

    if (error) {
      logger.error('Error listing pilots', error);
      return ApiResponse.error(res, 'Failed to fetch pilots', 500, 'SERVER_ERROR');
    }

    // Format progress dynamically based on milestones
    const formatted = (pilots || []).map((p) => ({
      ...p,
      computedProgress: aggregateMilestoneProgress(p.pilot_milestones)
    }));

    return ApiResponse.success(res, { pilots: formatted }, 'Pilots retrieved successfully');
  } catch (error) {
    logger.error('Error in listPilots controller', error);
    return ApiResponse.error(res, 'Failed to retrieve pilots', 500, 'SERVER_ERROR');
  }
};

/**
 * Get pilot details by ID
 * GET /api/pilots/:id
 */
export const getPilotById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const { data: pilot, error } = await supabaseAdmin
      .from('pilots')
      .select('*, applications(*, challenges(*, government_departments(name))), startups(*, profiles(full_name, email, phone)), pilot_milestones(*, pilot_evidence(*)), pilot_telemetry(*), validations(*, experts(id, expertise, organization, profiles(full_name, email)))')
      .eq('id', id)
      .single();

    if (error || !pilot) {
      return ApiResponse.error(res, 'Pilot not found', 404, 'NOT_FOUND');
    }

    // Verification check for startup ownership
    if (user.role === 'startup') {
      const { data: startup } = await supabaseAdmin.from('startups').select('id').eq('user_id', user.id).maybeSingle();
      if (!startup || startup.id !== pilot.startup_id) {
        return ApiResponse.error(res, 'Access forbidden to this pilot', 403, 'FORBIDDEN');
      }
    }

    return ApiResponse.success(res, { pilot }, 'Pilot details retrieved');
  } catch (error) {
    logger.error('Error in getPilotById controller', error);
    return ApiResponse.error(res, 'Failed to fetch pilot details', 500, 'SERVER_ERROR');
  }
};

/**
 * Get Pilot Performance Analytics
 * GET /api/pilots/:id/performance
 */
export const getPilotPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: pilot, error } = await supabaseAdmin
      .from('pilots')
      .select('*, pilot_milestones(*), pilot_telemetry(*), validations(*)')
      .eq('id', id)
      .single();

    if (error || !pilot) {
      return ApiResponse.error(res, 'Pilot not found', 404, 'NOT_FOUND');
    }

    const performancePct = calculatePerformancePercentage(
      pilot.baseline_value,
      pilot.target_value,
      pilot.actual_value
    );

    const milestoneProgress = aggregateMilestoneProgress(pilot.pilot_milestones);

    const performanceData = {
      pilotId: pilot.id,
      metricName: 'Operational Efficacy',
      baseline: pilot.baseline_value,
      target: pilot.target_value,
      actual: pilot.actual_value,
      unit: '%',
      performancePercentage: performancePct,
      milestoneProgress,
      status: pilot.status,
      telemetryLogsCount: pilot.pilot_telemetry?.length || 0,
      validation: pilot.validations?.[0] || null
    };

    return ApiResponse.success(res, { performance: performanceData }, 'Pilot performance analytics calculated');
  } catch (error) {
    logger.error('Error in getPilotPerformance controller', error);
    return ApiResponse.error(res, 'Failed to compute pilot performance', 500, 'SERVER_ERROR');
  }
};

/**
 * Create a new Sandbox Pilot from a selected application (Government Only)
 * POST /api/pilots
 */
export const createPilot = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      application_id,
      location,
      duration_days,
      baseline_value,
      target_value,
      milestones
    } = req.body;

    if (!application_id) {
      return ApiResponse.error(res, 'application_id is required', 422, 'VALIDATION_ERROR');
    }

    // 1. Verify application is selected
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('*, challenges(id, department_id, title), startups(id, name, user_id)')
      .eq('id', application_id)
      .single();

    if (appError || !application) {
      return ApiResponse.error(res, 'Application not found', 404, 'NOT_FOUND');
    }

    if (application.status !== 'selected') {
      return ApiResponse.error(
        res,
        `Cannot create pilot: Application must be in 'selected' status (currently '${application.status}')`,
        400,
        'APPLICATION_NOT_SELECTED'
      );
    }

    // 2. Create pilot record
    const { data: pilot, error: pilotError } = await supabaseAdmin
      .from('pilots')
      .insert([
        {
          application_id,
          department_id: application.challenges?.department_id,
          startup_id: application.startup_id,
          location: location || 'Municipal Pilot Zone',
          duration_days: duration_days ? Number(duration_days) : 180,
          baseline_value: baseline_value !== undefined ? Number(baseline_value) : null,
          target_value: target_value !== undefined ? Number(target_value) : null,
          status: 'approved',
          progress: 0,
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select('*, startups(name)')
      .single();

    if (pilotError) {
      logger.error('Error inserting pilot record', pilotError);
      return ApiResponse.error(res, 'Failed to create pilot', 500, 'SERVER_ERROR');
    }

    // 3. Create initial milestones if provided
    if (milestones && Array.isArray(milestones) && milestones.length > 0) {
      const milestoneInserts = milestones.map((m, idx) => ({
        pilot_id: pilot.id,
        title: m.title || `Milestone ${idx + 1}`,
        description: m.description || null,
        target_date: m.target_date || null,
        status: 'pending',
        created_at: new Date().toISOString()
      }));

      await supabaseAdmin.from('pilot_milestones').insert(milestoneInserts);
    }

    // 4. Audit Log
    await logAudit({
      userId,
      action: AuditActions.PILOT_CREATED,
      entityType: 'pilot',
      entityId: pilot.id,
      description: `Pilot sanctioned for startup '${application.startups?.name}' on challenge '${application.challenges?.title}'`
    });

    // 5. Notify Startup Founder
    if (application.startups?.user_id) {
      await createNotification({
        userId: application.startups.user_id,
        role: 'startup',
        title: 'Pilot Deployment Approved!',
        message: `Government approved sandbox pilot for '${application.challenges?.title}'. You can now deploy and submit milestone evidence.`,
        type: 'success'
      });
    }

    return ApiResponse.success(res, { pilot }, 'Sandbox pilot created successfully', 201);
  } catch (error) {
    logger.error('Error in createPilot controller', error);
    return ApiResponse.error(res, 'Failed to create pilot', 500, 'SERVER_ERROR');
  }
};

/**
 * Update pilot status (Government Only)
 * PATCH /api/pilots/:id/status
 */
export const updatePilotStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actual_value, progress } = req.body;

    const validStatuses = ['not_started', 'approved', 'in_progress', 'completed', 'failed'];
    if (status && !validStatuses.includes(status.toLowerCase())) {
      return ApiResponse.error(res, `Status must be one of: ${validStatuses.join(', ')}`, 422, 'VALIDATION_ERROR');
    }

    const updates = {};
    if (status) updates.status = status.toLowerCase();
    if (actual_value !== undefined) updates.actual_value = Number(actual_value);
    if (progress !== undefined) updates.progress = Number(progress);
    if (status === 'completed') updates.completed_at = new Date().toISOString();

    const { data: pilot, error } = await supabaseAdmin
      .from('pilots')
      .update(updates)
      .eq('id', id)
      .select('*, startups(name, user_id), applications(challenge_id, challenges(title))')
      .single();

    if (error || !pilot) {
      return ApiResponse.error(res, 'Failed to update pilot status', 500, 'SERVER_ERROR');
    }

    await logAudit({
      userId: req.user.id,
      action: AuditActions.PILOT_STATUS_UPDATED,
      entityType: 'pilot',
      entityId: id,
      description: `Pilot for ${pilot.startups?.name} status updated to '${pilot.status}' by ${req.user.email}`
    });

    return ApiResponse.success(res, { pilot }, `Pilot status updated to ${pilot.status}`);
  } catch (error) {
    logger.error('Error in updatePilotStatus controller', error);
    return ApiResponse.error(res, 'Failed to update pilot status', 500, 'SERVER_ERROR');
  }
};

export default {
  listPilots,
  getPilotById,
  getPilotPerformance,
  createPilot,
  updatePilotStatus
};
