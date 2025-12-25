import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Importações para Documentação (Swagger)
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// IMPORTAR AS NOVAS ROTAS
import authRoutes from './routes/auth.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import settingsRoutes from './routes/settings.routes.js';

// Configurações de caminho (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
// Importante: No Render a porta é dinâmica, mas localmente usa a 3000 ou 3001
const PORT = process.env.PORT || 3001; 

// 1. Middlewares globais
app.use(cors());
app.use(express.json());

// 2. Garantir que a pasta uploads existe
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
      description: 'Documentação do Backend CMS e Portfólio',
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
  // Atenção: Atualize o caminho para onde os comentários JSDoc estão (agora nas rotas separadas)
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 4. DEFINIÇÃO DAS ROTAS (VERSIONAMENTO V1)
// Aqui aplicamos a "base" de cada domínio
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/settings', settingsRoutes);

// Servir arquivos estáticos (Imagens do portfólio)
app.use('/uploads', express.static(uploadDir));

// Rota raiz para verificação de saúde (Health Check)
app.get('/', (req, res) => {
  res.json({ 
    status: 'API Online', 
    version: 'v1',
    documentation: `${serverUrl}/api-docs` 
  });
});

// Inicialização do Servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor a correr na porta ${PORT}`);
  console.log(`Documentação disponível em ${serverUrl}/api-docs`);
});