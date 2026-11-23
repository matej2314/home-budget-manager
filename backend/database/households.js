import prisma from './prismaClient.js';

export async function findHouseholdByName(houseName) {
  return prisma.households.findFirst({ where: { houseName } });
}

export async function findHouseholdById(houseId) {
  return prisma.households.findUnique({ where: { houseId } });
}

export async function createHousehold(data) {
  return prisma.households.create({ data });
}

export async function deleteHousehold(houseId, userId) {
  return prisma.households.deleteMany({ where: { houseId, userId } });
}

export async function deleteHouseholdById(houseId) {
  return prisma.households.delete({ where: { houseId } });
}

export async function listHousesWithMembers() {
  return prisma.households.findMany({
    orderBy: { houseId: 'asc' },
    include: { householdUsers: true },
  });
}

/** Aktywne membership: houseId ustawione (NULL = brak domu). */
export async function findMembershipByUserId(userId) {
  return prisma.householdUsers.findFirst({
    where: {
      userId,
      houseId: { not: null },
    },
  });
}

/** Dowolny wiersz householdUsers dla userId (także houseId NULL). */
export async function findHouseholdUserRow(userId) {
  return prisma.householdUsers.findFirst({ where: { userId } });
}

export async function listMemberUserIds(houseId) {
  const rows = await prisma.householdUsers.findMany({
    where: { houseId },
    select: { userId: true },
  });
  return rows.map((r) => r.userId);
}

export async function findHostUserId(houseId) {
  const row = await prisma.householdUsers.findFirst({
    where: { houseId, role: 'host' },
    select: { userId: true },
  });
  return row?.userId ?? null;
}

export async function listInmates(houseId) {
  return prisma.householdUsers.findMany({
    where: { houseId, role: 'inmate' },
  });
}

export async function getBalanceFields(houseId) {
  return prisma.households.findUnique({
    where: { houseId },
    select: { currentBalance: true, initBudget: true },
  });
}

export async function updateCurrentBalance(houseId, currentBalance) {
  return prisma.households.update({
    where: { houseId },
    data: { currentBalance },
  });
}

export async function updateInitBudget(houseId, initBudget) {
  return prisma.households.update({
    where: { houseId },
    data: { initBudget },
  });
}

export async function listHouseholdsForMonthlyBalance() {
  return prisma.households.findMany({
    select: {
      houseId: true,
      initBudget: true,
      monthlyBalanceDate: true,
      createdAt: true,
    },
  });
}
