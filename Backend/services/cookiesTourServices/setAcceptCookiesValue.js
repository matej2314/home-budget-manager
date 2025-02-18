const pool = require('../../database/db');
const logger = require('../../configs/logger');

const setAcceptCookies = async (cookieValue, userId) => {
    try {
        const connection = await pool.getConnection();

        const [saveCookiesValue] = await connection.query('UPDATE users SET acceptCookies =? WHERE id =?', [cookieValue, userId]);

        if (saveCookiesValue.affectedRows === 0) {
            logger.error(`Zapis zgody cookies użytkownika ${userId} nieudany.`);
            return { status: 'error', message: 'Wystąpił błąd serwera.' };
        } else if (saveCookiesValue.affectedRows === 1) {
            return {
                status: 'success',
                message: 'Twoja zgoda została zapisana.',
            };
        };
    } catch (error) {
        logger.error(`Błąd setCookieValue: ${error}`);
        return { status: 'error', message: 'Błąd przetwarzania żądania.' };
    };
};

module.exports = { setAcceptCookies };