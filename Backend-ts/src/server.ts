import dotenv from 'dotenv'; 
import path from 'path';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions} from 'cors';
import {logger} from '@configs/logger';
import express, {Request, Response} from 'express';
import swaggerDocs from '@configs/swaggerConfig';
import balanceHouseActions from '@tasks/balanceHouseTransactions';
import saveDailyTransactions from '@tasks/saveDailyTransactions';
import saveDailyBudget from '@tasks/saveDailyBudget';
import { initializeWebSocket } from '@configs/websocketConfig';
import { clearSocketConnections } from '@utils/clearSocketConnections';
import http from 'http';

dotenv.config({ path: './.env' });

const app = express();
import setupRoutes from '@routes/index';

app.disable('x-powered-by');

const port: string | number = process.env.SERV_PORT || 5053;

const allowedOrigins: string[] = ['https://budgetapp.msliwowski.net', 'http://localhost:5173', 'http://185.170.196.107:5052'];


const corsOptions: CorsOptions = {
    origin: (origin : string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/screens', express.static(path.join(__dirname, 'app-images')));

app.get('/robots.txt', (_, res:Response<any>) => {
    res.status(404).send('not found');
  });
  
  app.get('/sitemap.xml', (_, res) => {
    res.status(404).send('not found');
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
