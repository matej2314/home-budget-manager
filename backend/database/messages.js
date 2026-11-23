import prisma from './prismaClient.js';

export async function findUserIdByName(name) {
  const user = await prisma.users.findFirst({
    where: { name },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function createMessage(data) {
  return prisma.messages.create({ data });
}

export async function deleteMessageById(id) {
  return prisma.messages.deleteMany({ where: { id } });
}

export async function markMessageRead(messageId, recipientId) {
  return prisma.messages.updateMany({
    where: { id: messageId, recipientId },
    data: { is_read: true },
  });
}
