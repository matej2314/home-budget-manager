import { v4 as uuidv4 } from 'uuid';
import logger from '../../configs/logger.js';
import usersQueries from '../../database/usersQueries.js';
import { handleNotification } from '../../utils/handleNotification.js';
import { AppError } from '../errors/AppError.js';
import { saveNewHousemate } from './saveNewHousemate.js';

export const addUserByHost = async (connection, userName, houseId, invitedUserData) => {
  try {
    if (!invitedUserData) {
      logger.error(`User ${userName} not found.`);
      throw new AppError({
        code: 'USERS_HOST_BADREQ',
        messageKey: 'addUserToHouse.userNotFoundError',
        httpStatus: 400,
      });
    }

    if (invitedUserData.houseId != 0) {
      logger.info(`User ${userName} already is housemate or host.`);
      throw new AppError({
        code: 'USERS_HOST_INMATE',
        messageKey: 'addUserToHouse.inmateOrHostError',
        httpStatus: 400,
      });
    }

    await saveNewHousemate(usersQueries, invitedUserData.userId, houseId, connection);

    await handleNotification({
      id: uuidv4(),
      category: 'usersActions',
      houseId,
      message: 'notifications.addedHouseMate',
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
