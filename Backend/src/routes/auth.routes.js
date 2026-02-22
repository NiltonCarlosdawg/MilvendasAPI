import { Router } from 'express';
import { register, login } from '../controllers/AuthController.js';
import { authLimiter, registerLimiter } from '../middlewares/rateLimit.js';

const router = Router();


router.post('/register', registerLimiter, register);
router.post('/login', authLimiter, login);

export default router;