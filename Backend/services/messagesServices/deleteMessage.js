const pool = require('../../database/db');
const logger = require('../../configs/logger');

const delMessage = async (messageId) => {
    const connection = await pool.getConnection();

    try {
        const [delMessage] = await connection.query('DELETE FROM messages WHERE id=?', [messageId]);

        if (delMessage.affectedRows == 0) {
            return { status: 'notfound', message: 'Messages not found.' };
        };
        logger.info(`Delete message: ${messageId}`);
        return { status: 'success', message: `Message deleted correctly.` };

    } catch (error) {
        logger.error(`Deleting message error: ${error}`);
        return { status: 'error', message: 'Internal server error.' };
    };
};

module.exports = { delMessage };