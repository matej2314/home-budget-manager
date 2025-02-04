module.exports = {
    householdData: `SELECT
    h.houseName AS houseName,
    h.balance AS liveBalance,
    h.userName AS host,
    DATE_FORMAT(h.balanceDate, '%Y-%m-%d') AS lastBalanceDate,
    ib.value AS lastInitialBudget,
    DATE_FORMAT(ib.validUntil, '%Y-%m-%d') AS validUntil,
    DATE_FORMAT(ib.addedAt, '%Y-%m-%d') AS definedAt,
    mb.monthly_balance AS latestMonthly
    FROM households h
    LEFT JOIN initialMonthlyBudgets ib
    ON h.houseId = ib.houseId
    AND ib.addedAt = (
        SELECT MAX(addedAt)
        FROM initialMonthlyBudgets
        WHERE houseId = h.houseId
    )
    LEFT JOIN monthly_balances mb
    ON mb.houseId = h.houseId
    AND mb.balanceDate = (
        SELECT MAX(balanceDate)
        FROM monthly_balances
        WHERE houseId = h.houseId
    )
WHERE h.houseId = ?;`,
    
statsQuery: `SELECT
ib.value AS definedMonthlyBudgets,
 DATE_FORMAT(ib.addedAt, '%Y-%m-%d') AS initMonthlyBudgetDate,
 DATE_FORMAT(ib.validUntil, '%Y-%m-%d') AS initMonthlyBudgetValidDate,
 mb.monthly_balance AS monthlyBalanceValue,
 DATE_FORMAT(mb.balanceDate, '%Y-%m-%d') AS monthlyBalanceDate,
 tc.transactionCount AS transactionCount,
 DATE_FORMAT(tc.StartDate, '%Y-%m-%d') AS countStartDate,
 DATE_FORMAT(tc.balanceDate, '%Y-%m-%d') AS countEndDate
 FROM initialMonthlyBudgets ib
 LEFT JOIN monthly_balances mb
 ON ib.houseId = mb.houseId
 LEFT JOIN transactionCounts tc
 ON ib.houseId = tc.houseId
 WHERE ib.houseId=?
 ORDER BY mb.balanceDate ASC; `,
matesData: 'SELECT userName, role FROM householdUsers WHERE houseId = ? ORDER BY id',
transactionsData: `SELECT 
t.transactionId AS transactionId,
t.value,
DATE_FORMAT(t.addedAt, '%Y-%d-%m') AS addedAt,
t.type AS type,
t.userId AS userId,
t.houseId,
t.catId,
c.name AS categoryName,
u.name AS userName FROM
transactions t JOIN actionCategories c ON t.catId = c.id JOIN users u ON t.userId = u.id WHERE t.houseId = ?;`,
actionCatData: 'SELECT * FROM actionCategories ORDER BY id',
messagesData: `SELECT m.id AS id, m.content AS message, m.is_read AS readed, m.datetime AS date, u1.name AS sender,
u2.name AS recipient FROM messages m JOIN
users u1 ON m.senderId = u1.id JOIN users u2 ON m.recipientId = u2.id WHERE m.senderId = ? OR m.recipientId = ?;`,
};
