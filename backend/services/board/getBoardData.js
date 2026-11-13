import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import dashboardQueries from '../../database/dashboardQueries.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { countTotalPages } from '../../utils/dbUtils/countTotalPages.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function getBoardData(userId, filter = 'all', page = 1, limit = 10) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const userHouse = await checkUserHouse(connection, userId);
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
      const [householdData] = await connection.query(dashboardQueries.householdData, [
        userHouseId,
      ]);
      if (!householdData) {
        throw new AppError({
          code: 'BOARD_NO_HOUSE_INFO',
          messageKey: 'No household information.',
          httpStatus: 404,
        });
      }
      boardData.houseData = householdData;
    }

    if (filter === 'all' || filter === 'mates') {
      const [matesData] = await connection.query(dashboardQueries.matesData, [userHouseId]);
      boardData.houseMates = matesData;
    }

    if (filter === 'transactions') {
      const [transactionsData] = await connection.query(dashboardQueries.transactionsData, [
        userHouseId,
        limit,
        offset,
      ]);
      boardData.actionsData = transactionsData;
      const totalPages = await countTotalPages(filter, userHouseId);
      boardData.totalPages = totalPages.pages;
    }

    if (filter === 'all' || filter === 'daily') {
      const [dailyData] = await connection.query(dashboardQueries.dailyData, [userHouseId]);
      boardData.dailyData = dailyData;
    }

    if (filter === 'all' || filter === 'categories') {
      const [actionsCatData] = await connection.query(dashboardQueries.actionCatData);
      boardData.actionCatData = actionsCatData;
    }

    if (filter === 'messages') {
      const [messagesData] = await connection.query(dashboardQueries.messagesData, [
        userId,
        userId,
        limit,
        offset,
      ]);
      boardData.messagesData = messagesData;
      const totalPages = await countTotalPages(filter, userHouseId, userId);
      boardData.totalPages = totalPages.pages;
    }

    if (filter === 'all' || filter === 'stats') {
      const [statsData] = await connection.query(dashboardQueries.statsQuery, [userHouseId]);
      boardData.statsData = statsData;
    }

    await connection.commit();
    boardData.page = page;

    return {
      messageKey: 'Dashboard data fetched correctly.',
      dashboardData: boardData,
    };
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    logger.error(`getBoardData error: ${error.message}`);
    throw new AppError({
      code: 'BOARD_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
