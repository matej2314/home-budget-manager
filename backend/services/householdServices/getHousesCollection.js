import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import houseQueries from '../../database/householdQueries.js';

export const getHousesCollection = async () => {
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
