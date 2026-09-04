import { Router } from 'express';
import {
  listAuditLogs,
  getAuditLogById
} from '../controllers/auditController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

// Only Government officers (and platform admins) can inspect the compliance audit log
router.get('/', requireRole('government'), asyncHandler(listAuditLogs));
router.get('/:id', requireRole('government'), asyncHandler(getAuditLogById));

export default router;
