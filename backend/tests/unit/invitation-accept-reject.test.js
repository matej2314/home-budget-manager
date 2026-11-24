import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('acceptInvitation / rejectInvitation (P1)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('accept: host bez houseId → 400', async () => {
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => ({ houseId: null })),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/saveNewInmate.js', () => ({
      saveNewInmate: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      updateInvitationStatus: jest.fn(),
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification: jest.fn(),
    }));

    const { acceptInvitation } = await import(
      '../../services/invitations/acceptInvitation.js'
    );
    await expect(
      acceptInvitation({ invitationId: 'i-1', invitedUserId: 'u-2', hostId: 'h-1' }),
    ).rejects.toMatchObject({
      code: 'INVITE_HOST_NO_HOUSE',
      httpStatus: 400,
    });
  });

  test('accept: updateInvitationStatus.count === 0 → 500', async () => {
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => ({ houseId: 'house-1' })),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/saveNewInmate.js', () => ({
      saveNewInmate: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      updateInvitationStatus: jest.fn(async () => ({ count: 0 })),
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification: jest.fn(),
    }));

    const { acceptInvitation } = await import(
      '../../services/invitations/acceptInvitation.js'
    );
    await expect(
      acceptInvitation({ invitationId: 'i-1', invitedUserId: 'u-2', hostId: 'h-1' }),
    ).rejects.toMatchObject({
      code: 'INVITE_ACCEPT_FAILED',
      httpStatus: 500,
    });
  });

  test('reject: brak / status ≠ new → 404', async () => {
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      findInvitationById: jest.fn(async () => ({ id: 'i-1', status: 'accepted' })),
      updateInvitationStatus: jest.fn(),
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification: jest.fn(),
    }));

    const { rejectInvitation } = await import(
      '../../services/invitations/rejectInvitation.js'
    );
    await expect(rejectInvitation({ invitationId: 'i-1', hostId: 'h-1' })).rejects.toMatchObject({
      code: 'INVITE_NOT_FOUND',
      httpStatus: 404,
    });
  });

  test('reject: status new → update rejected + notice, bez saveNewInmate', async () => {
    const updateInvitationStatus = jest.fn(async () => ({ count: 1 }));
    const emitNotification = jest.fn();
    const saveNewInmate = jest.fn();

    jest.unstable_mockModule('../../database/invitations.js', () => ({
      findInvitationById: jest.fn(async () => ({
        id: 'i-1',
        status: 'new',
        houseId: 'house-1',
        invitedUserId: 'u-cand',
      })),
      updateInvitationStatus,
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification,
    }));
    // ensure reject path never pulls membership helper
    jest.unstable_mockModule('../../utils/householdUtils/saveNewInmate.js', () => ({
      saveNewInmate,
    }));

    const { rejectInvitation } = await import(
      '../../services/invitations/rejectInvitation.js'
    );
    const res = await rejectInvitation({ invitationId: 'i-1', hostId: 'h-1' });

    expect(res.messageKey).toBe('Invitation successfully rejected.');
    expect(updateInvitationStatus).toHaveBeenCalledWith('i-1', 'rejected');
    expect(emitNotification).toHaveBeenCalled();
    expect(saveNewInmate).not.toHaveBeenCalled();
  });
});
