const pool = require('../../database/db');
const logger = require('../../configs/logger');
const actionQueries = require('../../database/transactionsQueries');
const checkHouse = require('../../utils/checkUtils/checkUserHouse');


const getHouseActions = async (userId) => {
    const connection = await pool.getConnection();

    try {
        const houseData = await checkHouse(connection, userId);

        if (!houseData) {
            logger.error(`User ${userId} does not belong to any household.`);
            return {
                status: 'notfound',
                message: `User ${userId} does not belong to any household`,
            };
        }

        const houseId = houseData.houseId;
        const [rows] = await connection.query(actionQueries.getQuery, [houseId]);

        if (rows.length == 0) {
            logger.error(`Not found any transactions for household: ${houseId}`);
            return {
                status: 'notfound',
                message: 'Transactions not found.',
            };
        }
        logger.info(`Transactions for household fetched correctly.`);
        return {
            status: 'success',
            message: 'Transactions for household fetched correctly.',
            actions: rows,
        };
    } catch (error) {
        logger.error(`An error occured during fetching transactions for household: ${error.message}`);
        return {
            status: 'error',
            message: 'An error occured during fetching transactions for household.',
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getHouseActions };