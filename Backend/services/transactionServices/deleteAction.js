const pool = require('../../database/db');
const logger = require('../../configs/logger');
const actionQueries = require('../../database/transactionsQueries');
const checkHouse = require('../../utils/checkUtils/checkUserHouse');
const { checkTransaction } = require('../../utils/checkUtils/checkTransaction');
const { liveUpdateBalance } = require('../../utils/householdUtils/liveUpdateBalance');
const { broadcastToHouseMates } = require('../../configs/websocketConfig.js');

const deleteAction = async (transactionId, userId) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if (!transactionId) {
            logger.error('Transaction ID not found.');
            return {
                status: 'badreq',
                message: 'Invalid input data.',
            };
        }

        const houseData = await checkHouse(connection, userId);

        if (!houseData) {
            logger.error(`User ${userId} does not belong to any household.`);
            return { status: 'notfound', message: 'User does not belong to any household.' };
        }

        const houseId = houseData.houseId;

        const checkAction = await checkTransaction(connection, transactionId);

        if (!checkAction) {
            logger.error(`User ${userId} tries to delete someone else's transaction.`);
            return {
                status: 'badreq',
                message: 'You are deleting a transaction that is not yours!',
            };
        }

        const value = checkAction.value;

        const [result] = await connection.query(actionQueries.deleteQuery, [userId, houseId, transactionId]);

        if (result.affectedRows === 0) {
            logger.error(`Transaction ${transactionId} not found.`);
            return { status: 'notfound', message: 'Transaction not found.' };
        }
        await liveUpdateBalance('expense', value, houseId, userId, connection);

        await connection.commit();

        await broadcastToHouseMates(houseId, {
            type: 'notification',
            data: {
                category: 'transactions',
                action: 'deleteTransaction',
                message: 'Transaction deleted successfully.',
                user: userId
            }
        });

        logger.info(`Transaction ${transactionId} deleted correctly.`);

        return {
            status: 'success',
            message: `Transaction ${transactionId} deleted correctly.`,
        };
    } catch (error) {
        await connection.rollback();
        logger.error(`deleteAction error: ${error}`);
        return {
            status: 'error',
            message: 'Failed to deleting transaction.',
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { deleteAction };
