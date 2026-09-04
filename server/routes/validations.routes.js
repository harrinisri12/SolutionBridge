import { Router } from 'express';
import { updateValidation } from '../controllers/validationsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

// Update validation report (Assigned expert only)
router.put('/:id', requireRole('expert', 'government'), asyncHandler(updateValidation));

export default router;
