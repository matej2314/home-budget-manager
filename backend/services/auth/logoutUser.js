import pool from '../../database/db.js';
import socketQueries from '../../database/websocketQueries.js';

export async function logoutUser(userId) {
  await pool.query(socketQueries.deleteConnection, [userId]);
  return { messageKey: 'Logged out correctly.' };
}
