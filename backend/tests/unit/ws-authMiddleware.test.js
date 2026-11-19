import { describe, expect, test, jest, beforeEach } from '@jest/globals';

describe('WS authMiddleware (K-9 / S-14)', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-for-ws-auth';
  });

  test('rejects handshake without SESSID cookie', async () => {
    const { default: authMiddleware } = await import(
      '../../middlewares/websocket/authMiddleware.js'
    );
    const socket = { request: { headers: {} } };
    const next = jest.fn();
    authMiddleware(socket, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
  });

  test('rejects handshake with invalid SESSID', async () => {
    const { default: authMiddleware } = await import(
      '../../middlewares/websocket/authMiddleware.js'
    );
    const socket = {
      request: { headers: { cookie: 'SESSID=not-a-valid-jwt' } },
    };
    const next = jest.fn();
    await new Promise((resolve) => {
      authMiddleware(socket, (...args) => {
        next(...args);
        resolve();
      });
    });
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
