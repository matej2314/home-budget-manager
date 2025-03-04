const pool = require('../../database/db');
const logger = require('../../configs/logger');
const usersQueries = require('../../database/usersQueries');

const getInhabitants = async (houseId) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await pool.query(usersQueries.inhabitantsQuery, [houseId]);
        logger.info(`List of housemates of household ${houseId} fetched correctly.`);
        return {
            status: 'success',
            message: `List of housemates of household ${houseId} fetched correctly.`,
            users: rows,
        };

    } catch (error) {
        logger.error(`Failed to fetch housemates of household ${houseId}`);
        return {
            status: 'error',
            message: 'Failed to fetch housemates.',
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getInhabitants };