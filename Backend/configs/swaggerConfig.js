const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Budget Manager API',
            version: '1.0.0',
            description: 'Budget Manager API Docs',
        },
        components: {
            securitySchemes: {
              cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'SESSID',
              },
            },
          },          
    },
    apis: ['../routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;