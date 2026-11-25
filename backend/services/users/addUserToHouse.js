import logger from '../../configs/logger.js';
import { addUserByHost } from '../../utils/householdUtils/addUserByHost.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { addUserByInmate } from '../../utils/householdUtils/addUserByInmate.js';
import { invitedUserData } from '../../utils/householdUtils/getInvitedUserData.js';
import { AppError } from '../../utils/errors/AppError.js';
import { sendInvitationEmail } from '../invitations/sendInvitationEmail.js';

const addUserToHouse = async (userId, userName, invitingUserName, role) => {
  try {
    const invitedUser = await invitedUserData(userName);
    const getHouseId = await checkUserHouse(userId);
    const houseId = getHouseId.houseId;

    if (!invitedUser || !houseId) {
      throw new AppError({
        code: 'USER_1',
        messageKey: 'addUserToHouse.invalidInputError',
        httpStatus: 400,
      });
    }

    if (role === 'host') {
      const addByHost = await addUserByHost(userName, houseId, invitedUser);
      await sendInvitationEmail({
        recipientUserId: invitedUser.userId,
        houseId,
        invitingUserName,
        templateId: 'T-cand-host-added',
      });
      return { messageKey: addByHost.messageKey };
    }

    if (role === 'inmate') {
      const addByInmate = await addUserByInmate(
        userId,
        invitedUser,
        houseId,
        userName,
        invitingUserName,
      );
      await sendInvitationEmail({
        recipientUserId: invitedUser.userId,
        houseId,
        invitingUserName,
        templateId: 'T-cand-inmate-pending',
      });
      if (addByInmate.hostId) {
        await sendInvitationEmail({
          recipientUserId: addByInmate.hostId,
          houseId,
          invitingUserName,
          templateId: 'T-host-inmate-pending',
        });
      }
      return { messageKey: addByInmate.messageKey };
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Error in addUserToHouse: ${error}`);
    throw new AppError({
      code: 'USER_3',
      messageKey: 'addUserToHouse.inviteUserInternalError',
      httpStatus: 500,
    });
  }
};

export { addUserToHouse };