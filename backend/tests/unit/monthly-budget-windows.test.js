import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('addNewMonthlyBudget okna dat (P1)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  }

  async function loadWithMocks({ addedAt, addNewBudget = jest.fn() }) {
    const clearExtraValues = jest.fn();
    const updateInitBudget = jest.fn();
    const handleBroadcastInitBudget = jest.fn();

    addNewBudget.mockResolvedValue({
      addedAtFormatted: '2026-01-01',
      validUntilFormatted: '2026-01-31',
      valueToDb: 1200,
    });

    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => ({ houseId: 'h-1' })),
    }));
    jest.unstable_mockModule('../../database/budget.js', () => ({
      listAddedAtByHouse: jest.fn(async () =>
        addedAt === undefined ? [] : [{ addedAt }],
      ),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/initMonthlyBudgetFunctions.js', () => ({
      addNewBudget,
      clearExtraValues,
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      updateInitBudget,
    }));
    jest.unstable_mockModule('../../utils/handleBroadcastInitBudget.js', () => ({
      handleBroadcastInitBudget,
    }));

    const { addNewMonthlyBudget } = await import(
      '../../services/budget/addNewMonthlyBudget.js'
    );
    return { addNewMonthlyBudget, clearExtraValues, addNewBudget, updateInitBudget };
  }

  test('brak value → 400 BUDGET_INPUT', async () => {
    const { addNewMonthlyBudget } = await import(
      '../../services/budget/addNewMonthlyBudget.js'
    );
    await expect(addNewMonthlyBudget({ userId: 'u-1', value: null })).rejects.toMatchObject({
      code: 'BUDGET_INPUT',
      httpStatus: 400,
    });
  });

  test('brak domu → 400 BUDGET_NO_HOUSE', async () => {
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => null),
    }));
    jest.unstable_mockModule('../../database/budget.js', () => ({
      listAddedAtByHouse: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/initMonthlyBudgetFunctions.js', () => ({
      addNewBudget: jest.fn(),
      clearExtraValues: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      updateInitBudget: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleBroadcastInitBudget.js', () => ({
      handleBroadcastInitBudget: jest.fn(),
    }));

    const { addNewMonthlyBudget } = await import(
      '../../services/budget/addNewMonthlyBudget.js'
    );
    await expect(addNewMonthlyBudget({ userId: 'u-1', value: 500 })).rejects.toMatchObject({
      code: 'BUDGET_NO_HOUSE',
      httpStatus: 400,
    });
  });

  test('diffDays w (7, 30) → conditionError', async () => {
    const { addNewMonthlyBudget } = await loadWithMocks({ addedAt: daysAgo(15) });
    await expect(addNewMonthlyBudget({ userId: 'u-1', value: 500 })).rejects.toMatchObject({
      code: 'BUDGET_CONDITION',
      httpStatus: 400,
    });
  });

  test('diffDays <= 7 → update + clearExtraValues', async () => {
    const { addNewMonthlyBudget, clearExtraValues, updateInitBudget } = await loadWithMocks({
      addedAt: daysAgo(3),
    });
    const res = await addNewMonthlyBudget({ userId: 'u-1', value: 500 });
    expect(res).toMatchObject({
      httpStatus: 201,
      messageKey: 'declareBudget.declaredCorrectlyMessage',
    });
    expect(clearExtraValues).toHaveBeenCalled();
    expect(updateInitBudget).toHaveBeenCalledWith('h-1', 1200);
  });

  test('diffDays >= 30 → nowy budżet bez clearExtraValues', async () => {
    const { addNewMonthlyBudget, clearExtraValues, updateInitBudget } = await loadWithMocks({
      addedAt: daysAgo(40),
    });
    const res = await addNewMonthlyBudget({ userId: 'u-1', value: 500 });
    expect(res.httpStatus).toBe(201);
    expect(clearExtraValues).not.toHaveBeenCalled();
    expect(updateInitBudget).toHaveBeenCalledWith('h-1', 1200);
  });

  test('wpis bez addedAt → happy path 201', async () => {
    const { addNewMonthlyBudget, clearExtraValues } = await loadWithMocks({ addedAt: null });
    const res = await addNewMonthlyBudget({ userId: 'u-1', value: 500 });
    expect(res.httpStatus).toBe(201);
    expect(clearExtraValues).not.toHaveBeenCalled();
  });
});
