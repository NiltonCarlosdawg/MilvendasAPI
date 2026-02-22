import { Router } from 'express';
import { getAdminProfile } from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimit.js';

const router = Router();


router.get(
  '/me', 
  authMiddleware, 
  apiLimiter,
  getAdminProfile
);

export default router;