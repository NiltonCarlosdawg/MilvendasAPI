import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Importações para Documentação (Swagger)
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// IMPORTAÇÃO DAS ROTAS MODULARES
import authRoutes from './routes/auth.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/events.routes.js';

// Configurações de caminho (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Porta dinâmica para o Render ou 3001 para Local
const PORT = process.env.PORT || 3001; 

// ========================================
// CONFIGURAÇÃO CORS SEGURA
// ========================================
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de origens permitidas
    const allowedOrigins = [
      // Desenvolvimento local (sempre permitido)
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4200',
      'http://127.0.0.1:3000',
      
      // Produção (defina no .env)
      process.env.FRONTEND_URL,
      
      // Adicione seus domínios aqui se tiver
      // 'https://seu-dominio.com',
      // 'https://www.seu-dominio.com'
    ].filter(Boolean); // Remove valores undefined/null

    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,                    // Permitir cookies e headers de autenticação
  optionsSuccessStatus: 200,           // Para browsers antigos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['Authorization'],   // Headers que o cliente pode acessar
  maxAge: 86400                        // Cache da preflight request (24 horas)
};

// ========================================
// MIDDLEWARES GLOBAIS
// ========================================
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// GARANTIR PASTA UPLOADS
// ========================================
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ========================================
// CONFIGURAÇÃO DO SWAGGER
// ========================================
const serverUrl = process.env.NODE_ENV === 'production' 
  ? 'https://milvendasapi.onrender.com'
  : `http://localhost:${PORT}`;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API MilVendas',
      version: '1.0.0',
      description: 'Documentação do Backend CMS e Portfólio (v1)',
    },
    servers: [{ url: serverUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ========================================
// DEFINIÇÃO DAS ROTAS (VERSIONAMENTO V1)
// ========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/events', eventRoutes);

// Servir arquivos estáticos com CORS
app.use('/uploads', cors(corsOptions), express.static(uploadDir));

// ========================================
// ROTA RAIZ - HEALTH CHECK
// ========================================
app.get('/', (req, res) => {
  res.json({ 
    status: 'API Online', 
    version: 'v1',
    endpoints_base: '/api/v1',
    documentation: `${serverUrl}/api-docs`,
    cors_enabled: true
  });
});

// ========================================
// HANDLER DE ERROS CORS
// ========================================
app.use((err, req, res, next) => {
  if (err.message === 'Origem não permitida pelo CORS') {
    return res.status(403).json({ 
      error: 'Acesso negado pelo CORS',
      message: 'Origem não autorizada para acessar esta API'
    });
  }
  next(err);
});

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor MilVendas rodando na porta ${PORT}`);
  console.log(`📄 Documentação: ${serverUrl}/api-docs`);
  console.log(`🔒 CORS ativado e configurado`);
});