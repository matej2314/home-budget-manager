const logger = require('../configs/logger');
const { getHomePageCollection } = require('../services/homePageDataServices/homePageDataCollection');
const { addFunctionalityContent } = require('../services/homePageDataServices/addFunctionalityService');
const { addProjectInfoService } = require('../services/homePageDataServices/addProjectInfoService');
const { StatusCodes } = require('http-status-codes');


exports.getDataCollection = async (req, res) => {

    try {
        const response = await getHomePageCollection();

        if (response.status === 'error') {
            return res.status(500).json({ status: 'error', message: response.message });
        } else if (response.status === 'success') {
            return res.status(200).json(response);
        }
    } catch (error) {
        logger.error(`Błąd w homePageDataController/getDataCollection: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    }
};

exports.addFunctionality = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ status: 'error', message: 'Podaj szczegóły funkcjonalności!' });
    };

    try {
        const result = await addFunctionalityContent(title, content);

        if (result.status === 'error') {
            return res.status(500).json({ status: 'error', message: result.message });
        } else if (result.status === 'success') {
            return res.status(201).json({ status: 'success', message: result.message });
        };
    } catch (error) {
        logger.error(`Błąd w homePageDataController/addFunctionality: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    }

};

exports.addShortProjectInfo = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ status: 'error', message: 'Podaj szczegóły informacji!' })
    };

    try {
        const result = await addProjectInfoService(title, content);

        if (result.status === 'error') {
            return res.status(500).json({ status: 'error', message: result.message });
        } else if (result.status === 'success') {
            return res.status(201).json(result);
        }
    } catch (error) {
        logger.error(`Błąd w homePageDataController/addShortProjectInfo: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    }
};