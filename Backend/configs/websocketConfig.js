const logger = require('./logger');
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io');
const getMysqlExpireDate = require('../utils/getMySqlExpireDate');
const authMiddleware = require('../middlewares/websocket/authMiddleware');
const socketQueries = require('../database/websocketQueries');
const checkUserHouse = require('../utils/checkUserHouse');

let ioInstance;

const initializeWebSocket = (server) => {
	ioInstance = io(server, {
		cors: {
			origin: (origin, callback) => {
                const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
                if (allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Nieautoryzowany origin'), false);
                }
            },
			credentials: true,
		},
		pingInterval: 25000,
		pingTimeout: 5000,
	});

	ioInstance.use(authMiddleware);

	ioInstance.on('connection', async (socket) => {
		const id = uuidv4();
		const userId = socket.user.id;
		const expireDate = getMysqlExpireDate();
	
		try {
			const [checkConnection] = await pool.query(socketQueries.checkIfConnection, [userId]);
	
			if (checkConnection.length > 0) {
				const existingConnection = checkConnection[0];
				const existingExpireDate = new Date(existingConnection.expireDate);
	
				if (existingExpireDate > new Date()) {
					logger.info(`Połączenie dla użytkownika ${userId} już istnieje i jest aktywne. Używamy istniejącego połączenia.`);
					socket.emit('connect_success', { message: 'Połączenie zostało przywrócone.' });
	
					return;
				} else {
					logger.error(`Połączenie dla użytkownika ${userId} wygasło. Usuwamy stare połączenie.`);
					await pool.query(socketQueries.deleteConnection, [userId]);
				}
			}
	
			await pool.query(socketQueries.saveConnection, [id, userId, socket.id, expireDate]);
	
			socket.on('disconnect', async (reason) => {
				await pool.query(socketQueries.deleteConnection, [userId]);
				logger.info(`Połączenie WebSocket zamknięte. Powód: ${reason}`);
			});
	
			socket.on('error', (error) => {
				logger.error(`Błąd WebSocket: ${error.message}`);
			});
	
		} catch (error) {
			logger.error(`Błąd przy inicjalizacji połączenia: ${error.message}`);
			socket.emit('connect_error', {
				message: 'Błąd podczas nawiązywania połączenia.',
			});
			socket.disconnect();
		}
	});
	
	logger.info('Serwer WebSocket zainicjalizowany.');
	console.log('Serwer WebSocket zainicjalizowany.');
};

const broadcastMessage = async (userId, { type, data } = {}) => {
	if (!ioInstance) {
		logger.error('Nie zainicjalizowano serwera WebSocket.');
		return;
	}

	const connection = await pool.getConnection();

	try {
		const [result] = await connection.query(socketQueries.selectConnection, [userId]);

		if (!result || result.length == 0) {
			logger.error(`Brak połączenia dla userId: ${userId}`);
			return;
		}

		const socketId = result[0].connectionId;
		const socket = ioInstance.sockets.sockets.get(socketId);

		if (!socket) {
			logger.error(`Socket o id ${socketId} dla userId: ${userId} jest nieaktywny.`);
			return;
		}

		socket.emit(type, data);
		logger.info(`Wysłano wiadomość WebSocket dla ${userId}`);
	} catch (error) {
		logger.error(`Błąd podczas wysyłania wiadomości do użytkownika: ${userId} : ${error.message}`);
	} finally {
		if (connection) connection.release();
	}
};

const broadcastToHouseMates = async (houseId, { type, data } = {}) => {
	if (!ioInstance) {
		logger.error('Nie zainicjalizowano serwera WebSocket.');
		return;
	};

	const connection = await pool.getConnection();

	try {
		const [houseMates] = await connection.query('SELECT userId FROM householdUsers WHERE houseId = ?', [houseId]);

		if (houseMates.length === 0) {
			logger.error(`Nie znaleziono domowników gospodarstwa ${houseId}`);
			return;
		};


			const [usersConnections] = await connection.query(`SELECT connectionId FROM socketConnections WHERE userId IN (?)`, 
				[houseMates.map(mate => mate.userId)]
			);

		if (!usersConnections || usersConnections.length === 0) {
			logger.error(`Nie znaleziono połączeń dla domowników gospodarstwa ${houseId}`);
			return;
		};
				
		usersConnections.forEach((connection) => {
			const socket = ioInstance.sockets.sockets.get(connection.connectionId);

			if (socket) {
				socket.emit(type, data);
			}
		});
		logger.info(`Wysłano wiadomość do domowników gospodarstwa ${houseId}`);
	} catch (error) {
		logger.error(`Błąd podczas rozsyłania wiadomości do domoowników ${houseId}`);
	} finally {
		if (connection) connection.release();
	}
}

module.exports = { initializeWebSocket, broadcastMessage, broadcastToHouseMates };
