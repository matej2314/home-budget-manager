import prisma from './prismaClient.js';

export async function findUserById(id) {
  return prisma.users.findUnique({ where: { id } });
}

export async function updateUserEmail(id, email) {
  return prisma.users.update({ where: { id }, data: { email } });
}

export async function updateAvatarName(id, avatarName) {
  return prisma.users.update({ where: { id }, data: { avatarName } });
}

export async function setAcceptCookies(id, acceptCookies) {
  return prisma.users.update({ where: { id }, data: { acceptCookies } });
}

export async function setCompleteTour(id, completeTour) {
  return prisma.users.update({ where: { id }, data: { completeTour } });
}

export async function setUserHostFlags(id, { host, role }) {
  return prisma.users.update({ where: { id }, data: { host, role } });
}

export async function setUserInmateFlags(id, { inmate, role }) {
  return prisma.users.update({ where: { id }, data: { inmate, role } });
}

export async function deleteUserById(id) {
  return prisma.users.delete({ where: { id } });
}

export async function listHouseholdUsers() {
  return prisma.householdUsers.findMany({ orderBy: { id: 'asc' } });
}

export async function findHouseholdUserByUserName(userName) {
  return prisma.householdUsers.findFirst({ where: { userName } });
}

export async function updateHouseholdUserHouseId(userId, houseId) {
  return prisma.householdUsers.updateMany({ where: { userId }, data: { houseId } });
}

export async function updateHouseholdUserRole(userId, role) {
  return prisma.householdUsers.updateMany({ where: { userId }, data: { role } });
}

export async function deleteHouseholdUsersByUserId(userId) {
  return prisma.householdUsers.deleteMany({ where: { userId } });
}

export async function clearHouseIdForHouse(houseId) {
  // brak domu = NULL (FK houseId → households; "0" nie jest dozwolone)
  return prisma.householdUsers.updateMany({ where: { houseId }, data: { houseId: null } });
}

export async function deleteTransactionsByUserId(userId) {
  return prisma.transactions.deleteMany({ where: { userId } });
}
