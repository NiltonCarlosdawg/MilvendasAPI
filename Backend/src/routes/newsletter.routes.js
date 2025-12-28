import { Router } from 'express';
import { subscribe, sendBroadcast, unsubscribe } from '../controllers/NewsletterController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// ========================================
// ROTAS PÚBLICAS
// ========================================

// Inscrição na newsletter (rodapé do site)
router.post('/subscribe', subscribe);

// Cancelar inscrição (link no email)
router.get('/unsubscribe', unsubscribe);

// ========================================
// ROTAS PRIVADAS (Admin apenas)
// ========================================

// Enviar newsletter em massa
router.post('/broadcast', authMiddleware, sendBroadcast);

export default router;