import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import checkHouse from '../../utils/checkUtils/checkUserHouse.js';
import { checkTransaction } from '../../utils/checkUtils/checkTransaction.js';
import { deleteTransactionWithBalanceUpdate } from '../../database/transactions.js';
import { liveUpdateBalance } from '../../utils/householdUtils/liveUpdateBalance.js';
import { handleNotification } from '../../utils/handleNotification.js';
import { AppError } from '../../utils/errors/AppError.js';

const deleteAction = async (transactionId, userId) => {
  try {
    if (!transactionId) {
      logger.error('Transaction ID not found.');
      throw new AppError({ code: 'TX_1', messageKey: 'Invalid input data.', httpStatus: 400 });
    }

    const houseData = await checkHouse(userId);

    if (!houseData) {
      logger.error(`User ${userId} does not belong to any household.`);
      throw new AppError({
        code: 'TX_2',
        messageKey: 'User does not belong to any household.',
        httpStatus: 404,
      });
    }

    const houseId = houseData.houseId;

    const checkAction = await checkTransaction(transactionId);

    if (!checkAction) {
      logger.error(`User ${userId} tries to delete someone else's transaction.`);
      throw new AppError({
        code: 'TX_3',
        messageKey: 'You are deleting a transaction that is not yours!',
        httpStatus: 400,
      });
    }

    const value = checkAction.value;

    const result = await deleteTransactionWithBalanceUpdate({
      userId,
      houseId,
      transactionId,
      balanceType: 'expense',
      value,
    });

    if (!result.deleted) {
      logger.error(`Transaction ${transactionId} not found.`);
      throw new AppError({ code: 'TX_4', messageKey: 'Transaction not found.', httpStatus: 404 });
    }

    await liveUpdateBalance(houseId, userId, result.newBalance);

    const id = uuidv4();

    await handleNotification({
      id,
      category: 'transactions',
      houseId,
      message: 'notifications.deletedAction',
      extraData: {
        user: userId,
        action: 'deleteTransaction',
      },
    });

    logger.info(`Transaction ${transactionId} deleted correctly.`);

    return {
      messageKey: `Transaction ${transactionId} deleted correctly.`,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`deleteAction error: ${error}`);
    throw new AppError({
      code: 'TX_5',
      messageKey: 'Failed to deleting transaction.',
      httpStatus: 500,
    });
  }
};

export { deleteAction };
