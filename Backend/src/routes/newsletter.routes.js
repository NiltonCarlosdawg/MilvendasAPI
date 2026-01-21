import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { 
    subscribe, 
    sendBroadcast, 
    unsubscribe, 
    getAllSubscribers 
} from '../controllers/NewsletterController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// ========================================
// CONFIGURAÇÃO DO MULTER PARA IMAGENS
// ========================================
// Reutiliza a lógica de armazenamento para salvar imagens locais da newsletter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Garanta que a pasta 'uploads' existe na raiz
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'newsletter-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
  }
});

// ========================================
// ROTAS PÚBLICAS (Acessíveis pelo site)
// ========================================

// Inscrição via rodapé
router.post('/subscribe', subscribe);

// Cancelar inscrição via link de e-mail
router.get('/unsubscribe', unsubscribe);


// ========================================
// ROTAS PRIVADAS (Apenas SuperAdmin)
// ========================================

// Listar todos os inscritos (para a tabela do React Admin)
router.get('/', authMiddleware, getAllSubscribers);

// Enviar newsletter em massa usando os templates
router.post('/broadcast', authMiddleware, sendBroadcast);

// ROTA DE UPLOAD: Transforma ficheiro local numa URL pública para o e-mail
router.post('/upload-image', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum ficheiro enviado' });
    }

    // Gera a URL completa para ser inserida no template ({{imagem_evento}})
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({ 
      url: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar upload da imagem' });
  }
});

export default router;