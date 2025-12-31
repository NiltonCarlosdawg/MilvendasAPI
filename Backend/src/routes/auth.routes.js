import { Router } from 'express';
import { register, login } from '../controllers/AuthController.js';

const router = Router();

// Prefixo esperado: /api/v1/auth

router.post('/register', register); // POST /api/v1/auth/register
router.post('/login', login);       // POST /api/v1/auth/login

export default router;