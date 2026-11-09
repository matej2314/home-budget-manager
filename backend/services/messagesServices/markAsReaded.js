const pool = require('../../database/db');
const logger = require('../../configs/logger');

const markAsReaded = async (messageId, userId) => {
    const connection = await pool.getConnection();
    const markQuery = 'UPDATE messages SET is_read=? WHERE id = ? AND recipientId = ?';

    try {
        const [result] = await connection.query(markQuery, [1, messageId, userId]);

        if (result.affectedRows == 0) {
            logger.info('Messages not found.');
            return {
                status: 'notfound',
                message: 'Messages not found.',
            };
        };

        return {
            status: 'success',
            message: `Message status updated correctly.`,
        };
    } catch (error) {
        logger.error(`markMessage error: ${error}`);
        return { status: 'error', message: 'Internal server error.' };
    } finally {
        if (connection) connection.release();
    }
};


module.exports = { markAsReaded };