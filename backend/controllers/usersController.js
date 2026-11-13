import { runController } from '../utils/http/runController.js';
import { AppError } from '../utils/errors/AppError.js';
import { addUserToHouse as addUserToHouseService } from '../services/users/addUserToHouse.js';
import { getUsersCollection } from '../services/users/getUsersCollection.js';
import { deleteUser as deleteUserService } from '../services/users/deleteUser.js';
import { deleteInhabitant as deleteInhabitantService } from '../services/users/deleteInhabitant.js';
import { changeUserEmail } from '../services/users/changeUserEmail.js';

export async function addUserToHouse(req, res) {
  const userId = req.userId;
  const role = req.role;
  const invitingUserName = req.userName;
  const { userName } = req.body;
  return runController(res, async () => {
    if (!userName) {
      throw new AppError({
        code: 'USER_CTRL_INVITE_INPUT',
        messageKey: 'Invalid input user data.',
        httpStatus: 400,
      });
    }
    return addUserToHouseService(userId, userName, invitingUserName, role);
  });
}

export async function getAllUsers(req, res) {
  return runController(res, () => getUsersCollection());
}

export async function deleteUser(req, res) {
  return runController(res, () => deleteUserService(req.params.userId));
}

export async function deleteInhabitant(req, res) {
  const { inhabitantId } = req.body;
  return runController(res, async () => {
    if (!inhabitantId) {
      throw new AppError({
        code: 'USER_CTRL_INHAB_INPUT',
        messageKey: 'Enter correctly data!',
        httpStatus: 400,
      });
    }
    return deleteInhabitantService(inhabitantId);
  });
}

export async function changeEmail(req, res) {
  const userId = req.userId;
  const { newEmail } = req.body;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return runController(res, async () => {
    if (!newEmail || !emailRegex.test(newEmail)) {
      throw new AppError({
        code: 'USER_CTRL_EMAIL_INPUT',
        messageKey: 'Enter correctly e-mail address!',
        httpStatus: 400,
      });
    }
    return changeUserEmail(newEmail, userId);
  });
}
