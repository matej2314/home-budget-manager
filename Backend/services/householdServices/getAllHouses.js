const pool = require('../../database/db');
const houseQueries = require('../../database/householdQueries');
const logger = require('../../configs/logger');

exports.getAllHouses = async () => {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute(houseQueries.getAllHousesQuery);

        if (result.length === 0) {
            logger.info('Brak gospodarstw.');
            return { status: 'error', message: 'Brak gospodarstw.' };
        }

        logger.info('Gospodarstwa pobrane poprawnie.');
        return {
            status: 'success',
            message: 'Gospodarstwa pobrane poprawnie.',
            houses: result,
        };
    } catch (error) {
        logger.error(`Błąd podczas pobierania gospodarstw: ${error.stack}`);
        return { status: 'error', message: 'Błąd podczas pobierania gospodarstw.' };
    } finally {
        connection.release();
    }
};