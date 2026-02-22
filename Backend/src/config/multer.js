import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import paths from './paths.js';

const uploadDir = paths.UPLOAD_ROOT;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Pasta de upload criada: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileHash = crypto.randomBytes(16).toString('hex'); // Aumentado para 32 chars
    const safeOriginalName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_.]/g, '')
      .toLowerCase()
      .substring(0, 50); // Limita nome original a 50 chars

    const fileName = `${fileHash}-${safeOriginalName}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm'
  ];

  // Verifica também a extensão do arquivo
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(
      `Tipo de arquivo não permitido: ${file.mimetype}. ` +
      'Apenas imagens (JPEG, PNG, WEBP, GIF) e vídeos (MP4, WEBM) são permitidos.'
    ), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10MB máximo
    files: 1, // Máximo 1 arquivo por requisição
    fields: 10, // Máximo 10 campos no form
    fieldSize: 1024 * 1024 // 1MB por campo
  }
});