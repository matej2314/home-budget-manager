import logger from '../../configs/logger.js';
import { listHouseholdUsers } from '../../database/users.js';
import { AppError } from '../../utils/errors/AppError.js';

const getUsersCollection = async () => {
  try {
    const rows = await listHouseholdUsers();
    logger.info(`All user's list fetched correctly.`);

    if (rows.length === 0) {
      throw new AppError({ code: 'USER_1', messageKey: 'Users not found.', httpStatus: 404 });
    }

    return {
      messageKey: `User's list fetched correctly.`,
      users: rows,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`An error occured user's list: ${error}`);
    throw new AppError({ code: 'USERS_F1', messageKey: `Failed to fetch user's list.`, httpStatus: 500 });
  }
};

export { getUsersCollection };