import { Router } from 'express';
import {
  submitEvaluation,
  getEvaluationsByApplication,
  updateEvaluation
} from '../controllers/evaluationsController.js';
import {
  assignExpertToApplication,
  listApplicationExperts,
  removeExpertAssignment
} from '../controllers/assignmentsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

// 1. Expert Assignments on Applications
router.post('/applications/:id/experts', requireRole('government'), asyncHandler(assignExpertToApplication));
router.get('/applications/:id/experts', asyncHandler(listApplicationExperts));
router.delete('/applications/:id/experts/:expertId', requireRole('government'), asyncHandler(removeExpertAssignment));

// 2. Expert Evaluations
router.post('/applications/:id/evaluations', requireRole('expert'), asyncHandler(submitEvaluation));
router.get('/applications/:id/evaluations', asyncHandler(getEvaluationsByApplication));
router.put('/evaluations/:id', requireRole('expert'), asyncHandler(updateEvaluation));

export default router;
