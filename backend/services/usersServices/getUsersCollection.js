import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import usersQueries from '../../database/usersQueries.js';

const getUsersCollection = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await pool.query(usersQueries.allUsersQuery);
        logger.info(`All user's list fetched correctly.`);

        if (rows.affectedRows === 0) {
            return {
                status: 'notfound',
                message: 'Users not found.',
            };
        };

        return {
            status: 'success',
            message: `User's list fetched correctly.`,
            users: rows,
        };

    } catch (error) {
        logger.error(`An error occured user's list: ${error}`);
        return { status: 'error', mesage: `Failed to fetch user's list.` };
    } finally {
        if (connection) connection.release();
    }
};

export { getUsersCollection };
