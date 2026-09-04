import { Router } from 'express';
import { getMe, registerStartup } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Public Startup Registration
router.post('/register-startup', asyncHandler(registerStartup));

// Authenticated current user profile
router.get('/me', requireAuth, asyncHandler(getMe));

export default router;
