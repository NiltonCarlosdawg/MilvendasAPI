// src/config/multer.js
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import paths from './paths.js';  // ← caminho absoluto unificado

// Pasta absoluta para uploads gerais (portfólio)
const uploadDir = paths.UPLOAD_ROOT;

// Cria a pasta se não existir (executa no carregamento do módulo)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Pasta de upload criada automaticamente: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileHash = crypto.randomBytes(10).toString('hex');
    // Limpa nome original: remove espaços, caracteres especiais, mantém extensão
    const safeOriginalName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_.]/g, '')
      .toLowerCase();

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
    'image/gif'
    // 'video/mp4',  // descomente se quiser permitir vídeos no portfólio geral
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(
      'Tipo de arquivo inválido. Apenas imagens são permitidas (JPEG, PNG, WEBP, GIF).'
    ), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10MB por arquivo (ajuste se necessário)
  }
});