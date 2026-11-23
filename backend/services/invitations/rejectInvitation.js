import { v4 as uuidv4 } from 'uuid';
import logger from '../../configs/logger.js';
import { findInvitationById, updateInvitationStatus } from '../../database/invitations.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { emitNotification } from '../notifications/emitNotification.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function rejectInvitation({ invitationId, hostId: _hostId }) {
  try {
    const invitationData = await findInvitationById(invitationId);

    if (!invitationData || invitationData.status !== 'new') {
      throw new AppError({
        code: 'INVITE_NOT_FOUND',
        messageKey: 'Invitation not found',
        httpStatus: 404,
      });
    }

    const rejectResult = await updateInvitationStatus(invitationId, invitationStatus.rejected);
    if (rejectResult.count === 0) {
      throw new AppError({
        code: 'INVITE_REJECT_NOT_FOUND',
        messageKey: 'Invitation not found',
        httpStatus: 404,
      });
    }

    await emitNotification({
      id: uuidv4(),
      category: 'usersActions',
      houseId: invitationData.houseId,
      message: 'Rejected invitation of new user',
      extraData: { invitedUserId: invitationData.invitedUserId },
    });

    return { messageKey: 'Invitation successfully rejected.' };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`error in rejectInvitation: ${error}`);
    throw new AppError({
      code: 'INVITE_REJECT_INTERNAL',
      messageKey: 'Internal server error',
      httpStatus: 500,
    });
  }
}