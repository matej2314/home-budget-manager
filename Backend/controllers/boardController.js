const pool = require('../database/db');
const checkUserHouse = require('../utils/checkUserHouse');
const logger = require('../configs/logger');
const dashboardQueries = require('../database/dashboardQueries');

const getBoardData = async (userId) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const userHouse = await checkUserHouse(connection, userId);
        
        if (!userHouse) {
            logger.error(`Brak gospodarstwa użytkownika ${userId}`);
            return { status: 'notfound', message: 'Brak gospodarstwa użytkownika.' };
        }
        const userHouseId = userHouse.houseId;

        const [householdData] = await connection.query(dashboardQueries.householdData, [userHouseId]);
        
        if (!householdData) {
            return {status: 'notfound', message: 'Brak informacji o gospodarstwie.'};
        }

        const houseData = householdData;
       
        const [matesData] = await connection.query(dashboardQueries.matesData,[userHouseId]);

        const houseMates = matesData;

        const [transactionsData] = await connection.query(dashboardQueries.transactionsData, [userHouseId]);
        
        const actionsData = transactionsData;

        const [actionsCatData] = await connection.query(dashboardQueries.actionCatData);

        const [messagesData] = await connection.query('SELECT * FROM messages WHERE senderId=? OR recipientId=? ORDER BY datetime', [userId, userId]);

        await connection.commit();

        return {
            status: 'success',
            message: 'Dane boardu pobrane poprawnie.',
            dashboardData: {
                houseData,
                houseMates,
                messagesData,
                actionsData,
                actionsCatData,
            },
        };

    } catch (error) {
        await connection.rollback();
        logger.error(`Błąd w dashboardRoutes: ${error.message}`);
        return {
            status: 'error',
            message: error.message || 'Błąd przetwarzania danych.',
        };
    } finally {
        connection.release();
    }
};

module.exports = { getBoardData };