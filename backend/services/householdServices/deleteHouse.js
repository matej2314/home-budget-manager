const pool = require('../../database/db');
const logger = require('../../configs/logger');
const houseQueries = require('../../database/householdQueries');
const { resetHostProps, resetInmatesProps } = require('../../utils/dbUtils/modifyUsersProps');

exports.deleteHouse = async (userId, houseName) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [ownership] = await connection.query(houseQueries.ownershipQuery, [houseName]);

        if (ownership.length === 0) {
            logger.error('No permissions.');
            await connection.rollback();
            return { status: 'noperm', message: 'No permissions to delete household.' };
        };
        const houseId = ownership[0].houseId;

        const [result] = await connection.query(houseQueries.deleteQuery, [houseId, userId]);

        if (result.affectedRows == 0) {
            logger.info('Household not found.');
            await connection.rollback();
            return { status: 'error', message: 'Household not found.' };
        } else if (result.affectedRows == 1) {
            await resetHostProps(userId, connection);

            const [inmates] = await connection.query(houseQueries.selectInmates, [houseId]);

            for (const inmate of inmates) {
                const userId = inmate.userId;
                await resetInmatesProps(userId, connection);
            };

            await connection.query(houseQueries.deleteHouseActions, [houseId]);
            logger.info(`Household ${houseName} successfully deleted.`);
        };

        await connection.commit();

        return {
            status: 'success',
            message: `Household ${houseName} deleted.`,
            newRole: 'user'
        };
    } catch (error) {
        logger.error(`Deleting household error: ${error.message}`);
        await connection.rollback();
        return { status: 'error', message: 'Failed to deleting household.' };
    } finally {
        if (connection) connection.release();
    };
};