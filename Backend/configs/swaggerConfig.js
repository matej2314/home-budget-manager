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

  app.use('/api-docs', helmet.frameguard({ action: 'deny' }));
  app.use('/api-docs', helmet.noSniff());
  app.use('/api-docs', helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://budgetapp.msliwowski.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://budgetapp.msliwowski.net"],
      connectSrc: ["'self'", "https://budgetapi.msliwowski.net", "wss://budgetapi.msliwowski.net"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }));

  app.use('/api-docs', helmet.permissionPolicy({
    features: {
      fullscreen: ['*'],
      geolocation: ['self'],
      microphone: ['none'],
      camera: ['none'],
    },
  }));

  app.use('/api-docs', (req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
