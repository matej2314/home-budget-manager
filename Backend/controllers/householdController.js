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
        logger.error('Brak danych: userId lub houseName są puste.');
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Podaj wszystkie niezbędne informacje.'
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
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd w addNewHouse: ${error.message}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Wystąpił błąd podczas dodawania nowego gospodarstwa.'
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
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd w getAllHouses: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Wystąpił błąd podczas przetwarzania żądania.'
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
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd w getHouseInfo: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Wystąpił błąd przy przetwarzaniu żądania.'
        });
    };
};

exports.deleteHouse = async (req, res) => {
    const userId = req.userId;
    const { houseName } = req.body;

    if (!userId || !houseName) {
        logger.error('Podaj prawidłowe dane do usunięcia gospodarstwa.');
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Podaj prawidłowe dane wymagane do usunięcia gospodarstwa.'
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
                    message: 'Podany adres nie istnieje.',
                });
        };
    } catch (error) {
        logger.error(`Błąd w deleteHouse: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    };
};