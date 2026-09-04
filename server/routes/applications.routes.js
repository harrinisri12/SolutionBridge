import { Router } from 'express';
import {
  listApplications,
  getApplicationsByChallenge,
  getApplicationById,
  submitApplication,
  updateApplicationStatus
} from '../controllers/applicationsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

// Applications listing (role-scoped)
router.get('/', asyncHandler(listApplications));
router.get('/:id', asyncHandler(getApplicationById));

// Startup submit proposal
router.post('/', requireRole('startup'), asyncHandler(submitApplication));

// Government update application review status
router.patch('/:id/status', requireRole('government'), asyncHandler(updateApplicationStatus));

// Challenge-specific applications
router.get('/challenge/:challengeId', requireRole('government', 'expert'), asyncHandler(getApplicationsByChallenge));

export default router;
