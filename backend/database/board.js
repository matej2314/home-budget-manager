import prisma from './prismaClient.js';

export async function getHouseBoardData(houseId) {
  const house = await prisma.households.findUnique({ where: { houseId } });
  if (!house) return null;

  const latestBudget = await prisma.initialMonthlyBudgets.findFirst({
    where: { houseId },
    orderBy: { addedAt: 'desc' },
  });

  return {
    houseName: house.houseName,
    liveBalance: house.currentBalance,
    host: house.userName,
    lastBalanceDate: house.monthlyBalanceDate,
    lastInitialBudget: latestBudget?.value ?? null,
    initialValidUntil: latestBudget?.validUntil ?? null,
    initialDefinedAt: latestBudget?.addedAt ?? null,
  };
}

export async function getInmatesBoardData(houseId) {
  return prisma.householdUsers.findMany({
    where: { houseId },
    select: { userId: true, userName: true, role: true },
    orderBy: { id: 'asc' },
  });
}

export async function getTransactionsBoardPage(houseId, limit, offset) {
  const rows = await prisma.transactions.findMany({
    where: { houseId },
    orderBy: { addedAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      actionCategories: { select: { name: true } },
      users: { select: { name: true } },
    },
  });
  return rows.map((t) => ({
    transactionId: t.transactionId,
    value: t.value,
    addedAt: t.addedAt,
    type: t.type,
    userId: t.userId,
    houseId: t.houseId,
    catId: t.catId,
    categoryName: t.actionCategories?.name ?? null,
    userName: t.users?.name ?? null,
  }));
}

export async function getDailyBoardData(houseId) {
  const dailyTx = await prisma.dailyTransactions.findMany({ where: { houseId } });
  const dailyBudget = await prisma.dailyBudget.findMany({ where: { houseId } });
  // shortcut: N+1 / shape join w JS — KROK 3 dopasuje boardData.dailyData; upgrade = join po dacie
  return { dailyTx, dailyBudget };
}

export async function getStatsBoardData(houseId) {
  const budgets = await prisma.initialMonthlyBudgets.findMany({
    where: { houseId },
    orderBy: { addedAt: 'asc' },
  });
  const balances = await prisma.monthly_balances.findMany({
    where: { houseId },
    orderBy: { monthlyBalanceDate: 'asc' },
  });
  const counts = await prisma.monthlyTransactionCounts.findMany({
    where: { houseId },
  });
  return { budgets, balances, counts };
}

export async function getMessagesBoardPage(userId, limit, offset) {
  const rows = await prisma.messages.findMany({
    where: {
      OR: [{ senderId: userId }, { recipientId: userId }],
    },
    orderBy: { datetime: 'desc' },
    take: limit,
    skip: offset,
    include: {
      users_messages_senderIdTousers: { select: { name: true } },
      users_messages_recipientIdTousers: { select: { name: true } },
    },
  });
  return rows.map((m) => ({
    id: m.id,
    message: m.content,
    readed: m.is_read,
    date: m.datetime,
    sender: m.users_messages_senderIdTousers?.name ?? null,
    recipient: m.users_messages_recipientIdTousers?.name ?? null,
  }));
}

export async function countMessagesForUser(userId) {
  return prisma.messages.count({
    where: { OR: [{ senderId: userId }, { recipientId: userId }] },
  });
}
