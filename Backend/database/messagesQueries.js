module.exports = {
    saveMessage: 'INSERT INTO messages (id, senderId, recipientId, content, datetime, is_read) VALUES (?, ?, ?, ?, NOW(), ?)',
    getMessages: 'SELECT * FROM messages WHERE senderId = ? OR recipientId = ? ORDER BY datetime',
}