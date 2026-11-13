import { saveNotification } from './saveNotification.js';
import { broadcastToHouseMates } from '../../configs/websocketConfig.js';

export async function emitNotification({ id, category, houseId, message, extraData = {} }) {
  const data = { id, category, message, ...extraData };
  await saveNotification(id, category, JSON.stringify(data), houseId);
  await broadcastToHouseMates(houseId, { type: 'notification', data });
}
