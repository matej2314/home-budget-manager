import logger from '../configs/logger.js';
import { addNewAction as addNewActionService } from '../services/transactionServices/addNewAction.js';
import { deleteAction as deleteActionService } from '../services/transactionServices/deleteAction.js';
import { getActionsCollection } from '../services/transactionServices/getActionsCollection.js';
import { getHouseActions as getHouseActionsService } from '../services/transactionServices/getHouseActions.js';
import { StatusCodes } from 'http-status-codes';

const statusCode = StatusCodes;

export const addNewAction = async (req, res) => {
    const { type, value, catId } = req.body;
    const userId = req.userId;

    if (!type || !value || !catId) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Invalid input data.'
        });
    };

    try {
        const response = await addNewActionService(userId, type, value, catId);

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
                    message: 'URL not found.'
                });
        }
    } catch (error) {
        logger.error(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    }

};

export const getAllActions = async (req, res) => {
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
                    message: 'URL not found.'
                });
        };
    } catch (error) {
        logger.error(`getAllActions error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    };
};

export const getHouseActions = async (req, res) => {
    const userId = req.userId;

    try {
        const response = await getHouseActionsService(userId);


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
                    message: 'URL not found.',
                });
        };

    } catch (error) {
        logger.error(`getHouseActions error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    };
};

export const deleteAction = async (req, res) => {
    const { transactionId } = req.body;
    const userId = req.userId;

    try {
        const response = await deleteActionService(transactionId, userId);

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
                    message: 'URL not found.',
                });
        };

    } catch (error) {
        logger.error(`deleteAction error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    }
};
