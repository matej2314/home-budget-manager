const pool = require('../../database/db');
const logger = require('../../configs/logger');

const markAsReaded = async (messageId, userId) => {
    const connection = await pool.getConnection();
    const markQuery = 'UPDATE messages SET is_read=? WHERE id = ? AND recipientId = ?';

    try { 
        const [result] = await connection.query(markQuery, [1, messageId, userId]);

        if (result.affectedRows == 0) {
            logger.info('Nie znaleziono wiadomości.');
            return {
                status: 'notfound',
                message: 'Nie znaleziono wiadomości.',
            };
        };

        return {
            status: 'success',
            message: `Status wiadomości zmieniony poprawnie.`,
        };
    } catch (error) {
        logger.error(`Błąd w markMessage: ${error}`);
        return { status: 'error', message: 'Błąd serwera.' };
    } finally {
        if (connection) connection.release();
    }
};


module.exports = { markAsReaded };