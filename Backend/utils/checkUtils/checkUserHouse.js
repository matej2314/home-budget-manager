const actionQueries = require('../../database/transactionsQueries');

const checkUserHouse = async (connection, userId) => {
    const [result] = await connection.query(actionQueries.checkQuery, [userId]);
    return result.length > 0 ? result[0] : null;
};

module.exports = checkUserHouse;