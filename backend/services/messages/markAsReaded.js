import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';

const markAsReaded = async (messageId, userId) => {
    const connection = await pool.getConnection();
    const markQuery = 'UPDATE messages SET is_read=? WHERE id = ? AND recipientId = ?';

    try {
        const [result] = await connection.query(markQuery, [1, messageId, userId]);

        if (result.affectedRows == 0) {
            logger.info('Messages not found.');
            throw new AppError({ code: 'MSG_1', messageKey: 'Messages not found.', httpStatus: 404 });
        };

        return {
            messageKey: `Message status updated correctly.`,
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`markMessage error: ${error}`);
        throw new AppError({ code: 'MSG_2', messageKey: 'Internal server error.', httpStatus: 500 });
    } finally {
        if (connection) connection.release();
    }
};


export { markAsReaded };
