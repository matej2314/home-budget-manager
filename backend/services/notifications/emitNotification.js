import { saveNotification } from './saveNotification.js';
import { broadcastToHousehold } from '../../configs/websocketConfig.js';

export async function emitNotification({ id, category, houseId, message, extraData = {} }) {
  const data = { id, category, message, ...extraData };
  await saveNotification(id, category, JSON.stringify(data), houseId);
  await broadcastToHousehold(houseId, { type: 'notification', data });
}
