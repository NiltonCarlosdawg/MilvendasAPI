// src/routes/events.routes.js
import { Router } from 'express';
import { uploadEvents } from '../config/multer-events.js';
import { 
  createEvent,
  uploadEventMedia,
  getEvents,
  getEventBySlug,
  updateEvent,
  deleteEvent,
  deleteEventMedia,
  requestTicket,
  getTicketRequests,
  updateTicketRequestStatus
} from '../controllers/EventController.js';
import { authMiddleware, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// ========================================
// ROTAS PÚBLICAS (sem autenticação)
// ========================================

// Listar eventos publicados
router.get('/', getEvents);

// Buscar evento por slug (detalhes públicos)
router.get('/:slug', getEventBySlug);

// Solicitar ingresso (para eventos próprios que permitem)
router.post('/:eventId/ticket-request', requestTicket);

// ========================================
// ROTAS PRIVADAS / ADMIN (exigem autenticação + role admin)
// ========================================

// Criar novo evento
router.post('/admin/create', authMiddleware, requireAdmin, createEvent);

// Upload de mídia (imagens/vídeos) para evento específico
router.post(
  '/admin/:eventId/media',
  authMiddleware,
  requireAdmin,
  uploadEvents.array('files', 11), // máximo 11 arquivos (ex: 10 imagens + 1 vídeo)
  uploadEventMedia
);

// Atualizar evento
router.put('/admin/:id', authMiddleware, requireAdmin, updateEvent);

// Deletar evento (e suas mídias/solicitações associadas)
router.delete('/admin/:id', authMiddleware, requireAdmin, deleteEvent);

// Deletar mídia específica de um evento
router.delete('/admin/media/:mediaId', authMiddleware, requireAdmin, deleteEventMedia);

// Listar solicitações de ingresso de um evento
router.get('/admin/:eventId/ticket-requests', authMiddleware, requireAdmin, getTicketRequests);

// Atualizar status de uma solicitação de ingresso
router.patch('/admin/ticket-requests/:requestId', authMiddleware, requireAdmin, updateTicketRequestStatus);

export default router;