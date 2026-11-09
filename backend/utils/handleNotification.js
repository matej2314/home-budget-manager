import { saveNotification } from '../controllers/notificationController.js';
import { broadcastToHouseMates } from '../configs/websocketConfig.js';

const handleNotification = async ({ id, category, houseId, message, extraData = {} }) => {

    const data = {
        id,
        category,
        message,
        ...extraData,
    };

    await saveNotification(id, category, JSON.stringify(data), houseId);
    await broadcastToHouseMates(houseId, { type: 'notification', data })
};

export { handleNotification };
