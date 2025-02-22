const pool = require('../../database/db');

const countTotalPages = async (dataType, houseId, userId) => {
    const connection = await pool.getConnection();
    let query = ``;
    let params = [];

    if (dataType === 'transactions' && houseId) {
        query = `SELECT COUNT(*) AS total FROM transactions WHERE houseId = ?`;
        params = [houseId];
    } else if (dataType === 'messages' && userId) {
        query = `SELECT COUNT(*) AS total FROM messages WHERE senderId =? OR recipientId =?`;
        params = [userId, userId];
    } else {
        return;
    }

    try {
        const [getPagesCounter] = await connection.query(query, params);

        if (getPagesCounter.length > 0) {

            const totalRecords = getPagesCounter[0].total;
            const limit = 10;
            const totalPages = Math.ceil(totalRecords / limit);

            return { status: 'success', type: dataType, pages: totalPages };

        } else if (!getPagesCounter.length) {
            return { status: 'success', type: dataType, pages: 0 };
        }
    } catch (error) {
        return { status: 'error', message: 'Nie udało się obliczyć liczby stron' }
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { countTotalPages };