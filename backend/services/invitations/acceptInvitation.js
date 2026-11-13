import { v4 as uuidv4 } from 'uuid';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import usersQueries from '../../database/usersQueries.js';
import invitationQueries from '../../database/invitationsQueries.js';
import { saveNewHousemate } from '../../utils/householdUtils/saveNewHousemate.js';
import { emitNotification } from '../notifications/emitNotification.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function acceptInvitation({ invitationId, invitedUserId, hostId }) {
  const connection = await pool.getConnection();
  try {
    const hostHouseId = await checkUserHouse(connection, hostId);
    if (!hostHouseId || !hostHouseId.houseId) {
      throw new AppError({
        code: 'INVITE_HOST_NO_HOUSE',
        messageKey: `You don't belong to any household`,
        httpStatus: 400,
      });
    }

    const houseId = hostHouseId.houseId;
    await saveNewHousemate(usersQueries, invitedUserId, houseId, connection);

    const [confirmInvitation] = await connection.query(invitationQueries.acceptQuery, [
      invitationStatus.accepted,
      invitationId,
      hostId,
    ]);
    if (confirmInvitation.affectedRows === 0) {
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
      message: 'notifications.addedHouseMate',
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
  } finally {
    connection.release();
  }
}
