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
            return { status: 'notfound', message: 'Transaction category not found.' };
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
            logger.info(`Failed to delete transaction category: ${fetchedCatName}`);
            return { status: 'notfound', message: 'Failed to delete transaction category.' };
        }

        return {
            status: 'success',
            message: `Transaction category ${fetchedCatName} deleted correctly.`,
        };
    } catch (error) {
        logger.error(`/actioncat/delete error: ${error}`);
        return {
            status: 'error',
            message: `Failed to delete transaction category.`,
        };
    } finally {
        if (connection) connection.release();
    }
};


module.exports = { deleteActionCat };
