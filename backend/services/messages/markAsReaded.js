import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';
import { markMessageRead } from '../../database/messages.js';

const markAsReaded = async (messageId, userId) => {
  try {
    const result = await markMessageRead(messageId, userId);

    if (result.count === 0) {
      logger.info('Messages not found.');
      throw new AppError({ code: 'MSG_1', messageKey: 'Messages not found.', httpStatus: 404 });
    }

    return {
      messageKey: `Message status updated correctly.`,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`markMessage error: ${error}`);
    throw new AppError({ code: 'MSG_2', messageKey: 'Internal server error.', httpStatus: 500 });
  }
};

export { markAsReaded };