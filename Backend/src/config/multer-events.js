
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import paths from './paths.js';  // ← caminho absoluto unificado

// Pasta absoluta para uploads de eventos
const uploadDir = paths.EVENTS_UPLOAD;

// Cria a pasta automaticamente ao carregar o módulo (segurança extra)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Pasta de eventos criada automaticamente: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileHash = crypto.randomBytes(10).toString('hex');
    
    // Sanitiza o nome original: remove espaços, caracteres especiais, mantém extensão
    const safeName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_.]/g, '')
      .toLowerCase();

    const fileName = `${fileHash}-${safeName}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Imagens
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    // Vídeos
    'video/mp4',
    'video/quicktime',     // .mov
    'video/x-msvideo',     // .avi
    'video/webm'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(
      'Tipo de arquivo inválido. Apenas imagens (JPEG, PNG, WEBP, GIF) e vídeos (MP4, MOV, WEBM, AVI) são permitidos.'
    ), false);
  }
};

export const uploadEvents = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,  // 100MB – suficiente para vídeos curtos de eventos
  }
});