import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import houseQueries from '../../database/householdQueries.js';
import { AppError } from '../../utils/errors/AppError.js';

export const getHousesCollection = async () => {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute(houseQueries.getAllHousesQuery);

        if (result.length === 0) {
            logger.info('Households not found.');
            throw new AppError({ code: 'HOUSE_1', messageKey: 'Households not found.', httpStatus: 404 });
        }

        logger.info('Households fetched correctly.');
        return {
            messageKey: 'Households fetched correctly.',
            houses: result,
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`Fetching households error: ${error.stack}`);
        throw new AppError({ code: 'HOUSE_2', messageKey: 'Fetching households error.', httpStatus: 500 });
    } finally {
        if (connection) connection.release();
    }
};
