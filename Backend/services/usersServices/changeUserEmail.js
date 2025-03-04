const pool = require('../../database/db');
const logger = require('../../configs/logger');
const { checkUserEmail } = require('../../utils/checkUtils/checkUserEmail');

const changeUserEmail = async (newEmail, userId) => {

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const checkEmail = await checkUserEmail(connection, newEmail);

        if (checkEmail) {
            return { status: 'emailexist', message: 'Entered e-mail address already exists.' };
        };

        const [changeEmail] = await connection.query('UPDATE users SET email =? WHERE id =? ', [newEmail, userId]);

        if (changeEmail.affectedRows === 0) {
            return { status: 'error', message: 'Failed to change e-mail address.' };
        };

        connection.commit();

        return {
            status: 'success',
            message: `Your new e-mail address: ${newEmail}`,
        };
    } catch (error) {
        await connection.rollback();
        logger.error(`changeEmail error: ${error}`);
        return { status: 'error', message: 'Internal server error.' };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { changeUserEmail };