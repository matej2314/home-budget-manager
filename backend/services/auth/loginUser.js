import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import queries from '../../database/authQueries.js';
import { loginValidations } from '../../utils/validation.js';
import { AppError } from '../../utils/errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function loginUser({ email, password }) {
  const validations = loginValidations(email, password);
  for (const validation of validations) {
    if (!validation.isValid) {
      logger.error(validation.message);
      throw new AppError({
        code: 'AUTH_LOGIN_VALIDATION',
        messageKey: validation.message,
        httpStatus: 400,
      });
    }
  }

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(queries.login, [email]);
    if (rows.length === 0) {
      logger.error('Incorrect e-mail address.');
      throw new AppError({
        code: 'AUTH_LOGIN_BAD_EMAIL',
        messageKey: 'Incorrect user data.',
        httpStatus: 401,
      });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.error('incorrect password.');
      throw new AppError({
        code: 'AUTH_LOGIN_BAD_PASSWORD',
        messageKey: 'Incorrect login data.',
        httpStatus: 401,
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, userName: user.name },
      JWT_SECRET,
      { expiresIn: '24h' },
    );

    logger.info(`User ${user.name} logged in correctly.`);

    return {
      messageKey: 'User logged in correctly.',
      token,
      userName: user.name,
      role: user.role,
      id: user.id,
      cookies: user.acceptCookies,
      tour: user.completeTour,
      avatar: user.avatarName,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Log in error: ${error.message}`);
    throw new AppError({
      code: 'AUTH_LOGIN_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
