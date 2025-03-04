const pool = require('../../database/db');
const logger = require('../../configs/logger');
const { v4: uuidv4 } = require('uuid');
const messagesQueries = require('../../database/messagesQueries');
const { broadcastMessage } = require('../../configs/websocketConfig');


const sendNewMessage = async (userId, userName, recipientName, content) => {
    const id = uuidv4();
    const connection = await pool.getConnection();

    try {
        const [checkUserId] = await connection.query(messagesQueries.checkUserIdQuery, [recipientName]);

        if (checkUserId.length == 0) {
            return { status: 'badreq', message: 'Sender not found.' };
        };

        const recipientId = checkUserId[0].id;

        const result = await connection.query(messagesQueries.saveMessage, [id, userId, recipientId, content, false]);

        if (result.affectedRows === 0) {
            logger.error(`Failed to save message from user ${userId} to user ${recipientId}`);
            return { status: 'error', message: 'Failed to save message.' };
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
            logger.error('Failed to send message to receiver.', error);
        };


        return {
            status: 'success',
            message: 'Message sent successfully.',
        };
    } catch (error) {
        logger.error(`Sending message error: ${error}`);
        return { status: 'error', message: 'An error occured during sending message.' };
    } finally {
        connection && connection.release();
    }
};

module.exports = { sendNewMessage };