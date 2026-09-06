import { supabaseAdmin, createUserClient } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';

/**
 * JWT Authentication Middleware
 * Extracts and validates the Supabase access token from Authorization header.
 * Loads the user profile and binds req.user and req.supabase.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(
        res,
        'Authorization header missing or invalid format (Bearer <token> required)',
        401,
        'UNAUTHORIZED'
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return ApiResponse.error(res, 'Access token is required', 401, 'UNAUTHORIZED');
    }

    // 1. Verify token with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authData?.user) {
      logger.warn('Failed token verification attempt', { error: authError?.message });
      return ApiResponse.error(
        res,
        'Invalid or expired authorization token',
        401,
        'INVALID_TOKEN'
      );
    }

    const authUser = authData.user;

    // 2. Fetch profile from 'profiles' table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    // Special allowance for the startup registration endpoint: profile might be created in that call
    if (!profile) {
      if (req.path === '/register-startup' || req.originalUrl?.includes('/auth/register-startup')) {
        req.user = {
          id: authUser.id,
          email: authUser.email,
          role: 'startup',
          is_admin: false,
          is_active: true,
          token
        };
        req.supabase = createUserClient(token);
        return next();
      }

      logger.warn(`Profile not found for authenticated auth_id: ${authUser.id}`);
      return ApiResponse.error(
        res,
        'User profile could not be found or has not been provisioned',
        403,
        'PROFILE_NOT_FOUND'
      );
    }

    // 3. Verify account active state
    if (profile.is_active === false) {
      return ApiResponse.error(
        res,
        'Your stakeholder account is currently deactivated. Contact your administrator.',
        403,
        'ACCOUNT_DEACTIVATED'
      );
    }

    // 4. Attach authenticated user details and user-scoped Supabase client
    req.user = {
      id: profile.id,
      email: profile.email || authUser.email,
      full_name: profile.full_name || '',
      role: (profile.role || '').toLowerCase(), // 'government' | 'startup' | 'expert'
      is_admin: Boolean(profile.is_admin),
      is_active: Boolean(profile.is_active),
      department_id: profile.department_id || null,
      organization: profile.organization || null,
      token
    };

    // User-scoped client forwarding RLS context
    req.supabase = createUserClient(token);

    next();
  } catch (error) {
    logger.error('Error in requireAuth middleware', error);
    return ApiResponse.error(
      res,
      'Internal authentication error',
      500,
      'AUTH_INTERNAL_ERROR'
    );
  }
};

/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles - e.g. 'government', 'startup', 'expert'
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }

    const userRole = (req.user.role || '').toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return ApiResponse.error(
        res,
        `Access forbidden: requires one of [${allowedRoles.join(', ')}] role(s). Your role is '${req.user.role}'.`,
        403,
        'FORBIDDEN_ROLE'
      );
    }

    next();
  };
};

/**
 * Government Administrator Middleware
 * Requires role === 'government' and is_admin === true
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.error(res, 'Authentication required', 401, 'UNAUTHORIZED');
  }

  const isGov = (req.user.role || '').toLowerCase() === 'government';
  const isAdmin = Boolean(req.user.is_admin);

  if (!isGov || !isAdmin) {
    return ApiResponse.error(
      res,
      'Access forbidden: this operation requires authorized Government Administrator privileges.',
      403,
      'ADMIN_REQUIRED'
    );
  }

  next();
};

export default {
  requireAuth,
  requireRole,
  requireAdmin
};
