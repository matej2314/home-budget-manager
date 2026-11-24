import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('deleteHouse guards', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('brak ownership → 403', async () => {
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHouseholdByName: jest.fn(async () => null),
      deleteHousehold: jest.fn(),
      listInmates: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      deleteTransactionsByHouseId: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/dbUtils/modifyUsersProps.js', () => ({
      resetHostProps: jest.fn(),
      resetInmatesProps: jest.fn(),
    }));

    const { deleteHouse } = await import('../../services/household/deleteHouse.js');
    await expect(deleteHouse('u-1', 'host01', 'NoSuch')).rejects.toMatchObject({
      code: 'HOUSE_1',
      httpStatus: 403,
    });
  });

  test('deleteHousehold.count === 0 → 400 HOUSE_2', async () => {
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHouseholdByName: jest.fn(async () => ({ houseId: 'h-1' })),
      deleteHousehold: jest.fn(async () => ({ count: 0 })),
      listInmates: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      deleteTransactionsByHouseId: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/dbUtils/modifyUsersProps.js', () => ({
      resetHostProps: jest.fn(),
      resetInmatesProps: jest.fn(),
    }));

    const { deleteHouse } = await import('../../services/household/deleteHouse.js');
    await expect(deleteHouse('u-1', 'host01', 'House')).rejects.toMatchObject({
      code: 'HOUSE_2',
      httpStatus: 400,
    });
  });

  test('sukces: reset host + inmates + delete tx + newRole user', async () => {
    const resetHostProps = jest.fn();
    const resetInmatesProps = jest.fn();
    const deleteTransactionsByHouseId = jest.fn();

    jest.unstable_mockModule('../../database/households.js', () => ({
      findHouseholdByName: jest.fn(async () => ({ houseId: 'h-1' })),
      deleteHousehold: jest.fn(async () => ({ count: 1 })),
      listInmates: jest.fn(async () => [{ userId: 'u-inmate' }]),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      deleteTransactionsByHouseId,
    }));
    jest.unstable_mockModule('../../utils/dbUtils/modifyUsersProps.js', () => ({
      resetHostProps,
      resetInmatesProps,
    }));

    const { deleteHouse } = await import('../../services/household/deleteHouse.js');
    const res = await deleteHouse('u-host', 'host01', 'House');

    expect(res.newRole).toBe('user');
    expect(res.token).toBeTruthy();
    expect(resetHostProps).toHaveBeenCalledWith('u-host');
    expect(resetInmatesProps).toHaveBeenCalledWith('u-inmate');
    expect(deleteTransactionsByHouseId).toHaveBeenCalledWith('h-1');
  });
});
