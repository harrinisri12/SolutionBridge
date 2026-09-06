import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * List challenges with filtering and search
 * GET /api/challenges
 */
export const listChallenges = async (req, res) => {
  try {
    const { category, status, department_id, search } = req.query;

    let query = supabaseAdmin
      .from('challenges')
      .select('*, government_departments(name), applications(count)')
      .order('created_at', { ascending: false });

    // Non-government users can only see published challenges unless specific access
    const userRole = req.user?.role?.toLowerCase();

    if (userRole !== 'government') {
      query = query.eq('status', 'published');
    } else if (status) {
      query = query.eq('status', status.toLowerCase());
    }

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (department_id) {
      query = query.eq('department_id', department_id);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,problem_statement.ilike.%${search}%`
      );
    }

    const { data: challenges, error } = await query;

    if (error) {
      logger.error('Error fetching challenges', error);
      return ApiResponse.error(
        res,
        'Failed to retrieve challenges',
        500,
        'SERVER_ERROR'
      );
    }

    // Format application count for UI consumption
    const formatted = (challenges || []).map((ch) => ({
      ...ch,
      applicationsCount: ch.applications
        ? ch.applications[0]?.count || 0
        : 0
    }));

    return ApiResponse.success(
      res,
      { challenges: formatted },
      'Challenges retrieved successfully'
    );
  } catch (error) {
    logger.error('Error in listChallenges controller', error);
    return ApiResponse.error(
      res,
      'Failed to fetch challenges',
      500,
      'SERVER_ERROR'
    );
  }
};

/**
 * Get challenge details by ID
 * GET /api/challenges/:id
 */
export const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .select('*, government_departments(name), applications(count)')
      .eq('id', id)
      .single();

    if (error || !challenge) {
      return ApiResponse.error(
        res,
        'Challenge problem statement not found',
        404,
        'NOT_FOUND'
      );
    }

    return ApiResponse.success(
      res,
      { challenge },
      'Challenge retrieved successfully'
    );
  } catch (error) {
    logger.error('Error in getChallengeById controller', error);
    return ApiResponse.error(
      res,
      'Failed to fetch challenge',
      500,
      'SERVER_ERROR'
    );
  }
};

/**
 * Create a new Government Challenge (Government Only)
 * POST /api/challenges
 */
export const createChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDept = req.user.department_id;

    const title = req.body.title;
    const problem_statement = req.body.problem_statement || req.body.problemStatement;
    const category = req.body.category || req.body.sector || 'General';
    const department_id = req.body.department_id || req.body.departmentId;
    const technical_requirements = req.body.technical_requirements || req.body.technicalRequirements || '';
    const pilot_guidelines = req.body.pilot_guidelines || req.body.pilotGuidelines || '';
    const status = (req.body.status || 'published').toLowerCase();
    const eligibility_criteria = req.body.eligibility_criteria || req.body.eligibilityCriteria || '';
    const location = req.body.location || '';
    const pilot_duration = req.body.pilot_duration || req.body.pilotDuration || '';
    const budget = req.body.budget || '';

    if (!title || !problem_statement) {
      return ApiResponse.error(
        res,
        'Title and problem statement are required',
        422,
        'VALIDATION_ERROR'
      );
    }

    let targetDept = userDept || department_id;
    if (!req.user.is_admin && userDept) {
      targetDept = userDept;
    }
    if (!targetDept) {
      const { data: defaultDept } = await supabaseAdmin
        .from('government_departments')
        .select('id')
        .limit(1)
        .single();
      if (defaultDept) targetDept = defaultDept.id;
    }

    const isPublished = status.toLowerCase() === 'published';

    // Combine any supplementary fields into technical_requirements and pilot_guidelines
    const techReqCombined = [
      technical_requirements || '',
      eligibility_criteria ? `\n\nEligibility: ${eligibility_criteria}` : ''
    ].filter(Boolean).join('\n');

    const pilotGuidelinesCombined = [
      pilot_guidelines || '',
      location ? `\nLocation: ${location}` : '',
      pilot_duration ? `\nDuration: ${pilot_duration}` : '',
      budget ? `\nBudget: ${budget}` : ''
    ].filter(Boolean).join('\n');

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .insert([
        {
          title: title.trim(),
          problem_statement: problem_statement.trim(),
          category: category || 'General',
          department_id: targetDept,
          created_by: userId,
          technical_requirements: techReqCombined || null,
          pilot_guidelines: pilotGuidelinesCombined || null,
          status: isPublished ? 'published' : 'draft',
          published_at: isPublished
            ? new Date().toISOString()
            : null,
          created_at: new Date().toISOString()
        }
      ])
      .select('*, government_departments(name)')
      .single();

    if (error) {
      logger.error('Error inserting challenge record', error);
      return ApiResponse.error(
        res,
        'Failed to create challenge',
        500,
        'SERVER_ERROR'
      );
    }

    // Audit Log
    await logAudit({
      userId,
      action: isPublished
        ? AuditActions.CHALLENGE_PUBLISHED
        : AuditActions.CHALLENGE_CREATED,
      entityType: 'challenge',
      entityId: challenge.id,
      description: `${
        isPublished ? 'Published' : 'Drafted'
      } challenge '${title}' for department`
    });

    // Notify startups if published
    if (isPublished) {
      await createNotification({
        role: 'startup',
        title: 'New Government Challenge Announced',
        message: `A new public problem has been published: '${title}'`,
        type: 'info'
      });
    }

    return ApiResponse.success(
      res,
      { challenge },
      'Challenge created successfully',
      201
    );
  } catch (error) {
    logger.error('Error in createChallenge controller', error);
    return ApiResponse.error(
      res,
      'Failed to create challenge',
      500,
      'SERVER_ERROR'
    );
  }
};

/**
 * Update challenge (Government Only)
 * PUT /api/challenges/:id
 */
export const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userDept = req.user.department_id;
    const isAdmin = Boolean(req.user.is_admin);

    // Verify existing challenge & department ownership
    const { data: existingChallenge, error: fetchErr } = await supabaseAdmin
      .from('challenges')
      .select('*, government_departments(name)')
      .eq('id', id)
      .single();

    if (fetchErr || !existingChallenge) {
      return ApiResponse.error(
        res,
        'Challenge not found',
        404,
        'NOT_FOUND'
      );
    }

    if (!isAdmin && userDept && existingChallenge.department_id && existingChallenge.department_id !== userDept) {
      return ApiResponse.error(
        res,
        `You can only edit problem statements for your assigned department (${existingChallenge.government_departments?.name || 'Other Department'}).`,
        403,
        'FORBIDDEN'
      );
    }

    const {
      title,
      problem_statement,
      category,
      technical_requirements,
      pilot_guidelines,
      status
    } = req.body;

    const updates = {};

    if (title) updates.title = title.trim();
    if (problem_statement) {
      updates.problem_statement = problem_statement.trim();
    }
    if (category) updates.category = category;
    if (technical_requirements !== undefined) {
      updates.technical_requirements = technical_requirements;
    }
    if (pilot_guidelines !== undefined) {
      updates.pilot_guidelines = pilot_guidelines;
    }
    if (status) {
      updates.status = status.toLowerCase();
    }

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .update(updates)
      .eq('id', id)
      .select('*, government_departments(name)')
      .single();

    if (error || !challenge) {
      logger.error('Error updating challenge', error);
      return ApiResponse.error(
        res,
        'Failed to update challenge',
        500,
        'SERVER_ERROR'
      );
    }

    await logAudit({
      userId,
      action: AuditActions.CHALLENGE_UPDATED,
      entityType: 'challenge',
      entityId: id,
      description: `Challenge '${challenge.title}' updated by ${req.user.email}`
    });

    return ApiResponse.success(
      res,
      { challenge },
      'Challenge updated successfully'
    );
  } catch (error) {
    logger.error('Error in updateChallenge controller', error);
    return ApiResponse.error(
      res,
      'Failed to update challenge',
      500,
      'SERVER_ERROR'
    );
  }
};

/**
 * Publish a draft challenge
 * PATCH /api/challenges/:id/publish
 */
export const publishChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const userDept = req.user.department_id;
    const isAdmin = Boolean(req.user.is_admin);

    const { data: existingChallenge } = await supabaseAdmin
      .from('challenges')
      .select('department_id')
      .eq('id', id)
      .single();

    if (existingChallenge && !isAdmin && userDept && existingChallenge.department_id && existingChallenge.department_id !== userDept) {
      return ApiResponse.error(
        res,
        'You can only publish challenges for your assigned department.',
        403,
        'FORBIDDEN'
      );
    }

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !challenge) {
      return ApiResponse.error(
        res,
        'Failed to publish challenge',
        404,
        'NOT_FOUND'
      );
    }

    await logAudit({
      userId: req.user.id,
      action: AuditActions.CHALLENGE_PUBLISHED,
      entityType: 'challenge',
      entityId: id,
      description: `Challenge '${challenge.title}' published by ${req.user.email}`
    });

    await createNotification({
      role: 'startup',
      title: 'New Government Challenge Published',
      message: `Open for applications: '${challenge.title}'`,
      type: 'info'
    });

    return ApiResponse.success(
      res,
      { challenge },
      'Challenge published successfully'
    );
  } catch (error) {
    logger.error('Error in publishChallenge controller', error);
    return ApiResponse.error(
      res,
      'Failed to publish challenge',
      500,
      'SERVER_ERROR'
    );
  }
};

/**
 * Close a challenge
 * PATCH /api/challenges/:id/close
 */
export const closeChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const userDept = req.user.department_id;
    const isAdmin = Boolean(req.user.is_admin);

    const { data: existingChallenge } = await supabaseAdmin
      .from('challenges')
      .select('department_id')
      .eq('id', id)
      .single();

    if (existingChallenge && !isAdmin && userDept && existingChallenge.department_id && existingChallenge.department_id !== userDept) {
      return ApiResponse.error(
        res,
        'You can only close challenges for your assigned department.',
        403,
        'FORBIDDEN'
      );
    }

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .update({
        status: 'closed'
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !challenge) {
      return ApiResponse.error(
        res,
        'Failed to close challenge',
        404,
        'NOT_FOUND'
      );
    }

    await logAudit({
      userId: req.user.id,
      action: AuditActions.CHALLENGE_CLOSED,
      entityType: 'challenge',
      entityId: id,
      description: `Challenge '${challenge.title}' closed for new submissions by ${req.user.email}`
    });

    return ApiResponse.success(
      res,
      { challenge },
      'Challenge marked as closed'
    );
  } catch (error) {
    logger.error('Error in closeChallenge controller', error);
    return ApiResponse.error(
      res,
      'Failed to close challenge',
      500,
      'SERVER_ERROR'
    );
  }
};

/**
 * Delete a draft challenge
 * DELETE /api/challenges/:id
 */
export const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const userDept = req.user.department_id;
    const isAdmin = Boolean(req.user.is_admin);

    const { data: challenge } = await supabaseAdmin
      .from('challenges')
      .select('status, title, department_id')
      .eq('id', id)
      .single();

    if (!challenge) {
      return ApiResponse.error(res, 'Challenge not found', 404, 'NOT_FOUND');
    }

    if (!isAdmin && userDept && challenge.department_id && challenge.department_id !== userDept) {
      return ApiResponse.error(
        res,
        'You can only remove challenges for your assigned department.',
        403,
        'FORBIDDEN'
      );
    }

    if (challenge && challenge.status === 'published') {
      return ApiResponse.error(
        res,
        'Published challenges cannot be deleted. Close the challenge instead.',
        400,
        'CANNOT_DELETE_PUBLISHED'
      );
    }

    const { error } = await supabaseAdmin
      .from('challenges')
      .delete()
      .eq('id', id);

    if (error) {
      return ApiResponse.error(
        res,
        'Failed to delete challenge',
        500,
        'SERVER_ERROR'
      );
    }

    return ApiResponse.success(
      res,
      { id },
      'Challenge deleted successfully'
    );
  } catch (error) {
    logger.error('Error in deleteChallenge controller', error);
    return ApiResponse.error(
      res,
      'Failed to delete challenge',
      500,
      'SERVER_ERROR'
    );
  }
};

export default {
  listChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  publishChallenge,
  closeChallenge,
  deleteChallenge
};