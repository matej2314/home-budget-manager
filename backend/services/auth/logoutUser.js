import { deleteConnectionByUserId } from '../../database/sockets.js';

export async function logoutUser(userId) {
  await deleteConnectionByUserId(userId);
  return { messageKey: 'Logged out correctly.' };
}