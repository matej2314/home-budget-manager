import jwt from 'jsonwebtoken';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import houseQueries from '../../database/householdQueries.js';
import { resetHostProps, resetInmatesProps } from '../../utils/dbUtils/modifyUsersProps.js';
import { AppError } from '../../utils/errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const deleteHouse = async (userId, userName, houseName) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [ownership] = await connection.query(houseQueries.ownershipQuery, [houseName]);

    if (ownership.length === 0) {
      logger.error('No permissions.');
      await connection.rollback();
      throw new AppError({
        code: 'HOUSE_1',
        messageKey: 'No permissions to delete household.',
        httpStatus: 403,
      });
    }
    const houseId = ownership[0].houseId;

    const [result] = await connection.query(houseQueries.deleteQuery, [houseId, userId]);

    if (result.affectedRows == 0) {
      logger.info('Household not found.');
      await connection.rollback();
      throw new AppError({
        code: 'HOUSE_2',
        messageKey: 'Household not found.',
        httpStatus: 400,
      });
    }

    if (result.affectedRows == 1) {
      await resetHostProps(userId, connection);

      const [inmates] = await connection.query(houseQueries.selectInmates, [houseId]);

      for (const inmate of inmates) {
        await resetInmatesProps(inmate.userId, connection);
      }

      await connection.query(houseQueries.deleteHouseActions, [houseId]);
      logger.info(`Household ${houseName} successfully deleted.`);
    }

    await connection.commit();

    const newRole = 'user';
    return {
      messageKey: `Household ${houseName} deleted.`,
      newRole,
      token: jwt.sign({ id: userId, userName, role: newRole }, JWT_SECRET, { expiresIn: '24h' }),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Deleting household error: ${error.message}`);
    await connection.rollback();
    throw new AppError({
      code: 'HOUSE_3',
      messageKey: 'Failed to deleting household.',
      httpStatus: 400,
    });
  } finally {
    if (connection) connection.release();
  }
};
