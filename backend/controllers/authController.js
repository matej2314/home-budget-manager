import jwtCookieOptions from '../configs/jwtCookieOptions.js';
import { runController } from '../utils/http/runController.js';
import { registerUser } from '../services/auth/registerUser.js';
import { loginUser } from '../services/auth/loginUser.js';
import { logoutUser } from '../services/auth/logoutUser.js';

export async function registerUserHandler(req, res) {
  return runController(res, () => registerUser(req.body));
}

export async function loginUserHandler(req, res) {
  try {
    const result = await loginUser(req.body);
    const { token, messageKey, ...publicData } = result;
    res.cookie('SESSID', token, {
      ...jwtCookieOptions,
      maxAge: 86400000,
    });
    return res.status(200).json({
      status: 'success',
      message: messageKey,
      ...publicData,
    });
  } catch (error) {
    return runController(res, async () => {
      throw error;
    });
  }
}

export async function logoutUserHandler(req, res) {
  return runController(res, async () => {
    const result = await logoutUser(req.userId);
    res.clearCookie('SESSID', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return result;
  });
}

export {
  registerUserHandler as registerUser,
  loginUserHandler as loginUser,
  logoutUserHandler as logoutUser,
};
