import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { logger } from '../utils/logger.js';

/**
 * Provision a new Government Officer account (Admin Only)
 * POST /api/users/government
 */
export const createGovernmentUser = async (req, res) => {
  let createdAuthUserId = null;
  try {
    const { full_name, email, phone, organization, department_id, temporary_password, is_admin } = req.body;

    if (!email || !full_name) {
      return ApiResponse.error(res, 'Full name and email are required', 422, 'VALIDATION_ERROR');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const tempPassword = temporary_password || `Gov@${Math.random().toString(36).slice(-8)}!`;

    // 1. Verify department_id if provided
    let validDepartmentId = null;
    if (department_id) {
      const { data: dept } = await supabaseAdmin
        .from('government_departments')
        .select('id')
        .eq('id', department_id)
        .maybeSingle();

      if (dept) {
        validDepartmentId = dept.id;
      }
    }

    // 2. Create Auth user via Supabase Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: full_name.trim(),
        role: 'government',
        department_id: validDepartmentId,
        organization: organization || 'Government Department'
      }
    });

    if (authError || !authData?.user) {
      logger.error('Error in Supabase admin createUser for government', authError);
      return ApiResponse.error(
        res,
        authError?.message || 'Failed to create government user in authentication system',
        400,
        'USER_CREATION_FAILED'
      );
    }

    const userId = authData.user.id;
    createdAuthUserId = userId;

    // 3. Create/Update Profile in 'profiles'
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: userId,
          email: normalizedEmail,
          full_name: full_name.trim(),
          role: 'government',
          phone: phone?.trim() || null,
          organization: organization?.trim() || 'Government Department',
          department_id: validDepartmentId,
          is_admin: Boolean(is_admin),
          is_active: true,
          created_by: req.user.id,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (profileError) {
      logger.error('Error upserting government profile, rolling back auth user', profileError);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return ApiResponse.error(res, 'Failed to initialize government profile', 500, 'PROFILE_CREATION_FAILED');
    }

    // 4. Audit Log
    try {
      await logAudit({
        userId: req.user.id,
        action: AuditActions.USER_CREATED,
        entityType: 'user',
        entityId: userId,
        description: `Government officer account '${full_name.trim()}' (${normalizedEmail}) provisioned by ${req.user.email}`
      });
    } catch (err) {
      logger.warn('Audit logging failed for createGovernmentUser', err);
    }

    return ApiResponse.success(
      res,
      {
        user: {
          id: userId,
          email: profile?.email || normalizedEmail,
          full_name: profile?.full_name || full_name,
          role: 'government',
          department_id: profile?.department_id || validDepartmentId,
          is_admin: Boolean(profile?.is_admin),
          is_active: true
        }
      },
      'Government user account provisioned successfully',
      201
    );
  } catch (error) {
    if (createdAuthUserId) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
      } catch {}
    }
    logger.error('Error in createGovernmentUser controller', error);
    return ApiResponse.error(res, 'Failed to provision government user', 500, 'SERVER_ERROR');
  }
};

/**
 * Provision a new Technical Expert account (Admin Only)
 * POST /api/users/expert
 */
