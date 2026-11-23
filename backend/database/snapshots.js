import prisma from './prismaClient.js';

export async function upsertDailyTransactionCount(data) {
  return prisma.dailyTransactions.create({ data });
}

export async function createDailyBudget(data) {
  return prisma.dailyBudget.create({ data });
}

export async function createMonthlyBalance(data) {
  return prisma.monthly_balances.create({ data });
}

export async function createMonthlyTransactionCount(data) {
  return prisma.monthlyTransactionCounts.create({ data });
}

export async function deleteDailyTransactionsInRange(houseId, from, to) {
  return prisma.dailyTransactions.deleteMany({
    where: { houseId, date: { gte: from, lte: to } },
  });
}

export async function deleteDailyBudgetInRange(houseId, from, to) {
  return prisma.dailyBudget.deleteMany({
    where: { houseId, date: { gte: from, lte: to } },
  });
}

export async function updateHouseholdMonthlyBalanceDate(houseId, monthlyBalanceDate) {
  return prisma.households.update({
    where: { houseId },
    data: { monthlyBalanceDate },
  });
}
