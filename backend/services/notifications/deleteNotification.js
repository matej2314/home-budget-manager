import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { checkNotice } from '../../utils/checkUtils/checkNotice.js';
import { AppError } from '../../utils/errors/AppError.js';
import { deleteNotification as deleteNotificationRow } from '../../database/notifications.js';

export async function deleteNotification({ noticeId, userId }) {
  if (!noticeId) {
    throw new AppError({
      code: 'NOTICE_DELETE_BAD_INPUT',
      messageKey: 'Invalid input data.',
      httpStatus: 400,
    });
  }

  const noticeExist = await checkNotice(noticeId);
  if (!noticeExist) {
    throw new AppError({
      code: 'NOTICE_DELETE_NOT_FOUND',
      messageKey: 'Notification not found.',
      httpStatus: 404,
    });
  }

  try {
    const checkHouse = await checkUserHouse(userId);
    if (!checkHouse) {
      throw new AppError({
        code: 'NOTICE_DELETE_NO_HOUSE',
        messageKey: 'User does not belong to any household',
        httpStatus: 403,
      });
    }

    const deleteResult = await deleteNotificationRow(noticeId, checkHouse.houseId);
    if (deleteResult.count === 0) {
      throw new AppError({
        code: 'NOTICE_DELETE_FAILED',
        messageKey: 'Failed to delete notification',
        httpStatus: 404,
      });
    }

    return { messageKey: 'Notification removed correctly' };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError({
      code: 'NOTICE_DELETE_INTERNAL',
      messageKey: 'Failed to delete notification.',
      httpStatus: 500,
    });
  }
}