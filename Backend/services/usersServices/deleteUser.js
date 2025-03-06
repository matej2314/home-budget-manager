const pool = require('../../database/db');
const logger = require('../../configs/logger');
const checkUserHouse = require('../../utils/checkUtils/checkUserHouse');

const deleteUser = async (userId) => {
    const connection = await pool.getConnection();

    if (!userId) {
        logger.error(`No user ID.`);
        return { status: 'badreq', message: 'Invalid input data.' };
    };

    try {
        await connection.beginTransaction();
        const [checkIsHost] = await connection.query('SELECT host FROM users WHERE id=?', [userId]);

        if (checkIsHost[0].host == 1) {
            const userHouseId = await checkUserHouse(connection, userId);
            const houseId = userHouseId.houseId;
            const [deleteHouse] = await connection.query('DELETE FROM households WHERE houseId=? AND userId=?', [houseId, userId]);

            if (deleteHouse.affectedRows === 1) {
                const [deleteUserTransactions] = await connection.query('DELETE FROM transactions WHERE userId=?', [userId]);
                const [updateHouseHu] = await connection.query('UPDATE householdUsers SET houseId = NULL WHERE houseId = ?', [houseId]);
            };

            const [deleteFromUsers] = await connection.query('DELETE FROM users WHERE id=?', [userId]);
            if (deleteFromUsers.affectedRows == 1) {
                logger.info(`User ${userId} deleted correctly.`);
            };

        } else {
            logger.info(`User ${userId} isn't host. Deleting his transactions.`);
            const [deleteFromTransactions] = await connection.query('DELETE FROM transactions WHERE userId=?', [userId]);

            if (deleteFromTransactions.length > 0) {

                const [deleteFromHu] = await connection.query('DELETE FROM householdUsers WHERE userId=?', [userId]);
            };

            const [deleteFromUsers] = await connection.query('DELETE FROM users WHERE id=?', [userId]);

        };
        await connection.commit();
        return { status: 'success', message: `User ${userId} deleted correctly.` };

    } catch (error) {

        await connection.rollback();

        logger.error(`An error occured during deleting user ${userId}: ${error.message}`);
        return { status: 'error', message: 'Internal server error.' };

    } finally {
        if (connection) connection.release();
    }
};

module.exports = { deleteUser };