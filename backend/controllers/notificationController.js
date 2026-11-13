import { runController } from '../utils/http/runController.js';
import { getNoticesCollection } from '../services/notifications/getNoticesCollection.js';
import { deleteNotification as deleteNotificationService } from '../services/notifications/deleteNotification.js';

export async function GetNoticesCollection(req, res) {
  return runController(res, () => getNoticesCollection(req.userId));
}

export async function deleteNotification(req, res) {
  return runController(res, () =>
    deleteNotificationService({ noticeId: req.body.noticeId, userId: req.userId }),
  );
}
