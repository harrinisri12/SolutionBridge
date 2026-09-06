import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * List applications based on user role and permissions
 * GET /api/applications
 */
export const listApplications = async (req, res) => {
  try {
    const user = req.user;
    const { challenge_id, status, dpiit_verified } = req.query;

    let query = supabaseAdmin
      .from('applications')
      .select('*, challenges(id, title, category, department_id, government_departments(name)), startups(id, name, dpiit_number, sector, verified), evaluations(*)')
      .order('created_at', { ascending: false });

    // Role-based scoping
    if (user.role === 'startup') {
      // Find startup record owned by user
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!startup) {
        return ApiResponse.success(res, { applications: [] }, 'No startup profile found');
      }

      query = query.eq('startup_id', startup.id);
    } else if (user.role === 'expert') {
      // Find applications assigned to this expert
      const { data: expert } = await supabaseAdmin
        .from('experts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!expert) {
        return ApiResponse.success(res, { applications: [] }, 'No expert profile found');
      }

      const { data: assignments } = await supabaseAdmin
        .from('expert_assignments')
        .select('application_id')
        .eq('expert_id', expert.id);

      const assignedAppIds = (assignments || []).map((a) => a.application_id);

      if (assignedAppIds.length === 0) {
        return ApiResponse.success(res, { applications: [] }, 'No assigned applications');
      }

      query = query.in('id', assignedAppIds);
    }

    if (challenge_id) {
      query = query.eq('challenge_id', challenge_id);
    }
    if (status) {
      query = query.eq('status', status.toLowerCase());
    }
    if (dpiit_verified !== undefined) {
      query = query.eq('dpiit_verified', dpiit_verified === 'true');
    }

    const { data: applications, error } = await query;

    if (error) {
      logger.error('Error fetching applications', error);
      return ApiResponse.error(res, 'Failed to fetch applications', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { applications: applications || [] }, 'Applications retrieved successfully');
  } catch (error) {
    logger.error('Error in listApplications controller', error);
    return ApiResponse.error(res, 'Failed to retrieve applications', 500, 'SERVER_ERROR');
  }
};

/**
 * Get applications for a specific challenge (Government / Evaluator)
 * GET /api/challenges/:challengeId/applications
 */
export const getApplicationsByChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select('*, startups(*), evaluations(*)')
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching challenge applications', error);
      return ApiResponse.error(res, 'Failed to fetch challenge applications', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { applications: applications || [] }, 'Challenge applications retrieved');
  } catch (error) {
    logger.error('Error in getApplicationsByChallenge controller', error);
    return ApiResponse.error(res, 'Failed to fetch applications', 500, 'SERVER_ERROR');
  }
};

/**
 * Get application details by ID
 * GET /api/applications/:id
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .select('*, challenges(*, government_departments(name)), startups(*, profiles(full_name, email, phone)), evaluations(*, experts(id, expertise, organization, profiles(full_name, email)))')
      .eq('id', id)
      .single();

    if (error || !application) {
      return ApiResponse.error(res, 'Application not found', 404, 'NOT_FOUND');
    }

    // Authorization check for startup
    if (user.role === 'startup') {
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!startup || startup.id !== application.startup_id) {
        return ApiResponse.error(res, 'Access forbidden to this proposal', 403, 'FORBIDDEN');
      }
    }

    return ApiResponse.success(res, { application }, 'Application details retrieved');
  } catch (error) {
    logger.error('Error in getApplicationById controller', error);
    return ApiResponse.error(res, 'Failed to retrieve application', 500, 'SERVER_ERROR');
  }
};

/**
 * Submit a proposal application (Startup Only)
 * POST /api/applications
 */
