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
      .select('*, applications(id, challenge_id, proposal, estimated_cost, status, challenges(id, title, category, department_id, government_departments(name))), startups(id, name, dpiit_number, sector, verified), pilot_milestones(*, pilot_evidence(*)), pilot_telemetry(*), validations(*, experts(id, expertise, organization, profiles(full_name, email)))')
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
 * Get pilot by Application ID
 * GET /api/pilots/application/:applicationId
 */
export const getPilotByApplicationId = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { data: pilot, error } = await supabaseAdmin
      .from('pilots')
      .select('*, applications(*, challenges(*, government_departments(name))), startups(*), pilot_milestones(*, pilot_evidence(*)), pilot_telemetry(*), validations(*)')
      .eq('application_id', applicationId)
      .maybeSingle();

    if (error) {
      logger.error('Error fetching pilot by application ID', error);
      return ApiResponse.error(res, 'Failed to fetch pilot for application', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { pilot: pilot || null }, 'Application pilot query completed');
  } catch (error) {
    logger.error('Error in getPilotByApplicationId controller', error);
    return ApiResponse.error(res, 'Failed to retrieve application pilot', 500, 'SERVER_ERROR');
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
    const applicationId = req.body.application_id || req.body.applicationId;
    const location = req.body.location;
    const durationDays = req.body.duration_days !== undefined ? req.body.duration_days : req.body.durationDays;
    const baselineValue = req.body.baseline_value !== undefined ? req.body.baseline_value : req.body.baselineValue;
    const targetValue = req.body.target_value !== undefined ? req.body.target_value : req.body.targetValue;
    const milestones = req.body.milestones;

    if (!applicationId) {
      return ApiResponse.error(res, 'application_id is required', 422, 'VALIDATION_ERROR');
    }

    // 1. Verify application exists in public.applications
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('*, challenges(id, department_id, title, category), startups(id, name, user_id)')
      .eq('id', applicationId)
      .maybeSingle();

    if (appError) {
      logger.error('Database error querying application in createPilot', appError);
      return ApiResponse.error(res, `Database error querying application: ${appError.message}`, 500, 'DATABASE_ERROR');
    }

    if (!application) {
      return ApiResponse.error(res, 'Application not found', 404, 'NOT_FOUND');
    }

    const appStatus = (application.status || '').toLowerCase();
    if (appStatus !== 'selected') {
      return ApiResponse.error(
        res,
        'Application must be selected before creating a pilot.',
        400,
        'APPLICATION_NOT_SELECTED'
      );
    }

    // 2. Prevent duplicate pilot for the same application
    const { data: existingPilot } = await supabaseAdmin
      .from('pilots')
      .select('*, startups(name, user_id), applications(challenge_id, challenges(id, title, category, department_id, government_departments(name))), pilot_milestones(*, pilot_evidence(*))')
      .eq('application_id', applicationId)
      .maybeSingle();

    if (existingPilot) {
      return ApiResponse.error(
        res,
        'Pilot already exists for this application.',
        409,
        'PILOT_ALREADY_EXISTS',
        { pilot: existingPilot }
      );
    }

    // 3. Derive/validate Government Department from authenticated profile or application
    let departmentId = req.user.department_id;
    if (!departmentId) {
      // Fall back to challenge department if user is Admin or department unassigned
      departmentId = application.challenges?.department_id;
    }

    if (!departmentId) {
      const { data: defaultDept } = await supabaseAdmin
        .from('government_departments')
        .select('id')
        .limit(1)
        .maybeSingle();
      if (defaultDept) {
        departmentId = defaultDept.id;
      }
    }

    if (!departmentId) {
      return ApiResponse.error(
        res,
        'Government department is not configured for this account.',
        400,
        'DEPARTMENT_NOT_CONFIGURED'
      );
    }

    // Verify startup relationship
    const startupId = application.startup_id || application.startups?.id;
    if (!startupId) {
      return ApiResponse.error(
        res,
        'Associated startup not found for this application.',
        400,
        'STARTUP_NOT_FOUND'
      );
    }

    // 4. Validate fields
    const parsedDuration = durationDays ? Number(durationDays) : 180;
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return ApiResponse.error(res, 'Invalid pilot duration. Duration must be a positive integer in days.', 422, 'VALIDATION_ERROR');
    }

    const pilotLocation = (location || 'Municipal Pilot Zone').trim();
    if (!pilotLocation) {
      return ApiResponse.error(res, 'Pilot deployment location is required.', 422, 'VALIDATION_ERROR');
    }

    const baselineVal = baselineValue !== undefined && baselineValue !== null && baselineValue !== '' ? Number(baselineValue) : null;
    const targetVal = targetValue !== undefined && targetValue !== null && targetValue !== '' ? Number(targetValue) : null;

    // 5. Insert new pilot with initial status 'not_started' and progress 0
    const { data: pilot, error: pilotError } = await supabaseAdmin
      .from('pilots')
      .insert([
        {
          application_id: applicationId,
          department_id: departmentId,
          startup_id: startupId,
          location: pilotLocation,
          duration_days: parsedDuration,
          baseline_value: baselineVal,
          target_value: targetVal,
          actual_value: null,
          status: 'not_started',
          progress: 0,
          started_at: null,
          completed_at: null,
          created_at: new Date().toISOString()
        }
      ])
      .select('*, startups(name, user_id), applications(challenge_id, challenges(id, title, category, department_id, government_departments(name)))')
      .single();

    if (pilotError || !pilot) {
      logger.error('Error inserting pilot record', pilotError);
      return ApiResponse.error(res, 'Failed to create pilot in database', 500, 'SERVER_ERROR');
    }

    // 6. Create initial milestones linked to the newly created pilot ID
    let milestoneInserts = [];
    if (milestones && Array.isArray(milestones) && milestones.length > 0) {
      milestoneInserts = milestones.map((m, idx) => ({
        pilot_id: pilot.id,
        title: (m.title || `Phase ${idx + 1}: Milestone Deliverable`).trim(),
        description: m.description || null,
        target_date: m.target_date || m.targetDate || m.dueDate || null,
        status: 'pending',
        created_at: new Date().toISOString()
      }));
    } else {
      // Default 3 standard milestone phases
      milestoneInserts = [
        {
          pilot_id: pilot.id,
          title: 'Phase 1: Environment Setup & Baseline Calibration',
          description: 'Deploy hardware/software infrastructure at test site and calibrate baseline metrics.',
          status: 'pending',
          created_at: new Date().toISOString()
        },
        {
          pilot_id: pilot.id,
          title: 'Phase 2: Live Deployment & Telemetry Data Ingestion',
          description: 'Operationalize pilot in real field conditions and stream continuous sensor telemetry.',
          status: 'pending',
          created_at: new Date().toISOString()
        },
        {
          pilot_id: pilot.id,
          title: 'Phase 3: Final Efficacy Benchmarking & Validation Audit',
          description: 'Complete pilot run, verify KPI targets against baseline, and submit evidence for expert validation.',
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ];
    }

    const { data: createdMilestones, error: mError } = await supabaseAdmin
      .from('pilot_milestones')
      .insert(milestoneInserts)
      .select();

    if (mError) {
      logger.warn('Warning inserting pilot milestones', mError);
    }

    // 7. Audit Log
    await logAudit({
      userId,
      action: AuditActions.PILOT_CREATED,
      entityType: 'pilot',
      entityId: pilot.id,
      description: `Pilot initiated for startup '${application.startups?.name || 'Startup'}' on challenge '${application.challenges?.title || 'Challenge'}' with status 'not_started'`
    });

    // 8. Notify Startup Founder
    const startupUserId = application.startups?.user_id;
    if (startupUserId) {
      await createNotification({
        userId: startupUserId,
        role: 'startup',
        title: 'Sandbox Pilot Initiated',
        message: `Government initiated sandbox pilot deployment for '${application.challenges?.title || 'Challenge'}'. Awaiting formal sanction & approval.`,
        type: 'info'
      });
    }

    return ApiResponse.success(
      res,
      {
        pilot: {
          ...pilot,
          pilot_milestones: createdMilestones || []
        }
      },
      'Sandbox pilot initiated successfully',
      201
    );
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

    // 1. Fetch current pilot state
    const { data: currentPilot, error: findError } = await supabaseAdmin
      .from('pilots')
      .select('*, startups(name, user_id), applications(challenge_id, challenges(title))')
      .eq('id', id)
      .single();

    if (findError || !currentPilot) {
      return ApiResponse.error(res, 'Pilot not found', 404, 'NOT_FOUND');
    }

    const targetStatus = status ? status.toLowerCase() : currentPilot.status;

    // 2. Validate Allowed Status Transitions:
    // not_started -> approved
    // approved -> in_progress
    // in_progress -> completed | failed
    if (status && targetStatus !== currentPilot.status) {
      const current = currentPilot.status;
      const validTransitionMap = {
        'not_started': ['approved'],
        'approved': ['in_progress', 'not_started'],
        'in_progress': ['completed', 'failed'],
        'completed': [], // Terminal state unless admin
        'failed': []
      };

      const allowedNext = validTransitionMap[current] || [];
      if (!req.user.is_admin && !allowedNext.includes(targetStatus)) {
        return ApiResponse.error(
          res,
          `Invalid pilot status transition from '${current}' to '${targetStatus}'. Allowed next states: ${allowedNext.length > 0 ? allowedNext.join(', ') : 'None (Terminal state)'}`,
          400,
          'INVALID_STATUS_TRANSITION'
        );
      }
    }

    const updates = {};
    if (status) updates.status = targetStatus;
    if (actual_value !== undefined && actual_value !== null) updates.actual_value = Number(actual_value);
    if (progress !== undefined && progress !== null) updates.progress = Number(progress);

    if (targetStatus === 'in_progress' && !currentPilot.started_at) {
      updates.started_at = new Date().toISOString();
    }
    if (targetStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
      if (progress === undefined) updates.progress = 100;
    }
    if (targetStatus === 'failed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data: updatedPilot, error } = await supabaseAdmin
      .from('pilots')
      .update(updates)
      .eq('id', id)
      .select('*, startups(name, user_id), applications(challenge_id, challenges(id, title, category, department_id, government_departments(name))), pilot_milestones(*, pilot_evidence(*)), pilot_telemetry(*), validations(*)')
      .single();

    if (error || !updatedPilot) {
      logger.error('Error updating pilot status', error);
      return ApiResponse.error(res, 'Failed to update pilot status', 500, 'SERVER_ERROR');
    }

    // 3. Audit Log
    await logAudit({
      userId: req.user.id,
      action: AuditActions.PILOT_STATUS_UPDATED,
      entityType: 'pilot',
      entityId: id,
      description: `Pilot for '${updatedPilot.startups?.name}' status changed from '${currentPilot.status}' to '${updatedPilot.status}' by ${req.user.email}`
    });

    // 4. Notify Startup
    if (updatedPilot.startups?.user_id) {
      const statusTitleMap = {
        'approved': 'Pilot Formally Approved!',
        'in_progress': 'Pilot Deployment Started!',
        'completed': 'Pilot Completed & Ready for Validation!',
        'failed': 'Pilot Deployment Terminated'
      };

      const statusMsgMap = {
        'approved': `Government approved the sandbox pilot for '${updatedPilot.applications?.challenges?.title}'. You can now prepare for field deployment.`,
        'in_progress': `Pilot for '${updatedPilot.applications?.challenges?.title}' is now IN PROGRESS. Submit milestones and sensor telemetry data.`,
        'completed': `Field trials for '${updatedPilot.applications?.challenges?.title}' marked COMPLETED. Scientific expert audit is now active.`,
        'failed': `Pilot for '${updatedPilot.applications?.challenges?.title}' has been marked as FAILED.`
      };

      await createNotification({
        userId: updatedPilot.startups.user_id,
        role: 'startup',
        title: statusTitleMap[updatedPilot.status] || `Pilot Status: ${updatedPilot.status.toUpperCase()}`,
        message: statusMsgMap[updatedPilot.status] || `Pilot status updated to '${updatedPilot.status}'.`,
        type: updatedPilot.status === 'completed' || updatedPilot.status === 'approved' ? 'success' : updatedPilot.status === 'failed' ? 'error' : 'info'
      });
    }

    return ApiResponse.success(res, { pilot: updatedPilot }, `Pilot status updated to ${updatedPilot.status}`);
  } catch (error) {
    logger.error('Error in updatePilotStatus controller', error);
    return ApiResponse.error(res, 'Failed to update pilot status', 500, 'SERVER_ERROR');
  }
};

export default {
  listPilots,
  getPilotById,
  getPilotByApplicationId,
  getPilotPerformance,
  createPilot,
  updatePilotStatus
};

