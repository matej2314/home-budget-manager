import logger from '../../configs/logger.js';
import { listHousesWithMembers } from '../../database/households.js';
import { AppError } from '../../utils/errors/AppError.js';

/** As-is shape of legacy JOIN query (one row per household member). */
function flattenHousesWithMembers(houses) {
  const result = [];
  for (const h of houses) {
    for (const hu of h.householdUsers) {
      if (hu.houseId !== h.houseId) continue;
      result.push({
        houseId: h.houseId,
        houseName: h.houseName,
        userId: h.userId,
        userName: hu.userName,
        role: hu.role,
      });
    }
  }
  return result;
}

export const getHousesCollection = async () => {
  try {
    const houses = await listHousesWithMembers();
    const result = flattenHousesWithMembers(houses);

    if (result.length === 0) {
      logger.info('Households not found.');
      throw new AppError({ code: 'HOUSE_1', messageKey: 'Households not found.', httpStatus: 404 });
    }

    logger.info('Households fetched correctly.');
    return {
      messageKey: 'Households fetched correctly.',
      houses: result,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Fetching households error: ${error.stack}`);
    throw new AppError({ code: 'HOUSE_2', messageKey: 'Fetching households error.', httpStatus: 500 });
  }
};