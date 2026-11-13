import pool from '../../database/db.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { checkNotice } from '../../utils/checkUtils/checkNotice.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function deleteNotification({ noticeId, userId }) {
  if (!noticeId) {
    throw new AppError({
      code: 'NOTICE_DELETE_BAD_INPUT',
      messageKey: 'Invalid input data.',
      httpStatus: 400,
    });
  }

  const connection = await pool.getConnection();
  const noticeExist = await checkNotice(noticeId, connection);
  if (!noticeExist) {
    connection.release();
    throw new AppError({
      code: 'NOTICE_DELETE_NOT_FOUND',
      messageKey: 'Notification not found.',
      httpStatus: 404,
    });
  }

  try {
    await connection.beginTransaction();
    const checkHouse = await checkUserHouse(connection, userId);
    if (!checkHouse) {
      throw new AppError({
        code: 'NOTICE_DELETE_NO_HOUSE',
        messageKey: 'User does not belong to any household',
        httpStatus: 403,
      });
    }

    const [deleteNotice] = await connection.query(
      'DELETE FROM notifications WHERE id=? AND houseId=?',
      [noticeId, checkHouse.houseId],
    );
    if (deleteNotice.affectedRows == 0) {
      throw new AppError({
        code: 'NOTICE_DELETE_FAILED',
        messageKey: 'Failed to delete notification',
        httpStatus: 404,
      });
    }

    await connection.commit();
    return { messageKey: 'Notification removed correctly' };
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError({
      code: 'NOTICE_DELETE_INTERNAL',
      messageKey: 'Failed to delete notification.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
