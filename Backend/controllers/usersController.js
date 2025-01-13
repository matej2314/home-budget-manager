const logger = require('../configs/logger');
const { addUserToHouse } = require('../services/usersServices/addUserToHouse');
const { getAllUsers } = require('../services/usersServices/getAllUsers');
const { getInhabitants } = require('../services/usersServices/getInhabitants');
const { deleteUser } = require('../services/usersServices/deleteUser');
const { deleteInhabitant } = require('../services/usersServices/deleteInhabitant');

exports.addUserToHouse = async (req, res) => {
    const userId = req.userId;
    const { userName } = req.body;

    try {
        const response = await addUserToHouse(userId, userName);

        if (response.status === 'badreq') {
            return res.status(404).json(response);
        } else if (response.status === 'error') {
            return res.status(500).json(response);
        } else if (response.status === 'inmate') {
            return res.status(400).json(response);
        } if (response.status === 'success') {
            return res.status(200).json(response);
        };

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };
   
};

exports.getAllUsers = async (req, res) => {

    try {
        const response = await getAllUsers();

        if (response.status === 'success') {
            return res.status(200).json(response);
        };
    } catch (error) {
        logger.error(`Błąd pobierania listy użytkowników: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd pobierania listy użytkowników.' });
    };
};

exports.getInhabitants = async (req, res) => {
    const houseId = req.house;
 
    try {
        response = await getInhabitants(houseId);

        if (response.status === 'success') {
            return res.status(200).json(response);
        };
    } catch (error) {
        logger.error(`Błąd pobierania listy domowników gospodarstwa ${houseId} : ${error}`);
    };
   
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const response = await deleteUser(userId);
        if (response.status === 'success') {
            return res.status(200).json(response);
        };

    } catch (error) {
        logger.error(`Błąd podczas usuwania użytkownika ${userId}: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd podczas usuwania użytkownika.' });
    };
    
};

exports.deleteInhabitant = async (req, res) => {
    const { inhabitantId } = req.body;

    try {
        const response = await deleteInhabitant(inhabitantId);

        if (response.status === 'badreq') {
            return res.status(400).json(response);
        } else if (response.status === 'success') {
            return res.status(200).json(response);
        }
    } catch (error) {
        logger.error(`Błąd deleteInhabitant: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Nie udało się usunąć domownika.' });
    };
};

