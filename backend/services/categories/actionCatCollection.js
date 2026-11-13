import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import actionCatQueries from '../../database/transactionCategoriesQueries.js';
import { AppError } from '../../utils/errors/AppError.js';

const getActionCatColl = async () => {

    const connection = await pool.getConnection();

    try {
        const [categories] = await connection.query(actionCatQueries.collectionQuery);

        if (categories.length == 0) {
            logger.error('Transactions categories not found.');
            throw new AppError({ code: 'CAT_1', messageKey: 'Transactions categories not found.', httpStatus: 404 });
        };

        return {
            messageKey: 'Transactions categories fetched correctly.',
            actionCategories: categories,
        };

    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error('Failed to fetch transactions categories.', error);
        throw new AppError({ code: 'CAT_2', messageKey: 'Internal server error.', httpStatus: 500 });
    } finally {
        if (connection) connection.release();
    };
};

export { getActionCatColl };
