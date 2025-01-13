const pool = require('../../database/db');
const usersQueries = require('../../database/usersQueries');

const getAllUsers = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await pool.query(usersQueries.allUsersQuery);
        logger.info('Lista wszystkich użytkowników pobrana poprawnie.');
        return {
            status: 'success',
            message: 'Lista wszystkich użytkowników pobrana poprawnie',
            users: rows,
        };

    } catch (error) {
        logger.error(`Błąd podczas pobierania listy użytkowników: ${error}`);
        return { status: 'error', mesage: 'Bląd pobierania listy użytkowników' };
    } finally {
        connection.release();
    }
};

module.exports = { getAllUsers };