export const createExpertUser = async (req, res) => {
  let createdAuthUserId = null;
  try {
    const { full_name, email, phone, organization, specialization, expertise, institution, temporary_password } = req.body;

    if (!email || !full_name) {
      return ApiResponse.error(res, 'Full name and email are required', 422, 'VALIDATION_ERROR');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const tempPassword = temporary_password || `Exp@${Math.random().toString(36).slice(-8)}!`;
    const expertOrg = organization || institution || 'Independent Expert Panel';
    const expertSpec = specialization || expertise || 'Domain Specialist';

    // 1. Create Auth user via Supabase Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: full_name.trim(),
        role: 'expert',
        organization: expertOrg
      }
    });

    if (authError || !authData?.user) {
      logger.error('Error in Supabase admin createUser for expert', authError);
      return ApiResponse.error(
        res,
        authError?.message || 'Failed to create expert user in authentication system',
        400,
        'USER_CREATION_FAILED'
      );
    }

    const userId = authData.user.id;
    createdAuthUserId = userId;

    // 2. Create/Update Profile in 'profiles'
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: userId,
          email: normalizedEmail,
          full_name: full_name.trim(),
          role: 'expert',
          phone: phone?.trim() || null,
          organization: expertOrg,
          is_admin: false,
          is_active: true,
          created_by: req.user.id,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (profileError) {
      logger.error('Error upserting expert profile, rolling back auth user', profileError);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return ApiResponse.error(res, 'Failed to initialize expert profile', 500, 'PROFILE_CREATION_FAILED');
    }

    // 3. Create Expert Record in 'experts'
    const { data: expertRecord, error: expertError } = await supabaseAdmin
      .from('experts')
      .insert([
        {
          user_id: userId,
          expertise: expertSpec,
          organization: expertOrg,
          verified: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .maybeSingle();

    if (expertError) {
      logger.error('Error inserting into experts table, rolling back', expertError);
      await supabaseAdmin.from('profiles').delete().eq('id', userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return ApiResponse.error(res, 'Failed to create expert profile record', 500, 'EXPERT_CREATION_FAILED');
    }

    // 4. Audit Log
    try {
      await logAudit({
        userId: req.user.id,
        action: AuditActions.USER_CREATED,
        entityType: 'user',
        entityId: userId,
        description: `Expert evaluator account '${full_name.trim()}' (${normalizedEmail}) provisioned by ${req.user.email}`
      });
    } catch (err) {
      logger.warn('Audit logging failed for createExpertUser', err);
    }

    return ApiResponse.success(
      res,
      {
        user: {
          id: userId,
          email: profile?.email || normalizedEmail,
          full_name: profile?.full_name || full_name,
          role: 'expert',
          expert: expertRecord || { expertise: expertSpec, organization: expertOrg },
          is_active: true
        }
      },
      'Expert evaluator account provisioned successfully',
      201
    );
  } catch (error) {
    if (createdAuthUserId) {
      try {
        await supabaseAdmin.from('experts').delete().eq('user_id', createdAuthUserId);
        await supabaseAdmin.from('profiles').delete().eq('id', createdAuthUserId);
        await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
      } catch {}
    }
    logger.error('Error in createExpertUser controller', error);
    return ApiResponse.error(res, 'Failed to provision expert user', 500, 'SERVER_ERROR');
  }
};

/**
 * List all users / profiles (Admin & Government)
 * GET /api/users
 */
export const listUsers = async (req, res) => {
  try {
    const { role, is_active } = req.query;

    let query = supabaseAdmin
      .from('profiles')
      .select('*, department:government_departments(name), expert:experts(expertise, organization, verified)')
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }
    if (is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    const { data: users, error } = await query;

    if (error) {
      logger.error('Error listing users', error);
      return ApiResponse.error(res, 'Failed to retrieve users', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { users: users || [] }, 'Users retrieved successfully');
  } catch (error) {
    logger.error('Error in listUsers controller', error);
    return ApiResponse.error(res, 'Failed to list users', 500, 'SERVER_ERROR');
  }
};

/**
 * Toggle user active status (Admin Only)
 * PATCH /api/users/:id/status
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return ApiResponse.error(res, 'is_active boolean is required', 422, 'VALIDATION_ERROR');
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_active: Boolean(is_active) })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating user active status', error);
      return ApiResponse.error(res, 'Failed to update user status', 500, 'SERVER_ERROR');
    }

    await logAudit({
      userId: req.user.id,
      action: 'USER_STATUS_UPDATED',
      entityType: 'user',
      entityId: id,
      description: `User '${profile.email}' status set to ${is_active ? 'Active' : 'Deactivated'} by ${req.user.email}`
    });

    return ApiResponse.success(res, { profile }, `User status updated to ${is_active ? 'Active' : 'Deactivated'}`);
  } catch (error) {
    logger.error('Error in toggleUserStatus controller', error);
    return ApiResponse.error(res, 'Failed to toggle user status', 500, 'SERVER_ERROR');
  }
};

export const toggleExpertVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    if (verified === undefined) {
      return ApiResponse.error(res, 'verified boolean is required', 422, 'VALIDATION_ERROR');
    }

    const { data: expert, error } = await supabaseAdmin
      .from('experts')
      .update({ verified: Boolean(verified) })
      .eq('user_id', id)
      .select()
      .single();

    if (error || !expert) {
      return ApiResponse.error(res, 'Expert profile not found', 404, 'NOT_FOUND');
    }

    await logAudit({
      userId: req.user.id,
      action: 'EXPERT_VERIFICATION_UPDATED',
      entityType: 'expert',
      entityId: expert.id,
      description: `Expert verification set to ${verified ? 'Verified' : 'Pending'} by ${req.user.email}`
    });

    return ApiResponse.success(res, { expert }, 'Expert verification updated');
  } catch (error) {
    logger.error('Error updating expert verification', error);
    return ApiResponse.error(res, 'Failed to update expert verification', 500, 'SERVER_ERROR');
  }
};

export default {
  createGovernmentUser,
  createExpertUser,
  listUsers,
  toggleUserStatus,
  toggleExpertVerification
};
