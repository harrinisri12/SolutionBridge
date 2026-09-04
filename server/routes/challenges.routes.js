import { Router } from 'express';
import {
  listChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  publishChallenge,
  closeChallenge,
  deleteChallenge
} from '../controllers/challengesController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Public / Authenticated read
router.get('/', asyncHandler(listChallenges));
router.get('/:id', asyncHandler(getChallengeById));

// Government management endpoints
router.post('/', requireAuth, requireRole('government'), asyncHandler(createChallenge));
router.put('/:id', requireAuth, requireRole('government'), asyncHandler(updateChallenge));
router.patch('/:id/publish', requireAuth, requireRole('government'), asyncHandler(publishChallenge));
router.patch('/:id/close', requireAuth, requireRole('government'), asyncHandler(closeChallenge));
router.delete('/:id', requireAuth, requireRole('government'), asyncHandler(deleteChallenge));

export default router;
