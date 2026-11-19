import 'dotenv/config';
import http from 'node:http';
import logger from './configs/logger.js';
import balanceHouseActions from './tasks/balanceHouseTransactions.js';
import saveDailyTransactions from './tasks/saveDailyTransactions.js';
import saveDailyBudget from './tasks/saveDailyBudget.js';
import { initializeWebSocket } from './configs/websocketConfig.js';
import { clearSocketConnections } from './utils/clearSocketConnections.js';
import { createApp } from './app.js';

const app = createApp();
const port = process.env.SERV_PORT || 5053;
const server = http.createServer(app);

try {
  server.listen(port, () => {
    logger.info(`BACKEND SERVER RUNNING. PORT ${port}`);
    initializeWebSocket(server);
    saveDailyTransactions();
    saveDailyBudget();
    balanceHouseActions();
  });
  server.setTimeout(0);

  process.on('SIGINT', async () => {
    await clearSocketConnections();
    logger.info('Stopping server...');
    server.close(() => {
      logger.info('Server stopped');
      process.exit(0);
    });
  });

  process.on('SIGTERM', async () => {
    await clearSocketConnections();
    logger.info('Stopping server...');
    server.close(() => {
      logger.info('Server stopped');
      process.exit(0);
    });
  });
} catch (error) {
  logger.error(`Failed to run API server : ${error}`);
}
