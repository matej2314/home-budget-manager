import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('membership invite guards (T-1)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('addUserByHost: user już w domu → AppError inmateOrHostError', async () => {
    jest.unstable_mockModule('../../utils/householdUtils/saveNewInmate.js', () => ({
      saveNewInmate: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification: jest.fn(),
    }));

    const { addUserByHost } = await import('../../utils/householdUtils/addUserByHost.js');
    const { saveNewInmate } = await import('../../utils/householdUtils/saveNewInmate.js');

    await expect(
      addUserByHost('bob12', 'h-1', { userId: 'u-2', houseId: 'other' }),
    ).rejects.toMatchObject({
      messageKey: 'addUserToHouse.inmateOrHostError',
      httpStatus: 400,
    });
    expect(saveNewInmate).not.toHaveBeenCalled();
  });

  test('addUserByInmate: brak invitedUser → AppError invalidInput', async () => {
    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastMessage: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHostUserId: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      createInvitation: jest.fn(),
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification: jest.fn(),
    }));

    const { addUserByInmate } = await import('../../utils/householdUtils/addUserByInmate.js');
    // Po resetModules toBeInstanceOf(AppError) z top-level importu pada (dwa konstruktory ESM).
    await expect(
      addUserByInmate('u-inviter', null, 'h-1', 'cand01', 'inmte1'),
    ).rejects.toMatchObject({
      messageKey: 'addUserToHouse.invalidInputError',
      httpStatus: 400,
    });
  });

  test('addUserByInmate: invited już w domu → nie tworzy invitation', async () => {
    const createInvitation = jest.fn();
    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastMessage: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHostUserId: jest.fn(async () => 'host-1'),
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      createInvitation,
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification: jest.fn(),
    }));

    const { addUserByInmate } = await import('../../utils/householdUtils/addUserByInmate.js');

    await expect(
      addUserByInmate(
        'u-inviter',
        { userId: 'u-cand', houseId: 'h-x' },
        'h-1',
        'cand01',
        'inmte1',
      ),
    ).rejects.toMatchObject({
      messageKey: 'addUserToHouse.inmateOrHostError',
    });
    expect(createInvitation).not.toHaveBeenCalled();
  });
});
