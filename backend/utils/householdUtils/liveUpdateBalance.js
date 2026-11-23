import logger from '../../configs/logger.js';
import { broadcastMessage, broadcastToHousehold } from '../../configs/websocketConfig.js';

/**
 * Skutek uboczny po udanej mutacji salda w database/ — bez SQL (R6 / D-3).
 */
export const liveUpdateBalance = async (houseId, userId, newBalance) => {
  try {
    await broadcastToHousehold(houseId, {
      type: 'balance_update',
      data: { houseId, newBalance },
    });
  } catch (error) {
    logger.error(`liveupdate websocket error: ${error.message}`);
    broadcastMessage(userId, {
      type: 'error',
      data: { message: 'Websocket error.' },
    });
  }
};
