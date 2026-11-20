import logger from '../../configs/logger.js';
import { broadcastMessage } from '../../configs/websocketConfig.js';
import { v4 as uuidv4 } from 'uuid';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { AppError } from '../errors/AppError.js';

export const addUserByInmate = async (
  connection,
  invitingUserId,
  invitedUser,
  houseId,
  userName,
  invitingUserName,
) => {
  try {
    if (!invitedUser) {
      throw new AppError({
        code: 'USERS_INMATE_BADREQ',
        messageKey: 'addUserToHouse.invalidInputError',
        httpStatus: 400,
      });
    }

    if (invitedUser.houseId != 0) {
      throw new AppError({
        code: 'USERS_INMATE_ALREADY_IN_HOUSE',
        messageKey: 'addUserToHouse.inmateOrHostError',
        httpStatus: 400,
      });
    }

    const invitedUserId = invitedUser.userId;
    const [getHost] = await connection.query(
      'SELECT userId FROM householdUsers WHERE houseid=? AND role=?',
      [houseId, 'host'],
    );
    const hostId = getHost[0].userId;
    const invitationId = uuidv4();

    await connection.query(
      'INSERT INTO invitations (id, status, invitingUserId, invitedUserId, houseId, hostId) VALUES (?,?,?,?,?,?)',
      [invitationId, invitationStatus.new, invitingUserId, invitedUserId, houseId, hostId],
    );

    broadcastMessage(hostId, {
      type: 'invitation',
      data: {
        invitationId,
        invitingUser: invitingUserName,
        invitedUser: userName,
      },
    });

    return { messageKey: 'addUserToHouse.correctlyAddedByInmate' };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`addUserByInmate error: ${error}`);
    throw new AppError({
      code: 'USERS_INMATE_ERROR',
      messageKey: 'addUserToHouse.inviteUserInternalError',
      httpStatus: 500,
    });
  }
};
