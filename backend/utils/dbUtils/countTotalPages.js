import { AppError } from '../errors/AppError.js';
import { countTransactionsByHouse } from '../../database/transactions.js';
import { countMessagesForUser } from '../../database/board.js';

const countTotalPages = async (dataType, houseId, userId) => {
  try {
    let totalRecords = 0;

    if (dataType === 'transactions' && houseId) {
      totalRecords = await countTransactionsByHouse(houseId);
    } else if (dataType === 'messages' && userId) {
      totalRecords = await countMessagesForUser(userId);
    } else {
      return { type: dataType, pages: 0 };
    }

    const limit = 10;
    const totalPages = Math.ceil(totalRecords / limit);
    return { type: dataType, pages: totalPages };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError({
      code: 'PAGES_COUNT_FAILED',
      messageKey: 'The number of pages could not be calculated.',
      httpStatus: 500,
    });
  }
};

export { countTotalPages };
