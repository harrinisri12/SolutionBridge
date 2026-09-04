import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { logger } from '../utils/logger.js';

/**
 * List all government departments
 * GET /api/departments
 */
export const listDepartments = async (req, res) => {
  try {
    const { data: departments, error } = await supabaseAdmin
      .from('government_departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      logger.error('Error fetching departments', error);
      return ApiResponse.error(res, 'Failed to fetch departments', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { departments: departments || [] }, 'Departments retrieved successfully');
  } catch (error) {
    logger.error('Error in listDepartments controller', error);
    return ApiResponse.error(res, 'Failed to retrieve departments', 500, 'SERVER_ERROR');
  }
};

/**
 * Get department by ID
 * GET /api/departments/:id
 */
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: department, error } = await supabaseAdmin
      .from('government_departments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !department) {
      return ApiResponse.error(res, 'Department not found', 404, 'NOT_FOUND');
    }

    return ApiResponse.success(res, { department }, 'Department details retrieved');
  } catch (error) {
    logger.error('Error in getDepartmentById controller', error);
    return ApiResponse.error(res, 'Failed to fetch department', 500, 'SERVER_ERROR');
  }
};

/**
 * Create a new department (Government Admin Only)
 * POST /api/departments
 */
export const createDepartment = async (req, res) => {
  try {
    const { name, code, ministry, state, description } = req.body;

    if (!name) {
      return ApiResponse.error(res, 'Department name is required', 422, 'VALIDATION_ERROR');
    }

    const { data: department, error } = await supabaseAdmin
      .from('government_departments')
      .insert([
        {
          name: name.trim(),
          code: code ? code.trim().toUpperCase() : null,
          ministry: ministry || null,
          state: state || 'National',
          description: description || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      logger.error('Error creating department', error);
      return ApiResponse.error(res, 'Failed to create department', 500, 'SERVER_ERROR');
    }

    await logAudit({
      userId: req.user.id,
      action: AuditActions.DEPARTMENT_CREATED,
      entityType: 'department',
      entityId: department.id,
      description: `Government Department '${name}' created by ${req.user.email}`
    });

    return ApiResponse.success(res, { department }, 'Department created successfully', 201);
  } catch (error) {
    logger.error('Error in createDepartment controller', error);
    return ApiResponse.error(res, 'Failed to create department', 500, 'SERVER_ERROR');
  }
};

/**
 * Update department details (Government Admin Only)
 * PUT /api/departments/:id
 */
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, ministry, state, description } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (code !== undefined) updates.code = code.trim().toUpperCase();
    if (ministry !== undefined) updates.ministry = ministry;
    if (state !== undefined) updates.state = state;
    if (description !== undefined) updates.description = description;

    const { data: department, error } = await supabaseAdmin
      .from('government_departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !department) {
      return ApiResponse.error(res, 'Department not found or update failed', 404, 'NOT_FOUND');
    }

    return ApiResponse.success(res, { department }, 'Department updated successfully');
  } catch (error) {
    logger.error('Error in updateDepartment controller', error);
    return ApiResponse.error(res, 'Failed to update department', 500, 'SERVER_ERROR');
  }
};

export default {
  listDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment
};
