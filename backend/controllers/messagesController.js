import { runController } from '../utils/http/runController.js';
import { AppError } from '../utils/errors/AppError.js';
import { sendNewMessage } from '../services/messages/sendNewMessage.js';
import { markAsReaded } from '../services/messages/markAsReaded.js';
import { delMessage } from '../services/messages/deleteMessage.js';

export async function sendMessage(req, res) {
  const userId = req.userId;
  const userName = req.userName;
  const { recipientName, content } = req.body;
  return runController(res, async () => {
    if (!recipientName || !content) {
      throw new AppError({
        code: 'MSG_CTRL_INPUT',
        messageKey: 'Enter required message data.',
        httpStatus: 400,
      });
    }
    return sendNewMessage(userId, userName, recipientName, content);
  });
}

export async function markMessage(req, res) {
  const messageId = req.body.messageId;
  const userId = req.userId;
  return runController(res, async () => {
    if (!messageId) {
      throw new AppError({
        code: 'MSG_CTRL_MARK_INPUT',
        messageKey: 'Enter correctly message data.',
        httpStatus: 400,
      });
    }
    return markAsReaded(messageId, userId);
  });
}

export async function deleteMessage(req, res) {
  const { messageId } = req.body;
  return runController(res, async () => {
    if (!messageId) {
      throw new AppError({
        code: 'MSG_CTRL_DEL_INPUT',
        messageKey: 'Point out the message!',
        httpStatus: 400,
      });
    }
    return delMessage(messageId);
  });
}
