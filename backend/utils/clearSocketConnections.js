import logger from '../configs/logger.js';
import { clearAllConnections } from '../database/sockets.js';

const clearSocketConnections = async () => {
  try {
    const result = await clearAllConnections();

    if (result.count >= 1) {
      logger.info('All websocket connections were deleted correctly.');
      return true;
    }
    logger.info('Failed to delete websocket connections.');
    return null;
  } catch (error) {
    logger.error(`clearSocketConnections error: ${error}`);
  }
};

export { clearSocketConnections };
