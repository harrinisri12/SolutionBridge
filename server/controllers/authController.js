import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * Get authenticated user profile and associated stakeholder data
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch full profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return ApiResponse.error(res, 'Profile not found', 404, 'NOT_FOUND');
    }

    let extraData = {};

    // If role is startup, load startup record
    if (profile.role === 'startup') {
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('*')
        .eq('profile_id', userId)
        .maybeSingle();

      extraData.startup = startup || null;
    }

    // If role is expert, load expert record
    if (profile.role === 'expert') {
      const { data: expert } = await supabaseAdmin
        .from('experts')
        .select('*')
        .eq('profile_id', userId)
        .maybeSingle();

      extraData.expert = expert || null;
    }

    // If role is government and has department_id, load department
    if (profile.role === 'government' && profile.department_id) {
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
        user: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          phone: profile.phone,
          organization: profile.organization,
          is_admin: Boolean(profile.is_admin),
          is_active: Boolean(profile.is_active),
          department_id: profile.department_id,
          created_at: profile.created_at,
          ...extraData
        }
      },
      'User profile loaded successfully'
    );
  } catch (error) {
    logger.error('Error in getMe controller', error);
    return ApiResponse.error(res, 'Failed to fetch user profile', 500, 'SERVER_ERROR');
  }
};

/**
 * Public Startup Registration
 * POST /api/auth/register-startup
 * NOTE: Enforces that public registration ONLY permits role === 'startup'
 */
export const registerStartup = async (req, res) => {
  try {
    const { email, password, full_name, phone, organization, startup_name, dpiit_number, sector, website, description } = req.body;

    if (!email || !password || !full_name) {
      return ApiResponse.error(
        res,
        'Email, password, and full name are required for registration',
        422,
        'VALIDATION_ERROR'
      );
    }

    // 1. Create Auth User in Supabase Auth (Forces role='startup')
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name,
          role: 'startup',
          phone,
          organization: organization || startup_name
        }
      }
    });

    if (authError || !authData?.user) {
      logger.warn('Startup signup auth error', { error: authError?.message });
      return ApiResponse.error(
        res,
        authError?.message || 'Could not register startup user account',
        400,
        'SIGNUP_FAILED'
      );
    }

    const userId = authData.user.id;

    // 2. Ensure Profile Record in 'profiles' (Role is locked to 'startup')
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: userId,
          email: email.trim().toLowerCase(),
          full_name,
          role: 'startup',
          phone: phone || null,
          organization: organization || startup_name || full_name,
          is_active: true,
          is_admin: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (profileError) {
      logger.error('Error creating startup profile record', profileError);
    }

    // 3. Create Startup Record in 'startups'
    let startupRecord = null;
    if (startup_name || dpiit_number) {
      const { data: startup, error: startupError } = await supabaseAdmin
        .from('startups')
        .insert([
          {
            profile_id: userId,
            name: startup_name || organization || full_name,
            dpiit_number: dpiit_number || `DPIIT-${Date.now().toString().slice(-6)}`,
            sector: sector || 'Technology',
            website: website || null,
            description: description || null,
            verified: false,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (!startupError) {
        startupRecord = startup;
      } else {
        logger.error('Error inserting startup details', startupError);
      }
    }

    // 4. Log Audit Event
    await logAudit({
      userId,
      action: AuditActions.STARTUP_CREATED,
      entityType: 'startup',
      entityId: startupRecord?.id || userId,
      description: `Startup '${startup_name || full_name}' registered under DPIIT account.`
    });

    // 5. Notify Government Admins
    await createNotification({
      role: 'government',
      title: 'New Startup Registered',
      message: `Startup '${startup_name || full_name}' (${dpiit_number || 'DPIIT Registered'}) has joined SolutionBridge.`,
      type: 'info'
    });

    return ApiResponse.success(
      res,
      {
        user: {
          id: userId,
          email: profile?.email || email,
          full_name: profile?.full_name || full_name,
          role: 'startup',
          startup: startupRecord
        },
        session: authData.session
      },
      'Startup account created successfully',
      201
    );
  } catch (error) {
    logger.error('Error in registerStartup controller', error);
    return ApiResponse.error(res, 'Startup registration failed', 500, 'SERVER_ERROR');
  }
};

export default {
  getMe,
  registerStartup
};
