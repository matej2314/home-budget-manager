const pool = require('../database/db');
const logger = require('../configs/logger');
const dashboardQueries = require('../database/dashboardQueries');
const checkUserHouse = require('../utils/checkUtils/checkUserHouse');
const { countTotalPages } = require('../utils/dbUtils/countTotalPages');

const getBoardData = async (userId, filter = 'all', page = 1, limit = 10) => {
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
        const offset = (page - 1) * limit;

        if (filter === 'all' || filter === 'house') {
            const [householdData] = await connection.query(dashboardQueries.householdData, [userHouseId]);

            if (!householdData) {
                return { status: 'notfound', message: 'Brak informacji o gospodarstwie.' };
            }
            boardData.houseData = householdData;
        }

        if (filter === 'all' || filter === 'mates') {
            const [matesData] = await connection.query(dashboardQueries.matesData, [userHouseId]);

            boardData.houseMates = matesData;
        };

        if (filter === 'transactions') {
            const [transactionsData] = await connection.query(dashboardQueries.transactionsData, [userHouseId, limit, offset]);
            boardData.actionsData = transactionsData;
            const totalPages = await countTotalPages(filter, userHouseId);
            boardData.totalPages = totalPages ? totalPages.pages : 0;
        };

        if (filter === 'all' || filter === 'daily') {
            const [dailyData] = await connection.query(dashboardQueries.dailyData, [userHouseId]);

            boardData.dailyData = dailyData;
        }


        if (filter === 'all' || filter === 'categories') {
            const [actionsCatData] = await connection.query(dashboardQueries.actionCatData);
            boardData.actionCatData = actionsCatData;
        };

        if (filter === 'messages') {
            const [messagesData] = await connection.query(dashboardQueries.messagesData, [userId, userId, limit, offset]);
            boardData.messagesData = messagesData;
            const totalPages = await countTotalPages(filter, userHouseId, userId);
            boardData.totalPages = totalPages ? totalPages.pages : 0;
        };

        if (filter === 'all' || filter === 'stats') {
            const [statsData] = await connection.query(dashboardQueries.statsQuery, [userHouseId]);
            boardData.statsData = statsData;
        };

        await connection.commit();
        boardData.page = page;

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