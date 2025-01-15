const pool = require('../../database/db');
const logger = require('../../configs/logger');
const actionCatQueries = require('../../database/transactionCategoriesQueries');

const deleteActionCat = async (catName) => {
    const connection = await pool.getConnection();

    if (!catName || !catName.trim()) {
        logger.error('Brak nazwy kategorii do usunięcia.');
        return {
            status: 'badreq',
            message: 'Podaj poprawne dane dotyczące kategorii.',
        };
    };

    try {
        const [result] = await connection.query(actionCatQueries.deleteQuery, [catName]);

        if (result.affectedRows == 0) {
            logger.info(`Nie udało się usunąć kategorii transakcji ${catName}`);
            return { status: 'notfound', message: 'Nie udało się usunąć kategorii transakcji.' };
        };

        return {
            status: 'success',
            message: `Kategoria transakcji ${catName} usunięta poprawnie.`,
        };

    } catch (error) {
        logger.error(`Błąd w /actioncat/delete: ${error}`);
        return {
            status: 'error',
            message: `Błąd przetwarzania żądania.`,
        };
    } finally {
        if (connection) connection.release();
    };
};

module.exports = { deleteActionCat };
