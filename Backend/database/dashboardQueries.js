module.exports = {
    householdData: `SELECT h.houseName AS houseName, h.balance AS liveBalance, h.userName AS host,
     DATE_FORMAT(h.balanceDate, '%Y-%m-%d') AS lastBalanceDate, mb.monthly_balance AS monthlyBalance
      FROM households h JOIN monthly_balances mb ON h.houseId = mb.houseId WHERE h.houseId = ?`,
    matesData: 'SELECT userName, role FROM householdUsers WHERE houseId = ? ORDER BY id',
    transactionsData: `SELECT t.transactionId AS transactionId, t.value, t.addedAt, t.type AS type,
     t.userId AS userId, t.houseId, t.catId, c.name AS categoryName, u.name AS userName FROM
      transactions t JOIN actionCategories c ON t.catId = c.id JOIN users u ON t.userId = u.id WHERE t.houseId = ?;`,
    actionCatData: 'SELECT * FROM actionCategories ORDER BY id',
    messagesData: `SELECT m.content AS message, m.datetime AS date, u1.name AS sender, u2.name AS recipient FROM messages m JOIN 
        users u1 ON m.senderId = u1.id JOIN users u2 ON m.recipientId = u2.id WHERE m.senderId = ? OR m.recipientId = ?;`,
};