const pool = require('../../database/db');
const logger = require('../../configs/logger');
const usersQueries = require('../../database/usersQueries');

const getUsersCollection = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await pool.query(usersQueries.allUsersQuery);
        logger.info('Lista wszystkich użytkowników pobrana poprawnie.');

        if (rows.affectedRows === 0) {
            return {
                status: 'notfound',
                message: 'Brak użytkowników',
            };
        };

        return {
            status: 'success',
            message: 'Lista wszystkich użytkowników pobrana poprawnie',
            users: rows,
        };

    } catch (error) {
        logger.error(`Błąd podczas pobierania listy użytkowników: ${error}`);
        return { status: 'error', mesage: 'Bląd pobierania listy użytkowników' };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getUsersCollection };