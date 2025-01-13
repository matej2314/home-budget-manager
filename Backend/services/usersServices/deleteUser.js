const pool = require('../../database/db');
const logger = require('../../configs/logger');
const usersQueries = require('../../database/usersQueries');

const deleteUser = async (userId) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [householdResult] = await connection.query(usersQueries.checkHousehold, [userId]);
        if (householdResult.length > 0) {
            const householdId = householdResult[0].household_id;

            await connection.query(usersQueries.deleteHouse, [householdId]);
            logger.info(`Gospodarstwo użytkownika ${userId} (ID: ${householdId}) usunięte.`);
        } else {
            logger.info(`Użytkownik ${userId} nie ma przypisanego gospodarstwa.`);
        }

        await connection.query(usersQueries.delUserQuery, [userId]);
        logger.info(`Użytkownik ${userId} usunięty poprawnie.`);

        await connection.commit();

        return { status: 'success', message: 'Użytkownik usunięty poprawnie.' };

    } catch (error) {

        await connection.rollback();

        logger.error(`Błąd podczas usuwania użytkownika ${userId}: ${error.message}`);
        return { status: 'error', message: 'Błąd serwera.' };

    } finally {
        connection.release();
    }
};

module.exports = { deleteUser };