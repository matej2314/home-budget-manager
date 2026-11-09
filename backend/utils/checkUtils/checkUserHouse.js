import actionQueries from '../../database/transactionsQueries.js';

const checkUserHouse = async (connection, userId) => {
    const [result] = await connection.query(actionQueries.checkQuery, [userId]);
    return result.length > 0 ? result[0] : null;
};

export default checkUserHouse;
