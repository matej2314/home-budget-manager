module.exports = {
    newitemQuery: 'INSERT INTO transactions (id, transactionId, userId, houseId, catId, type, value) VALUES (?, ?, ?, ?, ?, ?, ?)',
    allQuery: 'SELECT * FROM transactions ORDER BY transactionId',
    getQuery: 'SELECT * FROM transactions WHERE houseId=? ORDER BY transactionId',
    deleteQuery: 'DELETE FROM transactions WHERE userId=? AND houseId=? AND transactionId=?',
    checkQuery : 'SELECT houseId FROM householdUsers WHERE userId=?;'
};