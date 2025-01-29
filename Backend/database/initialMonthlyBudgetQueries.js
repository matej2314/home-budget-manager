module.exports = {
    addInitialBudgetQuery: `INSERT INTO initialMonthlyBudgets (id, houseId, value, validUntil) VALUES (?, ? ,? ,?);`,
    getAddedAt: `SELECT DATE_FORMAT(addedAt, '%Y-%m-%d') AS addedAt FROM initialMonthlyBudgets WHERE id=?;`,
    updateBudgetQuery : 'UPDATE initialMonthlyBudgets SET value=? WHERE id=?',
}