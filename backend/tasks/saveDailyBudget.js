import cron from 'node-cron';
import { saveDailyBudgetSnapshot } from '../services/budget/saveDailyBudgetSnapshot.js';

const saveDailyBudget = () => {
  cron.schedule('50 23 * * *', async () => {
    await saveDailyBudgetSnapshot();
  });
};

export default saveDailyBudget;
