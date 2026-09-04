import { Router } from 'express';
import {
  listStartups,
  getMyStartup,
  getStartupById,
  createStartupProfile,
  updateMyStartup,
  verifyStartup
} from '../controllers/startupsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Public / Semi-public listing
router.get('/', asyncHandler(listStartups));
router.get('/me', requireAuth, requireRole('startup'), asyncHandler(getMyStartup));
router.get('/:id', asyncHandler(getStartupById));

// Startup actions
router.post('/', requireAuth, requireRole('startup'), asyncHandler(createStartupProfile));
router.put('/me', requireAuth, requireRole('startup'), asyncHandler(updateMyStartup));

// Government verification
router.patch('/:id/verify', requireAuth, requireRole('government'), asyncHandler(verifyStartup));

export default router;
