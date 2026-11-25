import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('addUserByInmate — notice trwały + WS (K-15 / Faza 9.3)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('createInvitation + broadcast invitation + emitNotification; zwraca hostId', async () => {
    const createInvitation = jest.fn(async () => ({}));
    const broadcastMessage = jest.fn();
    const emitNotification = jest.fn(async () => ({}));
    const findHostUserId = jest.fn(async () => 'host-1');

    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastMessage,
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHostUserId,
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      createInvitation,
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification,
    }));

    const { addUserByInmate } = await import(
      '../../utils/householdUtils/addUserByInmate.js'
    );

    const res = await addUserByInmate(
      'inmate-1',
      { userId: 'cand-1', houseId: null },
      'house-1',
      'cand01',
      'inmte1',
    );

    expect(res).toEqual({
      messageKey: 'addUserToHouse.correctlyAddedByInmate',
      hostId: 'host-1',
    });
    expect(createInvitation).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'new',
        invitingUserId: 'inmate-1',
        invitedUserId: 'cand-1',
        houseId: 'house-1',
        hostId: 'host-1',
      }),
    );
    expect(broadcastMessage).toHaveBeenCalledWith(
      'host-1',
      expect.objectContaining({ type: 'invitation' }),
    );
    expect(emitNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'usersActions',
        houseId: 'house-1',
        message: 'notifications.pendingInvitation',
      }),
    );
  });
});
