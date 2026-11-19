import pool from '../database/db.js';
import logger from '../configs/logger.js';

const clearSocketConnections = async () => {
  const connection = await pool.getConnection();
  try {
    const [clearConnections] = await connection.query('DELETE FROM socketConnections');

    if (clearConnections.affectedRows === 1) {
      logger.info('All websocket connections were deleted correctly.');
      return true;
    } else if (clearConnections.affectedRows === 0) {
      logger.info('Failed to delete websocket connections.');
      return null;
    }
  } catch (error) {
    logger.error(`clearSocketConnections error: ${error}`);
  }
};

export { clearSocketConnections };
