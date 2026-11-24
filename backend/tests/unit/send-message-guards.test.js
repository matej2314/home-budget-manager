import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('sendNewMessage guards', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('nieistniejący recipient → 400 MSG_1', async () => {
    jest.unstable_mockModule('../../database/messages.js', () => ({
      findUserIdByName: jest.fn(async () => null),
      createMessage: jest.fn(),
    }));
    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastMessage: jest.fn(),
    }));

    const { sendNewMessage } = await import('../../services/messages/sendNewMessage.js');
    await expect(
      sendNewMessage('u-1', 'alice', 'nobody', 'hi'),
    ).rejects.toMatchObject({
      code: 'MSG_1',
      httpStatus: 400,
    });
  });

  test('throw z broadcastMessage nie psuje HTTP success', async () => {
    const createMessage = jest.fn(async () => ({}));
    jest.unstable_mockModule('../../database/messages.js', () => ({
      findUserIdByName: jest.fn(async () => 'u-2'),
      createMessage,
    }));
    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastMessage: jest.fn(() => {
        throw new Error('ws down');
      }),
    }));

    const { sendNewMessage } = await import('../../services/messages/sendNewMessage.js');
    const res = await sendNewMessage('u-1', 'alice', 'bob12', 'hello');
    expect(res.messageKey).toBe('sendMessage.successMessage');
    expect(createMessage).toHaveBeenCalled();
  });
});
