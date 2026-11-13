export class AppError extends Error {
  /**
   * @param {{ code: string, messageKey: string, httpStatus: number, details?: unknown }} params
   */
  constructor({ code, messageKey, httpStatus, details }) {
    super(messageKey);
    this.name = 'AppError';
    this.code = code;
    this.messageKey = messageKey;
    this.httpStatus = httpStatus;
    this.details = details;
  }
}

export function isAppError(error) {
  return error instanceof AppError;
}
