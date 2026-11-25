import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import checkHouse from '../../utils/checkUtils/checkUserHouse.js';
import { validTransactionTypes, parseAmount2dp } from '../../utils/validation.js';
import { createTransactionWithBalanceUpdate } from '../../database/transactions.js';
import { liveUpdateBalance } from '../../utils/householdUtils/liveUpdateBalance.js';
import { handleNotification } from '../../utils/handleNotification.js';
import { AppError } from '../../utils/errors/AppError.js';

const addNewAction = async (userId, type, value, catId) => {
  const transactionId = uuidv4();
  const id = uuidv4();
  const validTypes = validTransactionTypes;

  if (!type || !validTypes.includes(type)) {
    logger.error('Invalid input data.');
    throw new AppError({ code: 'TX_1', messageKey: 'Invalid input data.', httpStatus: 400 });
  }

  try {
    const houseData = await checkHouse(userId);
    if (!houseData || houseData.houseId == null) {
      logger.error(`User ${userId} does not belong to any household.`);
      throw new AppError({
        code: 'TRANSACT_F2',
        messageKey: `User ${userId} does not belong to any household.`,
        httpStatus: 500,
      });
    }

    const houseId = houseData.houseId;
    const valueToDb = parseAmount2dp(value);
    if (valueToDb === null) {
      throw new AppError({
        code: 'TX_AMOUNT',
        messageKey: 'transactions.invalidAmount',
        httpStatus: 400,
      });
    }

    const { newBalance } = await createTransactionWithBalanceUpdate({
      id,
      transactionId,
      userId,
      houseId,
      catId,
      type,
      value: valueToDb,
    });

    logger.info(`Transaction ${transactionId} successfully added to household: ${houseId}.`);

    await liveUpdateBalance(houseId, userId, newBalance);

    await handleNotification({
      id,
      category: 'transactions',
      houseId,
      message: 'notifications.addedAction',
      extraData: { action: 'addTransaction' },
    });

    return {
      messageKey: 'addTransaction.addTransactionCorrect',
      transactionId,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`An error occured during adding transaction: ${error.message}`);
    throw new AppError({
      code: 'TRANSACT_F1',
      messageKey: 'addTransaction.addTransactionError',
      httpStatus: 500,
    });
  }
};

export { addNewAction };
