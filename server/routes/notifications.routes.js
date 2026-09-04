import { Router } from 'express';
import {
  listNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationsController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(listNotifications));
router.patch('/:id/read', asyncHandler(markAsRead));
router.patch('/read-all', asyncHandler(markAllAsRead));

export default router;
