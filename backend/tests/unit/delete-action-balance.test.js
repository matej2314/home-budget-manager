import { beforeEach, describe, expect, jest, test } from '@jest/globals';

/**
 * As-is: deleteAction zawsze przekazuje balanceType: 'expense'
 * (odejmuje wartość niezależnie od typu usuwanej transakcji).
 */
describe('deleteAction saldo (as-is balanceType)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('woła deleteTransactionWithBalanceUpdate z balanceType expense', async () => {
    const deleteTransactionWithBalanceUpdate = jest.fn(async () => ({
      deleted: true,
      houseId: 'h-1',
      newBalance: 800,
      value: 100,
    }));

    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => ({ houseId: 'h-1' })),
    }));
    jest.unstable_mockModule('../../utils/checkUtils/checkTransaction.js', () => ({
      checkTransaction: jest.fn(async () => ({
        userId: 'u-1',
        value: 100,
        houseId: 'h-1',
      })),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      deleteTransactionWithBalanceUpdate,
    }));
    jest.unstable_mockModule('../../utils/householdUtils/liveUpdateBalance.js', () => ({
      liveUpdateBalance: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification: jest.fn(),
    }));

    const { deleteAction } = await import('../../services/transactions/deleteAction.js');
    await deleteAction('tx-1', 'u-1');

    expect(deleteTransactionWithBalanceUpdate).toHaveBeenCalledWith({
      userId: 'u-1',
      houseId: 'h-1',
      transactionId: 'tx-1',
      balanceType: 'expense',
      value: 100,
    });
  });

  test('brak transactionId → 400', async () => {
    const { deleteAction } = await import('../../services/transactions/deleteAction.js');
    await expect(deleteAction(null, 'u-1')).rejects.toMatchObject({
      httpStatus: 400,
      messageKey: 'Invalid input data.',
    });
  });

  test('brak domu → 404', async () => {
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => null),
    }));
    jest.unstable_mockModule('../../utils/checkUtils/checkTransaction.js', () => ({
      checkTransaction: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      deleteTransactionWithBalanceUpdate: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/liveUpdateBalance.js', () => ({
      liveUpdateBalance: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification: jest.fn(),
    }));

    const { deleteAction } = await import('../../services/transactions/deleteAction.js');
    await expect(deleteAction('tx-1', 'u-1')).rejects.toMatchObject({
      httpStatus: 404,
      code: 'TX_2',
    });
  });
});
