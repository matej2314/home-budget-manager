const pool = require('../database/db');

const clearSocketConnections = async  () => {

    const connection = await pool.getConnection();
    try {
        const [clearConnections] = await connection.query('DELETE FROM socketConnections');

        if (clearConnections.affectedRows === 1) {
            console.log('Wszystkie połączenia websocket zostały usunięte.')
            return true;
        } else if (clearConnections.affectedRows === 0) {
            console.log('Nie udało się usunąć połączeń websocket.');
            return null;
        };
    } catch (error) {
       console.log(`Błąd w clearSocketConnections: ${error}`);
    };
};

module.exports = { clearSocketConnections };