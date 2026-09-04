import { Router } from 'express';
import { updateMilestone, updateMilestoneStatus } from '../controllers/milestonesController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

router.put('/:id', requireRole('government'), asyncHandler(updateMilestone));
router.patch('/:id/status', requireRole('government', 'startup'), asyncHandler(updateMilestoneStatus));

export default router;
