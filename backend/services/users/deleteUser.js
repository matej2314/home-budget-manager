import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { AppError } from '../../utils/errors/AppError.js';

const deleteUser = async (userId) => {
    const connection = await pool.getConnection();

    if (!userId) {
        logger.error(`No user ID.`);
        throw new AppError({ code: 'USER_1', messageKey: 'Invalid input data.', httpStatus: 400 });
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
        return { messageKey: `User ${userId} deleted correctly.` };

    } catch (error) {
        if (error instanceof AppError) throw error;

        await connection.rollback();

        logger.error(`An error occured during deleting user ${userId}: ${error.message}`);
        throw new AppError({ code: 'USER_2', messageKey: 'Internal server error.', httpStatus: 500 });

    } finally {
        if (connection) connection.release();
    }
};

export { deleteUser };
