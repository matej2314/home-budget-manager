import jwt from 'jsonwebtoken';
import logger from '../../configs/logger.js';
import {
  deleteHousehold,
  findHouseholdByName,
  listInmates,
} from '../../database/households.js';
import { deleteTransactionsByHouseId } from '../../database/transactions.js';
import { resetHostProps, resetInmatesProps } from '../../utils/dbUtils/modifyUsersProps.js';
import { AppError } from '../../utils/errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const deleteHouse = async (userId, userName, houseName) => {
  try {
    const ownership = await findHouseholdByName(houseName);

    if (!ownership) {
      logger.error('No permissions.');
      throw new AppError({
        code: 'HOUSE_1',
        messageKey: 'No permissions to delete household.',
        httpStatus: 403,
      });
    }
    const houseId = ownership.houseId;

    const result = await deleteHousehold(houseId, userId);

    if (result.count === 0) {
      logger.info('Household not found.');
      throw new AppError({
        code: 'HOUSE_2',
        messageKey: 'Household not found.',
        httpStatus: 400,
      });
    }

    if (result.count === 1) {
      await resetHostProps(userId);

      const inmates = await listInmates(houseId);

      for (const inmate of inmates) {
        await resetInmatesProps(inmate.userId);
      }

      await deleteTransactionsByHouseId(houseId);
      logger.info(`Household ${houseName} successfully deleted.`);
    }

    const newRole = 'user';
    return {
      messageKey: `Household ${houseName} deleted.`,
      newRole,
      token: jwt.sign({ id: userId, userName, role: newRole }, JWT_SECRET, { expiresIn: '24h' }),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Deleting household error: ${error.message}`);
    throw new AppError({
      code: 'HOUSE_3',
      messageKey: 'Failed to deleting household.',
      httpStatus: 400,
    });
  }
};