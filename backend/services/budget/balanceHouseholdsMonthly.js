import logger from '../../configs/logger.js';
import { handleNotification } from '../../utils/handleNotification.js';
import { v4 as uuidv4 } from 'uuid';
import { listHouseholdsForMonthlyBalance } from '../../database/households.js';
import { listTransactionsInDateRange } from '../../database/transactions.js';
import { latestInitialBudgetValue } from '../../database/budget.js';
import {
  createMonthlyBalance,
  createMonthlyTransactionCount,
  updateHouseholdMonthlyBalanceDate,
} from '../../database/snapshots.js';

/**
 * Miesięczne bilansowanie gospodarstw + notice/WS notification (ten sam mechanizm co HTTP).
 * Wołane z tasks/ (cron) — bez omijania services (B-5).
 */
export async function balanceHouseholdsMonthly() {
  try {
    logger.info('Bilansowanie rozpoczęte.');

    const households = await listHouseholdsForMonthlyBalance();

    logger.info(`Finded ${households.length} households in database.`);

    if (households.length === 0) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    for (const household of households) {
      const { houseId, monthlyBalanceDate, createdAt, initBudget } = household;

      const formattedBalanceDate = monthlyBalanceDate
        ? new Date(monthlyBalanceDate).toISOString().split('T')[0]
        : null;
      const formattedCreatedAt = new Date(createdAt).toISOString().split('T')[0];
      const dateLimit = formattedBalanceDate || formattedCreatedAt;

      logger.info(
        `Calculating the date for household ${houseId}, balanceDate: ${monthlyBalanceDate}, createdAt: ${createdAt}`
      );

      const nextBalanceDate = new Date(dateLimit);
      nextBalanceDate.setDate(nextBalanceDate.getDate() + 1);
      const nextBalanceDateStr = nextBalanceDate.toISOString().split('T')[0];

      if (today !== nextBalanceDateStr) {
        logger.info(
          `Household ${houseId} do not require finance balancing before ${nextBalanceDateStr}.`
        );
        continue;
      }

      logger.info(`Check transactions for household ${houseId} from ${dateLimit}.`);

      const from = new Date(`${dateLimit}T00:00:00.000Z`);
      const to = new Date(`${nextBalanceDateStr}T23:59:59.999Z`);
      const transactions = await listTransactionsInDateRange(houseId, from, to);

      logger.info(`Finded ${transactions.length} transactions for household ${houseId}.`);
      const transactionCountId = uuidv4();

      await createMonthlyTransactionCount({
        id: transactionCountId,
        houseId,
        transactionCount: transactions.length,
        startDate: new Date(dateLimit),
        balanceDate: new Date(today),
      });

      let newBalance = 0;

      if (!formattedBalanceDate) {
        newBalance = parseFloat(initBudget);
      } else {
        const latestValue = await latestInitialBudgetValue(houseId);

        if (latestValue != null) {
          newBalance = parseFloat(latestValue);
        } else {
          newBalance = parseFloat(initBudget);
        }
      }

      transactions.forEach((ts) => {
        if (ts.type === 'income') {
          newBalance += parseFloat(ts.value);
        } else if (ts.type === 'expense') {
          newBalance -= ts.value;
        }
      });

      const id = uuidv4();
      const newBalanceToDb = parseFloat(newBalance);
      const insertBalance = await createMonthlyBalance({
        id,
        monthly_balance: newBalanceToDb,
        houseId,
        monthlyBalanceDate: new Date(),
      });

      if (insertBalance) {
        await updateHouseholdMonthlyBalanceDate(houseId, new Date());
      }

      const noticeId = uuidv4();
      await handleNotification({
        id: noticeId,
        category: 'monthlyBalance',
        houseId,
        message: 'notifications.neMonthlyBalance',
      });

      logger.info(`Balance for household ${houseId} updated.`);
    }
  } catch (error) {
    logger.error(`An error occured during households finance balancing: ${error}`);
  }
}