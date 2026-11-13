import logger from '../../configs/logger.js';
import { AppError } from '../errors/AppError.js';

export const saveNewHousemate = async (usersQueries, invitedUserId, hostHouseId, connection) => {
  try {
    const [addMate] = await connection.query(usersQueries.mateQuery, [1, 'mate', invitedUserId]);
    if (addMate.affectedRows == 1) {
      await connection.query(usersQueries.updatehouseIdHu, [hostHouseId, invitedUserId]);
      await connection.query(usersQueries.updateroleHu, ['mate', invitedUserId]);
    }
    return { invitedUserId };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`error in saveNewHousemate: ${error.message || error}`);
    throw new AppError({
      code: 'HOUSEMATE_SAVE_FAILED',
      messageKey: 'Failed to save new housemate.',
      httpStatus: 500,
    });
  }
};
