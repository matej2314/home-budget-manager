const pool = require('../database/db');
const logger = require('../configs/logger');
const { sendNewMessage } = require('../services/messagesServices/sendNewMessage');
const { markAsReaded } = require('../services/messagesServices/markAsReaded');
const { delMessage } = require('../services/messagesServices/deleteMessage');

exports.sendMessage = async (req, res) => {
    const userId = req.userId;
    const userName = req.userName;
    const { recipientName, content } = req.body;

    if (!recipientName || !content) {
        logger.error('Brak danych wymaganych do wysłania wiadomości.');
        return res.status(400).json({ status: 'error', message: 'Brak danych wymaganych do wysłania wiadomości.' });
    };
   
    try {
        const sendResult = await sendNewMessage(userId, userName, recipientName, content);

        if (sendResult.status === 'badreq') {
            return res.status(400).json({ status: 'error', message: sendResult.message });
        } else if (sendResult.status === 'error') {
            return res.status(500).json({ status: 'error', message: sendResult.message });
        } else {
            return res.status(200).json({status: 'success', message: sendResult.message})
        }
    } catch (error) {
        logger.error(`Błąd w sendMessage: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };
};

exports.markMessage = async (req, res) => {
    const  messageId  = req.body.messageId;
    const userId = req.userId;

    if (!messageId) {
        logger.error('Brak danych wiadomości do oznaczenia!');
        return res.status(400).json({ status: 'error', message: 'Prześlij poprawne dane wiadomości.' });
    };

    try {
        const markResult = await markAsReaded(messageId, userId);
        
        if (markResult.status === 'notfound') {
            return res.status(404).json({ status: 'error', message: markResult.message });
        } else if (markResult.status === 'error') {
            return res.status(500).json({ status: 'error', message: markResult.message });
        };

        return res.status(200).json({ status: 'success', message: markResult.message });

    } catch (error) {
        logger.error(`Błąd w markMessage: ${error}`);
    };
};

exports.deleteMessage = async (req, res) => {
    const { messageId } = req.body;
   
    if (!messageId) {
        return res.status(400).json({ status: 'error', message: 'Wskaż wiadomość!' });
    };

    try {

        const delResult = await delMessage(messageId);

        if (delResult.status === 'notfound') {
            return res.status(404).json({ status: 'error', message: delResult.message });
        } else if (delResult.status === 'error') {
            return res.status(500).json({status: 'error', message: ''})
        } else {
            return res.status(200).json({ status: 'success', message: delResult.message });
        }

    } catch (error) {

    }
}