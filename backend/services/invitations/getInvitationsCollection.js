import logger from '../../configs/logger.js';
import { listInvitationsCollection } from '../../database/invitations.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function getInvitationsCollection(hostId) {
  try {
    if (!hostId) {
      throw new AppError({
        code: 'INVITE_COLLECTION_NO_HOST',
        messageKey: 'Incorrect input data.',
        httpStatus: 400,
      });
    }
    const invitations = await listInvitationsCollection(invitationStatus.new, hostId);
    return { messageKey: 'Invitations fetched correctly.', invitations };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`getInvitationsCollection error: ${error}`);
    throw new AppError({
      code: 'INVITE_COLLECTION_INTERNAL',
      messageKey: 'Internal server error',
      httpStatus: 500,
    });
  }
}
