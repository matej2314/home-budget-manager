import prisma from '../../database/prismaClient.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const categoriesPath = path.join(__dirname, '../../prisma/data/actionCategories.json');

/** Stałe ID z seeda — do E2E transakcji (T-5.4). */
export const SEED_CAT = {
  expenseEducation: '1f2dace5-930b-4f8f-a1ab-7d257c47869e',
  incomeSalary: '82ec5ca0-a79d-4538-bb6f-306d4d77bd79',
};

/**
 * Sprząta dane mutowane przez E2E. Nie rusza actionCategories / technologies.
 * Kolejność respektuje FK (dzieci przed rodzicami).
 */
export async function resetMutatingTables() {
  await prisma.messages.deleteMany();
  await prisma.notifications.deleteMany();
  await prisma.transactions.deleteMany();
  await prisma.invitations.deleteMany();
  await prisma.socketConnections.deleteMany();
  await prisma.dailyBudget.deleteMany();
  await prisma.dailyTransactions.deleteMany();
  await prisma.monthly_balances.deleteMany();
  await prisma.monthlyTransactionCounts.deleteMany();
  await prisma.initialMonthlyBudgets.deleteMany();
  await prisma.householdUsers.deleteMany();
  await prisma.households.deleteMany();
  await prisma.usersReviews.deleteMany();
  await prisma.users.deleteMany();
}

/** Idempotentny seed kategorii (jak prisma/seed.js, bez technologies — E2E ich nie wymaga). */
export async function ensureSeedCategories() {
  const categories = JSON.parse(readFileSync(categoriesPath, 'utf8'));
  await prisma.actionCategories.createMany({
    data: categories,
    skipDuplicates: true,
  });
}

export async function prepareE2eDatabase() {
  await resetMutatingTables();
  await ensureSeedCategories();
}
