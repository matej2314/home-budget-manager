import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { allowedOrigins } from './configs/allowedOrigins.js';
import setupRoutes from './routes/index.js';
import swaggerDocs from './configs/swaggerConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fabryka Express bez listen / cron / WS — pod server.js i Supertest.
 */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
      preflightContinue: false,
    })
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/screens', express.static(path.join(__dirname, 'app-images')));

  app.all(['/sitemap.xml', '/robots.txt'], (_req, res) => {
    return res.status(404).send('sitemap not found');
  });

  setupRoutes(app);
  swaggerDocs(app);

  return app;
}

export default createApp;
