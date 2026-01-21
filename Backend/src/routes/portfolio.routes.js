// src/routes/portfolio.routes.js
import { Router } from 'express';
import { upload } from '../config/multer.js';
import { 
  createItem, 
  getPortfolio, 
  getPortfolioById, // Importa a função de busca por ID
  updateItem, 
  deleteItem 
} from '../controllers/PortfolioController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

/**
 * Prefixo da Rota: /api/v1/portfolio
 */

// Rota Pública: Listar todos
router.get('/', getPortfolio);                                      

// Rota de Admin/Edição: Buscar um item específico por ID (CORRIGE O ERRO 404 NO EDIT)
router.get('/:id', getPortfolioById);                               

// Rotas Protegidas (Criação, Atualização e Eliminação)
router.post('/', authMiddleware, upload.single('file'), createItem); 
router.put('/:id', authMiddleware, upload.single('file'), updateItem); 
router.delete('/:id', authMiddleware, deleteItem);                   

export default router;