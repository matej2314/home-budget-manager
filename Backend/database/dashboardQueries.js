module.exports = {
    householdData: `SELECT h.houseName AS houseName, h.balance AS liveBalance, h.userName AS host, DATE_FORMAT(h.balanceDate, '%Y-%m-%d') AS lastBalanceDate, mb.monthly_balance AS monthlyBalance FROM households h JOIN monthly_balances mb ON h.houseId = mb.houseId WHERE h.houseId = ?`,
    matesData: 'SELECT userName, role FROM householdUsers WHERE houseId = ? ORDER BY id',
    transactionsData: 'SELECT t.transactionId AS transactionId, t.value, t.addedAt, t.userId AS userId, t.houseId, t.catId, c.name AS categoryName FROM transactions t JOIN actionCategories c ON t.catId = c.id WHERE t.houseId = ?; ',
    actionCatData: 'SELECT * FROM actionCategories ORDER BY id',
    messagesData: 'SELECT * FROM messages WHERE senderId=? OR recipientId=? ORDER BY datetime',
};