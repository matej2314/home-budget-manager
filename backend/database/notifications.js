import prisma from './prismaClient.js';

export async function createNotification({ id, category, noticeData, houseId }) {
  return prisma.notifications.create({
    data: { id, category, noticeData, houseId },
  });
}

export async function listNotificationsByHouse(houseId) {
  return prisma.notifications.findMany({
    where: { houseId },
    select: { id: true, category: true, noticeData: true },
  });
}

export async function deleteNotification(noticeId, houseId) {
  return prisma.notifications.deleteMany({ where: { id: noticeId, houseId } });
}

export async function findNotificationById(id) {
  return prisma.notifications.findUnique({ where: { id } });
}
