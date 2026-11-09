const dotenv = require('dotenv').config({ path: './.env' });
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('./configs/logger.js');
const express = require('express');
const swaggerDocs = require('./configs/swaggerConfig.js');
const balanceHouseActions = require('./tasks/balanceHouseTransactions.js');
const saveDailyTransactions = require('./tasks/saveDailyTransactions.js');
const saveDailyBudget = require('./tasks/saveDailyBudget.js');
const { initializeWebSocket } = require('./configs/websocketConfig.js');
const { clearSocketConnections } = require('./utils/clearSocketConnections.js');
const http = require('http');
const app = express();
const setupRoutes = require('./routes/index.js');

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
