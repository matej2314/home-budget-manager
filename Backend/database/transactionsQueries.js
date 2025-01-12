module.exports = {
    newitemQuery: 'INSERT INTO transactions (transactionId, userId, houseId, type, value) VALUES (?, ?, ?, ?, ?)',
    allQuery: 'SELECT * FROM transactions ORDER BY transactionId',
    getQuery: 'SELECT * FROM transactions WHERE houseId=? ORDER BY transactionId',
    deleteQuery: 'DELETE FROM transactions WHERE userId=? AND houseId=? AND transactionId=?',
    checkQuery : 'SELECT houseId FROM householdUsers WHERE userId=?;'
};