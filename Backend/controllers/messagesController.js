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
        logger.error('No required message data.');
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Enter required message data.'
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
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`sendMessage error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    };
};

exports.markMessage = async (req, res) => {
    const messageId = req.body.messageId;
    const userId = req.userId;

    if (!messageId) {
        logger.error('No message data.');
        return res.status(statusCode.BAD_REQUEST).json({ status: 'error', message: 'Enter correctly message data.' });
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
                    message: 'URL not found.',
                });
        };

    } catch (error) {
        logger.error(`markMessage error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.',
        })
    };
};

exports.deleteMessage = async (req, res) => {
    const { messageId } = req.body;

    if (!messageId) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Point out the message!'
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
                    message: 'Deleting message error.',
                });
            case 'success':
                return res.status(statusCode.OK).json({
                    status: 'success',
                    message: delResult.message
                });
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                })
        }

    } catch (error) {
        logger.error(`messagesController/deleteMessage error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.',
        });
    };
};