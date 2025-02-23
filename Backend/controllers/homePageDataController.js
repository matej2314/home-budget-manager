const logger = require('../configs/logger');
const { getHomePageCollection } = require('../services/homePageDataServices/homePageDataCollection');
const { addFunctionalityContent } = require('../services/homePageDataServices/addFunctionalityService');
const { addProjectInfoService } = require('../services/homePageDataServices/addProjectInfoService');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.getDataCollection = async (req, res) => {

    try {
        const response = await getHomePageCollection();

        switch (response.status) {
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
                })
        }

    } catch (error) {
        logger.error(`Błąd w homePageDataController/getDataCollection: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    }
};

exports.addFunctionality = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Podaj szczegóły funkcjonalności!'
        });
    };

    try {
        const result = await addFunctionalityContent(title, content);

        switch (result.status) {
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: result.message
                });
            case 'success':
                return res.status(statusCode.CREATED).json({
                    status: 'success',
                    message: result.message
                });
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd w homePageDataController/addFunctionality: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    }

};

exports.addShortProjectInfo = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Podaj szczegóły informacji!'
        });
    };

    try {
        const result = await addProjectInfoService(title, content);


        switch (result.status) {
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: result.message
                });
            case 'success':
                return res.status(statusCode.CREATED).json(result);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd w homePageDataController/addShortProjectInfo: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    }
};