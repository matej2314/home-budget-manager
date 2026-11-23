import logger from '../../configs/logger.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { AppError } from '../../utils/errors/AppError.js';
import { listNotificationsByHouse } from '../../database/notifications.js';

export async function getNoticesCollection(userId) {
  if (!userId) {
    throw new AppError({
      code: 'NOTICE_BAD_USER',
      messageKey: 'Incorrect input data.',
      httpStatus: 400,
    });
  }

  try {
    const checkHouse = await checkUserHouse(userId);
    if (!checkHouse) {
      logger.error(`User ${userId} does not belong to any household.`);
      throw new AppError({
        code: 'NOTICE_NO_HOUSE',
        messageKey: 'User does not belong to any household.',
        httpStatus: 403,
      });
    }

    const notifications = await listNotificationsByHouse(checkHouse.houseId);

    if (notifications.length === 0) {
      throw new AppError({
        code: 'NOTICE_NOT_FOUND',
        messageKey: 'Notifications not found.',
        httpStatus: 404,
      });
    }

    return {
      messageKey: 'Notifications fetched correctly.',
      notifications,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`ERROR in getNoticesCollection: ${error}`);
    throw new AppError({
      code: 'NOTICE_COLLECTION_INTERNAL',
      messageKey: 'Failed to fetch notifications.',
      httpStatus: 500,
    });
  }
}