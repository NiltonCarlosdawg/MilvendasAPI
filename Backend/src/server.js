import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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

// Middlewares
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
// RATE LIMITING GLOBAL
// ========================================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // 200 requisições por IP
  message: { 
    error: 'Muitas requisições. Tente novamente mais tarde.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

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
// SEGURANÇA: HELMET
// ========================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "*"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Necessário para uploads
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
}));

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
      "http://localhost:5174",
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

// ========================================
// RATE LIMITING GLOBAL (aplica-se a todas as rotas)
// ========================================
app.use(globalLimiter);

// ========================================
// PARSING DE JSON E URL ENCODED
// ========================================
app.use(express.json({ limit: '10mb' })); // Limite de tamanho do body
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para adicionar Content-Range automaticamente
app.use(addPaginationHeaders);
console.log('✅ Middleware de paginação (Content-Range) carregado');

// ========================================
// SERVIR UPLOADS (antes das rotas API)
// ========================================
app.use('/uploads', express.static(paths.UPLOAD_ROOT, {
  setHeaders: (res, path) => {
    // 1. Garante que qualquer origem (incluindo proxies de email como o do Google) aceda à imagem
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // 2. Cache de longa duração ajuda os clientes de email a carregar a imagem com sucesso
    res.set('Cache-Control', 'public, max-age=31536000');
    
    // 3. Forçar o tipo de conteúdo correto para evitar bloqueios de segurança
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) res.set('Content-Type', 'image/jpeg');
    if (path.endsWith('.png')) res.set('Content-Type', 'image/png');
    if (path.endsWith('.gif')) res.set('Content-Type', 'image/gif');
    if (path.endsWith('.webp')) res.set('Content-Type', 'image/webp');
    if (path.endsWith('.mp4')) res.set('Content-Type', 'video/mp4');
    if (path.endsWith('.webm')) res.set('Content-Type', 'video/webm');
  }
}));

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
      { url: process.env.FRONTEND_URL || 'https://milvendas.ao' }
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
  res.json({ 
    message: 'API MilVendas rodando!',
    version: '1.1.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota 404 - deve vir DEPOIS de todas as outras rotas
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
// MIDDLEWARE DE ERRO (captura erros não tratados)
// ========================================
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  // Erro de rate limit
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Muitas requisições',
      message: 'Você atingiu o limite de requisições. Tente novamente mais tarde.'
    });
  }
  
  // Erro de payload muito grande
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload muito grande',
      message: 'O tamanho da requisição excede o limite permitido.'
    });
  }
  
  // Erro de CORS
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS',
      message: 'Origem não permitida pelo CORS'
    });
  }

  // Erro genérico (não expõe detalhes em produção)
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    error: 'Erro interno do servidor',
    message: isDev ? err.message : 'Ocorreu um erro inesperado. Tente novamente.',
    ...(isDev && { stack: err.stack })
  });
});

// ========================================
// VALIDAÇÃO DE ENV
// ========================================
const validateEnv = () => {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(' ERRO: Variáveis obrigatórias ausentes:');
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }
  
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('  JWT_SECRET curto (<32 chars) - use uma chave mais forte');
  }
  
  // Verificar variáveis de email se newsletter estiver ativa
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('  Variáveis de email não configuradas. Newsletter pode não funcionar.');
  }
  
  console.log(' Env validado');
};

validateEnv();

// ========================================
// START SERVER
// ========================================
const server = app.listen(PORT, '0.0.0.0', () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log('\n========================================');
  console.log(' Servidor MilVendas rodando com sucesso!');
  console.log('========================================');
  console.log(`📍 URL: ${serverUrl}`);
  console.log(` Porta: ${PORT}`);
  console.log(` Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Documentação: ${serverUrl}/api-docs`);
  console.log(` Helmet: Ativado (headers de segurança)`);
  console.log(`  Rate Limit: Ativado (200 req/15min)`);
  console.log(` CORS: Ativado (Range/Content-Range liberados)`);
  console.log(` Uploads: ${paths.UPLOAD_ROOT}`);
  console.log(` Events: ${paths.EVENTS_UPLOAD}`);
  console.log('========================================\n');
});

// ========================================
// GRACEFUL SHUTDOWN + TRATAMENTO DE ERROS
// ========================================

// Exceções não tratadas
process.on('uncaughtException', (error) => {
  console.error(' Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  
  // Tentar fechar o servidor graciosamente
  server.close(() => {
    console.log(' Servidor encerrado devido a exceção não tratada');
    process.exit(1);
  });
  
  // Forçar encerramento após 5 segundos se não fechar graciosamente
  setTimeout(() => {
    console.error('  Forçando encerramento após timeout');
    process.exit(1);
  }, 5000);
});

// Promessas rejeitadas não tratadas
process.on('unhandledRejection', (reason, promise) => {
  console.error(' Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  
  // Não encerrar o processo, apenas logar
  // Mas monitorar para evitar vazamentos de memória
});

// Sinais de encerramento
process.on('SIGTERM', () => {
  console.log(' SIGTERM recebido. Encerrando graciosamente...');
  server.close(() => {
    console.log(' Servidor encerrado com sucesso');
    process.exit(0);
  });
  
  // Forçar após 10 segundos
  setTimeout(() => {
    console.error('  Forçando encerramento SIGTERM após timeout');
    process.exit(0);
  }, 10000);
});

process.on('SIGINT', () => {
  console.log(' SIGINT recebido. Encerrando graciosamente...');
  server.close(() => {
    console.log(' Servidor encerrado com sucesso');
    process.exit(0);
  });
  
  // Forçar após 10 segundos
  setTimeout(() => {
    console.error('  Forçando encerramento SIGINT após timeout');
    process.exit(0);
  }, 10000);
});

// Monitoramento de saúde do processo
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
  
  // Alertar se memória estiver muito alta (acima de 500MB)
  if (heapUsedMB > 500) {
    console.warn(`  Uso de memória alto: ${heapUsedMB}MB / ${heapTotalMB}MB`);
  }
}, 60000); // Verificar a cada minuto

export default app;