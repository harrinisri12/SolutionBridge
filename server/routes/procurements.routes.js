import { Router } from 'express';
import multer from 'multer';
import {
  listProcurements,
  getProcurementById,
  createProcurement,
  updateProcurement,
  updateProcurementStatus,
  uploadProcurementDocument
} from '../controllers/procurementsController.js';
import {
  getProcurementPayments,
  createPaymentMilestone
} from '../controllers/paymentsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();
const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 } }); // 25 MB max

router.use(requireAuth);

// Procurements
router.get('/', asyncHandler(listProcurements));
router.get('/:id', asyncHandler(getProcurementById));
router.post('/', requireRole('government'), asyncHandler(createProcurement));
router.put('/:id', requireRole('government'), asyncHandler(updateProcurement));
router.patch('/:id/status', requireRole('government'), asyncHandler(updateProcurementStatus));
router.post('/:id/documents', requireRole('government'), upload.single('file'), asyncHandler(uploadProcurementDocument));

// Nested Payment Milestones
router.get('/:id/payments', asyncHandler(getProcurementPayments));
router.post('/:id/payments', requireRole('government'), asyncHandler(createPaymentMilestone));

export default router;
