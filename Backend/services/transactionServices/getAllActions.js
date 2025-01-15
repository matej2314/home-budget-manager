const pool = require('../../database/db');
const actionQueries = require('../../database/transactionsQueries');
const logger = require('../../configs/logger');

const getAllActions = async () => {
    
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(actionQueries.allQuery);

        if (rows.length == 0) {
            logger.error(`Nie znaleziono żadnych transakcji.`);
            return {
                status: 'notfound',
                message: 'Brak transakcji',
            };
        };
        logger.info(`Wszystkie transakcje pobrano poprawnie.`);
        return {
            status: 'success',
            message: 'Transakcje pobrane poprawnie',
            actions: rows,
        };

    } catch (error) {
        logger.error(`Błąd w getAllActions: ${error}`);
        return { status: 'error', message: 'Błąd podczas pobierania transakcji.' };
    } finally {
        if (connection) connection.release();
    };
};

module.exports = { getAllActions };