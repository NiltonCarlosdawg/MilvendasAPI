import { Router } from 'express';
import { register, login } from '../controllers/AuthController.js';
import { authLimiter, registerLimiter } from '../middlewares/rateLimit.js';

const router = Router();

// Prefixo esperado: /api/v1/auth

router.post('/register', registerLimiter, register);
router.post('/login', authLimiter, login);

export default router;