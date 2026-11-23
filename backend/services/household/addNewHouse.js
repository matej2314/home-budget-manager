import jwt from 'jsonwebtoken';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import {
  createHousehold,
  findHouseholdByName,
} from '../../database/households.js';
import { setUserInmateFlags, setUserHostFlags } from '../../database/users.js';
import { setHostProps, setInmateProps } from '../../utils/dbUtils/modifyUsersProps.js';
import { AppError } from '../../utils/errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET;

function signRoleToken(userId, userName, newRole) {
  return jwt.sign({ id: userId, userName, role: newRole }, JWT_SECRET, { expiresIn: '24h' });
}

const addNewHouse = async (userId, userName, houseName, initBudget) => {
  const houseId = uuidv4();

  try {
    const existingHouse = await findHouseholdByName(houseName);

    if (existingHouse) {
      const existingId = existingHouse.houseId;

      await setUserInmateFlags(userId, { inmate: true, role: 'inmate' });
      await setInmateProps(userId, existingId);

      logger.info(`Household ${houseName} already exists. User attributed as inmate.`);

      const newRole = 'inmate';
      return {
        messageKey: 'userDashboard.assignedCorrectlyMessage',
        newRole,
        token: signRoleToken(userId, userName, newRole),
      };
    }

    await createHousehold({
      houseId,
      userId,
      userName,
      houseName,
      initBudget,
    });

    await setUserHostFlags(userId, { host: true, role: 'host' });
    await setHostProps(userId, houseId);

    logger.info(`New household ${houseName} created.`);
    const newRole = 'host';
    return {
      messageKey: 'userDashboard.addedCorrectlyMessage',
      newRole,
      token: signRoleToken(userId, userName, newRole),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Error adding new household: ${error.message}`);
    throw new AppError({ code: 'HOUSE_1', messageKey: 'Internal server error.', httpStatus: 500 });
  }
};

export { addNewHouse };