import cron from 'node-cron';
import { balanceHouseholdsMonthly } from '../services/budget/balanceHouseholdsMonthly.js';

const balanceHouseActions = () => {
  cron.schedule('58 23 * * *', async () => {
    await balanceHouseholdsMonthly();
  });
};

export default balanceHouseActions;
