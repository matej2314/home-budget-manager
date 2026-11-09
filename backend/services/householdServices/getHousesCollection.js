const pool = require('../../database/db');
const logger = require('../../configs/logger');
const houseQueries = require('../../database/householdQueries');

exports.getHousesCollection = async () => {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute(houseQueries.getAllHousesQuery);

        if (result.length === 0) {
            logger.info('Households not found.');
            return { status: 'error', message: 'Households not found.' };
        }

        logger.info('Households fetched correctly.');
        return {
            status: 'success',
            message: 'Households fetched correctly.',
            houses: result,
        };
    } catch (error) {
        logger.error(`Fetching households error: ${error.stack}`);
        return { status: 'error', message: 'Fetching households error.' };
    } finally {
        if (connection) connection.release();
    }
};