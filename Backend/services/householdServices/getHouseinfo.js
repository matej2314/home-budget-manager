const pool = require('../../database/db');
const logger = require('../../configs/logger');
const houseQueries = require('../../database/householdQueries');
const checkUserHouse = require('../../utils/checkUtils/checkUserHouse');

exports.getHouseInfo = async (userId) => {
    if (!userId) {
        logger.error('Enter correctly household data.');
        return { status: 'error', message: 'Enter correctly data.' };
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const checkHouse = await checkUserHouse(connection, userId);

        const householdId = checkHouse.houseId;

        const [basicData] = await connection.execute(houseQueries.dataQuery, [householdId]);

        if (basicData.length === 0) {
            logger.error('Household not found.');
            return { status: 'error', message: 'Household not found.' };
        }

        await connection.commit();

        logger.info(`Household data ${householdId} fetched successfully.`);
        return {
            status: 'success',
            message: 'Household data fetched successfully.',
            info: basicData,
            stats: statsData,
        };
    } catch (error) {
        await connection.rollback();
        logger.error(`Fetching household data error: ${error.stack}`);
        return { status: 'error', message: 'Failed to fetching household data.' };
    } finally {
        if (connection) connection.release();
    }
}