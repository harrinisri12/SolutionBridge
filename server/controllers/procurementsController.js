import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { uploadFile, getSignedUrl } from '../services/storageService.js';
import { logger } from '../utils/logger.js';

/**
 * List procurements based on user role
 * GET /api/procurements
 */
export const listProcurements = async (req, res) => {
  try {
    const { role, id: userId, department_id } = req.user;
    const { status, pilotId } = req.query;

    let query = supabaseAdmin
      .from('procurements')
      .select(`
        *,
        pilots(
          id,
          challenges(id, title, category),
          location,
          status
        ),
        startups(id, name, dpiit_number, sector),
        government_departments(id, name, code)
      `)
      .order('created_at', { ascending: false });

    if (pilotId) {
      query = query.eq('pilot_id', pilotId);
    }

    if (status) {
      query = query.eq('status', status.toLowerCase());
    }

    if (role === 'startup') {
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('profile_id', userId)
        .single();

      if (!startup) {
        return ApiResponse.success(res, { procurements: [] }, 'No startup profile found');
      }
      query = query.eq('startup_id', startup.id);
    } else if (role === 'government' && !req.user.is_admin && department_id) {
      query = query.eq('department_id', department_id);
    }

    const { data: procurements, error } = await query;

    if (error) {
      logger.error('Error fetching procurements', error);
      return ApiResponse.error(res, 'Failed to fetch procurements', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { procurements: procurements || [] }, 'Procurements retrieved successfully');
  } catch (error) {
    logger.error('Error in listProcurements controller', error);
    return ApiResponse.error(res, 'Failed to list procurements', 500, 'SERVER_ERROR');
  }
};

/**
 * Get procurement details by ID
 * GET /api/procurements/:id
 */
export const getProcurementById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const { data: procurement, error } = await supabaseAdmin
      .from('procurements')
      .select(`
        *,
        pilots(
          id,
          challenges(id, title, category, problem_statement),
          location,
          duration_days,
          baseline_value,
          target_value,
          actual_value,
          status,
          progress
        ),
        startups(id, name, dpiit_number, sector, website, verified, profile_id),
        government_departments(id, name, code),
        payments(*)
      `)
      .eq('id', id)
      .single();

    if (error || !procurement) {
      return ApiResponse.error(res, 'Procurement order not found', 404, 'NOT_FOUND');
    }

    // Role-based visibility checks
    if (role === 'startup') {
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('profile_id', userId)
        .single();

      if (!startup || procurement.startup_id !== startup.id) {
        return ApiResponse.error(res, 'Access denied to this procurement order', 403, 'FORBIDDEN');
      }
    } else if (role === 'expert') {
      // Check if expert is assigned to the pilot
      const { data: expert } = await supabaseAdmin
        .from('experts')
        .select('id')
        .eq('profile_id', userId)
        .single();

      if (!expert) {
        return ApiResponse.error(res, 'Expert profile not found', 403, 'FORBIDDEN');
      }

      const { data: assigned } = await supabaseAdmin
        .from('pilot_expert_assignments')
        .select('id')
        .eq('pilot_id', procurement.pilot_id)
        .eq('expert_id', expert.id)
        .maybeSingle();

      if (!assigned && !req.user.is_admin) {
        return ApiResponse.error(res, 'Access denied to this procurement order', 403, 'FORBIDDEN');
      }
    }

    // Generate signed URL for tender exemption certificate if stored
    let certificate_signed_url = null;
    if (procurement.tender_exemption_certificate && !procurement.tender_exemption_certificate.startsWith('http')) {
      const signedRes = await getSignedUrl('procurement-documents', procurement.tender_exemption_certificate, 3600);
      if (signedRes.success) {
        certificate_signed_url = signedRes.signedUrl;
      }
    }

    return ApiResponse.success(res, { procurement, certificate_signed_url }, 'Procurement details retrieved');
  } catch (error) {
    logger.error('Error in getProcurementById controller', error);
    return ApiResponse.error(res, 'Failed to fetch procurement details', 500, 'SERVER_ERROR');
  }
};

/**
 * Initiate a new Direct Procurement Order (Government Only)
 * POST /api/procurements
 */
