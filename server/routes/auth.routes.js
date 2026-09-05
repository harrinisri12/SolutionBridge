import { Router } from 'express';

import {
  getMe,
  registerStartup
} from '../controllers/authController.js';

import { requireAuth } from '../middleware/auth.js';

import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

/*
 * Startup Registration
 *
 * The Supabase Auth account is created first by the frontend.
 * This endpoint then uses the authenticated Supabase session
 * to create the SolutionBridge profile and startup record.
 *
 * Therefore requireAuth is REQUIRED here.
 */
router.post(
  '/register-startup',
  requireAuth,
  asyncHandler(registerStartup)
);

/*
 * Get currently authenticated user
 */
router.get(
  '/me',
  requireAuth,
  asyncHandler(getMe)
);

export default router;