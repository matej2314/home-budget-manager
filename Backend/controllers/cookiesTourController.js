const pool = require('../database/db');
const logger = require('../configs/logger');

exports.setCookieValue = async (req, res) => {
    const userId = req.userId;
    const cookieValue = req.body.cookieValue;
    const connection = await pool.getConnection();

    try {
        const [saveCookiesValue] = await connection.query('UPDATE users SET acceptCookies =? WHERE id =?', [cookieValue, userId]);

        if (saveCookiesValue.affectedRows === 0) {
            logger.error(`Zapis zgody cookies użytkownika ${userId} nieudany.`);
            return res.status(500).json({ status: 'error', message: 'Wystąpił błąd serwera.' });
        } else if (saveCookiesValue.affectedRows === 1) {
            return res.status(200).json({
                status: 'success',
                message: 'Twoja zgoda została zapisana.',
            });
        };
    } catch (error) {
        logger.error(`Błąd setCookieValue: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };
};

exports.setTourValue = async (req, res) => {
    const userId = req.userId;
    const tourValue = req.body.tourValue;
    const connection = await pool.getConnection();

    try {
        const [saveTourValue] = await connection.query('UPDATE users SET completeTour=? WHERE id=?', [tourValue, userId]);

        if (saveTourValue.affectedRows === 0) {
            logger.error(`Zapis info o samouczku użytkownika ${userId} nieudany.`);
            return res.status(500).json({ status: 'error', message: 'Wystąpił błąd serwera.' });
        } else if (saveTourValue.affectedRows === 1) {
            return res.status(200).json({
                status: 'success',
                message: 'Gratulujemy przejścia samouczka!',
            });
        };

    } catch (error) {
        logger.error(`Błąd w setTourValue: ${error}`);
        return res.status(500).json({ status: 'error', mesage: 'Błąd serwera.' });
    };
};