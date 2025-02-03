const pool = require('../../database/db');
const houseQueries = require('../../database/householdQueries');
const logger = require('../../configs/logger');
const checkUserHouse = require('../../utils/checkUserHouse');

exports.getHouseInfo = async (userId) => {
    if (!userId) {
        logger.error('Brak danych do pobrania informacji o gospodarstwie.');
        return { status: 'error', message: 'Brak poprawnych informacji.' };
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const checkHouse = await checkUserHouse(connection, userId);

        const householdId = checkHouse.houseId;
       
            const [basicData] = await connection.execute(houseQueries.dataQuery, [householdId]);

            if (basicData.length === 0) {
                logger.error('Nie znaleziono gospodarstwa.');
                return { status: 'error', message: 'Nie znaleziono gospodarstwa.' };
            }

            const [statsData] = await connection.query(houseQueries.statsQuery, [householdId]);
            
            await connection.commit();
    
            logger.info(`Informacje o gospodarstwie ${householdId} pobrane poprawnie.`);
            return {
                status: 'success',
                message: 'Informacje o gospodarstwie pobrane poprawnie.',
                info: basicData,
                stats: statsData,
            };
        } catch (error) {
        await connection.rollback();
        logger.error(`Błąd podczas pobierania informacji o gospodarstwie: ${error.stack}`);
        return { status: 'error', message: 'Nie udało się pobrać danych o gospodarstwie.' };
    } finally {
        if (connection) connection.release();
    }
}