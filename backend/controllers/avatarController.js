import logger from '../configs/logger.js';
import { runController } from '../utils/http/runController.js';
import { addAvatar } from '../services/users/addAvatar.js';
import { deleteAvatar } from '../services/users/deleteAvatar.js';
import { resolveAvatarPath } from '../services/users/resolveAvatarPath.js';

export async function addAvatarHandler(req, res) {
  return runController(res, () => addAvatar(req.file));
}

export async function getAvatar(req, res) {
  try {
    const userId = req.params.userId || req.userId;
    const { avatarPath, defaultPath } = await resolveAvatarPath(userId);
    return res.sendFile(avatarPath || defaultPath);
  } catch (error) {
    logger.error(`getAvatar error: ${error?.message || error}`);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
}

export async function deleteAvatarHandler(req, res) {
  return runController(res, () => deleteAvatar(req.userName));
}

export {
  addAvatarHandler as addAvatar,
  deleteAvatarHandler as deleteAvatar,
};
