import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { broadcastMessage } from '../../configs/websocketConfig.js';
import { AppError } from '../../utils/errors/AppError.js';
import { createMessage, findUserIdByName } from '../../database/messages.js';

const sendNewMessage = async (userId, userName, recipientName, content) => {
  const id = uuidv4();

  try {
    const recipientId = await findUserIdByName(recipientName);

    if (recipientId == null) {
      throw new AppError({ code: 'MSG_1', messageKey: 'Sender not found.', httpStatus: 400 });
    }

    await createMessage({
      id,
      senderId: userId,
      recipientId,
      content,
      is_read: false,
    });

    try {
      broadcastMessage(recipientId, {
        type: 'newMessage',
        data: {
          id,
          sender: userName,
          recipient: recipientName,
          message: content,
          date: new Date().toISOString(),
          readed: 0,
        },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Failed to send message to receiver.', error);
    }

    return {
      messageKey: 'sendMessage.successMessage',
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Sending message error: ${error}`);
    throw new AppError({ code: 'MSG_3', messageKey: 'sendMessage.errorMessage', httpStatus: 500 });
  }
};

export { sendNewMessage };