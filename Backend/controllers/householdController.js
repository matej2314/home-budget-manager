const logger = require('../configs/logger');
const { addNewHouse } = require('../services/householdServices/addNewHouse');
const { getAllHouses } = require('../services/householdServices/getAllHouses');
const { getHouseInfo } = require('../services/householdServices/getHouseinfo');
const { deleteHouse } = require('../services/householdServices/deleteHouse');

exports.addNewHouse = async (req, res) => {
    const userId = req.userId;
    const userName = req.userName;
    const { houseName } = req.body;

    if (!userId || !houseName) {
        logger.error('Brak danych: userId lub houseName są puste.');
        return res.status(400).json({ status: 'error', message: 'Podaj wszystkie niezbędne informacje.' });
    }

    const result = await addNewHouse(userId, userName, houseName, res);

    return res.status(result.status === 'success' ? 200 : 500).json(result);
};

exports.getAllHouses = async (req, res) => {
    try {
        const result = await getAllHouses();

        if (result.status === 'error') {
            return res.status(404).json(result);
        };

        return res.status(200).json(result);

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
        };

        if (result.status === 'noperm') {
            return res.status(403).json(result);
        };

        return res.status(200).json(result);
    } catch (error) {
        logger.error(`Błąd w kontrolerze: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };
};