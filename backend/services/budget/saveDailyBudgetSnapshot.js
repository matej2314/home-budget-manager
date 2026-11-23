import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { listHouseholdsForMonthlyBalance, getBalanceFields } from '../../database/households.js';
import { createDailyBudget } from '../../database/snapshots.js';

/** Dzienny snapshot salda per dom (`dailyBudget`). Cron → service (B-5). */
export async function saveDailyBudgetSnapshot() {
  try {
    const households = await listHouseholdsForMonthlyBalance();

    logger.info(`Finded ${households.length} households.`);

    if (households.length === 0) {
      return;
    }

    for (const house of households) {
      const id = uuidv4();
      const { currentBalance } = await getBalanceFields(house.houseId);
      const balanceToDb = currentBalance;

      const addDailyBudget = await createDailyBudget({
        id,
        houseId: house.houseId,
        value: balanceToDb,
      });
      if (!addDailyBudget) {
        logger.error('Failed to save daily budget.');
      } else {
        logger.info('The daily budget of all households has been saved.');
      }
    }
  } catch (error) {
    logger.error(error);
  }
}