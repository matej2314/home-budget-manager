import logger from '../../configs/logger.js';
import { AppError } from '../errors/AppError.js';

export const saveNewInmate = async (usersQueries, invitedUserId, hostHouseId, connection) => {
  try {
    const [addInmate] = await connection.query(usersQueries.inmateQuery, [1, 'inmate', invitedUserId]);
    if (addInmate.affectedRows == 1) {
      await connection.query(usersQueries.updatehouseIdHu, [hostHouseId, invitedUserId]);
      await connection.query(usersQueries.updateroleHu, ['inmate', invitedUserId]);
    }
    return { invitedUserId };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`error in saveNewInmate: ${error.message || error}`);
    throw new AppError({
      code: 'INMATE_SAVE_FAILED',
      messageKey: 'Failed to save new inmate.',
      httpStatus: 500,
    });
  }
};
