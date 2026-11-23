import logger from '../../../configs/logger.js';
import { AppError } from '../../../utils/errors/AppError.js';
import { setCompleteTour as setCompleteTourDb } from '../../../database/users.js';

const setCompleteTour = async (userId) => {
  try {
    await setCompleteTourDb(userId, true);
    return {
      messageKey: 'Congratulations for passing the tutorial!',
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error?.code === 'P2025') {
      logger.error(`User  ${userId} tutorial info saved failed.`);
      throw new AppError({ code: 'SHELL_CT_1', messageKey: 'Internal server error.', httpStatus: 500 });
    }
    logger.error(`setTourValue error: ${error}`);
    throw new AppError({ code: 'SHELL_CT_2', messageKey: 'Internal server error.', httpStatus: 500 });
  }
};

export { setCompleteTour };