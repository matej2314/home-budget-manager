const pool = require('../../database/db');
const logger = require('../../configs/logger');

const setCompleteTour = async (userId) => {
    const connection = await pool.getConnection();

    try {
        const [saveTourValue] = await connection.query('UPDATE users SET completeTour=? WHERE id=?', [1, userId]);

        if (saveTourValue.affectedRows === 0) {
            logger.error(`Zapis info o samouczku użytkownika ${userId} nieudany.`);
            return { status: 'error', message: 'Wystąpił błąd serwera.' };

        } else if (saveTourValue.affectedRows === 1) {
            return {
                status: 'success',
                message: 'Gratulujemy przejścia samouczka!',
            };
        };

    } catch (error) {
        logger.error(`Błąd w setTourValue: ${error}`);
        return { status: 'error', mesage: 'Błąd serwera.' };
    };
};

module.exports = { setCompleteTour };