const pool = require('../../database/db');
const actionQueries = require('../../database/transactionsQueries');
const checkHouse = require('../../utils/checkUserHouse');
const { checkIfAdded } = require('../../utils/checkIfAdded');
const logger = require('../../configs/logger');

const deleteAction = async (transactionId, userId) => {
    const connection = await pool.getConnection();

    try {
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

        const checkAction = await checkIfAdded(connection, transactionId, userId);

        if (!checkAction) {
            logger.error(`Użytkownik ${userId} próbuje usunąć cudzą transakcję.`);
            return {
                status: 'badreq',
                message: 'Usuwasz nie swoją transakcję!',
            };
        }

        const [result] = await connection.query(actionQueries.deleteQuery, [userId, houseId, transactionId]);

        if (result.affectedRows === 0) {
            logger.error(`Nie znaleziono transakcji ${transactionId} do usunięcia.`);
            return { status: 'notfound', message: 'Nie znaleziono transakcji.' };
        }

        logger.info(`Udało się usunąć transakcję ${transactionId}.`);
        return {
            status: 'success',
            message: `Transakcja ${transactionId} usunięta.`,
        };
    } catch (error) {
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
