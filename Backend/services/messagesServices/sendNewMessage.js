const pool = require('../../database/db');
const messagesQueries = require('../../database/messagesQueries');
const logger = require('../../configs/logger');
const { broadcastMessage } = require('../../configs/websocketConfig');
const { v4: uuidv4 } = require('uuid');

const sendNewMessage = async (userId, userName, recipientName, content) => {
    const id = uuidv4();
    const connection = await pool.getConnection();

    try {
        const [checkUserId] = await connection.query(messagesQueries.checkUserIdQuery, [recipientName]);

        if (checkUserId.length == 0) {
            return { status: 'badreq', message: 'Nie znaleziono nadawcy.' };
        };

        const recipientId = checkUserId[0].id;

        const result = await connection.query(messagesQueries.saveMessage, [id, userId, recipientId, content, false]);

        if (result.affectedRows === 0) {
            logger.error(`Nie udało się zapisać wiadomości od użytkownika ${userId} do użytkownika ${recipientId}`);
            return { status: 'error', message: 'Nie udało się zapisać wiadomości.' };
        }
        try {
            broadcastMessage(recipientId, {
                type: 'newMessage',
                data: {
                    id: id,
                    sender: userName,
                    recipient: recipientName,
                    message: content,
                    date: new Date().toISOString(),
                    readed: 0,
                }
            });
        } catch (error) {
            logger.error('Nie udało się wysłać wiadomości do adresata.', error);
        };
        

        return {
            status: 'success',
            message: 'Wiadomość wysłana.',
        };
    } catch (error) {
        logger.error(`Błąd podczas wysyłania wiadomości: ${error}`);
        return { status: 'error', message: 'Wystąpił błąd podczas wysyłania wiadomości.' };
    } finally {
        connection && connection.release();
    }
};

module.exports = { sendNewMessage };