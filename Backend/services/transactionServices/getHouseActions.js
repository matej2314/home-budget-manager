const pool = require('../../database/db');
const actionQueries = require('../../database/transactionsQueries');
const checkHouse = require('../../utils/checkUserHouse');

const getHouseActions = async (userId) => {
    const connection = await pool.getConnection();

    try {
        const houseData = await checkHouse(connection, userId);
    
        if (!houseData) {
            logger.error(`Użytkownik ${userId} nie należy do żadnego gospodarstwa.`);
            return res.status(404).json({
                status: 'notfound',
                message: `Użytkownik ${userId} nie należy do żadnego gospodarstwa.`,
            });
        }
    
        const houseId = houseData.houseId;
        const [rows] = await connection.query(actionQueries.getQuery, [houseId]);
    
        if (rows.length == 0) {
            logger.error(`Brak transakcji dla gospodarstwa ${houseId}`);
            return res.status(404).json({
                status: 'notfound',
                message: 'Brak transakcji dla gospodarstwa.',
            });
        }
        logger.info(`Pobranie wszystkich transakcji dla gospodarstwa zakończyło się sukcesem.`);
        return res.status(200).json({
            status: 'success',
            message: 'Transakcje dla gospodarstwa pobrane poprawnie',
            actions: rows,
        });
    } catch (error) {
        logger.error(`Błąd podczas pobierania transakcji gospodarstwa: ${error.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Błąd podczas pobierania transakcji dla gospodarstwa.',
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getHouseActions };