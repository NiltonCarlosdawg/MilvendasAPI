// src/routes/events.routes.js
import { Router } from 'express';
import { uploadEvents } from '../config/multer-events.js';
import { 
  createEvent,
  uploadEventMedia,
  getEvents,
  getEventById,      // <--- Certifique-se de importar
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

// ROTAS PÚBLICAS
router.get('/', getEvents);
router.get('/s/:slug', getEventBySlug);
router.post('/:eventId/ticket-request', requestTicket);

// ROTAS ADMIN (CRUD PADRÃO REACT ADMIN)

// Buscar por ID (A função getEventById já tem o prisma configurado dentro dela no Controller)
router.get('/:id', getEventById); 

router.post('/', authMiddleware, requireAdmin, createEvent);
router.put('/:id', authMiddleware, requireAdmin, updateEvent);
router.delete('/:id', authMiddleware, requireAdmin, deleteEvent);

// OUTRAS ROTAS
router.post('/:eventId/media', authMiddleware, requireAdmin, uploadEvents.array('files', 11), uploadEventMedia);
router.get('/:eventId/ticket-requests', authMiddleware, requireAdmin, getTicketRequests);
router.delete('/admin/media/:mediaId', authMiddleware, requireAdmin, deleteEventMedia);
router.patch('/admin/ticket-requests/:requestId', authMiddleware, requireAdmin, updateTicketRequestStatus);

export default router;