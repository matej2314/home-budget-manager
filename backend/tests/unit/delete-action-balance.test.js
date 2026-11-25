import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { reverseBalanceType } from '../../database/transactions.js';

describe('reverseBalanceType (D-11a)', () => {
  test('expense → income, income → expense', () => {
    expect(reverseBalanceType('expense')).toBe('income');
    expect(reverseBalanceType('income')).toBe('expense');
  });
});

describe('deleteAction saldo (reverse type)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('woła deleteTransactionWithBalanceUpdate bez hardkodu expense', async () => {
    const deleteTransactionWithBalanceUpdate = jest.fn(async () => ({
      deleted: true,
      houseId: 'h-1',
      newBalance: 1000,
      value: 100,
      type: 'expense',
    }));

    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => ({ houseId: 'h-1', role: 'host' })),
    }));
    jest.unstable_mockModule('../../utils/checkUtils/checkTransaction.js', () => ({
      checkTransaction: jest.fn(async () => ({
        userId: 'u-1',
        value: 100,
        houseId: 'h-1',
        type: 'expense',
      })),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      deleteTransactionWithBalanceUpdate,
      reverseBalanceType,
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
      houseId: 'h-1',
      transactionId: 'tx-1',
    });
    expect(deleteTransactionWithBalanceUpdate.mock.calls[0][0].balanceType).toBeUndefined();
  });

  test('brak transactionId → 400', async () => {
    const { deleteAction } = await import('../../services/transactions/deleteAction.js');
    await expect(deleteAction(null, 'u-1')).rejects.toMatchObject({
      httpStatus: 400,
      messageKey: 'Invalid input data.',
    });
  });
});