export const submitApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      challenge_id,
      proposal,
      technical_solution,
      technical_approach,
      expected_impact,
      estimated_cost,
      estimated_cost_numeric
    } = req.body;

    if (!challenge_id || !proposal) {
      return ApiResponse.error(res, 'Challenge ID and proposal summary are required', 422, 'VALIDATION_ERROR');
    }

    // 1. Verify startup ownership
    let { data: startup, error: startupError } = await supabaseAdmin
      .from('startups')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!startup) {
      // Auto-create startup record if user registered as startup role
      const { data: userProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userProfile && userProfile.role === 'startup') {
        const { data: createdStartup } = await supabaseAdmin
          .from('startups')
          .insert([
            {
              user_id: userId,
              name: userProfile.organization || userProfile.full_name || 'My Startup',
              dpiit_number: 'DPIIT' + Math.floor(100000 + Math.random() * 900000),
              sector: 'Technology',
              verified: false,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();
        startup = createdStartup;
      }
    }

    if (!startup) {
      return ApiResponse.error(res, 'You must register a startup profile before applying to challenges', 403, 'STARTUP_REQUIRED');
    }

    // 2. Verify challenge exists and is open
    const { data: challenge, error: challengeError } = await supabaseAdmin
      .from('challenges')
      .select('id, title, status, department_id')
      .eq('id', challenge_id)
      .single();

    if (challengeError || !challenge) {
      return ApiResponse.error(res, 'Challenge not found', 404, 'NOT_FOUND');
    }

    if (challenge.status !== 'published') {
      return ApiResponse.error(res, 'This challenge is closed or in draft status and not accepting proposals', 400, 'CHALLENGE_NOT_OPEN');
    }

    // 3. Prevent duplicate application
    const { data: existingApp } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('challenge_id', challenge_id)
      .eq('startup_id', startup.id)
      .maybeSingle();

    if (existingApp) {
      return ApiResponse.error(res, 'Your startup has already submitted a proposal for this challenge', 409, 'ALREADY_APPLIED');
    }

    // Compose technical solution and cost details
    const fullTechSolution = technical_solution || [
      proposal,
      technical_approach ? `\n\nApproach: ${technical_approach}` : '',
      expected_impact ? `\n\nImpact: ${expected_impact}` : ''
    ].join('');

    const costStr = estimated_cost ? String(estimated_cost) : estimated_cost_numeric ? `₹${estimated_cost_numeric}` : 'To be determined';

    // 4. Create application
    const { data: newApp, error: appError } = await supabaseAdmin
      .from('applications')
      .insert([
        {
          challenge_id,
          startup_id: startup.id,
          proposal: proposal.trim(),
          technical_solution: fullTechSolution.trim(),
          estimated_cost: costStr,
          dpiit_verified: Boolean(startup.verified),
          status: 'under_review',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select('*, challenges(title, department_id), startups(name)')
      .single();

    if (appError) {
      logger.error('Error inserting application', appError);
      return ApiResponse.error(res, 'Failed to submit application', 500, 'SERVER_ERROR');
    }

    // 5. Audit Log
    await logAudit({
      userId,
      action: AuditActions.APPLICATION_SUBMITTED,
      entityType: 'application',
      entityId: newApp.id,
      description: `Startup '${startup.name}' submitted proposal for '${challenge.title}'`
    });

    // 6. Notify Government Officers
    await createNotification({
      role: 'government',
      title: 'New Application Received',
      message: `${startup.name} submitted a proposal for '${challenge.title}'.`,
      type: 'info'
    });

    return ApiResponse.success(res, { application: newApp }, 'Application submitted successfully', 201);
  } catch (error) {
    logger.error('Error in submitApplication controller', error);
    return ApiResponse.error(res, 'Failed to submit application', 500, 'SERVER_ERROR');
  }
};

/**
 * Update application status & recommendation (Government Only)
 * PATCH /api/applications/:id/status
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['under_review', 'shortlisted', 'selected', 'rejected'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return ApiResponse.error(
        res,
        `Status must be one of: ${validStatuses.join(', ')}`,
        422,
        'VALIDATION_ERROR'
      );
    }

    const normalizedStatus = status.toLowerCase();

    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .update({
        status: normalizedStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, challenges(title), startups(name, user_id)')
      .single();

    if (error || !application) {
      logger.error('Error updating application status', error);
      return ApiResponse.error(res, 'Failed to update application status', 500, 'SERVER_ERROR');
    }

    // Audit Log
    await logAudit({
      userId: req.user.id,
      action: AuditActions.APPLICATION_STATUS_UPDATED,
      entityType: 'application',
      entityId: id,
      description: `Proposal by ${application.startups?.name} marked as '${normalizedStatus}' by ${req.user.email}`
    });

    // Notify Startup
    if (application.startups?.user_id) {
      await createNotification({
        userId: application.startups.user_id,
        role: 'startup',
        title: `Proposal Status: ${normalizedStatus.toUpperCase()}`,
        message: `Your application for '${application.challenges?.title}' has been moved to '${normalizedStatus}'.`,
        type: normalizedStatus === 'selected' ? 'success' : normalizedStatus === 'rejected' ? 'warning' : 'info'
      });
    }

    return ApiResponse.success(res, { application }, `Application status updated to ${normalizedStatus}`);
  } catch (error) {
    logger.error('Error in updateApplicationStatus controller', error);
    return ApiResponse.error(res, 'Failed to update application status', 500, 'SERVER_ERROR');
  }
};

export default {
  listApplications,
  getApplicationsByChallenge,
  getApplicationById,
  submitApplication,
  updateApplicationStatus
};
