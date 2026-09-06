import { Router } from 'express';
import {
  listApplications,
  getApplicationsByChallenge,
  getApplicationById,
  submitApplication,
  updateApplicationStatus
} from '../controllers/applicationsController.js';
import {
  assignExpertToApplication,
  listApplicationExperts,
  removeExpertAssignment
} from '../controllers/assignmentsController.js';
import {
  submitEvaluation,
  getEvaluationsByApplication
} from '../controllers/evaluationsController.js';
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

// Expert Assignments on Application
router.post('/:id/experts', requireRole('government'), asyncHandler(assignExpertToApplication));
router.get('/:id/experts', asyncHandler(listApplicationExperts));
router.delete('/:id/experts/:expertId', requireRole('government'), asyncHandler(removeExpertAssignment));

// Expert Evaluations on Application
router.post('/:id/evaluations', requireRole('expert'), asyncHandler(submitEvaluation));
router.get('/:id/evaluations', asyncHandler(getEvaluationsByApplication));

export default router;
