import pool from '../../database/db.js';
import { AppError } from '../errors/AppError.js';

const countTotalPages = async (dataType, houseId, userId) => {
  const connection = await pool.getConnection();
  let query = ``;
  let params = [];

  if (dataType === 'transactions' && houseId) {
    query = `SELECT COUNT(*) AS total FROM transactions WHERE houseId = ?`;
    params = [houseId];
  } else if (dataType === 'messages' && userId) {
    query = `SELECT COUNT(*) AS total FROM messages WHERE senderId =? OR recipientId =?`;
    params = [userId, userId];
  } else {
    return { type: dataType, pages: 0 };
  }

  try {
    const [getPagesCounter] = await connection.query(query, params);

    if (getPagesCounter.length > 0) {
      const totalRecords = getPagesCounter[0].total;
      const limit = 10;
      const totalPages = Math.ceil(totalRecords / limit);
      return { type: dataType, pages: totalPages };
    }

    return { type: dataType, pages: 0 };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError({
      code: 'PAGES_COUNT_FAILED',
      messageKey: 'The number of pages could not be calculated.',
      httpStatus: 500,
    });
  } finally {
    if (connection) connection.release();
  }
};

export { countTotalPages };
