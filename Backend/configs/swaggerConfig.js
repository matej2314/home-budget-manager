const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const helmet = require('helmet');

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
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app) => {
  app.use('/api-docs', (req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://budgetapp.msliwowski.net; connect-src 'self' https://budgetapi.msliwowski.net wss://budgetapi.msliwowski.net; frame-src 'none'; object-src 'none'");
    res.setHeader('Permissions-Policy', 'fullscreen=*; geolocation=self; microphone=none; camera=none');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
