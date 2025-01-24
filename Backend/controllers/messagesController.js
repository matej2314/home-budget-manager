const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');
const { broadcastMessage } = require('../configs/websocketConfig');
const messagesQueries = require('../database/messagesQueries');

exports.sendMessage = async (req, res) => {
    const userId = req.userId;
    const { recipientId, content } = req.body;
    const connection = await pool.getConnection();
    const id = uuidv4();

    if (!recipientId || !content) {
        logger.error('Brak danych wymaganych do wysłania wiadomości.');
        return res.status(400).json({ status: 'error', message: 'Brak danych wymaganych do wysłania wiadomości.' });
    }

    try {
        const result = await connection.query(messagesQueries.saveMessage, [id, userId, recipientId, content, false]);

        if (result.affectedRows === 0) {
            logger.error(`Nie udało się zapisać wiadomości od użytkownika ${userId} do użytkownika ${recipientId}`);
            return res.status(500).json({ status: 'error', message: 'Nie udało się zapisać wiadomości.' });
        }
        try {
            broadcastMessage(recipientId, {
                type: 'newMessage',
                data: {
                    senderId: userId,
                    recipientId: recipientId,
                    content: content,
                }
            });
        } catch (error) {
            logger.error('Nie udało się wysłać wiadomości do adresata.', error);  
        };
        

        return res.status(200).json({
            status: 'success',
            message: 'Wiadomość wysłana.',
        });
    } catch (error) {
        logger.error(`Błąd podczas wysyłania wiadomości: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Wystąpił błąd podczas wysyłania wiadomości.' });
    } finally {
        connection && connection.release();
    }
};

exports.getMessages = async (req, res) => {
    const userId = req.userId;
    const connection = await pool.getConnection();

    try {
        const [messages] = await connection.query(messagesQueries.getMessages, [userId, userId]);

        if (messages.length === 0) {
            logger.info(`Brak wiadomości dla użytkownika ${userId}`);
            return res.status(404).json({ status: 'error', message: 'Nie znaleziono wiadomości :(' });
        }

        return res.status(200).json({ status: 'success', message: 'Pobrano wiadomości', messages: messages });
    } catch (error) {
        logger.error(`Błąd pobierania wiadomości użytkownika ${userId}: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Wystąpił błąd podczas pobierania wiadomości.' });
    } finally {
        if (connection) connection.release();
    }
};