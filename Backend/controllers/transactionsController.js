const logger = require('../configs/logger');
const { addNewAction } = require('../services/transactionServices/addNewAction');
const { deleteAction } = require('../services/transactionServices/deleteAction');
const { getActionsCollection } = require('../services/transactionServices/getActionsCollection');
const { getHouseActions } = require('../services/transactionServices/getHouseActions');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.addNewAction = async (req, res) => {
    const { type, value, catId } = req.body;
    const userId = req.userId;

    if (!type || !value || !catId) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Brak odpowiednich danych.'
        });
    };

    try {
        const response = await addNewAction(userId, type, value, catId);

        switch (response.status) {
            case 'success':
                return res.status(statusCode.OK).json(response);
            case 'nodata':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: response.message
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
            default:
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Błąd przetwarzania żądania.'
                });
        }
    } catch (error) {
        logger.error(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    }

};

exports.getAllActions = async (req, res) => {
    try {
        const result = await getActionsCollection();

        switch (result.status) {
            case 'notfound':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: result.message
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json(result);
            case 'success':
                return res.status(statusCode.OK).json(result);
            default:
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Błąd przetwarzania żądania.'
                });
        };
    } catch (error) {
        logger.error(`Błąd przetwarzania getAllActions: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    };
};

exports.getHouseActions = async (req, res) => {
    const userId = req.userId;

    try {
        const response = await getHouseActions(userId);


        switch (response.status) {
            case 'notfound':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: response.message
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: response.message
                });
            case 'success':
                return res.status(statusCode.OK).json(response);
            default:
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Błąd przetwarzania żądania.',
                });
        };

    } catch (error) {
        logger.error(`Błąd getHouseActions: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    };
};

exports.deleteAction = async (req, res) => {
    const { transactionId } = req.body;
    const userId = req.userId;

    try {
        const response = await deleteAction(transactionId, userId);

        switch (response.status) {
            case 'badreq':
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: response.message
                });
            case 'notfound':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: response.message,
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
            case 'success':
                return res.status(statusCode.OK).json(response);
            default:
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Błąd przetwarzania żądania.',
                });
        };

    } catch (error) {
        logger.error(`Błąd przetwarzania deleteAction: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    }
};