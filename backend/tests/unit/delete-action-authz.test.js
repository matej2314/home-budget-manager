import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('deleteAction authz (S-8a)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  async function loadDeleteAction(mocks) {
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: mocks.checkHouse,
    }));
    jest.unstable_mockModule('../../utils/checkUtils/checkTransaction.js', () => ({
      checkTransaction: mocks.checkTransaction,
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      deleteTransactionWithBalanceUpdate: mocks.deleteTx,
    }));
    jest.unstable_mockModule('../../utils/householdUtils/liveUpdateBalance.js', () => ({
      liveUpdateBalance: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification: jest.fn(),
    }));
    return import('../../services/transactions/deleteAction.js');
  }

  test('inmate na cudzej tx w domu → 403', async () => {
    const deleteTx = jest.fn();
    const { deleteAction } = await loadDeleteAction({
      checkHouse: jest.fn(async () => ({ houseId: 'h-1', role: 'inmate' })),
      checkTransaction: jest.fn(async () => ({
        userId: 'host-1',
        houseId: 'h-1',
        value: 40,
        type: 'expense',
      })),
      deleteTx,
    });

    await expect(deleteAction('tx-1', 'inmate-1')).rejects.toMatchObject({
      httpStatus: 403,
      messageKey: 'authz.transactions.delete.denied',
    });
    expect(deleteTx).not.toHaveBeenCalled();
  });

  test('host na cudzej tx w domu → delete bez userId aktora', async () => {
    const deleteTx = jest.fn(async () => ({
      deleted: true,
      houseId: 'h-1',
      newBalance: 500,
      value: 40,
      type: 'expense',
    }));
    const { deleteAction } = await loadDeleteAction({
      checkHouse: jest.fn(async () => ({ houseId: 'h-1', role: 'host' })),
      checkTransaction: jest.fn(async () => ({
        userId: 'inmate-1',
        houseId: 'h-1',
        value: 40,
        type: 'expense',
      })),
      deleteTx,
    });

    await deleteAction('tx-1', 'host-1');
    expect(deleteTx).toHaveBeenCalledWith({ houseId: 'h-1', transactionId: 'tx-1' });
  });

  test('tx innego domu → 404', async () => {
    const deleteTx = jest.fn();
    const { deleteAction } = await loadDeleteAction({
      checkHouse: jest.fn(async () => ({ houseId: 'h-1', role: 'host' })),
      checkTransaction: jest.fn(async () => ({
        userId: 'u-x',
        houseId: 'h-other',
        value: 10,
        type: 'expense',
      })),
      deleteTx,
    });

    await expect(deleteAction('tx-1', 'host-1')).rejects.toMatchObject({
      httpStatus: 404,
      code: 'TX_4',
    });
    expect(deleteTx).not.toHaveBeenCalled();
  });
});
