import logger from '../../configs/logger.js';
import checkHouse from '../../utils/checkUtils/checkUserHouse.js';
import { AppError } from '../../utils/errors/AppError.js';
import { listTransactionsByHouse } from '../../database/transactions.js';

function mapHouseActionRow(t) {
  return {
    transaction_id: t.transactionId,
    value: t.value,
    addedAt: t.addedAt,
    houseId: t.houseId,
    catId: t.catId,
    userId: t.userId,
    category_name: t.actionCategories?.name ?? null,
  };
}

const getHouseActions = async (userId) => {
  try {
    const houseData = await checkHouse(userId);

    if (!houseData) {
      logger.error(`User ${userId} does not belong to any household.`);
      throw new AppError({
        code: 'TRANSACT_F1',
        messageKey: `User ${userId} does not belong to any household`,
        httpStatus: 404,
      });
    }

    const rows = await listTransactionsByHouse(houseData.houseId);

    if (rows.length === 0) {
      logger.error(`Not found any transactions for household: ${houseData.houseId}`);
      throw new AppError({ code: 'TX_1', messageKey: 'Transactions not found.', httpStatus: 404 });
    }
    logger.info(`Transactions for household fetched correctly.`);
    return {
      messageKey: 'Transactions for household fetched correctly.',
      actions: rows.map(mapHouseActionRow),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`An error occured during fetching transactions for household: ${error.message}`);
    throw new AppError({
      code: 'TX_2',
      messageKey: 'An error occured during fetching transactions for household.',
      httpStatus: 500,
    });
  }
};

export { getHouseActions };