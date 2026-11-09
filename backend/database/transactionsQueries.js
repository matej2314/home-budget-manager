module.exports = {
    newitemQuery: 'INSERT INTO transactions (id, transactionId, userId, houseId, catId, type, value) VALUES (?, ?, ?, ?, ?, ?, ?)',
    allQuery: 'SELECT * FROM transactions ORDER BY transactionId',
    getQuery: `SELECT t.transactionId AS transaction_id, t.value, t.addedAt, t.houseId, t.catId, t.userId AS userId,
     c.name AS category_name FROM transactions t JOIN actionCategories c ON t.catId = c.id WHERE t.houseId = ?; `,
    deleteQuery: 'DELETE FROM transactions WHERE userId=? AND houseId=? AND transactionId=?',
    checkQuery: 'SELECT houseId FROM householdUsers WHERE userId=?;'
};