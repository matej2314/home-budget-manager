import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from './configs/logger.js';
import swaggerDocs from './configs/swaggerConfig.js';
import balanceHouseActions from './tasks/balanceHouseTransactions.js';
import saveDailyTransactions from './tasks/saveDailyTransactions.js';
import saveDailyBudget from './tasks/saveDailyBudget.js';
import { initializeWebSocket } from './configs/websocketConfig.js';
import { clearSocketConnections } from './utils/clearSocketConnections.js';
import setupRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('x-powered-by');

const port = process.env.SERV_PORT || 5053;

const allowedOrigins = ['https://budgetapp.msliwowski.net', 'http://localhost:5173', 'http://185.170.196.107:5052'];

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

app.all(['/sitemap.xml', '/robots.txt'], (req, res) => {
	return res.status(404).send('sitemap not found');
});

setupRoutes(app);
swaggerDocs(app);

const server = http.createServer(app);

try {
	server.listen(port, () => {
		logger.info(`BACKEND SERVER RUNNING. PORT ${port}`);
		console.log(`SERVER RUNNING ON PORT ${port}`);
		initializeWebSocket(server);
		saveDailyTransactions();
		saveDailyBudget();
		balanceHouseActions();
	});
	server.setTimeout(0);

	process.on('SIGINT', async () => {
		await clearSocketConnections();
		console.log('Zatrzymywanie serwera...');
		server.close(async () => {
			console.log('Serwer został zatrzymany');
			process.exit(0);
		});
	});

	process.on('SIGTERM', async () => {
		await clearSocketConnections();
		console.log('Zatrzymywanie serwera...');
		server.close(() => {
			console.log('Serwer został zatrzymany');
			process.exit(0);
		});
	});
} catch (error) {
	logger.error(`Failed to run API server : ${error} `);
	console.log('Failed to run API server');
}
