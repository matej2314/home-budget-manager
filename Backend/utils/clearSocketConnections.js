const pool = require('../database/db');

const clearSocketConnections = async () => {

    const connection = await pool.getConnection();
    try {
        const [clearConnections] = await connection.query('DELETE FROM socketConnections');

        if (clearConnections.affectedRows === 1) {
            console.log('All websocket connections was deleted correctly.')
            return true;
        } else if (clearConnections.affectedRows === 0) {
            console.log('Failed to delete websocket connections.');
            return null;
        };
    } catch (error) {
        console.log(`clearSocketConnections error: ${error}`);
    };
};

module.exports = { clearSocketConnections };