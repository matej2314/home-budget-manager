import logger from '../../configs/logger.js';
import { isAppError } from '../errors/AppError.js';

/**
 * Cienki adapter HTTP: service zwraca sukces { messageKey, httpStatus?, …data }
 * albo rzuca AppError. Bez reguł domenowych.
 * @param {import('express').Response} res
 * @param {() => Promise<Record<string, unknown> | void>} action
 */
export async function runController(res, action) {
  try {
    const result = (await action()) ?? { messageKey: 'OK' };
    const httpStatus = Number(result.httpStatus) || 200;
    const { httpStatus: _hs, messageKey, ...data } = result;
    return res.status(httpStatus).json({
      status: 'success',
      message: messageKey,
      ...data,
    });
  } catch (error) {
    if (isAppError(error)) {
      const body = {
        status: 'error',
        message: error.messageKey,
      };
      if (error.details && typeof error.details === 'object' && !Array.isArray(error.details)) {
        Object.assign(body, error.details);
      }
      return res.status(error.httpStatus).json(body);
    }

    logger.error(`Unhandled controller error: ${error?.message || error}`);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
}
