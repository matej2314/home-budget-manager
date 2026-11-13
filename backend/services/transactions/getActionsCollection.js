import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import actionQueries from '../../database/transactionsQueries.js';
import { AppError } from '../../utils/errors/AppError.js';

const getActionsCollection = async () => {

    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(actionQueries.allQuery);

        if (rows.length == 0) {
            logger.error(`Transactions not found.`);
            throw new AppError({ code: 'TX_1', messageKey: 'Transactions not found.', httpStatus: 404 });
        };
        logger.info(`Transactions fetched correctly.`);
        return {
            messageKey: 'Transactions fetched correctly.',
            actions: rows,
        };

    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`getAllActions error: ${error}`);
        throw new AppError({ code: 'TX_2', messageKey: 'An error occured during deleting transaction.', httpStatus: 500 });
    } finally {
        if (connection) connection.release();
    };
};

export { getActionsCollection };
