import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';
import { createNotification } from '../../database/notifications.js';

export async function saveNotification(id, category, noticeData, houseId) {
  if (!category || !noticeData || !houseId) {
    throw new AppError({
      code: 'NOTICE_INVALID_INPUT',
      messageKey: 'Invalid input data.',
      httpStatus: 400,
    });
  }

  try {
    await createNotification({ id, category, noticeData, houseId });
    return { messageKey: 'Notification saved correctly.' };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`saveNotification error: ${error}`);
    throw new AppError({
      code: 'NOTICE_SAVE_INTERNAL',
      messageKey: 'Failed to save notification.',
      httpStatus: 500,
    });
  }
}
