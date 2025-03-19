const dotenv = require('dotenv').config({ path: './.env' });
const path = require('path');
const cookieParser = require('cookie-parser');
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
const corsConfig = require('./configs/corsConfig.js');
const helmetConfig = require('./configs/helmetConfig.js');

app.disable('x-powered-by');

helmetConfig(app);
corsConfig(app);

const port = process.env.SERV_PORT || 5053;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/screens', express.static(path.join(__dirname, 'app-images')));

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
	logger.error(`Nie udało się uruchomić serwera : ${error} `);
	console.log('Nie udało się uruchomić serwera.');
}
