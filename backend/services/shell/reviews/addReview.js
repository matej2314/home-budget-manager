import { v4 as uuidv4 } from 'uuid';
import logger from '../../../configs/logger.js';
import { AppError } from '../../../utils/errors/AppError.js';
import { createReview } from '../../../database/shell.js';

export async function addReview({ userId, userName, content, rating }) {
  if (!content || content.trim().length === 0 || !rating) {
    throw new AppError({
      code: 'REVIEW_INVALID',
      messageKey: 'Invalid input data!',
      httpStatus: 400,
    });
  }

  const id = uuidv4();
  try {
    await createReview({ id, rating, content, userName, userId });
    return { httpStatus: 201, messageKey: 'Opinion added correctly.', id };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`addReview error: ${error}`);
    throw new AppError({
      code: 'REVIEW_ADD_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  }
}