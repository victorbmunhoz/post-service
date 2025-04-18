const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Posts',
      version: '1.0.0',
      description: 'API para gerenciamento de posts educacionais',
      contact: {
        name: 'Equipe de Desenvolvimento'
      },
      servers: [
        {
          url: 'http://localhost:3002',
          description: 'Servidor de Desenvolvimento'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerOptions; 