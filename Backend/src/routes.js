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

// --- Rotas de Autenticação ---
router.post('/auth/register', register);
router.post('/auth/login', login);

// --- Rotas de Configurações (Textos da Home/Quem Somos) ---
router.get('/settings', getSettings); // Público para o site
router.post('/settings', authMiddleware, updateSetting); // Protegido para o admin
router.delete('/settings/:key', authMiddleware, deleteSetting);

// --- Rotas do Portfólio (Trabalhos/Mídias) ---

// Listagem (Público)
router.get('/portfolio', getPortfolio);

// Criação (Protegido + Upload)
router.post('/portfolio', authMiddleware, upload.single('file'), createItem);

// Atualização (Protegido + Upload opcional)
// Usamos PUT para indicar que estamos atualizando um recurso existente pelo ID
router.put('/portfolio/:id', authMiddleware, upload.single('file'), updateItem);

// Exclusão (Protegido)
router.delete('/portfolio/:id', authMiddleware, deleteItem);

export default router;