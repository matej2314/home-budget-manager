import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import invitationQueries from '../../database/invitationsQueries.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function getInvitationsCollection() {
  const connection = await pool.getConnection();
  try {
    const [invitations] = await connection.query(
      invitationQueries.invitationsCollectionQuery,
      [invitationStatus.new],
    );
    return { messageKey: 'Invitations fetched correctly.', invitations };
  } catch (error) {
    logger.error(`getInvitationsCollection error: ${error}`);
    throw new AppError({
      code: 'INVITE_COLLECTION_INTERNAL',
      messageKey: 'Internal server error',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
