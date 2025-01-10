module.exports = {
    checkQuery: 'SELECT * FROM households WHERE houseName = ?',
    addQuery: 'INSERT INTO households (houseId, ownerId, houseName) VALUES (?, ?, ?)',
    mateQuery: 'UPDATE users SET inhabitant = ? WHERE id = ?',
    dataQuery: 'SELECT * FROM households WHERE houseId=? AND ownerId=?',
    ownershipQuery: 'SELECT ownerId FROM households WHERE houseId=?',
    deleteQuery : 'DELETE FROM households WHERE houseId=? AND ownerId=?',
};