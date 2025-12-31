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
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// ========================================
// ROTAS PÚBLICAS
// ========================================

// Listar eventos publicados
router.get('/', getEvents);

// Buscar evento por slug
router.get('/:slug', getEventBySlug);

// Solicitar ingresso (eventos próprios)
router.post('/:eventId/ticket-request', requestTicket);

// ========================================
// ROTAS PRIVADAS (Admin)
// ========================================

// Criar evento
router.post('/admin/create', authMiddleware, createEvent);

// Upload de mídia (imagens/vídeos)
router.post('/admin/:eventId/media', 
  authMiddleware, 
  uploadEvents.array('files', 11), // Máximo 11 arquivos (10 imagens + 1 vídeo)
  uploadEventMedia
);

// Atualizar evento
router.put('/admin/:id', authMiddleware, updateEvent);

// Deletar evento
router.delete('/admin/:id', authMiddleware, deleteEvent);

// Deletar mídia específica
router.delete('/admin/media/:mediaId', authMiddleware, deleteEventMedia);

// Listar solicitações de ingresso
router.get('/admin/:eventId/ticket-requests', authMiddleware, getTicketRequests);

// Atualizar status de solicitação
router.patch('/admin/ticket-requests/:requestId', authMiddleware, updateTicketRequestStatus);

export default router;