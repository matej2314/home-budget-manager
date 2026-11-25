import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('listInvitationsCollection (F-02 / F-03)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('bez hostId rzuca; z hostId — jeden batch userName', async () => {
    const findManyInv = jest.fn(async () => [
      {
        id: 'i-1',
        status: 'new',
        hostId: 'h-1',
        invitingUserId: 'u-inv',
        invitedUserId: 'u-cand',
        date: new Date('2026-01-01'),
      },
    ]);
    const findManyUsers = jest.fn(async () => [
      { userId: 'u-inv', userName: 'alice' },
      { userId: 'u-cand', userName: 'bob' },
    ]);

    jest.unstable_mockModule('../../database/prismaClient.js', () => ({
      default: {
        invitations: { findMany: findManyInv },
        householdUsers: { findMany: findManyUsers },
      },
    }));

    const { listInvitationsCollection } = await import(
      '../../database/invitations.js'
    );

    await expect(listInvitationsCollection('new')).rejects.toThrow(
      /hostId required/,
    );
    expect(findManyInv).not.toHaveBeenCalled();

    const rows = await listInvitationsCollection('new', 'h-1');
    expect(findManyInv).toHaveBeenCalledWith({
      where: { status: 'new', hostId: 'h-1' },
    });
    expect(findManyUsers).toHaveBeenCalledTimes(1);
    expect(findManyUsers).toHaveBeenCalledWith({
      where: { userId: { in: expect.arrayContaining(['u-inv', 'u-cand']) } },
      select: { userId: true, userName: true },
    });
    expect(rows).toEqual([
      expect.objectContaining({
        id: 'i-1',
        invitingUserName: 'alice',
        invitedUserName: 'bob',
      }),
    ]);
  });
});
