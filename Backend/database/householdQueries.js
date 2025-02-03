module.exports = {
    checkQuery: 'SELECT * FROM households WHERE houseName = ? LIMIT 1',
    addQuery: 'INSERT INTO households (houseId, userId, userName, houseName, initBudget) VALUES (?, ?, ?, ?, ?)',
    mateQuery: 'UPDATE users SET inmate = ?, role = ? WHERE id = ?',
    hostQuery: 'UPDATE users SET host = ?, role = ? WHERE id = ?',
    dataQuery: `SELECT houseId, houseName, initBudget, DATE_FORMAT(createdAt, '%Y-%m-%d') AS createdAt FROM households WHERE houseId = ?;`,
    statsQuery: `SELECT 
    ib.value AS initialBudgetValue,
     DATE_FORMAT(ib.addedAt, '%Y-%m-%d') AS initBudgetDate,
     DATE_FORMAT(ib.validUntil, '%Y-%m-%d') AS initialBudgetValidDate,
     mb.monthly_balance AS monthlyBalanceValue,
     DATE_FORMAT(mb.balanceDate, '%Y-%m-%d') AS monthlyBalanceDate,
     tc.transactionCount AS transactionCount,
     tc.StartDate AS actionsStartDate,
     tc.balanceDate AS actionsEndDate
     FROM initialMonthlyBudgets ib
     LEFT JOIN monthly_balances mb
     ON ib.houseId = mb.houseId
     LEFT JOIN transactionCounts tc
     ON ib.houseId = tc.houseId
     WHERE ib.houseId=?
     ORDER BY mb.balanceDate ASC; `,
    ownershipQuery: 'SELECT houseId FROM households WHERE houseName=?',
    deleteQuery: 'DELETE FROM households WHERE houseId=? AND userId=?',
    updateroleHu: 'UPDATE householdUsers SET role = ? WHERE userId = ?',
  getAllHousesQuery: `SELECT h.houseId, h.houseName, h.userId, hu.userName, hu.role FROM households h JOIN householdUsers hu
   ON h.houseId = hu.houseId ORDER BY h.houseId; `,
    updatehouseIdHu: 'UPDATE householdUsers SET houseId = ? WHERE userId = ?',
    deleteHouseActions: 'DELETE FROM transactions WHERE houseId=?',
   
};