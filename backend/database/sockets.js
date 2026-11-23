import prisma from './prismaClient.js';

export async function findConnectionByUserId(userId) {
  return prisma.socketConnections.findFirst({ where: { userId } });
}

export async function saveConnection(data) {
  return prisma.socketConnections.create({ data });
}

export async function deleteConnectionByUserId(userId) {
  return prisma.socketConnections.deleteMany({ where: { userId } });
}

export async function listConnectionIdsByUserIds(userIds) {
  if (!userIds.length) return [];
  const rows = await prisma.socketConnections.findMany({
    where: { userId: { in: userIds } },
    select: { connectionId: true },
  });
  return rows.map((r) => r.connectionId);
}

export async function clearAllConnections() {
  return prisma.socketConnections.deleteMany();
}
