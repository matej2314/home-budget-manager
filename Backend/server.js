const dotenv = require('dotenv').config({ path: './.env' });
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('./configs/logger.js');
const express = require('express');
const swaggerDocs = require('./configs/swaggerConfig.js');
const balanceHouseActions = require('./tasks/balanceHouseTransactions.js');
const saveDailyTransactions = require('./tasks/saveDailyTransactions.js');
const { initializeWebSocket } = require('./configs/websocketConfig.js');
const http = require('http');
const app = express();

const port = process.env.SERV_PORT || 5053;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://185.170.196.107/'];

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
	})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users-avatars', express.static(path.join(__dirname, 'public', 'user-photos')));

app.options('*', (req, res) => {
	res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.status(200).end();
});

swaggerDocs(app);

const authRouter = require('./routes/authRoutes.js');
const usersRouter = require('./routes/usersRoutes.js');
const householdRouter = require('./routes/householdRoutes.js');
const transactionRouter = require('./routes/transactionsRoutes.js');
const dashboardRouter = require('./routes/dashboardRoutes.js');
const actionCatRouter = require('./routes/actionCatRoutes.js');
const messagesRouter = require('./routes/messagesRoutes.js');
const initialMonthlyBudgetsRouter = require('./routes/initialMonthlyBudgetsRoutes.js');
const avatarsRouter = require('./routes/avatarsRoutes.js');

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/house', householdRouter);
app.use('/action', transactionRouter);
app.use('/board', dashboardRouter);
app.use('/actioncat', actionCatRouter);
app.use('/message', messagesRouter);
app.use('/initmonthly', initialMonthlyBudgetsRouter);
app.use('/avatars', avatarsRouter);

const server = http.createServer(app);

try {
	server.listen(port, () => {
		logger.info(`BACKEND SERVER RUNNING. PORT ${port}`);
		console.log(`SERVER RUNNING ON PORT ${port}`);
		initializeWebSocket(server);
		saveDailyTransactions();
		balanceHouseActions();
	});
	server.setTimeout(0);

	process.on('SIGINT', () => {
		console.log('Zatrzymywanie serwera...');
		server.close(() => {
			console.log('Serwer został zatrzymany');
			process.exit(0);
		});
	});

	process.on('SIGTERM', () => {
		console.log('Zatrzymywanie serwera...');
		app.close(() => {
			console.log('Serwer został zatrzymany');
			process.exit(0);
		});
	});
} catch (error) {
	logger.error(`Nie udało się uruchomić serwera : ${error} `);
	console.log('Nie udało się uruchomić serwera.');
}
