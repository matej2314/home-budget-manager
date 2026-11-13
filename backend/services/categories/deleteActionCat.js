import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import actionCatQueries from '../../database/transactionCategoriesQueries.js';
import { AppError } from '../../utils/errors/AppError.js';

const deleteActionCat = async (catName, catId) => {
    const connection = await pool.getConnection();

    try {

        const [rows] = await connection.query(
            'SELECT id, name FROM actionCategories WHERE name = ? OR id = ?',
            [catName, catId]
        );

        if (rows.length === 0) {
            throw new AppError({ code: 'CAT_1', messageKey: 'Transaction category not found.', httpStatus: 404 });
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
            throw new AppError({ code: 'CAT_2', messageKey: 'Failed to delete transaction category.', httpStatus: 404 });
        }

        return {
            messageKey: `Transaction category ${fetchedCatName} deleted correctly.`,
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`/actioncat/delete error: ${error}`);
        throw new AppError({ code: 'CATEGORI_F1', messageKey: `Failed to delete transaction category.`, httpStatus: 500 });
    } finally {
        if (connection) connection.release();
    }
};


export { deleteActionCat };
