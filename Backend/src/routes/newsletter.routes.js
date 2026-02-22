import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { 
    subscribe, 
    sendBroadcast, 
    unsubscribe, 
    getAllSubscribers 
} from '../controllers/NewsletterController.js';
import { authMiddleware, requireAdmin } from '../middlewares/auth.js';
import { newsletterSubscribeLimiter, uploadLimiter } from '../middlewares/rateLimit.js';

const router = Router();

// ========================================
// CONFIGURAÇÃO DO MULTER PARA IMAGENS
// ========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'newsletter-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 🔒 Limite: 5MB
    files: 1 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
  }
});

// ========================================
// ROTAS PÚBLICAS
// ========================================

// Inscrição via rodapé - com rate limiting
router.post('/subscribe', newsletterSubscribeLimiter, subscribe);

// Cancelar inscrição via link de e-mail
router.get('/unsubscribe', unsubscribe);

// ========================================
// ROTAS ADMIN (Protegidas + Apenas Admin)
// ========================================

// Listar todos os inscritos 
router.get(
  '/', 
  authMiddleware, 
  requireAdmin, 
  getAllSubscribers
);

// Enviar newsletter em massa 
router.post(
  '/broadcast', 
  authMiddleware, 
  requireAdmin, 
  sendBroadcast
);

// Upload de imagem - Apenas admin + rate limit
router.post(
  '/upload-image', 
  authMiddleware, 
  requireAdmin, 
  uploadLimiter,
  upload.single('file'), 
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const domain = process.env.NODE_ENV === 'production' 
        ? process.env.API_URL || 'https://api.milvendas.ao'
        : `${req.protocol}://${req.get('host')}`;

      const imageUrl = `${domain}/uploads/${req.file.filename}`;
      
      res.json({ 
        success: true,
        url: imageUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ error: 'Erro ao processar upload' });
    }
  }
);

export default router;