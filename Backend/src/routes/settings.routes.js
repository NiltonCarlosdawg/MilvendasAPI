import { Router } from 'express';
import { updateSetting, getSettings, deleteSetting } from '../controllers/SettingsController.js';
import { authMiddleware, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Listar configurações - Público (mas controller deve filtrar sensíveis!)
router.get('/', getSettings);

// Atualizar configuração - Apenas Admin
router.post(
  '/', 
  authMiddleware, 
  requireAdmin, 
  updateSetting
);

// Deletar configuração - Apenas Admin
router.delete(
  '/:key', 
  authMiddleware, 
  requireAdmin, 
  deleteSetting
);

export default router;