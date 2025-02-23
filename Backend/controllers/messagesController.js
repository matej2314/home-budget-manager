const logger = require('../configs/logger');
const { sendNewMessage } = require('../services/messagesServices/sendNewMessage');
const { markAsReaded } = require('../services/messagesServices/markAsReaded');
const { delMessage } = require('../services/messagesServices/deleteMessage');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.sendMessage = async (req, res) => {
    const userId = req.userId;
    const userName = req.userName;
    const { recipientName, content } = req.body;

    if (!recipientName || !content) {
        logger.error('Brak danych wymaganych do wysłania wiadomości.');
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Brak danych wymaganych do wysłania wiadomości.'
        });
    };

    try {
        const sendResult = await sendNewMessage(userId, userName, recipientName, content);

        switch (sendResult.status) {
            case 'badreq':
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: sendResult.message
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: sendResult.message
                });
            case 'success':
                return res.status(statusCode.OK).json({
                    status: 'success',
                    message: sendResult.message
                })
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd w sendMessage: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    };
};

exports.markMessage = async (req, res) => {
    const messageId = req.body.messageId;
    const userId = req.userId;

    if (!messageId) {
        logger.error('Brak danych wiadomości do oznaczenia!');
        return res.status(400).json({ status: 'error', message: 'Prześlij poprawne dane wiadomości.' });
    };

    try {
        const markResult = await markAsReaded(messageId, userId);

        switch (markResult.status) {
            case 'notfound':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: markResult.message
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: markResult.message
                });
            case 'success':
                return res.status(statusCode.OK).json({
                    status: 'success',
                    message: markResult.message
                });
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'Podany adres nie istnieje.',
                });
        };

    } catch (error) {
        logger.error(`Błąd w markMessage: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.',
        })
    };
};

exports.deleteMessage = async (req, res) => {
    const { messageId } = req.body;

    if (!messageId) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Wskaż wiadomość!'
        });
    };

    try {
        const delResult = await delMessage(messageId);

        switch (delResult.status) {
            case 'notfound':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: delResult.message
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: 'Nie udało się usunąć wiadomości',
                });
            case 'success':
                return res.status(statusCode.OK).json({
                    status: 'success',
                    message: delResult.message
                });
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'Podany adres nie istnieje.',
                })
        }

    } catch (error) {
        logger.error(`Błąd w messagesController/deleteMessage: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania',
        });
    };
};