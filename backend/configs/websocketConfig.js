import logger from './logger.js';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import getMysqlExpireDate from '../utils/getMySqlExpireDate.js';
import authMiddleware from '../middlewares/websocket/authMiddleware.js';
import { allowedOrigins } from './allowedOrigins.js';
import {
  findConnectionByUserId,
  saveConnection,
  deleteConnectionByUserId,
  listConnectionIdsByUserIds,
} from '../database/sockets.js';
import { listMemberUserIds } from '../database/households.js';

let ioInstance;

const initializeWebSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
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
    reconnectionAttempts: 3,
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
      const existingConnection = await findConnectionByUserId(userId);

      if (existingConnection) {
        const existingExpireDate = new Date(existingConnection.expireDate);

        if (existingExpireDate > new Date()) {
          socket.emit('connect_success', { message: 'Connection has been restored.' });
          return;
        }
        logger.error(`User's ${userId} websocket connection expired. Deleting old connection.`);
        await deleteConnectionByUserId(userId);
      }

      await saveConnection({
        id,
        userId,
        connectionId: socket.id,
        expireDate: new Date(expireDate),
      });

      socket.on('disconnect', async (reason) => {
        await deleteConnectionByUserId(userId);
        logger.info(`Websocket connection closed. Reason: ${reason}`);
      });

      socket.on('error', (error) => {
        logger.error(`Websocket error: ${error}`);
      });
    } catch (error) {
      logger.error(`An error occurred during connection initialization: ${error}`);
      socket.emit('error', {
        message: 'Failed to establish connection.',
      });
      socket.disconnect();
    }
  });

  logger.info('Websocket server initialized.');
};

const broadcastMessage = async (userId, { type, data } = {}) => {
  if (!ioInstance) {
    logger.error('Failed to initialize websocket server.');
    return;
  }

  try {
    const result = await findConnectionByUserId(userId);

    if (!result) {
      logger.error(`Connection not found for user: ${userId}`);
      return;
    }

    const socketId = result.connectionId;
    const socket = ioInstance.sockets.sockets.get(socketId);

    if (!socket) {
      logger.error(`Socket with id ${socketId} for userId: ${userId} is inactive.`);
      return;
    }

    socket.emit(type, data);
    logger.info(`Websocket message sent for ${userId}`);
  } catch (error) {
    logger.error(
      `An error occurred during sending websocket message for user: ${userId} : ${error.message}`,
    );
  }
};

const broadcastToHousehold = async (houseId, { type, data } = {}) => {
  if (!ioInstance) {
    logger.error('Failed to initialize Websocket server.');
    return;
  }

  try {
    const memberUserIds = await listMemberUserIds(houseId);

    if (memberUserIds.length === 0) {
      logger.error(`Not found members for household: ${houseId}`);
      return;
    }

    const connectionIds = await listConnectionIdsByUserIds(memberUserIds);

    if (!connectionIds || connectionIds.length === 0) {
      logger.error(`Connections not found for members of household: ${houseId}`);
      return;
    }

    connectionIds.forEach((connectionId) => {
      const socket = ioInstance.sockets.sockets.get(connectionId);
      if (socket) {
        socket.emit(type, data);
      }
    });
    logger.info(`Websocket message for household: ${houseId} was sent`);
  } catch {
    logger.error(
      `An error occurred during broadcasting websocket message for household: ${houseId}`,
    );
  }
};

export { initializeWebSocket, broadcastMessage, broadcastToHousehold };
