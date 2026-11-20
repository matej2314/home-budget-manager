import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { addUserByHost } from '../../utils/householdUtils/addUserByHost.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { addUserByInmate } from '../../utils/householdUtils/addUserByInmate.js';
import { invitedUserData } from '../../utils/householdUtils/getInvitedUserData.js';
import { AppError } from '../../utils/errors/AppError.js';

const addUserToHouse = async (userId, userName, invitingUserName, role) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const invitedUser = await invitedUserData(connection, userName);
    const getHouseId = await checkUserHouse(connection, userId);
    const houseId = getHouseId.houseId;

    if (!invitedUser || !houseId) {
      throw new AppError({
        code: 'USER_1',
        messageKey: 'addUserToHouse.invalidInputError',
        httpStatus: 400,
      });
    }

    if (role === 'host') {
      const addByHost = await addUserByHost(connection, userName, houseId, invitedUser);
      await connection.commit();
      return { messageKey: addByHost.messageKey };
    }

    if (role === 'inmate') {
      const addByInmate = await addUserByInmate(
        connection,
        userId,
        invitedUser,
        houseId,
        userName,
        invitingUserName,
      );
      await connection.commit();
      return { messageKey: addByInmate.messageKey };
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    logger.error(`Error in addUserToHouse: ${error}`);
    throw new AppError({
      code: 'USER_3',
      messageKey: 'addUserToHouse.inviteUserInternalError',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
};

export { addUserToHouse };
