import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Importações para Documentação
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Configurações de caminho (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares globais
app.use(cors());
app.use(express.json());

// 2. Garantir que a pasta uploads existe (Essencial para não dar erro no Multer)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. Configuração Dinâmica do Swagger (Local vs Produção)
const serverUrl = process.env.NODE_ENV === 'production' 
  ? 'https://sua-api-milvendas.onrender.com' // Altere para sua URL após criar o serviço no Render
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
  apis: ['./src/routes.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 4. Rotas e Arquivos Estáticos
app.use('/api', router);
app.use('/uploads', express.static(uploadDir));

// Rota raiz para verificação de saúde (Health Check)
app.get('/', (req, res) => {
  res.json({ status: 'API Online', documentation: `${serverUrl}/api-docs` });
});

// 5. Inicialização do Servidor
// Nota: O host '0.0.0.0' é fundamental para o Render aceitar conexões externas
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API MilVendas rodando em: ${serverUrl}`);
  console.log(`📖 Documentação: ${serverUrl}/api-docs`);
});