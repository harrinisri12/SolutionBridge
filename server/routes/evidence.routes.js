import { Router } from 'express';
import { verifyEvidence } from '../controllers/evidenceController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

router.patch('/:id/verify', requireRole('government', 'expert'), asyncHandler(verifyEvidence));

export default router;
