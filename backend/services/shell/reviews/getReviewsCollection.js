import logger from '../../../configs/logger.js';
import { AppError } from '../../../utils/errors/AppError.js';
import { listReviews } from '../../../database/shell.js';

function mapReviewRow(row) {
  return {
    id: row.id,
    rating: row.rating,
    userName: row.userName,
    content: row.content,
    userId: row.userId,
    date: row.date,
  };
}

export async function getReviewsCollection() {
  try {
    const reviews = await listReviews();
    if (reviews.length === 0) {
      throw new AppError({
        code: 'REVIEW_NOT_FOUND',
        messageKey: 'Opinions not found.',
        httpStatus: 404,
      });
    }
    return {
      messageKey: 'Opinions fetched correctly.',
      reviews: reviews.map(mapReviewRow),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`getReviewsCollection error: ${error}`);
    throw new AppError({
      code: 'REVIEW_COLLECTION_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  }
}