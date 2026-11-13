import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import houseQueries from '../../database/householdQueries.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { AppError } from '../../utils/errors/AppError.js';

export const getHouseInfo = async (userId) => {
    if (!userId) {
        logger.error('Enter correctly household data.');
        throw new AppError({ code: 'HOUSE_1', messageKey: 'Enter correctly data.', httpStatus: 400 });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const checkHouse = await checkUserHouse(connection, userId);

        const householdId = checkHouse.houseId;

        const [basicData] = await connection.execute(houseQueries.dataQuery, [householdId]);

        if (basicData.length === 0) {
            logger.error('Household not found.');
            throw new AppError({ code: 'HOUSE_2', messageKey: 'Household not found.', httpStatus: 400 });
        }

        await connection.commit();

        logger.info(`Household data ${householdId} fetched successfully.`);
        return {
            messageKey: 'Household data fetched successfully.',
            info: basicData,
            stats: statsData,
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        await connection.rollback();
        logger.error(`Fetching household data error: ${error.stack}`);
        throw new AppError({ code: 'HOUSE_3', messageKey: 'Failed to fetching household data.', httpStatus: 400 });
    } finally {
        if (connection) connection.release();
    }
}
