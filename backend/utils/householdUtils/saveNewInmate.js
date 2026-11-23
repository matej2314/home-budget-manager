import logger from '../../configs/logger.js';
import { AppError } from '../errors/AppError.js';
import {
  setUserInmateFlags,
  updateHouseholdUserHouseId,
  updateHouseholdUserRole,
} from '../../database/users.js';

export const saveNewInmate = async (invitedUserId, hostHouseId) => {
  try {
    await setUserInmateFlags(invitedUserId, { inmate: true, role: 'inmate' });
    await updateHouseholdUserHouseId(invitedUserId, hostHouseId);
    await updateHouseholdUserRole(invitedUserId, 'inmate');
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
