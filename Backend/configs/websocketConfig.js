const logger = require('./logger');
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io');
const getMysqlExpireDate = require('../utils/getMySqlExpireDate');
const authMiddleware = require('../middlewares/websocket/authMiddleware');
const socketQueries = require('../database/websocketQueries');

let ioInstance;

const initializeWebSocket = (server) => {
	ioInstance = io(server, {
		cors: {
			origin: (origin, callback) => {
				const allowedOrigins = ['http://localhost:5173', 'http://185.170.196.107:5052', 'https://budgetapp.msliwowski.net', 'https://budgetapi.msliwowski.net'];
				if (allowedOrigins.includes(origin)) {
					callback(null, true);
				} else {
					callback(new Error('Unauthorized URL'), false);
				}
			},
			credentials: true,
		},
		pingInterval: 15000,
		pingTimeout: 5000,
		reconnection: true,
		reconnectionAttempts: 3, // poprawiona nazwa
		reconnectionDelay: 3000,
		reconnectionDelayMax: 10000,
		randomizationFactor: 0.5,
		connectionStateRecovery: true,
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
					socket.emit('connect_success', { message: 'Connection has been restored.' });
					return;
				} else {
					logger.error(`User's ${userId} websocket connection expired. Deleting old connection.`);
					await pool.query(socketQueries.deleteConnection, [userId]);
				}
			}

			await pool.query(socketQueries.saveConnection, [id, userId, socket.id, expireDate]);

			socket.on('disconnect', async (reason) => {
				await pool.query(socketQueries.deleteConnection, [userId]);
				logger.info(`Websocket connection closed. Reason: ${reason}`);
			});

			socket.on('error', (error) => {
				logger.error(`Websocket error: ${error.message}`);
			});
		} catch (error) {
			logger.error(`An error occurred during connection initialization: ${error.message}`);
			socket.emit('error', {
				message: 'Failed to establish connection.',
			});
			socket.disconnect();
		}
	});

	logger.info('Websocket server initialized.');
	console.log('Websocket server initialized.');
};

const broadcastMessage = async (userId, { type, data } = {}) => {
	if (!ioInstance) {
		logger.error('Failed to initialize websocket server.');
		return;
	}

	const connection = await pool.getConnection();

	try {
		const [result] = await connection.query(socketQueries.selectConnection, [userId]);

		if (!result || result.length == 0) {
			logger.error(`Connection not found for user: ${userId}`);
			return;
		}

		const socketId = result[0].connectionId;
		const socket = ioInstance.sockets.sockets.get(socketId);

		if (!socket) {
			logger.error(`Socket with id ${socketId} for userId: ${userId} is inactive.`);
			return;
		}

		socket.emit(type, data);
		logger.info(`Websocket message sent for ${userId}`);
	} catch (error) {
		logger.error(`An error occurred during sending websocket message for user: ${userId} : ${error.message}`);
	} finally {
		if (connection) connection.release();
	}
};

const broadcastToHouseMates = async (houseId, { type, data } = {}) => {
	if (!ioInstance) {
		logger.error('Failed to initialize Websocket server.');
		return;
	}

	const connection = await pool.getConnection();

	try {
		const [houseMates] = await connection.query('SELECT userId FROM householdUsers WHERE houseId = ?', [houseId]);

		if (houseMates.length === 0) {
			logger.error(`Not found housemates for household: ${houseId}`);
			return;
		}

		const [usersConnections] = await connection.query(
			`SELECT connectionId FROM socketConnections WHERE userId IN (?)`,
			[houseMates.map(mate => mate.userId)]
		);

		if (!usersConnections || usersConnections.length === 0) {
			logger.error(`Connections not found for housemates of household: ${houseId}`);
			return;
		}

		usersConnections.forEach((connection) => {
			const socket = ioInstance.sockets.sockets.get(connection.connectionId);

			if (socket) {
				socket.emit(type, data);
			}
		});
		logger.info(`Websocket message for housemates of house: ${houseId} was sent`);
	} catch (error) {
		logger.error(`An error occurred during broadcasting websocket message for housemates of house: ${houseId}`);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = { initializeWebSocket, broadcastMessage, broadcastToHouseMates };
