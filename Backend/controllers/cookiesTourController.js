const logger = require('../configs/logger');
const { setAcceptCookies } = require('../services/cookiesTourServices/setAcceptCookiesValue');
const { setCompleteTour } = require('../services/cookiesTourServices/setCompleteTourValue');

exports.setCookieValue = async (req, res) => {
    const userId = req.userId;
    const cookieValue = req.body.cookieValue;

    if (!cookieValue) {
        return res.status(400).json({ status: 'error', message: 'Niepoprawna wartość.' });
    };

    try {
        const setResult = await setAcceptCookies(cookieValue, userId);

        if (setResult.status === 'error') {
            return res.status(500).json({ status: 'error', message: setResult.mesage });
        } else if (setResult.status === 'success') {
            return res.status(200).json({ status: 'success', message: setResult.mesage });
        };
    } catch (error) {
        logger.error(`Błąd w setCookieValue: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };

};

exports.setTourValue = async (req, res) => {
    const userId = req.userId;

    if (!tourValue) {
        return res.status(404).json({ status: 'error', message: '' })
    };

    try {
        const setResult = await setCompleteTour(userId);

        if (setResult.status === 'error') {
            return res.status(500).json({ status: 'error', message: setResult.mesage });
        } else if (setResult.status === 'success') {
            return res.status(200).json({ status: 'success', message: setResult.mesage });
        };
    } catch (error) {
        logger.error(`ERROR w setTourValue: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };
};