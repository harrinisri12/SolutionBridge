import { Router } from 'express';
import {
  assignExpertToApplication,
  listApplicationExperts,
  removeExpertAssignment
} from '../controllers/assignmentsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

router.post('/', requireRole('government'), asyncHandler(assignExpertToApplication));
router.post('/:id/experts', requireRole('government'), asyncHandler(assignExpertToApplication));
router.get('/:id/experts', asyncHandler(listApplicationExperts));
router.delete('/:id/experts/:expertId', requireRole('government'), asyncHandler(removeExpertAssignment));

export default router;
