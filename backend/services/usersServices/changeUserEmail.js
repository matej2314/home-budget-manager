const pool = require('../../database/db');
const logger = require('../../configs/logger');
const { checkUserEmail } = require('../../utils/checkUtils/checkUserEmail');

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

module.exports = { changeUserEmail };