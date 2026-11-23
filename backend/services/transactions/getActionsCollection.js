import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';
import { listAllTransactions } from '../../database/transactions.js';

const getActionsCollection = async () => {
  try {
    const rows = await listAllTransactions();

    if (rows.length === 0) {
      logger.error(`Transactions not found.`);
      throw new AppError({ code: 'TX_1', messageKey: 'Transactions not found.', httpStatus: 404 });
    }
    logger.info(`Transactions fetched correctly.`);
    return {
      messageKey: 'Transactions fetched correctly.',
      actions: rows,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`getAllActions error: ${error}`);
    throw new AppError({
      code: 'TX_2',
      messageKey: 'An error occured during deleting transaction.',
      httpStatus: 500,
    });
  }
};

export { getActionsCollection };