import { broadcastToHousehold } from '../configs/websocketConfig.js';

export const handleBroadcastInitBudget = async (id, value, addedAt, validUntil, houseId) => {

    const data = {
        id,
        category: 'initial_budget',
        initBudget: value,
        budgetPeriod: `${addedAt} - ${validUntil}`,
        message: 'notifications.newInitBudget',
    };

    await broadcastToHousehold(houseId, {
        type: 'initial_budget',
        data
    });
};
