import prisma from './prismaClient.js';
import { parseAmount2dp } from '../utils/validation.js';

/** Czysta reguła salda (D-11 / D-11a) — eksport pod unit T-1; bez Prisma. */
export function nextBalance(currentBalance, initBudget, type, value) {
  let balance = parseFloat(currentBalance) || parseFloat(initBudget) || 0;
  const amount = parseAmount2dp(value);
  if (amount === null) return NaN;
  if (type === 'income') balance += amount;
  else if (type === 'expense') balance -= amount;
  return parseAmount2dp(balance) ?? balance;
}

/**
 * Atomowy zapis transakcji + aktualizacja households.currentBalance (D-11).
 * Zwraca { transactionId, houseId, newBalance }.
 */
export async function createTransactionWithBalanceUpdate({
  id,
  transactionId,
  userId,
  houseId,
  catId,
  type,
  value,
}) {
  return prisma.$transaction(async (tx) => {
    const house = await tx.households.findUnique({ where: { houseId } });
    if (!house) {
      throw new Error(`Household ${houseId} not found`);
    }

    await tx.transactions.create({
      data: {
        id,
        transactionId,
        userId,
        houseId,
        catId,
        type,
        value,
      },
    });

    const newBalance = nextBalance(house.currentBalance, house.initBudget, type, value);
    await tx.households.update({
      where: { houseId },
      data: { currentBalance: newBalance },
    });

    return { transactionId, houseId, newBalance };
  });
}

/**
 * Usunięcie transakcji + reverse salda wg existing.type (D-11a).
 * FAZA 1: nadal wymaga userId aktora w WHERE (własne tx).
 * FAZA 2 zdejmie filtr userId dla hosta.
 */
export async function deleteTransactionWithBalanceUpdate({
  userId,
  houseId,
  transactionId,
}) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.transactions.findFirst({
      where: { transactionId, userId, houseId },
    });
    if (!existing) {
      return { deleted: false };
    }

    await tx.transactions.deleteMany({
      where: { transactionId, userId, houseId },
    });

    const house = await tx.households.findUnique({ where: { houseId } });
    const balanceType = reverseBalanceType(existing.type);
    const newBalance = nextBalance(
      house.currentBalance,
      house.initBudget,
      balanceType,
      existing.value,
    );
    await tx.households.update({
      where: { houseId },
      data: { currentBalance: newBalance },
    });

    return {
      deleted: true,
      houseId,
      newBalance,
      value: existing.value,
      type: existing.type,
    };
  });
}

export async function findTransactionByTransactionId(transactionId) {
  return prisma.transactions.findFirst({
    where: { transactionId },
    select: { userId: true, value: true, houseId: true, type: true },
  });
}

/** Typ korekty salda przy delete = odwrotność oryginalnego type (D-11a). */
export function reverseBalanceType(type) {
  if (type === 'income') return 'expense';
  if (type === 'expense') return 'income';
  return type;
}

export async function listTransactionsByHouse(houseId) {
  return prisma.transactions.findMany({
    where: { houseId },
    include: { actionCategories: true },
    orderBy: { addedAt: 'desc' },
  });
}

export async function listAllTransactions() {
  return prisma.transactions.findMany({ orderBy: { transactionId: 'asc' } });
}

export async function deleteTransactionsByHouseId(houseId) {
  return prisma.transactions.deleteMany({ where: { houseId } });
}

export async function countTransactionsByHouse(houseId) {
  return prisma.transactions.count({ where: { houseId } });
}

export async function listTransactionsInDateRange(houseId, from, to) {
  return prisma.transactions.findMany({
    where: {
      houseId,
      addedAt: { gte: from, lte: to },
    },
    select: { value: true, type: true },
  });
}

export async function deleteTransactionsInDateRange(houseId, from, to) {
  return prisma.transactions.deleteMany({
    where: {
      houseId,
      addedAt: { gte: from, lte: to },
    },
  });
}
