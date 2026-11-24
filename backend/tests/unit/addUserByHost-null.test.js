import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('addUserByHost null invitedUser', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('invitedUser == null → userNotFoundError, bez saveNewInmate', async () => {
    jest.unstable_mockModule('../../utils/householdUtils/saveNewInmate.js', () => ({
      saveNewInmate: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification: jest.fn(),
    }));

    const { addUserByHost } = await import('../../utils/householdUtils/addUserByHost.js');
    const { saveNewInmate } = await import('../../utils/householdUtils/saveNewInmate.js');

    await expect(addUserByHost('ghost1', 'h-1', null)).rejects.toMatchObject({
      messageKey: 'addUserToHouse.userNotFoundError',
      httpStatus: 400,
    });
    expect(saveNewInmate).not.toHaveBeenCalled();
  });
});
