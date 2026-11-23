import prisma from './prismaClient.js';

function nextBalance(currentBalance, initBudget, type, value) {
  let balance = parseFloat(currentBalance) || parseFloat(initBudget) || 0;
  const amount = parseFloat(value);
  if (type === 'income') balance += amount;
  else if (type === 'expense') balance -= amount;
  return parseFloat(balance);
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
 * Usunięcie transakcji + korekta salda.
 * As-is deleteAction woła liveUpdateBalance('expense', value, ...) — zachowaj tę samą regułę
 * (odejmowanie wartości usuwanego rekordu), o ile nie zmieniasz kontraktu produktu.
 */
export async function deleteTransactionWithBalanceUpdate({
  userId,
  houseId,
  transactionId,
  balanceType,
  value,
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
    const newBalance = nextBalance(
      house.currentBalance,
      house.initBudget,
      balanceType,
      value,
    );
    await tx.households.update({
      where: { houseId },
      data: { currentBalance: newBalance },
    });

    return { deleted: true, houseId, newBalance, value: existing.value };
  });
}

export async function findTransactionByTransactionId(transactionId) {
  return prisma.transactions.findFirst({
    where: { transactionId },
    select: { userId: true, value: true, houseId: true },
  });
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
