const pool = require('../database/db');
const checkUserHouse = require('../utils/checkUserHouse');
const logger = require('../configs/logger');
const dashboardQueries = require('../database/dashboardQueries');

const getBoardData = async (userId, filter = 'all') => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const userHouse = await checkUserHouse(connection, userId);
        
        if (!userHouse) {
            logger.error(`Brak gospodarstwa użytkownika ${userId}`);
            return { status: 'notfound', message: 'Brak gospodarstwa użytkownika.' };
        }
        const userHouseId = userHouse.houseId;

        let boardData = {};

        if (filter === 'all' || filter === 'house') {
            const [householdData] = await connection.query(dashboardQueries.householdData, [userHouseId]);
        
            if (!householdData) {
                return {status: 'notfound', message: 'Brak informacji o gospodarstwie.'};
            }
            boardData.houseData = householdData;
        }
       
        if (filter === 'all' || filter === 'mates') {
            const [matesData] = await connection.query(dashboardQueries.matesData,[userHouseId]);

            boardData.houseMates = matesData;
        };
       
        if (filter === 'all' || filter === 'transactions') {
            const [transactionsData] = await connection.query(dashboardQueries.transactionsData, [userHouseId]);
        
            boardData.actionsData = transactionsData;
        };
       

        if (filter === 'all' || filter === 'categories') {
            const [actionsCatData] = await connection.query(dashboardQueries.actionCatData);
            boardData.actionCatData = actionsCatData;
        };

        if (filter === 'all' || filter === 'messages') {
            const [messagesData] = await connection.query(dashboardQueries.messagesData, [userId, userId]);
            boardData.messagesData = messagesData;
        };
        
        await connection.commit();

        return {
            status: 'success',
            message: 'Dane boardu pobrane poprawnie.',
            dashboardData: boardData,
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