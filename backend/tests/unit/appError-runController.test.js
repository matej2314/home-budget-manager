import { describe, expect, test, jest } from '@jest/globals';
import { AppError } from '../../utils/errors/AppError.js';
import { runController } from '../../utils/http/runController.js';

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('B-10 AppError + runController', () => {
  test('AppError carries code, messageKey, httpStatus', () => {
    const err = new AppError({
      code: 'X',
      messageKey: 'errors.x',
      httpStatus: 400,
    });
    expect(err.code).toBe('X');
    expect(err.messageKey).toBe('errors.x');
    expect(err.httpStatus).toBe(400);
  });

  test('runController maps AppError to error envelope', async () => {
    const res = mockRes();
    await runController(res, async () => {
      throw new AppError({
        code: 'Y',
        messageKey: 'errors.y',
        httpStatus: 404,
      });
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'errors.y',
    });
  });

  test('runController maps success messageKey', async () => {
    const res = mockRes();
    await runController(res, async () => ({ messageKey: 'ok', value: 1 }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'ok',
      value: 1,
    });
  });
});
