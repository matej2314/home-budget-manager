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
            logger.error('Brak ID transakcji, którą chcesz usunąć.');
            return {
                status: 'badreq',
                message: 'Brak ID transakcji, którą chcesz usunąć',
            };
        }

        const houseData = await checkHouse(connection, userId);

        if (!houseData) {
            logger.error(`Użytkownik ${userId} nie należy do żadnego gospodarstwa.`);
            return { status: 'notfound', message: 'Użytkownik nie należy do żadnego gospodarstwa.' };
        }

        const houseId = houseData.houseId;

        const checkAction = await checkTransaction(connection, transactionId);

        if (!checkAction) {
            logger.error(`Użytkownik ${userId} próbuje usunąć cudzą transakcję.`);
            return {
                status: 'badreq',
                message: 'Usuwasz nie swoją transakcję!',
            };
        }

        const value = checkAction.value;

        const [result] = await connection.query(actionQueries.deleteQuery, [userId, houseId, transactionId]);

        if (result.affectedRows === 0) {
            logger.error(`Nie znaleziono transakcji ${transactionId} do usunięcia.`);
            return { status: 'notfound', message: 'Nie znaleziono transakcji.' };
        }
        await liveUpdateBalance('expense', value, houseId, userId, connection);

        await connection.commit();

        await broadcastToHouseMates(houseId, {
            type: 'notification',
            data: {
                category: 'transactions',
                action: 'deleteTransaction',
                message: 'Usunięto transakcję.',
                user: userId
            }
        });

        logger.info(`Udało się usunąć transakcję ${transactionId}.`);

        return {
            status: 'success',
            message: `Transakcja ${transactionId} usunięta.`,
        };
    } catch (error) {
        await connection.rollback();
        logger.error(`Błąd w deleteAction: ${error}`);
        return {
            status: 'error',
            message: 'Nie udało się usunąć transakcji.',
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { deleteAction };
