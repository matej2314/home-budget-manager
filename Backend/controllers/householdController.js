const logger = require('../configs/logger');
const { addNewHouse } = require('../services/householdServices/addNewHouse');
const { getAllHouses } = require('../services/householdServices/getAllHouses');
const { getHouseInfo } = require('../services/householdServices/getHouseinfo');
const { deleteHouse } = require('../services/householdServices/deleteHouse');
const jwt = require('jsonwebtoken');
const jwtCookieOptions = require('../configs/jwtCookieOptions');
const JWT_SECRET = process.env.JWT_SECRET;

exports.addNewHouse = async (req, res) => {
    const userId = req.userId;
    const userName = req.userName;
    const { houseName, initBudget = null } = req.body;

    if (!userId || !houseName) {
        logger.error('Brak danych: userId lub houseName są puste.');
        return res.status(400).json({ status: 'error', message: 'Podaj wszystkie niezbędne informacje.' });
    }

    try {
        const result = await addNewHouse(userId, userName, houseName, initBudget);

        if (result.status === 'success') {
            const token = jwt.sign({ id: userId, userName: userName, role: result.newRole }, JWT_SECRET, { expiresIn: '24h' });
            res.cookie('SESSID', token, { ...jwtCookieOptions, maxAge: 86400000 });
            return res.status(200).json(result);
        } else {
            return res.status(500).json(result);
        }

    } catch (error) {
        logger.error(`Błąd w kontrolerze: ${error.message}`);
        return res.status(500).json({ status: 'error', message: 'Wystąpił błąd podczas dodawania nowego gospodarstwa.' });
    }
};


exports.getAllHouses = async (req, res) => {
    try {
        const result = await getAllHouses();

        if (result.status === 'error') {
            return res.status(404).json(result);
        } else if (result.status === 'success') {
            return res.status(200).json(result);
        };

    } catch (error) {
        logger.error(`Błąd w kontrolerze: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Wystąpił błąd podczas przetwarzania żądania.' });
    }
};

exports.getHouseInfo = async (req, res) => {
    const userId = req.userId;
    
    try {
        const result = await getHouseInfo(userId);

        if (result.status === 'error') {
            return res.status(400).json(result);
        } else if (result.status === 'success') {
            return res.status(200).json(result);
        };
       
    } catch (error) {
        logger.error(`Błąd w kontrolerze: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Wystąpił błąd przy przetwarzaniu żądania.' });
    };
};

exports.deleteHouse = async (req, res) => {
    const userId = req.userId;
    const { houseName } = req.body;

    if ( !userId || !houseName) {
        logger.error('Podaj prawidłowe dane do usunięcia gospodarstwa.');
        return res.status(400).json({ status: 'error', message: 'Podaj prawidłowe dane do usunięcia gospodarstwa.' });
    };

    try {
        const result = await deleteHouse(userId, houseName);

        if (result.status === 'error') {
            return res.status(400).json(result);
        } else if (result.status === 'noperm') {
            return res.status(403).json(result);
        };
        const token = jwt.sign({ id: userId, userName: req.userName, role: result.newRole }, JWT_SECRET, { expiresIn: '24h' });
        res.cookie('SESSID', token, { ...jwtCookieOptions, maxAge: 86400000 });
        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Błąd w kontrolerze: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };
};