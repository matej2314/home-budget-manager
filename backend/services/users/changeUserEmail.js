import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { checkUserEmail } from '../../utils/checkUtils/checkUserEmail.js';
import { AppError } from '../../utils/errors/AppError.js';

const changeUserEmail = async (newEmail, userId) => {

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const checkEmail = await checkUserEmail(connection, newEmail);

        if (checkEmail) {
            throw new AppError({ code: 'USERS_F1', messageKey: "changeEmail.checkEmailError", httpStatus: 409 });
        };

        const [changeEmail] = await connection.query('UPDATE users SET email =? WHERE id =? ', [newEmail, userId]);

        if (changeEmail.affectedRows === 0) {
            throw new AppError({ code: 'USERS_F2', messageKey: "changeEmail.failedError", httpStatus: 500 });
        };

        connection.commit();

        return {
            messageKey: "changeEmail.changedCorrectlyMessage",
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        await connection.rollback();
        logger.error(`changeEmail error: ${error}`);
        throw new AppError({ code: 'USERS_F3', messageKey: "changeEmail.internalError", httpStatus: 500 });
    } finally {
        if (connection) connection.release();
    }
};

export { changeUserEmail };
