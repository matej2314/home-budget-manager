import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import actionQueries from '../../database/transactionsQueries.js';

const getActionsCollection = async () => {

    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(actionQueries.allQuery);

        if (rows.length == 0) {
            logger.error(`Transactions not found.`);
            return {
                status: 'notfound',
                message: 'Transactions not found.',
            };
        };
        logger.info(`Transactions fetched correctly.`);
        return {
            status: 'success',
            message: 'Transactions fetched correctly.',
            actions: rows,
        };

    } catch (error) {
        logger.error(`getAllActions error: ${error}`);
        return { status: 'error', message: 'An error occured during deleting transaction.' };
    } finally {
        if (connection) connection.release();
    };
};

export { getActionsCollection };
