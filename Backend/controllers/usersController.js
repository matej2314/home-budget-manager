const logger = require('../configs/logger');
const { addUserToHouse } = require('../services/usersServices/addUserToHouse');
const { getUsersCollection } = require('../services/usersServices/getUsersCollection');
const { deleteUser } = require('../services/usersServices/deleteUser');
const { deleteInhabitant } = require('../services/usersServices/deleteInhabitant');
const { changeUserEmail } = require('../services/usersServices/changeUserEmail');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.addUserToHouse = async (req, res) => {
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
        const response = await addUserToHouse(userId, userName, invitingUserName, role);

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

exports.getAllUsers = async (req, res) => {

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

exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const response = await deleteUser(userId);

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

exports.deleteInhabitant = async (req, res) => {
    const { inhabitantId } = req.body;

    if (!inhabitantId) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Enter correctly data!',
        });
    };

    try {
        const response = await deleteInhabitant(inhabitantId);

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

exports.changeEmail = async (req, res) => {
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

