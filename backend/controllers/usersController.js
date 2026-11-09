import logger from '../configs/logger.js';
import { addUserToHouse as addUserToHouseService } from '../services/usersServices/addUserToHouse.js';
import { getUsersCollection } from '../services/usersServices/getUsersCollection.js';
import { deleteUser as deleteUserService } from '../services/usersServices/deleteUser.js';
import { deleteInhabitant as deleteInhabitantService } from '../services/usersServices/deleteInhabitant.js';
import { changeUserEmail } from '../services/usersServices/changeUserEmail.js';
import { StatusCodes } from 'http-status-codes';

const statusCode = StatusCodes;

export const addUserToHouse = async (req, res) => {
    const userId = req.userId;
    const role = req.role;
    const invitingUserName = req.userName;
    const { userName } = req.body;

    if (!userName) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Invalid input user data.',
        });
    };

    try {
        const response = await addUserToHouseService(userId, userName, invitingUserName, role);

        switch (response.status) {
            case 'badreq':
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: response.message
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
            case 'inmate':
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: response.message
                });
            case 'success':
                return res.status(statusCode.OK).json(response);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    };

};

export const getAllUsers = async (req, res) => {

    try {
        const response = await getUsersCollection();

        switch (response.status) {
            case 'notfound':
                return res.status(statusCode.NOT_FOUND).json(response);
            case 'success':
                return res.status(statusCode.OK).json(response);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`Error fetching user's list: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: `Error fetching user's list.`
        });
    };
};

export const deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const response = await deleteUserService(userId);

        switch (response.status) {
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
            case 'success':
                return res.status(statusCode.OK).json(response);
        };
    } catch (error) {
        logger.error(`deleteUser error: ${userId}: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Deleting user error.'
        });
    };

};

export const deleteInhabitant = async (req, res) => {
    const { inhabitantId } = req.body;

    if (!inhabitantId) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Enter correctly data!',
        });
    };

    try {
        const response = await deleteInhabitantService(inhabitantId);

        switch (response.status) {
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
            case 'success':
                return res.status(statusCode.OK).json(response);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`deleteInhabitant error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to delete housemate.'
        });
    };
};

export const changeEmail = async (req, res) => {
    const userId = req.userId;
    const { newEmail } = req.body;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!newEmail || !emailRegex.test(newEmail)) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Enter correctly e-mail address!'
        });
    };

    try {
        const response = await changeUserEmail(newEmail, userId);

        switch (response.status) {
            case 'emailexist':
                return res.status(statusCode.CONFLICT).json({
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
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`changeEmail error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    };
};

