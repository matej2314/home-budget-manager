module.exports = {
    delUsersQuery : 'DELETE FROM users WHERE id = ?',
    deleteHouse: 'DELETE FROM households WHERE houseId = ?',
    checkQuery : 'SELECT inmate FROM users WHERE id = ?',
    selectUserByName: 'SELECT * FROM users WHERE name=?',
    updatehouseIdHu: 'UPDATE householdUsers SET houseId = ? WHERE userId = ?',
    mateQuery: 'UPDATE users SET inmate = ?, role = ? WHERE id = ?',
    hostQuery: 'UPDATE users SET host = ?, role = ? WHERE id = ?',
    updateroleHu: 'UPDATE householdUsers SET role = ? WHERE userId = ?',
    allUsersQuery: 'SELECT * FROM householdUsers ORDER BY id;',
    delUsersActions: 'DELETE FROM transactions WHERE userId=?',
};