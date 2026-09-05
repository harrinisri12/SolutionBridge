import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * GET /api/auth/me
 *
 * Returns the authenticated user's SolutionBridge profile.
 */
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return ApiResponse.error(
        res,
        'Profile not found',
        404,
        'NOT_FOUND'
      );
    }

    let extraData = {};

    /*
     * Startup-specific data
     *
     * IMPORTANT:
     * Your database uses startups.user_id,
     * not startups.profile_id.
     */
    if (profile.role === 'startup') {
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      extraData.startup = startup || null;
    }

    /*
     * Expert-specific data
     */
    if (profile.role === 'expert') {
      const { data: expert } = await supabaseAdmin
        .from('experts')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      extraData.expert = expert || null;
    }

    /*
     * Government department
     */
    if (
      profile.role === 'government' &&
      profile.department_id
    ) {
      const { data: department } = await supabaseAdmin
        .from('government_departments')
        .select('*')
        .eq('id', profile.department_id)
        .maybeSingle();

      extraData.department = department || null;
    }

    return ApiResponse.success(
      res,
      {
        profile: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          phone: profile.phone,
          organization: profile.organization,
          is_admin: Boolean(profile.is_admin),
          is_active: profile.is_active !== false,
          department_id: profile.department_id,
          created_at: profile.created_at,
          ...extraData
        }
      },
      'User profile loaded successfully'
    );

  } catch (error) {
    logger.error(
      'Error in getMe controller',
      error
    );

    return ApiResponse.error(
      res,
      'Failed to fetch user profile',
      500,
      'SERVER_ERROR'
    );
  }
};


/**
 * POST /api/auth/register-startup
 *
 * IMPORTANT:
 * The Supabase Auth account is already created
 * by the frontend using supabase.auth.signUp().
 *
 * This endpoint ONLY creates/updates the
 * SolutionBridge profile and startup record.
 *
 * The route must be protected by requireAuth.
 */
