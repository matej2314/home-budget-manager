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
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail: jest.fn(),
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
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail: jest.fn(),
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
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail: jest.fn(),
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
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail: jest.fn(async () => ({ sent: true })),
    }));

    const { rejectInvitation } = await import(
      '../../services/invitations/rejectInvitation.js'
    );
    const res = await rejectInvitation({ invitationId: 'i-1', hostId: 'h-1' });

    expect(res.messageKey).toBe('Invitation successfully rejected.');
    expect(updateInvitationStatus).toHaveBeenCalledWith('i-1', 'rejected', 'h-1');
    expect(emitNotification).toHaveBeenCalled();
    expect(saveNewInmate).not.toHaveBeenCalled();
  });

  test('reject: obcy hostId → count 0 → 404', async () => {
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      findInvitationById: jest.fn(async () => ({
        id: 'i-1',
        status: 'new',
        houseId: 'house-1',
        invitedUserId: 'u-cand',
        hostId: 'h-owner',
      })),
      updateInvitationStatus: jest.fn(async () => ({ count: 0 })),
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification: jest.fn(),
    }));
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail: jest.fn(),
    }));

    const { rejectInvitation } = await import(
      '../../services/invitations/rejectInvitation.js'
    );
    await expect(
      rejectInvitation({ invitationId: 'i-1', hostId: 'h-other' }),
    ).rejects.toMatchObject({
      code: 'INVITE_REJECT_NOT_FOUND',
      httpStatus: 404,
    });
  });

  test('accept: saveNewInmate + status accepted + notice; bez delete invitation', async () => {
    const saveNewInmate = jest.fn(async () => ({ invitedUserId: 'u-2' }));
    const updateInvitationStatus = jest.fn(async () => ({ count: 1 }));
    const emitNotification = jest.fn(async () => ({}));

    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => ({ houseId: 'house-1' })),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/saveNewInmate.js', () => ({
      saveNewInmate,
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      updateInvitationStatus,
      findInvitationById: jest.fn(),
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification,
    }));
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail: jest.fn(async () => ({ sent: true })),
    }));

    const { acceptInvitation } = await import(
      '../../services/invitations/acceptInvitation.js'
    );
    const src = await import('node:fs').then((fs) =>
      fs.readFileSync(
        new URL('../../services/invitations/acceptInvitation.js', import.meta.url),
        'utf8',
      ),
    );
    expect(src).not.toMatch(/\.delete\(|deleteInvitation/);

    await acceptInvitation({
      invitationId: 'i-1',
      invitedUserId: 'u-2',
      hostId: 'h-1',
    });

    expect(saveNewInmate).toHaveBeenCalledWith('u-2', 'house-1');
    expect(updateInvitationStatus).toHaveBeenCalledWith('i-1', 'accepted', 'h-1');
    expect(emitNotification).toHaveBeenCalled();
  });

  test('getInvitationsCollection filtruje po hostId', async () => {
    const listInvitationsCollection = jest.fn(async () => []);
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      listInvitationsCollection,
    }));

    const { getInvitationsCollection } = await import(
      '../../services/invitations/getInvitationsCollection.js'
    );
    await getInvitationsCollection('host-xyz');
    expect(listInvitationsCollection).toHaveBeenCalledWith('new', 'host-xyz');
  });
});
