import prisma from './prismaClient.js';

export async function findInvitationById(id) {
  return prisma.invitations.findUnique({ where: { id } });
}

export async function updateInvitationStatus(id, status, hostId) {
  return prisma.invitations.updateMany({
    where: hostId ? { id, hostId } : { id },
    data: { status },
  });
}

export async function createInvitation(data) {
  return prisma.invitations.create({ data });
}

export async function listInvitationsByStatus(status) {
  return prisma.invitations.findMany({ where: { status } });
}

export async function listInvitationsCollection(status, hostId) {
  if (!hostId) {
    throw new Error('listInvitationsCollection: hostId required');
  }

  const invitations = await prisma.invitations.findMany({
    where: { status, hostId },
  });
  if (invitations.length === 0) {
    return [];
  }

  const userIds = [
    ...new Set(
      invitations.flatMap((i) => [i.invitingUserId, i.invitedUserId]),
    ),
  ];
  const users = await prisma.householdUsers.findMany({
    where: { userId: { in: userIds } },
    select: { userId: true, userName: true },
  });
  const nameByUserId = new Map(users.map((u) => [u.userId, u.userName]));

  return invitations.map((i) => ({
    id: i.id,
    status: i.status,
    hostId: i.hostId,
    invitedUser: i.invitedUserId,
    invitingUser: i.invitingUserId,
    date: i.date,
    invitingUserName: nameByUserId.get(i.invitingUserId) ?? null,
    invitedUserName: nameByUserId.get(i.invitedUserId) ?? null,
  }));
}
