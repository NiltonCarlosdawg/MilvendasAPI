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
import userRoutes from './routes/user.routes.js'; // Rota de perfil do Admin

// Configurações de caminho (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Porta dinâmica para o Render ou 3001 para Local
const PORT = process.env.PORT || 3001; 

// 1. Middlewares globais
app.use(cors());
app.use(express.json());

// 2. Garantir que a pasta uploads existe para o Multer não falhar
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. Configuração do Swagger
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
  // Procura documentação em todos os arquivos dentro de routes
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 4. DEFINIÇÃO DAS ROTAS (VERSIONAMENTO V1)
app.use('/api/v1/auth', authRoutes);         // Login e Registro
app.use('/api/v1/users', userRoutes);       // Perfil do Admin (/me)
app.use('/api/v1/portfolio', portfolioRoutes); // CRUD de Portfólio
app.use('/api/v1/settings', settingsRoutes);   // Configurações do site
app.use('/api/v1/newsletter', newsletterRoutes); // Inscrição e Envio em massa

// Servir arquivos estáticos (Imagens/Vídeos do portfólio)
app.use('/uploads', express.static(uploadDir));

// Rota raiz - Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'API Online', 
    version: 'v1',
    endpoints_base: '/api/v1',
    documentation: `${serverUrl}/api-docs` 
  });
});

// Inicialização do Servidor
// O '0.0.0.0' é importante para o Render mapear a rede corretamente
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor MilVendas rodando na porta ${PORT}`);
  console.log(`📄 Documentação: ${serverUrl}/api-docs`);
});