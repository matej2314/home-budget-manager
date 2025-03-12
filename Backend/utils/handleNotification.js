const { saveNotification } = require('../controllers/notificationController');
const { broadcastToHouseMates } = require('../configs/websocketConfig');

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

module.exports = { handleNotification };