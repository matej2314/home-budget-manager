import pool from '../../../database/db.js';
import logger from '../../../configs/logger.js';
import { AppError } from '../../../utils/errors/AppError.js';

const setCompleteTour = async (userId) => {
    const connection = await pool.getConnection();

    try {
        const [saveTourValue] = await connection.query('UPDATE users SET completeTour=? WHERE id=?', [1, userId]);

        if (saveTourValue.affectedRows === 0) {
            logger.error(`User  ${userId} tutorial info saved failed.`);
            throw new AppError({ code: 'SHELL_CT_1', messageKey: 'Internal server error.', httpStatus: 500 });

        } else if (saveTourValue.affectedRows === 1) {
            return {
                messageKey: 'Congratulations for passing the tutorial!',
            };
        };

    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`setTourValue error: ${error}`);
        throw new AppError({ code: 'SHELL_CT_2', messageKey: 'Internal server error.', httpStatus: 500 });
    };
};

export { setCompleteTour };
