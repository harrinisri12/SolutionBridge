import { Router } from 'express';
import { updatePaymentStatus } from '../controllers/paymentsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

// Update status of payment milestone (e.g. approve, release)
router.patch('/:id/status', requireRole('government'), asyncHandler(updatePaymentStatus));

export default router;
