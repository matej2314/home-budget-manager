const logger = require('./logger');
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const io = require('socket.io');

let ioInstance;

const initializeWebSocket = (server) => {
   
    ioInstance = io(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    ioInstance.on('connection', (socket) => {
        const token = socket.handshake.headers.cookie?.SESSID;

        if (!token) {
            logger.error('Błąd autoryzacji WebSocket.');
            socket.emit('error', { type: 'error', message: 'Błąd autoryzacji.' });
            socket.disconnect();
            return;
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                socket.emit('error', { type: 'error', message: 'Błąd autoryzacji.' });
                socket.disconnect();
            } else {
                socket.userId = decoded.id;
                logger.info('Nowe połączenie WebSocket.');
            }
        });

        logger.info('Połączenie websocket nawiązane.');

        socket.on('message', async (message) => {
            let connection;
        
            try {
                const parsedMessage = JSON.parse(message);
                const { type, data } = parsedMessage;
        
                connection = await pool.getConnection();
        
                if (type === 'send') {
                    const id = uuidv4();
                    const { recipientId, content } = data;
        
                    await connection.query('INSERT INTO messages (id, senderId, recipientId, content, is_read) VALUES (?, ?, ?, ?, ?)', 
                        [id, socket.userId, recipientId, content, false]);
        
                    logger.info(`Wiadomość o ID ${id} została zapisana w bazie danych`);

                    broadcastMessage({
                        type: 'newMessage',
                        message: {
                            id,
                            senderId: socket.userId,
                            recipientId,
                            content
                        },
                    });

                } else if (type === 'fetch') {
                    const { userId } = data;
        
                    const [messages] = await connection.query(
                        'SELECT * FROM messages WHERE senderId = ? OR recipientId = ? ORDER BY datetime ASC', 
                        [userId, userId]
                    );
        
                    socket.emit('messages', { type: 'messages', data: messages });
                    logger.info(`Wysłano wiadomości dla użytkownika ${userId}.`);

                } else if (type === 'read') {
                    const { msgId } = data;
        
                    await connection.query('UPDATE messages SET is_read = TRUE WHERE id = ?', [msgId]);
                    logger.info(`Wiadomość o ID ${msgId} została oznaczona jako przeczytana.`);
                    
                } else if (type === 'delMsg') {
                    const { msgId } = data;

                    await connection.query('DELETE FROM messages WHERE id =?', [msgId]);
                    logger.info(`Wiadomość ${msgId} usunięta z systemu.`);

                } else {
                    logger.error(`Nieznany typ wiadomości: ${type}`);
                }
            } catch (error) {
                logger.error(`Błąd podczas przetwarzania wiadomości WebSocket: ${error.message}`);
                socket.emit('error', { type: 'error', message: error.message });
            } finally {
                if (connection) connection.release();
            }
        });

        socket.on('disconnect', (reason) => {
            logger.info(`Połączenie WebSocket zamknięte. Powód: ${reason}`);
        });

        socket.on('error', (error) => {
            logger.error(`Błąd WebSocket: ${error.message}`);
        });
    });

    logger.info('Serwer WebSocket zainicjalizowany.');
    console.log('Serwer WebSocket zainicjalizowany.');
};

const broadcastMessage = (data) => {
    if (!ioInstance) {
        logger.error('Nie zainicjalizowano serwera WebSocket.');
        return;
    }

    ioInstance.emit('newMessage', data); 
};

module.exports = { initializeWebSocket, broadcastMessage };
