import logger from '../../configs/logger.js';
import { updateUserEmail } from '../../database/users.js';
import { checkUserEmail } from '../../utils/checkUtils/checkUserEmail.js';
import { AppError } from '../../utils/errors/AppError.js';

const changeUserEmail = async (newEmail, userId) => {
  try {
    const checkEmail = await checkUserEmail(newEmail);

    if (checkEmail) {
      throw new AppError({ code: 'USERS_F1', messageKey: 'changeEmail.checkEmailError', httpStatus: 409 });
    }

    try {
      await updateUserEmail(userId, newEmail);
    } catch (updateError) {
      if (updateError.code === 'P2025') {
        throw new AppError({ code: 'USERS_F2', messageKey: 'changeEmail.failedError', httpStatus: 500 });
      }
      throw updateError;
    }

    return {
      messageKey: 'changeEmail.changedCorrectlyMessage',
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`changeEmail error: ${error}`);
    throw new AppError({ code: 'USERS_F3', messageKey: 'changeEmail.internalError', httpStatus: 500 });
  }
};

export { changeUserEmail };