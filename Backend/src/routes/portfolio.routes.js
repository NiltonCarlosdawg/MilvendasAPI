// src/routes/portfolio.routes.js
import { Router } from 'express';
import { upload } from '../config/multer.js';
import { uploadLimiter } from '../middlewares/rateLimit.js';
import { 
  createItem, 
  getPortfolio, 
  getPortfolioById,
  updateItem, 
  deleteItem 
} from '../controllers/PortfolioController.js';
import { authMiddleware, requireAdmin } from '../middlewares/auth.js';

const router = Router();


router.get('/', getPortfolio);                                      

// Rota Pública: Buscar item por ID (controller deve verificar se está publicado)
// Se o portfólio não tiver status "published", o controller deve retornar 404
router.get('/:id', getPortfolioById);                               

// Rotas Protegidas - Apenas Admin
router.post(
  '/', 
  authMiddleware, 
  requireAdmin, 
  uploadLimiter,
  upload.single('file'), 
  createItem
); 

router.put(
  '/:id', 
  authMiddleware, 
  requireAdmin, 
  uploadLimiter,
  upload.single('file'), 
  updateItem
); 

router.delete(
  '/:id', 
  authMiddleware, 
  requireAdmin, 
  deleteItem
);                   

export default router;