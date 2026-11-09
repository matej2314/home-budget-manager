import logger from '../configs/logger.js';
import jwt from 'jsonwebtoken';
import jwtCookieOptions from '../configs/jwtCookieOptions.js';
import { addNewHouse as addNewHouseService } from '../services/householdServices/addNewHouse.js';
import { getHousesCollection } from '../services/householdServices/getHousesCollection.js';
import { getHouseInfo as getHouseInfoService } from '../services/householdServices/getHouseinfo.js';
import { deleteHouse as deleteHouseService } from '../services/householdServices/deleteHouse.js';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = process.env.JWT_SECRET;
const statusCode = StatusCodes;

export const addNewHouse = async (req, res) => {
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
        const result = await addNewHouseService(userId, userName, houseName, initBudget);

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

export const getAllHouses = async (req, res) => {
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

export const getHouseInfo = async (req, res) => {
    const userId = req.userId;

    try {
        const result = await getHouseInfoService(userId);

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

export const deleteHouse = async (req, res) => {
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
        const result = await deleteHouseService(userId, houseName);

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