export const registerStartup = async (req, res) => {
  try {

    /*
     * The authenticated Supabase user.
     */
    const userId = req.user?.id;

    if (!userId) {
      return ApiResponse.error(
        res,
        'Authentication is required to register a startup.',
        401,
        'UNAUTHORIZED'
      );
    }

    const {
      full_name,
      phone,
      organization,
      company_name,
      dpiit_number,
      sector,
      website,
      description
    } = req.body || {};

    /*
     * Validate required startup information.
     */
    if (!full_name || !full_name.trim()) {
      return ApiResponse.error(
        res,
        'Founder name is required.',
        422,
        'VALIDATION_ERROR'
      );
    }

    if (!company_name || !company_name.trim()) {
      return ApiResponse.error(
        res,
        'Startup / Company Name is required.',
        422,
        'VALIDATION_ERROR'
      );
    }

    if (!dpiit_number || !dpiit_number.trim()) {
      return ApiResponse.error(
        res,
        'DPIIT Recognition Number is required.',
        422,
        'VALIDATION_ERROR'
      );
    }

    /*
     * Get the authenticated user's email
     * directly from Supabase Auth.
     */
    const {
      data: authUserData,
      error: authUserError
    } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (authUserError || !authUserData?.user) {
      return ApiResponse.error(
        res,
        'Authenticated Supabase user could not be found.',
        401,
        'UNAUTHORIZED'
      );
    }

    const authUser = authUserData.user;

    const email =
      authUser.email?.trim().toLowerCase();

    /*
     * Make sure this authenticated account
     * is a startup account.
     *
     * Public signup must never create
     * government or expert accounts.
     */
    const metadataRole =
      authUser.user_metadata?.role;

    if (
      metadataRole &&
      metadataRole !== 'startup'
    ) {
      return ApiResponse.error(
        res,
        'Only startup accounts can use public startup registration.',
        403,
        'FORBIDDEN'
      );
    }

    /*
     * 1. Create/update SolutionBridge profile.
     *
     * The database trigger normally creates this
     * automatically during Supabase signup.
     *
     * We use upsert here so registration remains
     * reliable even if the trigger is delayed/missing.
     */
    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from('profiles')
        .upsert(
          {
            id: userId,
            email,
            full_name: full_name.trim(),
            role: 'startup',
            phone: phone?.trim() || null,
            organization:
              organization?.trim() ||
              company_name.trim(),
            is_active: true,
            is_admin: false
          },
          {
            onConflict: 'id'
          }
        )
        .select()
        .single();

    if (profileError) {
      logger.error(
        'Error creating startup profile',
        profileError
      );

      return ApiResponse.error(
        res,
        profileError.message ||
          'Unable to create startup profile.',
        500,
        'PROFILE_CREATION_FAILED'
      );
    }

    /*
     * 2. Create startup record.
     *
     * IMPORTANT:
     * Your schema uses user_id.
     */
    const { data: existingStartup } =
      await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

    let startupRecord = null;

    if (existingStartup?.id) {

      /*
       * Startup already exists.
       * Update its information.
       */
      const {
        data: updatedStartup,
        error: updateError
      } = await supabaseAdmin
        .from('startups')
        .update({
          name: company_name.trim(),
          dpiit_number: dpiit_number.trim(),
          sector: sector || 'Technology',
          website: website?.trim() || null,
          description:
            description?.trim() || null
        })
        .eq('id', existingStartup.id)
        .select()
        .single();

      if (updateError) {
        logger.error(
          'Error updating startup record',
          updateError
        );

        return ApiResponse.error(
          res,
          updateError.message ||
            'Unable to update startup details.',
          500,
          'STARTUP_UPDATE_FAILED'
        );
      }

      startupRecord = updatedStartup;

    } else {

      /*
       * Create startup record.
       */
      const {
        data: newStartup,
        error: startupError
      } = await supabaseAdmin
        .from('startups')
        .insert({
          user_id: userId,
          name: company_name.trim(),
          dpiit_number: dpiit_number.trim(),
          sector: sector || 'Technology',
          website: website?.trim() || null,
          description:
            description?.trim() || null,
          verified: false
        })
        .select()
        .single();

      if (startupError) {
        logger.error(
          'Error creating startup record',
          startupError
        );

        return ApiResponse.error(
          res,
          startupError.message ||
            'Unable to create startup record.',
          500,
          'STARTUP_CREATION_FAILED'
        );
      }

      startupRecord = newStartup;
    }

    /*
     * 3. Audit log
     */
    try {
      await logAudit({
        userId,
        action: AuditActions.STARTUP_CREATED,
        entityType: 'startup',
        entityId:
          startupRecord?.id || userId,
        description:
          `Startup '${company_name.trim()}' registered under DPIIT account.`
      });
    } catch (auditError) {
      logger.warn(
        'Audit logging failed during startup registration',
        auditError
      );
    }

    /*
     * 4. Notify Government.
     *
     * Notification failure should NOT make
     * startup registration fail.
     */
    try {
      await createNotification({
        role: 'government',
        title: 'New Startup Registered',
        message:
          `Startup '${company_name.trim()}' (${dpiit_number.trim()}) has joined SolutionBridge.`,
        type: 'info'
      });
    } catch (notificationError) {
      logger.warn(
        'Startup notification failed',
        notificationError
      );
    }

    /*
     * 5. Return successful registration.
     */
    return ApiResponse.success(
      res,
      {
        user: {
          id: userId,
          email,
          full_name: profile.full_name,
          role: 'startup'
        },
        startup: startupRecord
      },
      'Startup registration completed successfully',
      201
    );

  } catch (error) {

    logger.error(
      'Error in registerStartup controller',
      error
    );

    return ApiResponse.error(
      res,
      error?.message ||
        'Startup registration failed.',
      500,
      'SERVER_ERROR'
    );
  }
};


export default {
  getMe,
  registerStartup
};