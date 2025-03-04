const logger = require('../configs/logger');
const jwt = require('jsonwebtoken');
const jwtCookieOptions = require('../configs/jwtCookieOptions');
const JWT_SECRET = process.env.JWT_SECRET;
const { addNewHouse } = require('../services/householdServices/addNewHouse');
const { getHousesCollection } = require('../services/householdServices/getHousesCollection');
const { getHouseInfo } = require('../services/householdServices/getHouseinfo');
const { deleteHouse } = require('../services/householdServices/deleteHouse');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.addNewHouse = async (req, res) => {
    const userId = req.userId;
    const userName = req.userName;
    const { houseName, initBudget = null } = req.body;

    if (!userId || !houseName) {
        logger.error('Empty input data.');
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Enter every required value.'
        });
    }

    try {
        const result = await addNewHouse(userId, userName, houseName, initBudget);

        switch (result.status) {
            case 'success':
                const token = jwt.sign({
                    id: userId,
                    userName: userName,
                    role: result.newRole
                }, JWT_SECRET, { expiresIn: '24h' });
                res.cookie('SESSID', token, { ...jwtCookieOptions, maxAge: 86400000 });
                return res.status(statusCode.OK).json(result);
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    message: result.message
                });
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`addNewHouse error: ${error.message}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Adding new household error.'
        });
    }
};

exports.getAllHouses = async (req, res) => {
    try {
        const result = await getHousesCollection();

        switch (result.status) {
            case 'error':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: result.message
                });
            case 'success':
                return res.status(statusCode.OK).json(result);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`getAllHouses error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    }
};

exports.getHouseInfo = async (req, res) => {
    const userId = req.userId;

    try {
        const result = await getHouseInfo(userId);

        switch (result.status) {
            case 'error':
                return res.status(statusCode.BAD_REQUEST).json(result);
            case 'success':
                return res.status(statusCode.OK).json(result);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`getHouseInfo error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    };
};

exports.deleteHouse = async (req, res) => {
    const userId = req.userId;
    const { houseName } = req.body;

    if (!userId || !houseName) {
        logger.error('Enter required data.');
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Enter required data.'
        });
    };

    try {
        const result = await deleteHouse(userId, houseName);

        switch (result.status) {
            case 'error':
                return res.status(statusCode.BAD_REQUEST).json(result);
            case 'noperm':
                return res.status(statusCode.FORBIDDEN).json({
                    status: 'error',
                    message: result.message
                });
            case 'success':
                const token = jwt.sign({
                    id: userId,
                    userName: req.userName,
                    role: result.newRole
                }, JWT_SECRET, { expiresIn: '24h' });

                res.cookie('SESSID', token, { ...jwtCookieOptions, maxAge: 86400000 });
                return res.status(statusCode.OK).json(result);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`deleteHouse error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    };
};