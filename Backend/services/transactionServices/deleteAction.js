const pool = require('../../database/db');
const actionQueries = require('../../database/transactionsQueries');
const checkHouse = require('../../utils/checkUserHouse');
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
        };
        const houseData = await checkHouse(connection, userId);

        if (!houseData) {
            logger.error(`Użytkownik ${userId} nie należy do żadnego gospodarstwa`);
            return { status: 'notfound', message: 'Użytkownik nie należy do żadnego gospodarstwa.' };
        };

        const houseId = houseData.houseId;

        const [result] = await connection.query(actionQueries.deleteQuery, [userId, houseId, transactionId]);

        if (result.affectedRows == 0) {
            logger.error('Nie znaleziono transakcji');
            return { status: 'notfound', message: 'Nie znaleziono transakcji.' };
        };
        logger.info(`Udało się usunąć transakcję ${transactionId}`);
        return {
            status: 'success',
            message: `Transakcja ${transactionId} usunięta.`
        };
    } catch (error) {
        logger.error(`Błąd w deleteAction: ${error}`);
        return {
            status: 'error',
            message: 'Nie udało się usunąć transakcji.',
        };
    } finally {
        connection.release();
    };
};

module.exports = { deleteAction };