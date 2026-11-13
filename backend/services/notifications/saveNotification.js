import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function saveNotification(id, category, noticeData, houseId) {
  if (!category || !noticeData || !houseId) {
    throw new AppError({
      code: 'NOTICE_INVALID_INPUT',
      messageKey: 'Invalid input data.',
      httpStatus: 400,
    });
  }

  const connection = await pool.getConnection();
  try {
    const [addNotice] = await connection.query(
      `INSERT INTO notifications (id, category, noticeData, houseId) VALUES (?, ?, ?, ?)`,
      [id, category, noticeData, houseId],
    );
    if (addNotice.affectedRows === 0) {
      throw new AppError({
        code: 'NOTICE_SAVE_FAILED',
        messageKey: 'Failed to add notification.',
        httpStatus: 500,
      });
    }
    return { messageKey: 'Notification saved correctly.' };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`saveNotification error: ${error}`);
    throw new AppError({
      code: 'NOTICE_SAVE_INTERNAL',
      messageKey: 'Failed to save notification.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
