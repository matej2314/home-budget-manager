import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('balanceHouseholdsMonthly (cron domain)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('gdy today ≠ nextBalanceDate — skip zapisów', async () => {
    const createMonthlyBalance = jest.fn();
    const createMonthlyTransactionCount = jest.fn();
    const handleNotification = jest.fn();

    // createdAt = dziś → next day = jutro → skip
    const today = new Date();
    jest.unstable_mockModule('../../database/households.js', () => ({
      listHouseholdsForMonthlyBalance: jest.fn(async () => [
        {
          houseId: 'h-1',
          monthlyBalanceDate: null,
          createdAt: today,
          initBudget: 1000,
        },
      ]),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      listTransactionsInDateRange: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/budget.js', () => ({
      latestInitialBudgetValue: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/snapshots.js', () => ({
      createMonthlyBalance,
      createMonthlyTransactionCount,
      updateHouseholdMonthlyBalanceDate: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification,
    }));

    const { balanceHouseholdsMonthly } = await import(
      '../../services/budget/balanceHouseholdsMonthly.js'
    );
    await balanceHouseholdsMonthly();

    expect(createMonthlyBalance).not.toHaveBeenCalled();
    expect(createMonthlyTransactionCount).not.toHaveBeenCalled();
    expect(handleNotification).not.toHaveBeenCalled();
  });

  test('dzień bilansu: income/expense → monthly_balance + count', async () => {
    const createMonthlyBalance = jest.fn(async () => ({ id: 'mb-1' }));
    const createMonthlyTransactionCount = jest.fn();
    const updateHouseholdMonthlyBalanceDate = jest.fn();
    const handleNotification = jest.fn();

    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    // dateLimit = yesterday ISO date → next = today → run

    jest.unstable_mockModule('../../database/households.js', () => ({
      listHouseholdsForMonthlyBalance: jest.fn(async () => [
        {
          houseId: 'h-1',
          monthlyBalanceDate: yesterday,
          createdAt: yesterday,
          initBudget: 1000,
        },
      ]),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      listTransactionsInDateRange: jest.fn(async () => [
        { type: 'income', value: 50 },
        { type: 'expense', value: 20 },
      ]),
    }));
    jest.unstable_mockModule('../../database/budget.js', () => ({
      latestInitialBudgetValue: jest.fn(async () => 1000),
    }));
    jest.unstable_mockModule('../../database/snapshots.js', () => ({
      createMonthlyBalance,
      createMonthlyTransactionCount,
      updateHouseholdMonthlyBalanceDate,
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification,
    }));

    const { balanceHouseholdsMonthly } = await import(
      '../../services/budget/balanceHouseholdsMonthly.js'
    );
    await balanceHouseholdsMonthly();

    expect(createMonthlyTransactionCount).toHaveBeenCalledWith(
      expect.objectContaining({ houseId: 'h-1', transactionCount: 2 }),
    );
    expect(createMonthlyBalance).toHaveBeenCalledWith(
      expect.objectContaining({
        houseId: 'h-1',
        monthly_balance: 1030, // 1000 + 50 - 20
      }),
    );
    expect(updateHouseholdMonthlyBalanceDate).toHaveBeenCalled();
    expect(handleNotification).toHaveBeenCalled();
  });

  test('pusta lista gospodarstw → early return', async () => {
    const createMonthlyBalance = jest.fn();
    jest.unstable_mockModule('../../database/households.js', () => ({
      listHouseholdsForMonthlyBalance: jest.fn(async () => []),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      listTransactionsInDateRange: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/budget.js', () => ({
      latestInitialBudgetValue: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/snapshots.js', () => ({
      createMonthlyBalance,
      createMonthlyTransactionCount: jest.fn(),
      updateHouseholdMonthlyBalanceDate: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification: jest.fn(),
    }));

    const { balanceHouseholdsMonthly } = await import(
      '../../services/budget/balanceHouseholdsMonthly.js'
    );
    await balanceHouseholdsMonthly();
    expect(createMonthlyBalance).not.toHaveBeenCalled();
  });
});
