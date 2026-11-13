import jwt from 'jsonwebtoken';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import houseQueries from '../../database/householdQueries.js';
import { setHostProps, setInmateProps } from '../../utils/dbUtils/modifyUsersProps.js';
import { AppError } from '../../utils/errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET;

function signRoleToken(userId, userName, newRole) {
  return jwt.sign({ id: userId, userName, role: newRole }, JWT_SECRET, { expiresIn: '24h' });
}

const addNewHouse = async (userId, userName, houseName, initBudget) => {
  const houseId = uuidv4();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingHouse] = await connection.query(houseQueries.checkQuery, [houseName]);

    if (existingHouse.length > 0) {
      const existingId = existingHouse[0].houseId;

      const [addmate] = await connection.query(houseQueries.mateQuery, [1, 'mate', userId]);

      if (addmate.affectedRows === 1) {
        setInmateProps(userId, existingId, connection);
      }

      logger.info(`Household ${houseName} already exists. User attributed as housemate.`);

      await connection.commit();
      const newRole = 'inmate';
      return {
        messageKey: 'userDashboard.assignedCorrectlyMessage',
        newRole,
        token: signRoleToken(userId, userName, newRole),
      };
    }

    const [addHouse] = await connection.query(houseQueries.addQuery, [
      houseId,
      userId,
      userName,
      houseName,
      initBudget,
    ]);

    if (addHouse.affectedRows === 1) {
      const [addHost] = await connection.query(houseQueries.hostQuery, [1, 'host', userId]);

      if (addHost.affectedRows === 1) {
        await setHostProps(userId, houseId, connection);
      }
    }

    await connection.commit();
    logger.info(`New household ${houseName} created.`);
    const newRole = 'host';
    return {
      messageKey: 'userDashboard.addedCorrectlyMessage',
      newRole,
      token: signRoleToken(userId, userName, newRole),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    await connection.rollback();
    logger.error(`Error adding new household: ${error.message}`);
    throw new AppError({ code: 'HOUSE_1', messageKey: 'Internal server error.', httpStatus: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export { addNewHouse };
