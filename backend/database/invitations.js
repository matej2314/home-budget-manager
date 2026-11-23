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

export async function listInvitationsCollection(status) {
  const invitations = await prisma.invitations.findMany({ where: { status } });
  const result = [];
  for (const i of invitations) {
    const inviting = await prisma.householdUsers.findFirst({
      where: { userId: i.invitingUserId },
      select: { userName: true },
    });
    const invited = await prisma.householdUsers.findFirst({
      where: { userId: i.invitedUserId },
      select: { userName: true },
    });
    result.push({
      id: i.id,
      status: i.status,
      hostId: i.hostId,
      invitedUser: i.invitedUserId,
      invitingUser: i.invitingUserId,
      date: i.date,
      invitingUserName: inviting?.userName ?? null,
      invitedUserName: invited?.userName ?? null,
    });
  }
  return result;
}
