const logger = require('../configs/logger');
const { addNewAction } = require('../services/transactionServices/addNewAction');
const { deleteAction } = require('../services/transactionServices/deleteAction');
const { getAllActions } = require('../services/transactionServices/getAllActions');
const { getHouseActions } = require('../services/transactionServices/getHouseActions');

exports.addNewAction = async (req, res) => {
    const { type, value } = req.body;
    const userId = req.userId;

    try {
        const response = await addNewAction(userId, type, value);

        if (response.status === 'success') {
            return res.status(200).json(response);
        } else if (response.status === 'nodata') {
            return res.status(400).json(response);
        } else if (response.status === 'error') {
            return res.status(500).json(response);
        }
    } catch (error) {
        logger.error(error);
        return res.status(500).json({status: 'error', message: 'Błąd przetwarzania żądania.'});
    }
    
};

exports.getAllActions = async (req, res) => {
    try {
        const result = await getAllActions();

        if (result.status === 'notfound') {
            return res.status(404).json(result);
        } else if (result.status === 'error') {
            return res.status(500).json(result);
        } else if (result.status === 'success') {
            return res.status(200).json(result);
        };

    } catch (error) {
        logger.error(`Błąd przetwarzania getAllActions: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };
};

exports.getHouseActions = async (req, res) => {
    const userId = req.userId;

    try {
        const response = await getHouseActions(userId);

        if (response.status === 'notfound') {
            return res.status(404).json(response.message);
        } else if (response.status === 'error') {
            return res.status(500).json(response.message);
        } if (response.status === 'success') {
            return res.status(200).json(response);
        }
    } catch (error) {
        logger.error(`Błąd getHouseActions: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };
};

exports.deleteAction = async (req, res) => {
    const { transactionId } = req.body;
    const userId = req.userId;

    try {
        const response = await deleteAction(transactionId, userId);

        if (response.status === 'badreq') {
            return res.status(400).json(response);
        } else if (response.status === 'notfound') {
            return res.status(404).json(response);
        } else if (response.status === 'error') {
            return res.status(500).json(response);
        } else {
            return res.status(200).json(response);
        }
    } catch (error) {
        logger.error(`Błąd przetwarzania deleteAction: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
   }
};