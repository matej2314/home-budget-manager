import logger from '../../configs/logger.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { countTotalPages } from '../../utils/dbUtils/countTotalPages.js';
import { AppError } from '../../utils/errors/AppError.js';
import { listCategories } from '../../database/categories.js';
import {
  getDailyBoardData,
  getHouseBoardData,
  getInmatesBoardData,
  getMessagesBoardPage,
  getStatsBoardData,
  getTransactionsBoardPage,
} from '../../database/board.js';

function formatDate(value) {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function mapHouseBoardRows(row) {
  return {
    houseName: row.houseName,
    liveBalance: row.liveBalance,
    host: row.host,
    lastBalanceDate: formatDate(row.lastBalanceDate),
    lastInitialBudget: row.lastInitialBudget,
    initialValidUntil: formatDate(row.initialValidUntil),
    initialDefinedAt: formatDate(row.initialDefinedAt),
  };
}

function buildDailyData({ dailyTx, dailyBudget }) {
  const budgets = dailyBudget.length ? dailyBudget : [null];
  const rows = [];
  for (const dt of dailyTx) {
    for (const db of budgets) {
      rows.push({
        dailyActionCount: dt.dailyActionCount,
        houseId: dt.houseId,
        dailyActionsDate: formatDate(dt.date),
        dailyBudgetValue: db?.value ?? null,
        dailyBudgetDate: db ? formatDate(db.date) : null,
      });
    }
  }
  return rows;
}

function buildStatsData({ budgets, balances, counts }) {
  const mbList = balances.length ? balances : [null];
  const tcList = counts.length ? counts : [null];
  const rows = [];
  for (const ib of budgets) {
    for (const mb of mbList) {
      for (const tc of tcList) {
        rows.push({
          definedMonthlyBudgets: ib.value,
          initMonthlyBudgetDate: formatDate(ib.addedAt),
          initMonthlyBudgetValidDate: formatDate(ib.validUntil),
          monthlyBalanceValue: mb?.monthly_balance ?? null,
          monthlyBalanceDate: mb ? formatDate(mb.monthlyBalanceDate) : null,
          transactionCount: tc?.transactionCount ?? null,
          countStartDate: tc ? formatDate(tc.startDate) : null,
          countEndDate: tc ? formatDate(tc.balanceDate) : null,
        });
      }
    }
  }
  return rows.sort((a, b) => {
    if (!a.monthlyBalanceDate) return 1;
    if (!b.monthlyBalanceDate) return -1;
    return a.monthlyBalanceDate.localeCompare(b.monthlyBalanceDate);
  });
}

export async function getBoardData(userId, filter = 'all', page = 1, limit = 10) {
  try {
    const userHouse = await checkUserHouse(userId);
    if (!userHouse) {
      logger.error(`No user's ${userId} household.`);
      throw new AppError({
        code: 'BOARD_NO_HOUSE',
        messageKey: `No user's household.`,
        httpStatus: 404,
      });
    }

    const userHouseId = userHouse.houseId;
    const boardData = {};
    const offset = (page - 1) * limit;

    if (filter === 'all' || filter === 'house') {
      const householdRow = await getHouseBoardData(userHouseId);
      if (!householdRow) {
        throw new AppError({
          code: 'BOARD_NO_HOUSE_INFO',
          messageKey: 'No household information.',
          httpStatus: 404,
        });
      }
      boardData.houseData = [mapHouseBoardRows(householdRow)];
    }

    if (filter === 'all' || filter === 'inmates') {
      boardData.inmates = await getInmatesBoardData(userHouseId);
    }

    if (filter === 'transactions') {
      const transactionsData = await getTransactionsBoardPage(userHouseId, limit, offset);
      boardData.actionsData = transactionsData.map((t) => ({
        ...t,
        addedAt: formatDateTime(t.addedAt),
      }));
      const totalPages = await countTotalPages(filter, userHouseId);
      boardData.totalPages = totalPages.pages;
    }

    if (filter === 'all' || filter === 'daily') {
      const daily = await getDailyBoardData(userHouseId);
      boardData.dailyData = buildDailyData(daily);
    }

    if (filter === 'all' || filter === 'categories') {
      boardData.actionCatData = await listCategories();
    }

    if (filter === 'messages') {
      boardData.messagesData = await getMessagesBoardPage(userId, limit, offset);
      const totalPages = await countTotalPages(filter, userHouseId, userId);
      boardData.totalPages = totalPages.pages;
    }

    if (filter === 'all' || filter === 'stats') {
      const stats = await getStatsBoardData(userHouseId);
      boardData.statsData = buildStatsData(stats);
    }

    boardData.page = page;

    return {
      messageKey: 'Dashboard data fetched correctly.',
      dashboardData: boardData,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`getBoardData error: ${error.message}`);
    throw new AppError({
      code: 'BOARD_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  }
}