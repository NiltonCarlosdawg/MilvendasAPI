import { Router } from 'express';
import { getAdminProfile } from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Endpoint: GET /api/v1/users/me
router.get('/me', authMiddleware, getAdminProfile);

export default router;