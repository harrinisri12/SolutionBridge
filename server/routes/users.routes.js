import { Router } from 'express';
import {
  createGovernmentUser,
  createExpertUser,
  listUsers,
  toggleUserStatus
} from '../controllers/usersController.js';
import { requireAuth, requireAdmin, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// All user management endpoints require authentication
router.use(requireAuth);

// List profiles (Government officers & Admins)
router.get('/', requireRole('government'), asyncHandler(listUsers));

// Admin account creation endpoints
router.post('/government', requireAdmin, asyncHandler(createGovernmentUser));
router.post('/expert', requireAdmin, asyncHandler(createExpertUser));

// Admin user activation/deactivation
router.patch('/:id/status', requireAdmin, asyncHandler(toggleUserStatus));

export default router;
