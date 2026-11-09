import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import messagesQueries from '../../database/messagesQueries.js';
import { broadcastMessage } from '../../configs/websocketConfig.js';

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
            return { status: 'error', message: 'sendMessage.errorMessage' };
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
            message: 'sendMessage.successMessage',
        };
    } catch (error) {
        logger.error(`Sending message error: ${error}`);
        return { status: 'error', message: 'sendMessage.errorMessage' };
    } finally {
        connection && connection.release();
    }
};

export { sendNewMessage };
