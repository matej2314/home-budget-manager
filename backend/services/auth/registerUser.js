import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import queries from '../../database/authQueries.js';
import { registerValidations } from '../../utils/validation.js';
import { checkUserEmail } from '../../utils/checkUtils/checkUserEmail.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function registerUser({
  reg_username,
  reg_email,
  reg_password,
  role,
  cookies,
}) {
  const validations = registerValidations(reg_username, reg_email, reg_password, role);
  const connection = await pool.getConnection();

  try {
    const checkEmail = await checkUserEmail(connection, reg_email);
    if (checkEmail && checkEmail.email === reg_email) {
      throw new AppError({
        code: 'AUTH_EMAIL_EXISTS',
        messageKey: 'Entered e-mail address already exists.',
        httpStatus: 409,
      });
    }

    for (const validation of validations) {
      if (!validation.isValid) {
        logger.error(validation.message);
        throw new AppError({
          code: 'AUTH_REGISTER_VALIDATION',
          messageKey: validation.message,
          httpStatus: 400,
        });
      }
    }

    if (role === 'superadmin') {
      const [rows] = await connection.query(queries.registerAdminCheck);
      if (rows.length > 0) {
        throw new AppError({
          code: 'AUTH_SUPERADMIN_EXISTS',
          messageKey: 'Superadmin account already exists.',
          httpStatus: 400,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(reg_password, 10);
    const userId = uuidv4();

    const [result] = await connection.query(queries.register, {
      id: userId,
      role,
      name: reg_username,
      password: hashedPassword,
      email: reg_email,
      acceptCookies: cookies ? cookies : 0,
    });

    if (result.affectedRows === 1) {
      await connection.query(queries.houseUsers, {
        id: uuidv4(),
        userId,
        userName: reg_username,
        houseId: 0,
        role,
      });
    }

    return {
      messageKey: 'User successfully registered. Now you can sign in.',
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Register error: ${error}`);
    throw new AppError({
      code: 'AUTH_REGISTER_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
