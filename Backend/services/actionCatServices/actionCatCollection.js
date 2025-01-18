const pool = require('../../database/db');
const logger = require('../../configs/logger');
const actionCatQueries = require('../../database/transactionCategoriesQueries');

const getActionCatColl = async () => {

    const connection = await pool.getConnection();

    try {
        const [categories] = await connection.query(actionCatQueries.collectionQuery);

        if (categories.length == 0) {
            logger.error('Nie znaleziono kategorii transakcji w bazie danych.');
            return {
                status: 'notfound',
                message: 'Nie znaleziono kategorii transakcji.',
            };
        };

        return {
            status: 'success',
            message: 'Kategorie transakcji pobrane poprawnie.',
            actionCategories: categories,
        };

    } catch (error) {
        logger.error('Nie udało się pobrać kategorii transakcji.', error);
        return {
            status: 'error',
            message: 'Błąd przetwarzania żądania.',
        };
    } finally {
        if (connection) connection.release();
    };
};

module.exports = { getActionCatColl };