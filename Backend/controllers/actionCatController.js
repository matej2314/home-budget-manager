const logger = require('../configs/logger');
const { addActionCat } = require('../services/actionCatServices/addActionCat');
const { getActionCatColl } = require('../services/actionCatServices/actionCatCollection');
const { deleteActionCat } = require('../services/actionCatServices/deleteActionCat');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.addNewActionCat = async (req, res) => {
    const { name, type } = req.body;

    try {
        const response = await addActionCat(name, type);

        switch (response.status) {
            case 'badreq':
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: response.message,
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: response.message,
                });
            case 'success':
                return res.status(statusCode.OK).json(response);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd w AddNewActionCat: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd podczas dodawania nowej kategorii transakcji.'
        });
    };
};

exports.actionCatCollection = async (req, res) => {
    try {
        const response = await getActionCatColl();

        switch (response.status) {
            case 'notfound':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: response.message,
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: response.message,
                });
            case 'success':
                return res.status(statusCode.OK).json(response);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Bład w actionCatCollection: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.',
        });
    };

};

exports.deleteActionCat = async (req, res) => {
    const { catName, catId } = req.body;

    try {
        const response = await deleteActionCat(catName, catId);

        switch (response.status) {
            case 'badreq':
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: response.message,
                });
            case 'notfound':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: response.message,
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: response.message,
                });
            case 'success':
                return res.status(statusCode.OK).json(response);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'Podany adres nie istnieje.',
                });
        }
    } catch (error) {
        logger.error(`Błąd w deleteActionCat: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania',
        });
    };
};