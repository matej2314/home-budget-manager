const pool = require('../../database/db');
const logger = require('../../configs/logger');

const setCompleteTour = async (userId) => {
    const connection = await pool.getConnection();

    try {
        const [saveTourValue] = await connection.query('UPDATE users SET completeTour=? WHERE id=?', [1, userId]);

        if (saveTourValue.affectedRows === 0) {
            logger.error(`User  ${userId} tutorial info saved failed.`);
            return { status: 'error', message: 'Internal server error.' };

        } else if (saveTourValue.affectedRows === 1) {
            return {
                status: 'success',
                message: 'Congratulations for passing the tutorial!',
            };
        };

    } catch (error) {
        logger.error(`setTourValue error: ${error}`);
        return { status: 'error', mesage: 'Internal server error.' };
    };
};

module.exports = { setCompleteTour };