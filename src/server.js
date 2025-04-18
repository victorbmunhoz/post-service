require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const connectDB = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const logger = require('./config/logger');
const swaggerOptions = require('./config/swagger');

// Inicializa o app Express
const app = express();

// Conecta ao banco de dados
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentação Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/api/posts', postRoutes);

// Rota de teste/healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'post-service' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Serviço de Posts - API para gerenciamento de posts educacionais',
    documentation: '/api-docs'
  });
});

// Middleware de tratamento de erro global
app.use((err, req, res, _next) => {
  logger.error(`Erro global: ${err.stack}`);
  res.status(500).json({
    message: 'Ocorreu um erro interno no servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Inicia o servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
}); 
