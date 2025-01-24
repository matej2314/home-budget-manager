module.exports = {
    saveConnection: 'INSERT INTO socketConnections (id, userId, connectionId, expireDate) VALUES(?, ?, ?, ?)',
    deleteConnection: 'DELETE FROM socketConnections WHERE userId =? AND connectionId=?',
    selectConnection: 'SELECT connectionId FROM socketConnections WHERE userId=?',
}