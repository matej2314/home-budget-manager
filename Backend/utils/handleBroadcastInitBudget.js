const { broadcastToHouseMates } = require("../configs/websocketConfig");

exports.handleBroadcastInitBudget = async (id, value, addedAt, validUntil, houseId) => {

    const data = {
        id,
        category: 'initial_budget',
        initBudget: value,
        budgetPeriod: `${addedAt} - ${validUntil}`,
        message: 'New monthly budget declared!',
    };

    await broadcastToHouseMates(houseId, {
        type: 'initial_budget',
        data
    });
};
