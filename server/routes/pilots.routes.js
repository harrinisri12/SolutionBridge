import { Router } from 'express';
import multer from 'multer';
import {
  listPilots,
  getPilotById,
  getPilotPerformance,
  createPilot,
  updatePilotStatus
} from '../controllers/pilotsController.js';
import {
  getMilestonesByPilot,
  createMilestone
} from '../controllers/milestonesController.js';
import {
  uploadEvidence,
  listPilotEvidence
} from '../controllers/evidenceController.js';
import {
  logTelemetry,
  getPilotTelemetry
} from '../controllers/telemetryController.js';
import {
  assignExpertToPilot,
  listPilotExperts,
  removePilotExpertAssignment,
  submitPilotValidation,
  getPilotValidation
} from '../controllers/validationsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();
const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 } }); // 25 MB max

router.use(requireAuth);

// 1. Pilots Core CRUD
router.get('/', asyncHandler(listPilots));
router.get('/:id', asyncHandler(getPilotById));
router.get('/:id/performance', asyncHandler(getPilotPerformance));
router.post('/', requireRole('government'), asyncHandler(createPilot));
router.patch('/:id/status', requireRole('government'), asyncHandler(updatePilotStatus));

// 2. Nested Milestones
router.get('/:pilotId/milestones', asyncHandler(getMilestonesByPilot));
router.post('/:pilotId/milestones', requireRole('government'), asyncHandler(createMilestone));

// 3. Nested Evidence
router.get('/:pilotId/evidence', asyncHandler(listPilotEvidence));
router.post('/:pilotId/evidence', requireRole('startup', 'government'), upload.single('file'), asyncHandler(uploadEvidence));

// 4. Nested Telemetry
router.get('/:pilotId/telemetry', asyncHandler(getPilotTelemetry));
router.post('/:pilotId/telemetry', requireRole('startup', 'government'), asyncHandler(logTelemetry));

// 5. Pilot Expert Assignment & Validation
router.post('/:pilotId/experts', requireRole('government'), asyncHandler(assignExpertToPilot));
router.get('/:pilotId/experts', asyncHandler(listPilotExperts));
router.delete('/:pilotId/experts/:expertId', requireRole('government'), asyncHandler(removePilotExpertAssignment));
router.post('/:id/validation', requireRole('expert'), asyncHandler(submitPilotValidation));
router.get('/:id/validation', asyncHandler(getPilotValidation));

export default router;

