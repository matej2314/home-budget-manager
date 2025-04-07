const logger = require('../configs/logger');
const { getHomePageCollection } = require('../services/homePageDataServices/homePageDataCollection');
const { addTechnologyContent } = require('../services/homePageDataServices/addTechnologyService');
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
                    message: 'URL not found.',
                })
        }

    } catch (error) {
        logger.error(`homePageDataController/getDataCollection error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Internal server error.' });
    }
};

exports.addTechnology = async (req, res) => {
    const { name, icon } = req.body;

    if (!name || !icon) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Enter technology details!'
        });
    };

    try {
        const result = await addTechnologyContent(name, icon);

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
                    message: 'URL not found',
                });
        };
    } catch (error) {
        logger.error(`homePageDataController/addTechnology error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    }

};
