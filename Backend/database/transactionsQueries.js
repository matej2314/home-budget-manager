module.exports = {
    newitemQuery: 'INSERT INTO transactions (transactionId, userId, householdId, type, value) VALUES (?, ?, ?, ?, ?)',
    allQuery: 'SELECT * FROM transactions ORDER BY transactionId',
    getQuery: 'SELECT * FROM transactions WHERE userId=? AND householdId=? ORDER BY transactionId',
    deleteQuery : 'DELETE FROM transactions WHERE userId=? AND householdId=? AND transactionId=?',
};