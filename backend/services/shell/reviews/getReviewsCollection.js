import pool from '../../../database/db.js';
import logger from '../../../configs/logger.js';
import { AppError } from '../../../utils/errors/AppError.js';

export async function getReviewsCollection() {
  const connection = await pool.getConnection();
  try {
    const [reviews] = await connection.query(
      'SELECT id, rating,userName, content, userId, date FROM usersReviews',
    );
    if (reviews.length === 0) {
      throw new AppError({
        code: 'REVIEW_NOT_FOUND',
        messageKey: 'Opinions not found.',
        httpStatus: 404,
      });
    }
    return {
      messageKey: 'Opinions fetched correctly.',
      reviews,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`getReviewsCollection error: ${error}`);
    throw new AppError({
      code: 'REVIEW_COLLECTION_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
