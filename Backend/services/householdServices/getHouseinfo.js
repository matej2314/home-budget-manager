const pool = require('../../database/db');
const houseQueries = require('../../database/householdQueries');
const logger = require('../../configs/logger');

exports.getHouseInfo = async (userId) => {
    if (!userId) {
        logger.error('Brak danych do pobrania informacji o gospodarstwie.');
        return { status: 'error', message: 'Brak poprawnych informacji.' };
    }

    const connection = await pool.getConnection();

    try {
        const [gethouseId] = await connection.query('SELECT houseId FROM householdUsers WHERE userId =?', [userId]);
       
        if (gethouseId.length === 0) {
            logger.error('Użytkownik nie zarządza gospodarstwem.');
            return { status: 'error', message: 'Użytkownik nie zarządza gospodarstwem.' };
        } else {
            const householdId = gethouseId[0].houseId;
           
            const [result] = await connection.execute(houseQueries.dataQuery, [householdId]);

            if (result.length === 0) {
                logger.error('Nie znaleziono gospodarstwa.');
                return { status: 'error', message: 'Nie znaleziono gospodarstwa.' };
            }
    
            logger.info(`Informacje o gospodarstwie ${householdId} pobrane poprawnie.`);
            return {
                status: 'success',
                message: 'Informacje o gospodarstwie pobrane poprawnie.',
                info: result,
            };
        };

    } catch (error) {
        logger.error(`Błąd podczas pobierania informacji o gospodarstwie: ${error.stack}`);
        return { status: 'error', message: 'Nie udało się pobrać danych o gospodarstwie.' };
    } finally {
        if (connection) connection.release();
    }
}