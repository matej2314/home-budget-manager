import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { checkUserEmail } from '../../utils/checkUtils/checkUserEmail.js';

const changeUserEmail = async (newEmail, userId) => {

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const checkEmail = await checkUserEmail(connection, newEmail);

        if (checkEmail) {
            return { status: 'emailexist', message: "changeEmail.checkEmailError" };
        };

        const [changeEmail] = await connection.query('UPDATE users SET email =? WHERE id =? ', [newEmail, userId]);

        if (changeEmail.affectedRows === 0) {
            return { status: 'error', message: "changeEmail.failedError" };
        };

        connection.commit();

        return {
            status: 'success',
            message: "changeEmail.changedCorrectlyMessage",
        };
    } catch (error) {
        await connection.rollback();
        logger.error(`changeEmail error: ${error}`);
        return { status: 'error', message: "changeEmail.internalError" };
    } finally {
        if (connection) connection.release();
    }
};

export { changeUserEmail };
