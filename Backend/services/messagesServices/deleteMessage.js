const pool = require('../../database/db');
const logger = require('../../configs/logger');

const delMessage = async (messageId) => {
    const connection = await pool.getConnection();

    try {
        const [delMessage] = await connection.query('DELETE FROM messages WHERE id=?', [messageId]);

        if (delMessage.affectedRows == 0) {
            return { status: 'notfound', message: 'Nie udało się odnależć wiadomości w bazie danych.' };
        };
        logger.info(`Usunięto wiadomość ${messageId}`);
        return { status: 'success', message: `Wiadomość usunięta poprawnie.` };
        
    } catch (error) {
        logger.error(`Błąd podczas usuwania wiadomości: ${error}`);
        return { status: 'error', message: 'Błąd serwera.' };
    };
};

module.exports = { delMessage };