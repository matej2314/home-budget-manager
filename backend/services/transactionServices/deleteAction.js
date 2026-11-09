import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import actionQueries from '../../database/transactionsQueries.js';
import checkHouse from '../../utils/checkUtils/checkUserHouse.js';
import { checkTransaction } from '../../utils/checkUtils/checkTransaction.js';
import { liveUpdateBalance } from '../../utils/householdUtils/liveUpdateBalance.js';
import { handleNotification } from '../../utils/handleNotification.js';

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

        const id = uuidv4();

        await handleNotification({
            id,
            category: 'transactions',
            houseId,
            message: 'notifications.deletedAction',
            extraData: {
                user: userId,
                action: 'deleteTransaction',
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

export { deleteAction };
