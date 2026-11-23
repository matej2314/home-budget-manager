import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';
import { deleteMessageById } from '../../database/messages.js';

const delMessage = async (messageId) => {
  try {
    const result = await deleteMessageById(messageId);

    if (result.count === 0) {
      throw new AppError({ code: 'MSG_1', messageKey: 'Messages not found.', httpStatus: 404 });
    }
    logger.info(`Delete message: ${messageId}`);
    return { messageKey: `Message deleted correctly.` };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Deleting message error: ${error}`);
    throw new AppError({ code: 'MSG_2', messageKey: 'Internal server error.', httpStatus: 500 });
  }
};

export { delMessage };