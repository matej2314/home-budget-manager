const pool = require('../../database/db');
const logger = require('../../configs/logger');
const actionCatQueries = require('../../database/transactionCategoriesQueries');

const deleteActionCat = async (catName, catId) => {
    const connection = await pool.getConnection();

    try {
        
        const [rows] = await connection.query(
            'SELECT id, name FROM actionCategories WHERE name = ? OR id = ?',
            [catName, catId]
        );

        if (rows.length === 0) {
            return { status: 'notfound', message: 'Kategoria nie została znaleziona.' };
        }

        const fetchedCatName = rows[0].name;

        let query = actionCatQueries.deleteQuery;
        const params = [];

        if (catName?.trim()) {
            query += ' WHERE name = ?';
            params.push(catName);
        }

        if (catId) {
            query += params.length ? ' OR id = ?' : ' WHERE id = ?';
            params.push(catId);
        }

        const [result] = await connection.query(query, params);

        if (result.affectedRows === 0) {
            logger.info(`Nie udało się usunąć kategorii transakcji ${fetchedCatName}`);
            return { status: 'notfound', message: 'Nie udało się usunąć kategorii transakcji.' };
        }

        return {
            status: 'success',
            message: `Kategoria transakcji ${fetchedCatName} została poprawnie usunięta.`,
        };
    } catch (error) {
        logger.error(`Błąd w /actioncat/delete: ${error}`);
        return {
            status: 'error',
            message: `Nie udało się usunąć kategorii.`,
        };
    } finally {
        if (connection) connection.release();
    }
};


module.exports = { deleteActionCat };
