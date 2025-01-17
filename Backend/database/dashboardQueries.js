module.exports = {
    householdData: 'SELECT houseName, userName, balance, balanceDate FROM households WHERE houseId = ?',
    matesData: 'SELECT userName, role FROM householdUsers WHERE houseId = ? ORDER BY id',
    transactionsData: 'SELECT t.transactionId AS transaction_id, t.value, t.addedAt, t.userId, t.houseId, t.catId, c.name AS category_name FROM transactions t JOIN actionCategories c ON t.catId = c.id WHERE t.houseId = ?; ',
    actionCatData: 'SELECT * FROM actionCategories ORDER BY id',
};