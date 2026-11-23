import prisma from './prismaClient.js';

export async function findUserByEmail(email) {
  return prisma.users.findFirst({ where: { email } });
}

export async function findSuperadmin() {
  return prisma.users.findFirst({ where: { role: 'superadmin' } });
}

export async function createUser(data) {
  return prisma.users.create({ data });
}

export async function createHouseholdUserRow(data) {
  return prisma.householdUsers.create({ data });
}
