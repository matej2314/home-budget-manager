const pool = require('../../database/db');
const { v4: uuidv4 } = require('uuid');
const actionQueries = require('../../database/transactionsQueries');
const checkHouse = require('../../utils/checkUserHouse');
const logger = require('../../configs/logger');
const { liveUpdateBalance } = require('../../utils/liveUpdateBalance');

const addNewAction = async (userId, type, value, catId) => {
    const transactionId = uuidv4();
    const id = uuidv4();
    
    const validTypes = ['income', 'expense'];
    
    if (!type || !validTypes.includes(type) ) {
        logger.error('Nieprawidłowe dane wejściowe do dodania transakcji.');
        return {
            status: 'nodata',
            message: 'Nieprawidłowe dane wejściowe. Sprawdź typ i wartość.',
        };
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const houseData = await checkHouse(connection, userId);

        if (!houseData) {
            logger.error(`Użytkownik ${userId} nie należy do żadnego gospodarstwa.`);
            return {
                status: 'error',
                message: `Użytkownik ${userId} nie należy do żadnego gospodarstwa.`,
            };
        }

        const houseId = houseData.houseId;
    
        const addActionQuery = actionQueries.newitemQuery;
        await connection.query(addActionQuery, [id, transactionId, userId, houseId, catId, type, value]);

        logger.info(`Transakcja ${transactionId} została pomyślnie dodana dla gospodarstwa ${houseId}.`);

        await liveUpdateBalance(type, value, houseId, connection);
        
        await connection.commit();

        return {
            status: 'success',
            message: 'Transakcja dodana poprawnie.',
            transactionId,
        };

    } catch (error) {
        await connection.rollback();
        logger.error(`Błąd podczas dodawania transakcji: ${error.message}`);
        return {
            status: 'error',
            message: 'Wystąpił błąd podczas dodawania transakcji. Spróbuj ponownie.',
        };
    } finally {
        if (connection) connection.release();
    };

};

module.exports = {addNewAction};