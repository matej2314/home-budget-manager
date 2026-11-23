import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';
import { listCategories } from '../../database/categories.js';

const getActionCatColl = async () => {
  try {
    const categories = await listCategories();

    if (categories.length === 0) {
      logger.error('Transactions categories not found.');
      throw new AppError({
        code: 'CAT_1',
        messageKey: 'Transactions categories not found.',
        httpStatus: 404,
      });
    }

    return {
      messageKey: 'Transactions categories fetched correctly.',
      actionCategories: categories,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Failed to fetch transactions categories.', error);
    throw new AppError({ code: 'CAT_2', messageKey: 'Internal server error.', httpStatus: 500 });
  }
};

export { getActionCatColl };