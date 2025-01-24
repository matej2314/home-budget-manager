const logger = require('./logger');
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io');
const getMysqlExpireDate = require('../utils/getMySqlExpireDate');
const authMiddleware = require('../middlewares/websocket/authMiddleware');

let ioInstance;

const initializeWebSocket = (server) => {
	ioInstance = io(server, {
		cors: {
			origin: 'http://localhost:3000',
			credentials: true,
		},
	});

	ioInstance.use(authMiddleware);

	ioInstance.on('connection', async (socket) => {
		const id = uuidv4();
		const userId = socket.user.id;
		const expireDate = getMysqlExpireDate();

		try {
			
			await pool.query('INSERT INTO socketConnections (id, userId, connectionId, expireDate) VALUES(?, ?, ?, ?)', [id, userId, socket.id, expireDate]);

			socket.on('disconnect', async (reason) => {
				await pool.query('DELETE FROM socketConnections WHERE userId =? AND connectionId=?', [socket.user.id, socket.id]);
				logger.info(`Połączenie WebSocket zamknięte. Powód: ${reason}`);
			});

			socket.on('error', (error) => {
				logger.error(`Błąd WebSocket: ${error.message}`);
			});
		} catch (error) {
			logger.error(`Błąd przy inicjalizacji połączenia: ${error.message}`);
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
		const [result] = await connection.query('SELECT connectionId FROM socketConnections WHERE userId=?', [userId]);

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

module.exports = { initializeWebSocket, broadcastMessage };
