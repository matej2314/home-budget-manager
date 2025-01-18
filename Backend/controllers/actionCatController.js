const logger = require('../configs/logger');
const { addActionCat } = require('../services/actionCatServices/addActionCat');
const { getActionCatColl } = require('../services/actionCatServices/actionCatCollection');
const { deleteActionCat } = require('../services/actionCatServices/deleteActionCat');

exports.addNewActionCat = async (req, res) => {
    const { name, type } = req.body;
    
    try {
        const response = await addActionCat(name, type);

        if (response.status === 'badreq') {
            return res.status(400).json({
                status: 'error',
                message: response.message,
            });
        } else if (response.status === 'error') {
            return res.status(500).json({
                status: 'error',
                message: response.message,
            });
        }

        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Błąd w AddNewActionCat: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd podczas dodawania nowej kategorii transakcji.' });
    };
};

exports.actionCatCollection = async (req, res) => {
    try {
        const response = await getActionCatColl();

        if (response.status === 'notfound') {
            return res.status(404).json({
                status: 'error',
                message: response.message,
            });
        } else if (response.status === 'error') {
            return res.status(500).json({
                status: 'error',
                message: response.message,
            });
        } else {
            return res.status(200).json(response);
        };
    } catch (error) {
        logger.error(`Bład w actionCatCollection: ${error}`);
        return res.status(500).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.',
        });
    };
   
};

exports.deleteActionCat = async (req, res) => {
    const { catName } = req.body;
   
    try {
        const response = await deleteActionCat(catName);

        if (response.status === 'badreq') {
            return res.status(400).json({
                status: 'error',
                message: response.message,
            });
        } else if (response.status === 'notfound') {
            return res.status(404).json({
                status: 'error',
                message: response.message,
            });
        } else if (response.status === 'error') {
            return res.status(500).json({
                status: 'error',
                message: response.message,
            });
        };

        return res.status(200).json(response);

    } catch (error) {
        logger.error(`Błąd w deleteActionCat: ${error}`);
        return res.status(500).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania',
        });
    };
};