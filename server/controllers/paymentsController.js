import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * Get payments for a procurement
 * GET /api/procurements/:id/payments
 */
export const getProcurementPayments = async (req, res) => {
  try {
    const { id: procurementId } = req.params;
    const { role, id: userId } = req.user;

    // Verify access to the parent procurement
    const { data: procurement, error: procError } = await supabaseAdmin
      .from('procurements')
      .select('id, startup_id, department_id, startups(user_id)')
      .eq('id', procurementId)
      .single();

    if (procError || !procurement) {
      return ApiResponse.error(res, 'Procurement order not found', 404, 'NOT_FOUND');
    }

    if (role === 'startup') {
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!startup || procurement.startup_id !== startup.id) {
        return ApiResponse.error(res, 'Access denied', 403, 'FORBIDDEN');
      }
    }

    const { data: payments, error } = await queryPayments(procurementId);

    if (error) {
      logger.error('Error fetching procurement payments', error);
      return ApiResponse.error(res, 'Failed to fetch payments', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { payments: payments || [] }, 'Payments retrieved successfully');
  } catch (error) {
    logger.error('Error in getProcurementPayments controller', error);
    return ApiResponse.error(res, 'Failed to get payments', 500, 'SERVER_ERROR');
  }
};

const queryPayments = async (procurementId) => {
  return await supabaseAdmin
    .from('payments')
    .select('*')
    .eq('procurement_id', procurementId)
    .order('created_at', { ascending: true });
};

/**
 * Create a payment milestone (Government Only)
 * POST /api/procurements/:id/payments
 */
export const createPaymentMilestone = async (req, res) => {
  try {
    const { id: procurementId } = req.params;
    const { milestone_name, amount } = req.body;

    if (!milestone_name || !amount) {
      return ApiResponse.error(res, 'milestone_name and amount are required', 422, 'VALIDATION_ERROR');
    }

    if (Number(amount) <= 0) {
      return ApiResponse.error(res, 'amount must be greater than zero', 422, 'VALIDATION_ERROR');
    }

    const { data: procurement, error: procError } = await supabaseAdmin
      .from('procurements')
      .select('id, department_id')
      .eq('id', procurementId)
      .single();

    if (procError || !procurement) {
      return ApiResponse.error(res, 'Procurement order not found', 404, 'NOT_FOUND');
    }

    if (req.user.department_id && procurement.department_id !== req.user.department_id && !req.user.is_admin) {
      return ApiResponse.error(res, 'Access denied to this procurement order', 403, 'FORBIDDEN');
    }

    const { data: payment, error: createError } = await supabaseAdmin
      .from('payments')
      .insert([
        {
          procurement_id: procurementId,
          milestone_name,
          amount: Number(amount),
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (createError) {
      logger.error('Error creating payment milestone', createError);
      return ApiResponse.error(res, 'Failed to create payment milestone', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { payment }, 'Payment milestone created', 201);
  } catch (error) {
    logger.error('Error in createPaymentMilestone controller', error);
    return ApiResponse.error(res, 'Failed to create payment', 500, 'SERVER_ERROR');
  }
};

/**
 * Update payment status (e.g. approve or release funds) (Government Only)
 * PATCH /api/payments/:id/status
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const validStatuses = ['pending', 'approved', 'released'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return ApiResponse.error(res, `status must be one of: ${validStatuses.join(', ')}`, 422, 'VALIDATION_ERROR');
    }

    const { data: existing, error: findError } = await supabaseAdmin
      .from('payments')
      .select('*, procurements(id, procurement_order, startup_id, startups(name, user_id), department_id)')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return ApiResponse.error(res, 'Payment milestone not found', 404, 'NOT_FOUND');
    }

    if (
      req.user.department_id &&
      existing.procurements?.department_id !== req.user.department_id &&
      !req.user.is_admin
    ) {
      return ApiResponse.error(res, 'Access denied to this department payment', 403, 'FORBIDDEN');
    }

    const updates = { status: status.toLowerCase() };
    if (status.toLowerCase() === 'released') {
      updates.released_at = new Date().toISOString();
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating payment status', updateError);
      return ApiResponse.error(res, 'Failed to update payment status', 500, 'SERVER_ERROR');
    }

    // Audit Log
    if (status.toLowerCase() === 'released') {
      await logAudit({
        userId,
        action: AuditActions.PAYMENT_RELEASED,
        entityType: 'payment',
        entityId: id,
        description: `Disbursed INR ${existing.amount.toLocaleString()} for milestone '${existing.milestone_name}' under PO ${existing.procurements?.procurement_order}`
      });
    }

    // Notify Startup
    if (existing.procurements?.startups?.user_id) {
      await createNotification({
        userId: existing.procurements.startups.user_id,
        role: 'startup',
        title: `Payment Milestone ${status.toUpperCase()}`,
        message: `Milestone disbursement of INR ${Number(existing.amount).toLocaleString()} for '${existing.milestone_name}' is now ${status}.`,
        type: status === 'released' ? 'success' : 'info'
      });
    }

    return ApiResponse.success(res, { payment: updated }, `Payment status updated to ${status}`);
  } catch (error) {
    logger.error('Error in updatePaymentStatus controller', error);
    return ApiResponse.error(res, 'Failed to update payment status', 500, 'SERVER_ERROR');
  }
};

export default {
  getProcurementPayments,
  createPaymentMilestone,
  updatePaymentStatus
};
