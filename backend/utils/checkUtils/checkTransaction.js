import logger from '../../configs/logger.js';
import { findTransactionByTransactionId } from '../../database/transactions.js';

const checkTransaction = async (transactionId) => {
  try {
    const result = await findTransactionByTransactionId(transactionId);
    return result ?? false;
  } catch (error) {
    logger.error(`checkTransaction error: ${error.message}`);
    return false;
  }
};

export { checkTransaction };
