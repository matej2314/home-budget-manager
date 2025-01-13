module.exports = {
    allUsersQuery: 'SELECT id, role, name, household_id from users ORDER By id',
    inhabitantsQuery: 'SELECT id, role, name, email FROM users WHERE inhabitant=? ORDER BY id',
    checkHousehold : 'SELECT household_id FROM users WHERE id = ?',
    delUserQuery : 'DELETE FROM users WHERE id = ?',
    deleteHouse: 'DELETE FROM households WHERE houseId = ?',
    checkQuery : 'SELECT inmate FROM users WHERE id = ?',
    deleteQuery : 'UPDATE users SET inhabitant = NULL WHERE id = ?',
    selectUserByName: 'SELECT * FROM users WHERE name=?',
};