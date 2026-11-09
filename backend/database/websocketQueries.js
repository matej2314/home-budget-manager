module.exports = {
    checkIfConnection: 'SELECT * FROM socketConnections WHERE userId=?',
    saveConnection: 'INSERT INTO socketConnections (id, userId, connectionId, expireDate) VALUES(?, ?, ?, ?)',
    deleteConnection: 'DELETE FROM socketConnections WHERE userId =?',
    selectConnection: 'SELECT connectionId FROM socketConnections WHERE userId=?',
}