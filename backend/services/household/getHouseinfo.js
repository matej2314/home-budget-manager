import logger from '../../configs/logger.js';
import { findHouseholdById } from '../../database/households.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { AppError } from '../../utils/errors/AppError.js';

function formatCreatedAt(createdAt) {
  const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
  return d.toISOString().slice(0, 10);
}

export const getHouseInfo = async (userId) => {
  if (!userId) {
    logger.error('Enter correctly household data.');
    throw new AppError({ code: 'HOUSE_1', messageKey: 'Enter correctly data.', httpStatus: 400 });
  }

  try {
    const checkHouse = await checkUserHouse(userId);

    const householdId = checkHouse.houseId;

    const household = await findHouseholdById(householdId);

    if (!household) {
      logger.error('Household not found.');
      throw new AppError({ code: 'HOUSE_2', messageKey: 'Household not found.', httpStatus: 400 });
    }

    const basicData = [
      {
        houseId: household.houseId,
        houseName: household.houseName,
        initBudget: household.initBudget,
        createdAt: formatCreatedAt(household.createdAt),
      },
    ];

    logger.info(`Household data ${householdId} fetched successfully.`);
    return {
      messageKey: 'Household data fetched successfully.',
      info: basicData,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Fetching household data error: ${error.stack}`);
    throw new AppError({ code: 'HOUSE_3', messageKey: 'Failed to fetching household data.', httpStatus: 400 });
  }
};