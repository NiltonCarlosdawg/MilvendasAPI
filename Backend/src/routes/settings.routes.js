import { Router } from 'express';
import { updateSetting, getSettings, deleteSetting } from '../controllers/SettingsController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// Prefixo esperado: /api/v1/settings

router.get('/', getSettings);                        // GET /api/v1/settings
router.post('/', authMiddleware, updateSetting);     // POST /api/v1/settings
router.delete('/:key', authMiddleware, deleteSetting); // DELETE /api/v1/settings/:key

export default router;