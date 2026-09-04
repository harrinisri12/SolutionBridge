import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * List all startups
 * GET /api/startups
 */
export const listStartups = async (req, res) => {
  try {
    const { sector, verified } = req.query;

    let query = supabaseAdmin.from('startups').select('*, profiles(full_name, email, phone)').order('created_at', { ascending: false });

    if (sector) {
      query = query.eq('sector', sector);
    }
    if (verified !== undefined) {
      query = query.eq('verified', verified === 'true');
    }

    const { data: startups, error } = await query;

    if (error) {
      logger.error('Error listing startups', error);
      return ApiResponse.error(res, 'Failed to fetch startups', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { startups: startups || [] }, 'Startups retrieved successfully');
  } catch (error) {
    logger.error('Error in listStartups controller', error);
    return ApiResponse.error(res, 'Failed to retrieve startups', 500, 'SERVER_ERROR');
  }
};

/**
 * Get current authenticated startup profile
 * GET /api/startups/me
 */
export const getMyStartup = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: startup, error } = await supabaseAdmin
      .from('startups')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle();

    if (error) {
      logger.error('Error retrieving own startup profile', error);
      return ApiResponse.error(res, 'Failed to load startup profile', 500, 'SERVER_ERROR');
    }

    if (!startup) {
      return ApiResponse.error(res, 'No startup profile linked to your account', 404, 'NOT_FOUND');
    }

    return ApiResponse.success(res, { startup }, 'Startup profile retrieved successfully');
  } catch (error) {
    logger.error('Error in getMyStartup controller', error);
    return ApiResponse.error(res, 'Failed to fetch startup details', 500, 'SERVER_ERROR');
  }
};

/**
 * Get startup by ID
 * GET /api/startups/:id
 */
export const getStartupById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: startup, error } = await supabaseAdmin
      .from('startups')
      .select('*, profiles(full_name, email, phone, organization)')
      .eq('id', id)
      .single();

    if (error || !startup) {
      return ApiResponse.error(res, 'Startup not found', 404, 'NOT_FOUND');
    }

    return ApiResponse.success(res, { startup }, 'Startup details retrieved successfully');
  } catch (error) {
    logger.error('Error in getStartupById controller', error);
    return ApiResponse.error(res, 'Failed to retrieve startup', 500, 'SERVER_ERROR');
  }
};

/**
 * Create/Link Startup Profile for current authenticated startup
 * POST /api/startups
 */
export const createStartupProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, dpiit_number, sector, description, website, team_size, founded_year, address } = req.body;

    if (!name || !dpiit_number) {
      return ApiResponse.error(res, 'Startup name and DPIIT recognition number are required', 422, 'VALIDATION_ERROR');
    }

    // Check if DPIIT number is already in use
    const { data: existingDpiit } = await supabaseAdmin
      .from('startups')
      .select('id')
      .eq('dpiit_number', dpiit_number.trim())
      .maybeSingle();

    if (existingDpiit) {
      return ApiResponse.error(res, 'This DPIIT Recognition number is already registered', 409, 'DPIIT_EXISTS');
    }

    const { data: startup, error } = await supabaseAdmin
      .from('startups')
      .insert([
        {
          profile_id: userId,
          name: name.trim(),
          dpiit_number: dpiit_number.trim(),
          sector: sector || 'Technology',
          description: description || null,
          website: website || null,
          team_size: team_size || null,
          founded_year: founded_year || null,
          address: address || null,
          verified: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      logger.error('Error creating startup record', error);
      return ApiResponse.error(res, 'Failed to create startup profile', 500, 'SERVER_ERROR');
    }

    await logAudit({
      userId,
      action: AuditActions.STARTUP_CREATED,
      entityType: 'startup',
      entityId: startup.id,
      description: `Startup '${name}' registered with DPIIT ID '${dpiit_number}'`
    });

    return ApiResponse.success(res, { startup }, 'Startup profile created successfully', 201);
  } catch (error) {
    logger.error('Error in createStartupProfile controller', error);
    return ApiResponse.error(res, 'Failed to create startup profile', 500, 'SERVER_ERROR');
  }
};

/**
 * Update own startup profile
 * PUT /api/startups/me
 */
export const updateMyStartup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, sector, description, website, team_size, founded_year, address } = req.body;

    // Check ownership
    const { data: existing, error: findError } = await supabaseAdmin
      .from('startups')
      .select('id')
      .eq('profile_id', userId)
      .maybeSingle();

    if (findError || !existing) {
      return ApiResponse.error(res, 'No startup profile found to update', 404, 'NOT_FOUND');
    }

    const updates = {
      updated_at: new Date().toISOString()
    };
    if (name) updates.name = name.trim();
    if (sector) updates.sector = sector;
    if (description !== undefined) updates.description = description;
    if (website !== undefined) updates.website = website;
    if (team_size !== undefined) updates.team_size = team_size;
    if (founded_year !== undefined) updates.founded_year = founded_year;
    if (address !== undefined) updates.address = address;

    const { data: updatedStartup, error: updateError } = await supabaseAdmin
      .from('startups')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating startup profile', updateError);
      return ApiResponse.error(res, 'Failed to update startup details', 500, 'SERVER_ERROR');
    }

    await logAudit({
      userId,
      action: AuditActions.STARTUP_UPDATED,
      entityType: 'startup',
      entityId: existing.id,
      description: `Startup '${updatedStartup.name}' profile updated by founder.`
    });

    return ApiResponse.success(res, { startup: updatedStartup }, 'Startup profile updated successfully');
  } catch (error) {
    logger.error('Error in updateMyStartup controller', error);
    return ApiResponse.error(res, 'Failed to update startup profile', 500, 'SERVER_ERROR');
  }
};

/**
 * Verify startup DPIIT status (Government / Admin only)
 * PATCH /api/startups/:id/verify
 */
export const verifyStartup = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified = true, verification_notes } = req.body;

    const { data: startup, error } = await supabaseAdmin
      .from('startups')
      .update({
        verified: Boolean(verified),
        verification_notes: verification_notes || null,
        verified_by: req.user.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, profiles(id, email, full_name)')
      .single();

    if (error || !startup) {
      return ApiResponse.error(res, 'Startup not found or verification update failed', 404, 'NOT_FOUND');
    }

    await logAudit({
      userId: req.user.id,
      action: AuditActions.STARTUP_VERIFIED,
      entityType: 'startup',
      entityId: id,
      description: `Startup '${startup.name}' marked as ${verified ? 'Verified' : 'Unverified'} by ${req.user.email}`
    });

    // Notify startup founder
    if (startup.profile_id) {
      await createNotification({
        userId: startup.profile_id,
        role: 'startup',
        title: 'DPIIT Profile Verification Updated',
        message: `Your startup profile '${startup.name}' is now marked as ${verified ? 'VERIFIED' : 'PENDING'}.`,
        type: verified ? 'success' : 'info'
      });
    }

    return ApiResponse.success(res, { startup }, `Startup marked as ${verified ? 'Verified' : 'Unverified'}`);
  } catch (error) {
    logger.error('Error in verifyStartup controller', error);
    return ApiResponse.error(res, 'Failed to verify startup', 500, 'SERVER_ERROR');
  }
};

export default {
  listStartups,
  getMyStartup,
  getStartupById,
  createStartupProfile,
  updateMyStartup,
  verifyStartup
};
