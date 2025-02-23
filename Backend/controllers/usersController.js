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
    const { userName } = req.body;

    if (!userName) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Podaj login użytkownika!',
        });
    };

    try {
        const response = await addUserToHouse(userId, userName);

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
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
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
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd pobierania listy użytkowników: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd pobierania listy użytkowników.'
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
        logger.error(`Błąd podczas usuwania użytkownika ${userId}: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd podczas usuwania użytkownika.'
        });
    };

};

exports.deleteInhabitant = async (req, res) => {
    const { inhabitantId } = req.body;

    if (!inhabitantId) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Podaj prawidłowe dane!',
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
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd deleteInhabitant: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Nie udało się usunąć domownika.'
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
            message: 'Podaj prawidłowy adres email!'
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
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd w changeEmail: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    };
};

