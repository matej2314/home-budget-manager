const logger = require('./logger');
const WebSocket = require('ws');
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;

let wss;

const initializeWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws,req) => {
        // const token = req.headers.cookie ? req.headers.cookie.split(';')
        //     .find(cookie => cookie.trim().startsWith('SESSID=*'))?.split('=')[1] : null;

        // if (!token) {
        //     logger.error('Błąd autoryzacji WebSocket.');
        //     ws.send(JSON.stringify({ type: 'error', message: 'Błąd autoryzacji.' }));
        //     ws.close();
        //     return;
        // } 

        // jwt.verify(token, JWT_SECRET, (err, decoded) => {

        //     ws.userId =  decoded.id;

        //     if (err) {
        //         ws.send(JSON.stringify({ type: 'error', message: 'Błąd autoryzacji.' }));
        //         ws.close();
        //     } else {
        //         logger.info('Nowe połączenie WebSocket.');
        //     }
        // });
        logger.info('Połączenie websocket nawiązane.');
        ws.on('message', async (message) => {
            let connection;
        
            try {
                const parsedMessage = JSON.parse(message);
                const { type, data } = parsedMessage;
        
                connection = await pool.getConnection();
        
                if (type === 'send') {
                    
                    const id = uuidv4();
                    const { recipientId, content } = data;
        
                    await connection.query('INSERT INTO messages (id, senderId, recipientId, content, is_read) VALUES (?, ?, ?, ?, ?)', 
                        [id, senderId, recipientId, content, false]);
        
                    logger.info(`Wiadomość o ID ${id} została zapisana w bazie danych`);

                    broadcastMessage({
                        type: 'newMessage',
                        message: {
                            id,
                            senderId : ws.userId,
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
        
                    ws.send(JSON.stringify({ type: 'messages', data: messages }));
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
                ws.send(JSON.stringify({ type: 'error', message: error.message }));
            } finally {
                if (connection) connection.release();
            }
        });
        
        ws.on('close', (code, reason) => {
            logger.info(`Połączenie WebSocket zamknięte. Kod: ${code}, Powód: ${reason}`);
        });

        ws.on('error', (error) => {
            logger.error(`Błąd WebSocket: ${error.message}`);
        });
    });

    logger.info('Serwer WebSocket zainicjalizowany.');
    console.log('Serwer WebSocket zainicjalizowany.');
};

const broadcastMessage = (data) => {
    if (!wss) {
        logger.error('Nie zainicjalizowano serwera WebSocket.');
        return;
    }

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

module.exports = { initializeWebSocket, broadcastMessage };
