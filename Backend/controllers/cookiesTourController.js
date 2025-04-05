const logger = require('../configs/logger');
const { setAcceptCookies } = require('../services/cookiesTourServices/setAcceptCookiesValue');
const { setCompleteTour } = require('../services/cookiesTourServices/setCompleteTourValue');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.setCookieValue = async (req, res) => {
    const userId = req.userId;
    const cookieValue = req.body.cookieValue;

    if (!cookieValue) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: "cookies.valueError"
        });
    };

    try {
        const setResult = await setAcceptCookies(cookieValue, userId);

        switch (setResult.status) {
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: setResult.message
                });
            case 'success':
                return res.status(statusCode.OK).json({
                    status: 'success',
                    message: setResult.message,
                });
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`setCookieValue error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    };

};