export const createProcurement = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      pilot_id,
      procurement_order,
      tender_exemption_certificate,
      total_amount,
      milestones = []
    } = req.body;

    if (!pilot_id || !total_amount) {
      return ApiResponse.error(res, 'pilot_id and total_amount are required', 422, 'VALIDATION_ERROR');
    }

    if (Number(total_amount) <= 0) {
      return ApiResponse.error(res, 'total_amount must be greater than zero', 422, 'VALIDATION_ERROR');
    }

    // 1. Fetch pilot and verify validation status
    const { data: pilot, error: pilotError } = await supabaseAdmin
      .from('pilots')
      .select('*, startups(id, name, profile_id), government_departments(id, name)')
      .eq('id', pilot_id)
      .single();

    if (pilotError || !pilot) {
      return ApiResponse.error(res, 'Pilot not found', 404, 'NOT_FOUND');
    }

    // Department match check
    if (req.user.department_id && pilot.department_id !== req.user.department_id && !req.user.is_admin) {
      return ApiResponse.error(res, 'You can only create procurement for your department pilots', 403, 'FORBIDDEN');
    }

    // Ensure pilot has an approved validation report
    const { data: validations } = await supabaseAdmin
      .from('validations')
      .select('final_result')
      .eq('pilot_id', pilot_id)
      .eq('final_result', 'approved');

    if (!validations || validations.length === 0) {
      return ApiResponse.error(
        res,
        'Procurement requires at least one approved independent pilot validation report',
        400,
        'VALIDATION_REQUIRED'
      );
    }

    // Generate unique procurement order number if not supplied
    const orderNumber = procurement_order || `PO-SB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 2. Insert Procurement
    const { data: procurement, error: createError } = await supabaseAdmin
      .from('procurements')
      .insert([
        {
          pilot_id,
          department_id: pilot.department_id,
          startup_id: pilot.startup_id,
          procurement_order: orderNumber,
          tender_exemption_certificate: tender_exemption_certificate || `GFR-RULE-194-EXEMPTION-${Date.now()}`,
          total_amount: Number(total_amount),
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (createError) {
      logger.error('Error creating procurement', createError);
      return ApiResponse.error(res, 'Failed to create procurement order', 500, 'SERVER_ERROR');
    }

    // 3. Create initial payment milestones if provided
    if (Array.isArray(milestones) && milestones.length > 0) {
      const paymentRows = milestones.map(m => ({
        procurement_id: procurement.id,
        milestone_name: m.milestone_name || m.name,
        amount: Number(m.amount),
        status: 'pending',
        created_at: new Date().toISOString()
      }));

      await supabaseAdmin.from('payments').insert(paymentRows);
    }

    // 4. Audit Log
    await logAudit({
      userId,
      action: AuditActions.PROCUREMENT_CREATED,
      entityType: 'procurement',
      entityId: procurement.id,
      description: `Initiated direct procurement order ${orderNumber} (INR ${total_amount}) for startup '${pilot.startups?.name}'`
    });

    // 5. Notify Startup
    if (pilot.startups?.profile_id) {
      await createNotification({
        userId: pilot.startups.profile_id,
        role: 'startup',
        title: 'Direct Procurement Order Created!',
        message: `A government procurement sanction order (${orderNumber}) of INR ${Number(total_amount).toLocaleString()} has been initiated.`,
        type: 'success'
      });
    }

    return ApiResponse.success(res, { procurement }, 'Procurement order created successfully', 201);
  } catch (error) {
    logger.error('Error in createProcurement controller', error);
    return ApiResponse.error(res, 'Failed to create procurement', 500, 'SERVER_ERROR');
  }
};

/**
 * Update procurement details (Government Only)
 * PUT /api/procurements/:id
 */
export const updateProcurement = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { procurement_order, tender_exemption_certificate, total_amount } = req.body;

    const { data: existing, error: findError } = await supabaseAdmin
      .from('procurements')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return ApiResponse.error(res, 'Procurement order not found', 404, 'NOT_FOUND');
    }

    if (req.user.department_id && existing.department_id !== req.user.department_id && !req.user.is_admin) {
      return ApiResponse.error(res, 'You can only edit procurements for your department', 403, 'FORBIDDEN');
    }

    const updates = {};
    if (procurement_order !== undefined) updates.procurement_order = procurement_order;
    if (tender_exemption_certificate !== undefined) updates.tender_exemption_certificate = tender_exemption_certificate;
    if (total_amount !== undefined) {
      if (Number(total_amount) <= 0) {
        return ApiResponse.error(res, 'total_amount must be greater than zero', 422, 'VALIDATION_ERROR');
      }
      updates.total_amount = Number(total_amount);
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('procurements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating procurement', updateError);
      return ApiResponse.error(res, 'Failed to update procurement order', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { procurement: updated }, 'Procurement updated successfully');
  } catch (error) {
    logger.error('Error in updateProcurement controller', error);
    return ApiResponse.error(res, 'Failed to update procurement', 500, 'SERVER_ERROR');
  }
};

/**
 * Update procurement status (Government Only)
 * PATCH /api/procurements/:id/status
 */
export const updateProcurementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const validStatuses = ['pending', 'approved', 'in_progress', 'completed'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return ApiResponse.error(res, `status must be one of: ${validStatuses.join(', ')}`, 422, 'VALIDATION_ERROR');
    }

    const { data: existing, error: findError } = await supabaseAdmin
      .from('procurements')
      .select('*, startups(name, profile_id)')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return ApiResponse.error(res, 'Procurement order not found', 404, 'NOT_FOUND');
    }

    if (req.user.department_id && existing.department_id !== req.user.department_id && !req.user.is_admin) {
      return ApiResponse.error(res, 'You can only update procurements for your department', 403, 'FORBIDDEN');
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('procurements')
      .update({ status: status.toLowerCase() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating procurement status', updateError);
      return ApiResponse.error(res, 'Failed to update procurement status', 500, 'SERVER_ERROR');
    }

    // Audit Log
    const actionMap = {
      approved: AuditActions.PROCUREMENT_APPROVED,
      completed: AuditActions.PROCUREMENT_COMPLETED
    };

    await logAudit({
      userId,
      action: actionMap[status.toLowerCase()] || AuditActions.PROCUREMENT_CREATED,
      entityType: 'procurement',
      entityId: id,
      description: `Procurement order ${existing.procurement_order} status updated to '${status.toUpperCase()}'`
    });

    // Notify Startup
    if (existing.startups?.profile_id) {
      await createNotification({
        userId: existing.startups.profile_id,
        role: 'startup',
        title: `Procurement Order ${status.toUpperCase()}`,
        message: `Your procurement contract order ${existing.procurement_order} is now marked as ${status}.`,
        type: status === 'approved' || status === 'completed' ? 'success' : 'info'
      });
    }

    return ApiResponse.success(res, { procurement: updated }, `Procurement status updated to ${status}`);
  } catch (error) {
    logger.error('Error in updateProcurementStatus controller', error);
    return ApiResponse.error(res, 'Failed to update procurement status', 500, 'SERVER_ERROR');
  }
};

/**
 * Upload Procurement Document / Exemption Certificate (Government Only)
 * POST /api/procurements/:id/documents
 */
export const uploadProcurementDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return ApiResponse.error(res, 'File is required', 422, 'FILE_REQUIRED');
    }

    const { data: procurement, error: findError } = await supabaseAdmin
      .from('procurements')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !procurement) {
      return ApiResponse.error(res, 'Procurement order not found', 404, 'NOT_FOUND');
    }

    const fileExt = file.originalname.split('.').pop();
    const safeFilename = `exemption_${id}_${Date.now()}.${fileExt}`;
    const storagePath = `${id}/${safeFilename}`;

    const uploadRes = await uploadFile('procurement-documents', storagePath, file.buffer, file.mimetype);
    if (!uploadRes.success) {
      return ApiResponse.error(res, 'Failed to upload document to storage', 500, 'STORAGE_ERROR');
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('procurements')
      .update({ tender_exemption_certificate: storagePath })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return ApiResponse.error(res, 'Failed to update procurement record', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { procurement: updated, storagePath }, 'Document uploaded successfully');
  } catch (error) {
    logger.error('Error in uploadProcurementDocument controller', error);
    return ApiResponse.error(res, 'Failed to upload document', 500, 'SERVER_ERROR');
  }
};

export default {
  listProcurements,
  getProcurementById,
  createProcurement,
  updateProcurement,
  updateProcurementStatus,
  uploadProcurementDocument
};
