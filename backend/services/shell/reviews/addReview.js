import { v4 as uuidv4 } from 'uuid';
import pool from '../../../database/db.js';
import logger from '../../../configs/logger.js';
import { AppError } from '../../../utils/errors/AppError.js';

export async function addReview({ userId, userName, content, rating }) {
  if (!content || content.trim().length === 0 || !rating) {
    throw new AppError({
      code: 'REVIEW_INVALID',
      messageKey: 'Invalid input data!',
      httpStatus: 400,
    });
  }

  const connection = await pool.getConnection();
  const id = uuidv4();
  try {
    const [addReviewResult] = await connection.query(
      'INSERT INTO usersReviews (id, rating, content, userName, userId) VALUES (?,?,?,?,?)',
      [id, rating, content, userName, userId],
    );
    if (addReviewResult.affectedRows === 0) {
      throw new AppError({
        code: 'REVIEW_ADD_FAILED',
        messageKey: 'Failed to add opinion.',
        httpStatus: 400,
      });
    }
    return { httpStatus: 201, messageKey: 'Opinion added correctly.', id };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`addReview error: ${error}`);
    throw new AppError({
      code: 'REVIEW_ADD_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
