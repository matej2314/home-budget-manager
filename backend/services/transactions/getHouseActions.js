import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import actionQueries from '../../database/transactionsQueries.js';
import checkHouse from '../../utils/checkUtils/checkUserHouse.js';
import { AppError } from '../../utils/errors/AppError.js';

const getHouseActions = async (userId) => {
    const connection = await pool.getConnection();

    try {
        const houseData = await checkHouse(connection, userId);

        if (!houseData) {
            logger.error(`User ${userId} does not belong to any household.`);
            throw new AppError({ code: 'TRANSACT_F1', messageKey: `User ${userId} does not belong to any household`, httpStatus: 404 });
        }

        const houseId = houseData.houseId;
        const [rows] = await connection.query(actionQueries.getQuery, [houseId]);

        if (rows.length == 0) {
            logger.error(`Not found any transactions for household: ${houseId}`);
            throw new AppError({ code: 'TX_1', messageKey: 'Transactions not found.', httpStatus: 404 });
        }
        logger.info(`Transactions for household fetched correctly.`);
        return {
            messageKey: 'Transactions for household fetched correctly.',
            actions: rows,
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`An error occured during fetching transactions for household: ${error.message}`);
        throw new AppError({ code: 'TX_2', messageKey: 'An error occured during fetching transactions for household.', httpStatus: 500 });
    } finally {
        if (connection) connection.release();
    }
};

export { getHouseActions };
