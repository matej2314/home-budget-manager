import { v4 as uuidv4 } from 'uuid';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import invitationQueries from '../../database/invitationsQueries.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { emitNotification } from '../notifications/emitNotification.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function rejectInvitation({ invitationId, hostId }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(invitationQueries.getInvitationQuery, [invitationId]);
    const invitationData = rows[0];

    if (!invitationData || invitationData.status !== 'new') {
      await connection.rollback();
      throw new AppError({
        code: 'INVITE_NOT_FOUND',
        messageKey: 'Invitation not found',
        httpStatus: 404,
      });
    }

    const [rejectResult] = await connection.query(invitationQueries.rejectQuery, [
      invitationStatus.rejected,
      invitationId,
    ]);
    if (rejectResult.affectedRows == 0) {
      await connection.rollback();
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

    await connection.commit();
    return { messageKey: 'Invitation successfully rejected.' };
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    logger.error(`error in rejectInvitation: ${error}`);
    throw new AppError({
      code: 'INVITE_REJECT_INTERNAL',
      messageKey: 'Internal server error',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
