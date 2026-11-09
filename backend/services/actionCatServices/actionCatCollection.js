import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import actionCatQueries from '../../database/transactionCategoriesQueries.js';

const getActionCatColl = async () => {

    const connection = await pool.getConnection();

    try {
        const [categories] = await connection.query(actionCatQueries.collectionQuery);

        if (categories.length == 0) {
            logger.error('Transactions categories not found.');
            return {
                status: 'notfound',
                message: 'Transactions categories not found.',
            };
        };

        return {
            status: 'success',
            message: 'Transactions categories fetched correctly.',
            actionCategories: categories,
        };

    } catch (error) {
        logger.error('Failed to fetch transactions categories.', error);
        return {
            status: 'error',
            message: 'Internal server error.',
        };
    } finally {
        if (connection) connection.release();
    };
};

export { getActionCatColl };
