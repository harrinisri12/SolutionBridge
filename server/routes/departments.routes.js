import { Router } from 'express';
import {
  listDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment
} from '../controllers/departmentsController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Public / Authenticated read
router.get('/', asyncHandler(listDepartments));
router.get('/:id', asyncHandler(getDepartmentById));

// Admin management
router.post('/', requireAuth, requireAdmin, asyncHandler(createDepartment));
router.put('/:id', requireAuth, requireAdmin, asyncHandler(updateDepartment));

export default router;
