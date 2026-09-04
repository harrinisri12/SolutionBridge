import { Router } from 'express';
import { logTelemetry, getPilotTelemetry } from '../controllers/telemetryController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

router.get('/:pilotId', asyncHandler(getPilotTelemetry));
router.post('/:pilotId', requireRole('government', 'startup'), asyncHandler(logTelemetry));

export default router;
