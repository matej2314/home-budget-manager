import { findNotificationById } from '../../database/notifications.js';

const checkNotice = async (noticeId) => {
  const result = await findNotificationById(noticeId);
  return result ? { id: result.id } : null;
};

export { checkNotice };
