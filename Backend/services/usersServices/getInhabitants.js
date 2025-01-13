const pool = require('../../database/db');
const logger = require('../../configs/logger');
const usersQueries = require('../../database/usersQueries');

const getInhabitants = async (houseId) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await pool.query(usersQueries.inhabitantsQuery, [houseId]);
        logger.info(`Lista domowników gospodarstwa ${houseId} pobrana poprawnie`);
        return {
            status: 'success',
            message: `Lista domowników gospodarstwa ${houseId} pobrana poprawnie`,
            users: rows,
        };

    } catch (error) {
        logger.error(`Nie udało się pobrać listy domowników gospodarstwa ${houseId}`);
        return {
            status: 'error',
            message: 'Nie udało się pobrać listy domowników gospodarstwa.',
        };
    } finally {
        connection.release();
    }
};

module.exports = { getInhabitants };