import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';

const delMessage = async (messageId) => {
    const connection = await pool.getConnection();

    try {
        const [delMessage] = await connection.query('DELETE FROM messages WHERE id=?', [messageId]);

        if (delMessage.affectedRows == 0) {
            throw new AppError({ code: 'MSG_1', messageKey: 'Messages not found.', httpStatus: 404 });
        };
        logger.info(`Delete message: ${messageId}`);
        return { messageKey: `Message deleted correctly.` };

    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`Deleting message error: ${error}`);
        throw new AppError({ code: 'MSG_2', messageKey: 'Internal server error.', httpStatus: 500 });
    };
};

export { delMessage };
