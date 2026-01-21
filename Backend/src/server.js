import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Imports para Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Rotas
import authRoutes from './routes/auth.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/events.routes.js';

// Middleware de paginação (para Content-Range do React Admin)
import { addPaginationHeaders } from './middlewares/paginationHeader.js';

// Config de caminhos absolutos
import paths from './config/paths.js';

// Config ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

// ========================================
// CRIAR PASTAS DE UPLOAD NO BOOT
// ========================================
const uploadDirs = [paths.UPLOAD_ROOT, paths.EVENTS_UPLOAD];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Pasta criada: ${dir}`);
  }
});

// ========================================
// CORS – TOTALMENTE COMPATÍVEL COM REACT ADMIN
// ========================================
const corsOptions = {
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:3000',
      'http://localhost:5173',      // Vite/React Admin
      'http://localhost:4200',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Range',               // Obrigatório para React Admin
    'Content-Range',
  ],
  exposedHeaders: [
    'Authorization',
    'Content-Range',       // React Admin lê isso para total
    'X-Total-Count',       // Compatibilidade extra
  ],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para adicionar Content-Range automaticamente
app.use(addPaginationHeaders);
console.log('✅ Middleware de paginação (Content-Range) carregado');

// ========================================
// SERVIR UPLOADS (antes das rotas API)
// ========================================
app.use('/uploads', express.static(paths.UPLOAD_ROOT));

// ========================================
// ROTAS
// ========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/events', eventRoutes);

// ========================================
// SWAGGER
// ========================================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MilVendas API',
      version: '1.0.0',
      description: 'API do sistema Mil Vendas',
    },
    servers: [
      { url: `http://localhost:${PORT}` },
      { url: process.env.FRONTEND_URL || 'https://seu-dominio.com' }
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ========================================
// HEALTH + 404
// ========================================
app.get('/', (req, res) => {
  res.json({ message: 'API MilVendas rodando!' });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe nesta API`,
    availableRoutes: [
      'GET /',
      'GET /api-docs',
      'GET /api/v1/health',
      'POST /api/v1/auth/register',
      'POST /api/v1/auth/login',
      'GET /api/v1/users/me',
      'GET /api/v1/portfolio',
      'GET /api/v1/settings',
      'GET /api/v1/events',
      'POST /api/v1/newsletter/subscribe',
      'GET /api/v1/newsletter/unsubscribe'
    ]
  });
});

// ========================================
// VALIDAÇÃO DE ENV
// ========================================
const validateEnv = () => {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ ERRO: Variáveis obrigatórias ausentes:');
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }
  
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️ JWT_SECRET curto (<32 chars) - use uma chave mais forte');
  }
  
  console.log('✅ Env validado');
};

validateEnv();

// ========================================
// START SERVER
// ========================================
const server = app.listen(PORT, '0.0.0.0', () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log('\n========================================');
  console.log('🚀 Servidor MilVendas rodando com sucesso!');
  console.log('========================================');
  console.log(`📍 URL: ${serverUrl}`);
  console.log(`🔢 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📄 Documentação: ${serverUrl}/api-docs`);
  console.log(`🔒 CORS: Ativado (Range/Content-Range liberados)`);
  console.log(`📁 Uploads: ${paths.UPLOAD_ROOT}`);
  console.log(`📁 Events: ${paths.EVENTS_UPLOAD}`);
  console.log('========================================\n');
});

// Graceful shutdown + erros
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recebido. Encerrando...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT recebido. Encerrando...');
  server.close(() => process.exit(0));
});