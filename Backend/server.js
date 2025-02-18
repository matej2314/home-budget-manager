const dotenv = require('dotenv').config({ path: './.env' });
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('./configs/logger.js');
const express = require('express');
const swaggerDocs = require('./configs/swaggerConfig.js');
const balanceHouseActions = require('./tasks/balanceHouseTransactions.js');
const saveDailyTransactions = require('./tasks/saveDailyTransactions.js');
const saveDailyBudget = require('./tasks/saveDailyBudget.js');
const { initializeWebSocket } = require('./configs/websocketConfig.js');
const {clearSocketConnections} = require('./utils/clearSocketConnections.js');
const http = require('http');
const app = express();

const port = process.env.SERV_PORT || 5053;

const allowedOrigins = ['http://localhost:5173', 'http://185.170.196.107/'];

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
const receiptRouter = require('./routes/receiptRoutes.js');
const avatarsRouter = require('./routes/avatarsRoutes.js');
const cookiesTourRouter = require('./routes/cookiesTourRoutes.js');

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/house', householdRouter);
app.use('/action', transactionRouter);
app.use('/board', dashboardRouter);
app.use('/actioncat', actionCatRouter);
app.use('/message', messagesRouter);
app.use('/initmonthly', initialMonthlyBudgetsRouter);
app.use('/receipt', receiptRouter);
app.use('/avatars', avatarsRouter);
app.use('/cookiestour', cookiesTourRouter);

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
