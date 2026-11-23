import { v4 as uuidv4 } from 'uuid';
import logger from '../../configs/logger.js';
import { handleNotification } from '../../utils/handleNotification.js';
import { AppError } from '../errors/AppError.js';
import { saveNewInmate } from './saveNewInmate.js';

export const addUserByHost = async (userName, houseId, invitedUser) => {
  try {
    if (!invitedUser) {
      logger.error(`User ${userName} not found.`);
      throw new AppError({
        code: 'USERS_HOST_BADREQ',
        messageKey: 'addUserToHouse.userNotFoundError',
        httpStatus: 400,
      });
    }

    if (invitedUser.houseId != null) {
      logger.info(`User ${userName} already is inmate or host.`);
      throw new AppError({
        code: 'USERS_HOST_INMATE',
        messageKey: 'addUserToHouse.inmateOrHostError',
        httpStatus: 400,
      });
    }

    await saveNewInmate(invitedUser.userId, houseId);

    await handleNotification({
      id: uuidv4(),
      category: 'usersActions',
      houseId,
      message: 'notifications.addedInmate',
    });

    logger.info(`User ${userName} correctly added to household.`);
    return { messageKey: 'addUserToHouse.inviteSuccessMessage' };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`inviteUser error:`, error);
    throw new AppError({
      code: 'USERS_HOST_ERROR',
      messageKey: 'addUserToHouse.inviteUserInternalError',
      httpStatus: 500,
    });
  }
};
