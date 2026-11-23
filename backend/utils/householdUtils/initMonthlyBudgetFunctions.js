import logger from '../../configs/logger.js';
import { updateInitialBudgetByHouse } from '../../database/budget.js';
import { deleteTransactionsInDateRange } from '../../database/transactions.js';
import {
  deleteDailyTransactionsInRange,
  deleteDailyBudgetInRange,
} from '../../database/snapshots.js';

const addNewBudget = async (value, userHouse) => {
  try {
    const addedAt = new Date();
    const validUntil = new Date(addedAt);
    validUntil.setDate(validUntil.getDate() + 30);

    const addedAtFormatted = addedAt.toISOString().split('T')[0];
    const validUntilFormatted = validUntil.toISOString().split('T')[0];
    const valueToDb = parseFloat(value).toFixed(2);

    await updateInitialBudgetByHouse(userHouse, {
      value: valueToDb,
      validUntil: new Date(validUntilFormatted),
    });

    return { addedAtFormatted, validUntilFormatted, valueToDb };
  } catch (error) {
    logger.error(error);
  }
};

// clear transactions, dailyTransactions, dailyBudgets added during 7 days (when changed init budget)
const clearExtraValues = async (houseId, lastAddedAt) => {
  const today = new Date().toISOString().split('T')[0];
  const startPeriod = new Date(lastAddedAt).toISOString().split('T')[0];
  const from = new Date(startPeriod);
  const to = new Date(today);
  try {
    const delActions = await deleteTransactionsInDateRange(houseId, from, to);
    if (delActions.count === 0) {
      logger.error(`No transactions in indicated range.`);
    }

    const delDailyActions = await deleteDailyTransactionsInRange(houseId, from, to);
    if (delDailyActions.count === 0) {
      logger.error(`No daily transactions to delete.`);
    }

    const delDailyBudgets = await deleteDailyBudgetInRange(houseId, from, to);
    if (delDailyBudgets.count === 0) {
      logger.error(`Daily budgets not remove.`);
    }
  } catch (error) {
    logger.error(`clearExtraValues error: ${error}`);
    throw error;
  }
};

export { addNewBudget, clearExtraValues };
