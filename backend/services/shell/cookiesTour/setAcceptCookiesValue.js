import logger from '../../../configs/logger.js';
import { AppError } from '../../../utils/errors/AppError.js';
import { setAcceptCookies as setAcceptCookiesDb } from '../../../database/users.js';

const setAcceptCookies = async (cookieValue, userId) => {
  try {
    await setAcceptCookiesDb(userId, cookieValue);
    return {
      messageKey: 'Your consent saved correctly.',
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error?.code === 'P2025') {
      logger.error(`User's ${userId} cookie consent saved failed.`);
      throw new AppError({ code: 'SHELL_CT_1', messageKey: 'Internal server error.', httpStatus: 500 });
    }
    logger.error(`setCookieValue error: ${error}`);
    throw new AppError({ code: 'SHELL_CT_2', messageKey: 'Internal server error.', httpStatus: 500 });
  }
};

export { setAcceptCookies };