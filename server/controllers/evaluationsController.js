import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { calculateWeightedScore } from '../services/evaluationService.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * Submit Expert Evaluation for an assigned application (Expert Only)
 * POST /api/applications/:id/evaluations
 */
export const submitEvaluation = async (req, res) => {
  try {
    const applicationId = req.params.id || req.body.application_id || req.body.applicationId;
    const userId = req.user.id;
    const {
      technical_feasibility,
      innovation_ip,
      cost_effectiveness,
      scalability,
      implementation_risk,
      recommendation,
      comments
    } = req.body;

    if (!applicationId) {
      return ApiResponse.error(res, 'application_id is required', 422, 'VALIDATION_ERROR');
    }

    // 1. Identify expert record linked to authenticated user
    const { data: expert, error: expertError } = await supabaseAdmin
      .from('experts')
      .select('id, user_id, profiles(full_name)')
      .eq('user_id', userId)
      .single();

    if (expertError || !expert) {
      return ApiResponse.error(res, 'No expert profile associated with your account', 403, 'EXPERT_REQUIRED');
    }

    // 2. Verify expert is assigned to this application!
    const { data: assignment, error: assignError } = await supabaseAdmin
      .from('expert_assignments')
      .select('id')
      .eq('application_id', applicationId)
      .or(`expert_id.eq.${expert.id},expert_id.eq.${expert.user_id}`)
      .maybeSingle();

    if (assignError || !assignment) {
      return ApiResponse.error(
        res,
        'Access denied: You are not assigned to evaluate this application',
        403,
        'NOT_ASSIGNED'
      );
    }

    // 3. Validate 0-10 score range
    const scores = {
      technical_feasibility: Number(technical_feasibility),
      innovation_ip: Number(innovation_ip),
      cost_effectiveness: Number(cost_effectiveness),
      scalability: Number(scalability),
      implementation_risk: Number(implementation_risk)
    };

    for (const [key, val] of Object.entries(scores)) {
      if (isNaN(val) || val < 0 || val > 10) {
        return ApiResponse.error(
          res,
          `Score for '${key}' must be a valid number between 0 and 10`,
          422,
          'VALIDATION_ERROR'
        );
      }
    }

    // 4. Calculate weighted score automatically on backend
    const weighted_score = calculateWeightedScore(scores);

    // 5. Create or update evaluation record
    const { data: evaluation, error: evalError } = await supabaseAdmin
      .from('evaluations')
      .upsert([
        {
          application_id: applicationId,
          expert_id: expert.id,
          technical_feasibility: scores.technical_feasibility,
          innovation_ip: scores.innovation_ip,
          cost_effectiveness: scores.cost_effectiveness,
          scalability: scores.scalability,
          implementation_risk: scores.implementation_risk,
          weighted_score,
          recommendation: recommendation || 'Recommend for Pilot',
          comments: comments || null
        }
      ])
      .select('*, applications(challenge_id, challenges(title), startups(name))')
      .single();

    if (evalError) {
      logger.error('Error inserting evaluation record', evalError);
      return ApiResponse.error(res, 'Failed to save evaluation', 500, 'SERVER_ERROR');
    }

    // Update assignment status to evaluated if assigned
    await supabaseAdmin
      .from('expert_assignments')
      .update({ status: 'completed' })
      .eq('application_id', applicationId)
      .eq('expert_id', expert.id);

    // 6. Audit Log
    await logAudit({
      userId,
      action: AuditActions.EVALUATION_SUBMITTED,
      entityType: 'evaluation',
      entityId: evaluation.id,
      description: `Expert '${expert.profiles?.full_name}' evaluated proposal (${weighted_score}/10) for ${evaluation.applications?.startups?.name}`
    });

    // 7. Notify Government Officers
    await createNotification({
      role: 'government',
      title: 'Expert Evaluation Completed',
      message: `${expert.profiles?.full_name} completed evaluation for ${evaluation.applications?.startups?.name} (Score: ${weighted_score}/10).`,
      type: 'success'
    });

    return ApiResponse.success(res, { evaluation }, 'Evaluation submitted successfully', 201);
  } catch (error) {
    logger.error('Error in submitEvaluation controller', error);
    return ApiResponse.error(res, 'Failed to submit evaluation', 500, 'SERVER_ERROR');
  }
};

/**
 * Get all evaluations for an application
 * GET /api/applications/:id/evaluations
 */
export const getEvaluationsByApplication = async (req, res) => {
  try {
    const { id: applicationId } = req.params;

    const { data: evaluations, error } = await supabaseAdmin
      .from('evaluations')
      .select('*, experts(*, profiles(full_name, email, organization))')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching application evaluations', error);
      return ApiResponse.error(res, 'Failed to fetch evaluations', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { evaluations: evaluations || [] }, 'Evaluations retrieved');
  } catch (error) {
    logger.error('Error in getEvaluationsByApplication controller', error);
    return ApiResponse.error(res, 'Failed to retrieve evaluations', 500, 'SERVER_ERROR');
  }
};

/**
 * Update existing evaluation (Author Expert Only)
 * PUT /api/evaluations/:id
 */
export const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      technical_feasibility,
      innovation_ip,
      cost_effectiveness,
      scalability,
      implementation_risk,
      recommendation,
      comments
    } = req.body;

    // Verify ownership
    const { data: expert } = await supabaseAdmin
      .from('experts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!expert) {
      return ApiResponse.error(res, 'Expert profile not found', 403, 'FORBIDDEN');
    }

    const { data: existingEval } = await supabaseAdmin
      .from('evaluations')
      .select('id, expert_id')
      .eq('id', id)
      .single();

    if (!existingEval || existingEval.expert_id !== expert.id) {
      return ApiResponse.error(res, 'You can only modify your own evaluations', 403, 'FORBIDDEN');
    }

    const scores = {
      technical_feasibility: Number(technical_feasibility),
      innovation_ip: Number(innovation_ip),
      cost_effectiveness: Number(cost_effectiveness),
      scalability: Number(scalability),
      implementation_risk: Number(implementation_risk)
    };

    const weighted_score = calculateWeightedScore(scores);

    const { data: updated, error } = await supabaseAdmin
      .from('evaluations')
      .update({
        technical_feasibility: scores.technical_feasibility,
        innovation_ip: scores.innovation_ip,
        cost_effectiveness: scores.cost_effectiveness,
        scalability: scores.scalability,
        implementation_risk: scores.implementation_risk,
        weighted_score,
        recommendation: recommendation || undefined,
        comments: comments || undefined
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating evaluation', error);
      return ApiResponse.error(res, 'Failed to update evaluation', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { evaluation: updated }, 'Evaluation scorecard updated');
  } catch (error) {
    logger.error('Error in updateEvaluation controller', error);
    return ApiResponse.error(res, 'Failed to update evaluation', 500, 'SERVER_ERROR');
  }
};

export default {
  submitEvaluation,
  getEvaluationsByApplication,
  updateEvaluation
};
