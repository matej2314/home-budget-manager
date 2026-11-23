import logger from '../../configs/logger.js';
import { deleteHousehold } from '../../database/households.js';
import {
  clearHouseIdForHouse,
  deleteHouseholdUsersByUserId,
  deleteTransactionsByUserId,
  deleteUserById,
  findUserById,
} from '../../database/users.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { AppError } from '../../utils/errors/AppError.js';

const deleteUser = async (userId) => {
  if (!userId) {
    logger.error(`No user ID.`);
    throw new AppError({ code: 'USER_1', messageKey: 'Invalid input data.', httpStatus: 400 });
  }

  try {
    const checkIsHost = await findUserById(userId);

    if (checkIsHost?.host) {
      const userHouseId = await checkUserHouse(userId);
      const houseId = userHouseId.houseId;
      const deleteHouse = await deleteHousehold(houseId, userId);

      if (deleteHouse.count === 1) {
        await deleteTransactionsByUserId(userId);
        await clearHouseIdForHouse(houseId);
      }

      const deleteFromUsers = await deleteUserById(userId);
      if (deleteFromUsers) {
        logger.info(`User ${userId} deleted correctly.`);
      }
    } else {
      logger.info(`User ${userId} isn't host. Deleting his transactions.`);
      const deleteFromTransactions = await deleteTransactionsByUserId(userId);

      if (deleteFromTransactions.count > 0) {
        await deleteHouseholdUsersByUserId(userId);
      }

      await deleteUserById(userId);
    }

    return { messageKey: `User ${userId} deleted correctly.` };
  } catch (error) {
    if (error instanceof AppError) throw error;

    logger.error(`An error occured during deleting user ${userId}: ${error.message}`);
    throw new AppError({ code: 'USER_2', messageKey: 'Internal server error.', httpStatus: 500 });
  }
};

export { deleteUser };