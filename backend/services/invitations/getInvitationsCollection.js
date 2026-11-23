import logger from '../../configs/logger.js';
import { listInvitationsCollection } from '../../database/invitations.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function getInvitationsCollection() {
  try {
    const invitations = await listInvitationsCollection(invitationStatus.new);
    return { messageKey: 'Invitations fetched correctly.', invitations };
  } catch (error) {
    logger.error(`getInvitationsCollection error: ${error}`);
    throw new AppError({
      code: 'INVITE_COLLECTION_INTERNAL',
      messageKey: 'Internal server error',
      httpStatus: 500,
    });
  }
}