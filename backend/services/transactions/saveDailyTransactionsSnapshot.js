import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { listHouseholdsForMonthlyBalance } from '../../database/households.js';
import { listTransactionsInDateRange } from '../../database/transactions.js';
import { upsertDailyTransactionCount } from '../../database/snapshots.js';

/** Dzienny agregat liczby transakcji per dom (`dailyTransactions`). Cron → service (B-5). */
export async function saveDailyTransactionsSnapshot() {
  try {
    const households = await listHouseholdsForMonthlyBalance();

    if (households.length === 0) {
      logger.error('No households found.');
      return;
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 58, 0, 0);

    const rows = [];
    for (const { houseId } of households) {
      const transactions = await listTransactionsInDateRange(houseId, startOfDay, endOfDay);
      if (transactions.length > 0) {
        rows.push({ houseId, transactionCount: transactions.length });
      }
    }

    if (rows.length === 0) {
      logger.error('No new transactions.');
      return;
    }

    let saved = 0;
    for (const row of rows) {
      await upsertDailyTransactionCount({
        id: uuidv4(),
        dailyActionCount: row.transactionCount,
        houseId: row.houseId,
        date: now,
      });
      saved += 1;
    }

    if (saved === rows.length) {
      logger.info(`Saved ${saved} daily transactions.`);
    } else {
      logger.error(`No daily transactions saved.`);
    }
  } catch (error) {
    logger.error(`saveDailyTransactions error: ${error}`);
  }
}