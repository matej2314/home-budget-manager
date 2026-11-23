import { v4 as uuidv4 } from 'uuid';
import logger from '../../configs/logger.js';
import { updateInvitationStatus } from '../../database/invitations.js';
import { saveNewInmate } from '../../utils/householdUtils/saveNewInmate.js';
import { emitNotification } from '../notifications/emitNotification.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function acceptInvitation({ invitationId, invitedUserId, hostId }) {
  try {
    const hostHouseId = await checkUserHouse(hostId);
    if (!hostHouseId || !hostHouseId.houseId) {
      throw new AppError({
        code: 'INVITE_HOST_NO_HOUSE',
        messageKey: `You don't belong to any household`,
        httpStatus: 400,
      });
    }

    const houseId = hostHouseId.houseId;
    await saveNewInmate(invitedUserId, houseId);

    const confirmInvitation = await updateInvitationStatus(
      invitationId,
      invitationStatus.accepted,
      hostId,
    );
    if (confirmInvitation.count === 0) {
      throw new AppError({
        code: 'INVITE_ACCEPT_FAILED',
        messageKey: 'Failed to accept invitation.',
        httpStatus: 500,
      });
    }

    await emitNotification({
      id: uuidv4(),
      category: 'usersActions',
      houseId,
      message: 'notifications.addedInmate',
    });

    return {
      messageKey: `Invitation of user ${invitedUserId} correctly accepted.`,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`acceptInvitation error: ${error}`);
    throw new AppError({
      code: 'INVITE_ACCEPT_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  }
}