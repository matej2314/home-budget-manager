const pool = require('../../database/db');
const houseQueries = require('../../database/householdQueries');
const logger = require('../../configs/logger');

exports.getHouseInfo = async (userId) => {
    if (!userId) {
        logger.error('Brak danych do pobrania informacji o gospodarstwie.');
        return res.status(400).json({ status: 'error', message: 'Brak poprawnych informacji.' });
    }

    const connection = await pool.getConnection();

    try {
        const [gethouseId] = await connection.query('SELECT houseId FROM householdUsers WHERE userId =?', [userId]);
       
        if (gethouseId.length === 0) {
            logger.error('Użytkownik nie zarządza gospodarstwem.');
            return res.status(404).json({ status: 'error', message: 'Użytkownik nie zarządza gospodarstwem.' });
        } else {
            const householdId = gethouseId[0].houseId;
           
            const [result] = await connection.execute(houseQueries.dataQuery, [householdId]);

            if (result.length === 0) {
                logger.error('Nie znaleziono gospodarstwa.');
                return res.status(404).json({ status: 'error', message: 'Nie znaleziono gospodarstwa.' });
            }
    
            logger.info(`Informacje o gospodarstwie ${householdId} pobrane poprawnie.`);
            return res.status(200).json({
                status: 'success',
                message: 'Informacje o gospodarstwie pobrane poprawnie.',
                info: result,
            });
        };

    } catch (error) {
        logger.error(`Błąd podczas pobierania informacji o gospodarstwie: ${error.stack}`);
        return res.status(500).json({ status: 'error', message: 'Nie udało się pobrać danych o gospodarstwie.' });
    } finally {
        if (connection) connection.release();
    }
}