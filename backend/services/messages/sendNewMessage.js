import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import messagesQueries from '../../database/messagesQueries.js';
import { broadcastMessage } from '../../configs/websocketConfig.js';
import { AppError } from '../../utils/errors/AppError.js';

const sendNewMessage = async (userId, userName, recipientName, content) => {
    const id = uuidv4();
    const connection = await pool.getConnection();

    try {
        const [checkUserId] = await connection.query(messagesQueries.checkUserIdQuery, [recipientName]);

        if (checkUserId.length == 0) {
            throw new AppError({ code: 'MSG_1', messageKey: 'Sender not found.', httpStatus: 400 });
        };

        const recipientId = checkUserId[0].id;

        const result = await connection.query(messagesQueries.saveMessage, [id, userId, recipientId, content, false]);

        if (result.affectedRows === 0) {
            logger.error(`Failed to save message from user ${userId} to user ${recipientId}`);
            throw new AppError({ code: 'MSG_2', messageKey: 'sendMessage.errorMessage', httpStatus: 500 });
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
        if (error instanceof AppError) throw error;
            logger.error('Failed to send message to receiver.', error);
        };


        return {
            messageKey: 'sendMessage.successMessage',
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`Sending message error: ${error}`);
        throw new AppError({ code: 'MSG_3', messageKey: 'sendMessage.errorMessage', httpStatus: 500 });
    } finally {
        connection && connection.release();
    }
};

export { sendNewMessage };
