import pool from '../../../database/db.js';
import logger from '../../../configs/logger.js';
import { AppError } from '../../../utils/errors/AppError.js';

const setAcceptCookies = async (cookieValue, userId) => {
    try {
        const connection = await pool.getConnection();

        const [saveCookiesValue] = await connection.query('UPDATE users SET acceptCookies =? WHERE id =?', [cookieValue, userId]);

        if (saveCookiesValue.affectedRows === 0) {
            logger.error(`User's ${userId} cookie consent saved failed.`);
            throw new AppError({ code: 'SHELL_CT_1', messageKey: 'Internal server error.', httpStatus: 500 });
        } else if (saveCookiesValue.affectedRows === 1) {
            return {
                messageKey: 'Your consent saved correctly.',
            };
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`setCookieValue error: ${error}`);
        throw new AppError({ code: 'SHELL_CT_2', messageKey: 'Internal server error.', httpStatus: 500 });
    };
};

export { setAcceptCookies };
