const{ checkUserEmail} = require('../../utils/checkUserEmail');
const logger = require('../../configs/logger');
const pool = require('../../database/db');

const changeUserEmail = async (newEmail, userId) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!newEmail || !emailRegex.test(newEmail)) {
        return { status: 'badreq', message: 'Podaj prawidłowy adres email!' };
    };

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const checkEmail = await checkUserEmail(connection, newEmail);

        if (checkEmail) {
            return { status: 'emailexist', message: 'Podany adres e-mail jest już zarejestrowany.' };
        };

        const [changeEmail] = await connection.query('UPDATE users SET email =? WHERE id =? ', [newEmail, userId]);

        if (changeEmail.affectedRows === 0) {
            return { status: 'error', message: 'Nie udało się zapisać nowego adresu e-mail' };
        };

        connection.commit();

        return {
            status: 'success',
            message: `Twój nowy adres e-mail: ${newEmail}`,
        };
    } catch (error) {
        await connection.rollback();
        logger.error(`Błąd w changeEmail: ${error}`);
        return { status: 'error', message: 'Błąd przetwarzania żądania.' };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { changeUserEmail };