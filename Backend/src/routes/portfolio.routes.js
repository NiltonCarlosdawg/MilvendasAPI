import { Router } from 'express';
import { upload } from '../config/multer.js'; // Ajuste o caminho conforme sua estrutura real
import { 
  createItem, 
  getPortfolio, 
  updateItem, 
  deleteItem 
} from '../controllers/PortfolioController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Prefixo esperado: /api/v1/portfolio

router.get('/', getPortfolio);                                      // GET /api/v1/portfolio
router.post('/', authMiddleware, upload.single('file'), createItem); // POST /api/v1/portfolio
router.put('/:id', authMiddleware, upload.single('file'), updateItem); // PUT /api/v1/portfolio/:id
router.delete('/:id', authMiddleware, deleteItem);                   // DELETE /api/v1/portfolio/:id

export default router;