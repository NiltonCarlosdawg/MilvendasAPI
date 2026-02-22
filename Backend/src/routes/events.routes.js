// src/routes/events.routes.js
import { Router } from 'express';
import { uploadEvents } from '../config/multer-events.js';
import { ticketRequestLimiter, uploadLimiter } from '../middlewares/rateLimit.js';
import { 
  createEvent,
  uploadEventMedia,
  getEvents,
  getEventById,
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
// ROTAS PÚBLICAS
// ========================================

// Listar eventos (com filtro de status via query)
router.get('/', getEvents);

// Buscar evento por slug (sempre público - para site)
router.get('/s/:slug', getEventBySlug);

// Pedido de bilhete com rate limiting
router.post(
  '/:eventId/ticket-request', 
  ticketRequestLimiter, 
  requestTicket
);

// ========================================
// ROTAS ADMIN (Protegidas)
// ========================================

// Buscar evento por ID - Apenas admin (para edição no React Admin)
// Isso permite acessar eventos em rascunho/draft
router.get(
  '/:id', 
  authMiddleware, 
  requireAdmin, 
  getEventById
); 

// CRUD de eventos
router.post(
  '/', 
  authMiddleware, 
  requireAdmin, 
  createEvent
);

router.put(
  '/:id', 
  authMiddleware, 
  requireAdmin, 
  updateEvent
);

router.delete(
  '/:id', 
  authMiddleware, 
  requireAdmin, 
  deleteEvent
);

// Upload de mídia com rate limiting
router.post(
  '/:eventId/media', 
  authMiddleware, 
  requireAdmin, 
  uploadLimiter,
  uploadEvents.array('files', 11), 
  uploadEventMedia
);

// Gerenciamento de pedidos de bilhete
router.get(
  '/:eventId/ticket-requests', 
  authMiddleware, 
  requireAdmin, 
  getTicketRequests
);

router.patch(
  '/admin/ticket-requests/:requestId', 
  authMiddleware, 
  requireAdmin, 
  updateTicketRequestStatus
);

// Deletar mídia
router.delete(
  '/admin/media/:mediaId', 
  authMiddleware, 
  requireAdmin, 
  deleteEventMedia
);

export default router;