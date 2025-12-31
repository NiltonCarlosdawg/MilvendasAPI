import { Router } from 'express';
import { upload } from './config/multer.js';
import { register, login } from './controllers/AuthController.js';
import { 
  createItem, 
  getPortfolio, 
  updateItem, 
  deleteItem 
} from './controllers/PortfolioController.js';
import { authMiddleware } from './middlewares/auth.js';
import { updateSetting, getSettings, deleteSetting } from './controllers/SettingsController.js';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Autentica o usuário e retorna um token JWT
 * tags: [Auth]
 */
router.post('/auth/register', register);
router.post('/auth/login', login);

/**
 * @swagger
 * /api/settings:
 * get:
 * summary: Retorna as configurações do site (Quem somos, textos home)
 * tags: [Settings]
 */
router.get('/settings', getSettings);
router.post('/settings', authMiddleware, updateSetting);
router.delete('/settings/:key', authMiddleware, deleteSetting);

/**
 * @swagger
 * /api/portfolio:
 * get:
 * summary: Lista todos os itens do portfólio
 * tags: [Portfolio]
 * post:
 * summary: Cria um novo item (Requer Auth e arquivo)
 * security:
 * - bearerAuth: []
 * tags: [Portfolio]
 */
router.get('/portfolio', getPortfolio);
router.post('/portfolio', authMiddleware, upload.single('file'), createItem);

/**
 * @swagger
 * /api/portfolio/{id}:
 * put:
 * summary: Atualiza um item existente
 * security:
 * - bearerAuth: []
 * tags: [Portfolio]
 * delete:
 * summary: Remove um item e o arquivo físico
 * security:
 * - bearerAuth: []
 * tags: [Portfolio]
 */
router.put('/portfolio/:id', authMiddleware, upload.single('file'), updateItem);
router.delete('/portfolio/:id', authMiddleware, deleteItem);

export default router;