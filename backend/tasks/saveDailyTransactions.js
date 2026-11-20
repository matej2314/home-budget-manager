import cron from 'node-cron';
import { saveDailyTransactionsSnapshot } from '../services/transactions/saveDailyTransactionsSnapshot.js';

const saveDailyTransactions = () => {
  cron.schedule('45 23 * * *', async () => {
    await saveDailyTransactionsSnapshot();
  });
};

export default saveDailyTransactions;
