const logger = require('./logger');
const WebSocket = require('ws');

let wss;

const initializeWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        logger.info('Nowe połączenie WebSocket.');

        ws.on('message', (message) => {
            try {
                const parsedMessage = JSON.parse(message);

                if (parsedMessage.type === 'chat') {
                    logger.info('Odebrano wiadomość typu "chat".');
                    
                } else {
                    logger.error(`Nieznany typ wiadomości: ${parsedMessage.type}`);
                }
            } catch (error) {
                logger.error(`Błąd podczas odbierania wiadomości WebSocket: ${error.message}`);
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
