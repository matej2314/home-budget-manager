import prisma from './prismaClient.js';

export async function createInitialMonthlyBudget(data) {
  return prisma.initialMonthlyBudgets.create({ data });
}

export async function listAddedAtByHouse(houseId) {
  return prisma.initialMonthlyBudgets.findMany({
    where: { houseId },
    select: { addedAt: true },
    orderBy: { addedAt: 'desc' },
  });
}

export async function updateInitialBudgetValue(id, value) {
  return prisma.initialMonthlyBudgets.update({
    where: { id },
    data: { value },
  });
}

export async function updateInitialBudgetByHouse(houseId, { value, validUntil }) {
  return prisma.initialMonthlyBudgets.updateMany({
    where: { houseId },
    data: { value, validUntil },
  });
}

export async function latestInitialBudgetValue(houseId) {
  const row = await prisma.initialMonthlyBudgets.findFirst({
    where: { houseId },
    orderBy: { addedAt: 'desc' },
    select: { value: true },
  });
  return row?.value ?? null;
}
