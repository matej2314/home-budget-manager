const pool = require('../../database/db');
const logger = require('../../configs/logger');

const setAcceptCookies = async (cookieValue, userId) => {
    try {
        const connection = await pool.getConnection();

        const [saveCookiesValue] = await connection.query('UPDATE users SET acceptCookies =? WHERE id =?', [cookieValue, userId]);

        if (saveCookiesValue.affectedRows === 0) {
            logger.error(`User's ${userId} cookie consent saved failed.`);
            return { status: 'error', message: 'Internal server error.' };
        } else if (saveCookiesValue.affectedRows === 1) {
            return {
                status: 'success',
                message: 'Your consent saved correctly.',
            };
        };
    } catch (error) {
        logger.error(`setCookieValue error: ${error}`);
        return { status: 'error', message: 'Internal server error.' };
    };
};

module.exports = { setAcceptCookies };