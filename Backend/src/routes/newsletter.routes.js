import { Router } from 'express';
import { subscribe, sendBroadcast } from '../controllers/NewsletterController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Rota pública (para o rodapé do site)
router.post('/subscribe', subscribe);

// Rota privada (apenas Admin logado pode disparar)
router.post('/broadcast', authMiddleware, sendBroadcast);

export default router;