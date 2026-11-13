import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function getNoticesCollection(userId) {
  if (!userId) {
    throw new AppError({
      code: 'NOTICE_BAD_USER',
      messageKey: 'Incorrect input data.',
      httpStatus: 400,
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const checkHouse = await checkUserHouse(connection, userId);
    if (!checkHouse) {
      logger.error(`User ${userId} does not belong to any household.`);
      await connection.rollback();
      throw new AppError({
        code: 'NOTICE_NO_HOUSE',
        messageKey: 'User does not belong to any household.',
        httpStatus: 403,
      });
    }

    const houseId = checkHouse.houseId;
    const [notifications] = await connection.query(
      `SELECT id, category, noticeData FROM notifications WHERE houseId=?`,
      [houseId],
    );

    if (notifications.length === 0) {
      await connection.commit();
      throw new AppError({
        code: 'NOTICE_NOT_FOUND',
        messageKey: 'Notifications not found.',
        httpStatus: 404,
      });
    }

    await connection.commit();
    return {
      messageKey: 'Notifications fetched correctly.',
      notifications,
    };
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    logger.error(`ERROR in getNoticesCollection: ${error}`);
    throw new AppError({
      code: 'NOTICE_COLLECTION_INTERNAL',
      messageKey: 'Failed to fetch notifications.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
