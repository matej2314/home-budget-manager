import logger from '../../configs/logger.js';
import {
  deleteTransactionsByUserId,
  setUserInmateFlags,
  updateHouseholdUserHouseId,
  updateHouseholdUserRole,
} from '../../database/users.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { v4 as uuidv4 } from 'uuid';
import { handleNotification } from '../../utils/handleNotification.js';
import { AppError } from '../../utils/errors/AppError.js';

const deleteInhabitant = async (inhabitantId) => {
  try {
    const inhabitantHouse = await checkUserHouse(inhabitantId);

    const inhabitantHouseId = inhabitantHouse.houseId;

    const deleteHouseIdHu = await updateHouseholdUserHouseId(inhabitantId, null);

    if (deleteHouseIdHu.count !== 1) {
      logger.error(`Failed to update houseId for user: ${inhabitantId}`);
    }

    const delUserActions = await deleteTransactionsByUserId(inhabitantId);

    if (delUserActions.count === 0) {
      logger.error(`Failed to delete transactions of user: ${inhabitantId}`);
    }

    const changeRoleHu = await updateHouseholdUserRole(inhabitantId, 'user');

    if (changeRoleHu.count !== 1) {
      logger.error(`Failed to change role for user: ${inhabitantId}`);
    }

    await setUserInmateFlags(inhabitantId, { inmate: false, role: 'user' });

    const id = uuidv4();

    await handleNotification({
      id,
      category: 'usersActions',
      houseId: inhabitantHouseId,
      message: 'notifications.deletedInmate',
    });
    return {
      messageKey: 'Inmate deleted correctly.',
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Failed to deleting inmate: ${error.message}`);
    throw new AppError({ code: 'USER_1', messageKey: 'Failed to delete inmate.', httpStatus: 500 });
  }
};

export { deleteInhabitant };