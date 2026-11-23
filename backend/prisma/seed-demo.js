import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

/**
 * Demo seed (dev): użytkownicy + ExampleHouse + transakcje / notice / wiadomość.
 * Osobny od domyślnego prisma.seed (kategorie/technologie).
 * Idempotentny: jeśli istnieje gospodarstwo ExampleHouse — stop.
 * Nie uruchamiać na prod deploy (D-16).
 */
const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const categoriesPath = path.join(__dirname, 'data', 'actionCategories.json');

/** 1:1 z budget_manager.sql (hash hasła bez zmian). */
const SUPERADMIN = {
  id: '0cb0ee69-7bd8-4298-8ef1-0c67cc8d4c95',
  role: 'superadmin',
  name: 'mateo2314',
  password: '$2b$10$SVlIf9y5/CQLWwQCob7Equryt7ucgnhUvl5uzLXm2ANi7wBF7dvlu',
  email: 'mateo2314@gmail.com',
  acceptCookies: false,
  avatarName: null,
  host: false,
  inmate: false,
  regDate: new Date('2025-01-11T19:59:04'),
  completeTour: false,
};

// houseId pominięte: po resetcie z 0_init kolumna może być NOT NULL DEFAULT '0';
// po migracji NULL+FK ustaw ręcznie NULL albo dopisz data-migration — superadmin bez domu.
const SUPERADMIN_HU = {
  id: '0c2677f2-3f61-4c42-8a9a-b023204a02c8',
  userId: SUPERADMIN.id,
  userName: 'mateo2314',
  role: 'superadmin',
};

/** Hash 1:1 z dumpa (Testuser123!!); rola inmate (dump: mate). */
const INMATE = {
  id: 'd45638cd-95a4-4c20-b878-fcd18bc0b2ab',
  role: 'inmate',
  name: 'testuser123',
  password: '$2b$10$uhf/S.JUWBvDzAIhQsOlVO63/6hUC3gdcoXX22goe1bMamQPCWM4m',
  email: 'testuser@email.pl',
  acceptCookies: true,
  avatarName: 'd45638cd-95a4-4c20-b878-fcd18bc0b2ab.jpeg',
  host: false,
  inmate: true,
  regDate: new Date('2025-03-24T14:39:48'),
  completeTour: true,
};

const INMATE_HU_ID = '8884426c-deee-41e7-bfec-89a545ddd298';

const HOST = {
  id: 'a11c0e01-0000-4000-8000-000000000001',
  role: 'host',
  name: 'househost',
  email: 'househost@example.com',
  plainPassword: 'HomeHost12!',
  acceptCookies: true,
  host: true,
  inmate: false,
  completeTour: true,
};

const HOST_HU_ID = 'a11c0e01-0000-4000-8000-000000000002';
const HOUSE_ID = 'a11c0e01-0000-4000-8000-000000000010';
const HOUSE_NAME = 'ExampleHouse';
const INIT_BUDGET_ID = 'a11c0e01-0000-4000-8000-000000000020';
const NOTICE_ID = 'a11c0e01-0000-4000-8000-000000000030';

/** Jak emitNotification: id wiersza musi być w noticeData (frontend DELETE po noticeData.id). */
const DEMO_NOTICE_DATA = {
  id: NOTICE_ID,
  category: 'usersActions',
  message: 'notifications.addedInmate',
  houseName: HOUSE_NAME,
};

const CAT = {
  salary: '82ec5ca0-a79d-4538-bb6f-306d4d77bd79',
  freelancing: '772872ac-e4d6-4155-b045-605ce6c8bf5d',
  grocery: 'df7011f8-d9eb-4a95-9a2e-1f177ffa0007',
  transport: '4666a5d9-ea4d-4608-b329-9487adb092ef',
  eatingOut: 'fb862bab-6757-4396-9038-2ceaeddf90c9',
  health: 'a54c1c20-bc3d-4879-98d0-fdad128729aa',
  bills: 'caef99e6-4792-4441-b019-e6c436deb7a2',
};

async function ensureCategories() {
  const categories = JSON.parse(readFileSync(categoriesPath, 'utf8'));
  const result = await prisma.actionCategories.createMany({
    data: categories,
    skipDuplicates: true,
  });
  console.log(`Demo seed: actionCategories +${result.count} (skipDuplicates).`);
}

async function upsertUser(data) {
  const existing = await prisma.users.findUnique({ where: { id: data.id } });
  if (existing) {
    console.log(`Demo seed: user ${data.email} already exists — skip create.`);
    return existing;
  }
  return prisma.users.create({ data });
}

async function upsertHouseholdUser(tx, data) {
  const existing = await tx.householdUsers.findUnique({ where: { userId: data.userId } });
  if (existing) {
    return tx.householdUsers.update({
      where: { userId: data.userId },
      data: {
        userName: data.userName,
        houseId: data.houseId,
        role: data.role,
      },
    });
  }
  return tx.householdUsers.create({ data });
}

async function upsertDemoNotice(houseId = HOUSE_ID) {
  await prisma.notifications.upsert({
    where: { id: NOTICE_ID },
    create: {
      id: NOTICE_ID,
      category: 'usersActions',
      noticeData: DEMO_NOTICE_DATA,
      houseId,
    },
    update: {
      category: 'usersActions',
      noticeData: DEMO_NOTICE_DATA,
      houseId,
    },
  });
}

async function main() {
  const existingHouse = await prisma.households.findFirst({
    where: { houseName: HOUSE_NAME },
  });
  if (existingHouse) {
    await upsertDemoNotice(existingHouse.houseId);
    console.log(
      `Demo seed: household "${HOUSE_NAME}" already exists — repaired notice ${NOTICE_ID} (noticeData.id).`,
    );
    return;
  }

  await ensureCategories();

  const hostPasswordHash = await bcrypt.hash(HOST.plainPassword, 10);

  await upsertUser(SUPERADMIN);
  await upsertUser({
    id: HOST.id,
    role: HOST.role,
    name: HOST.name,
    password: hostPasswordHash,
    email: HOST.email,
    acceptCookies: HOST.acceptCookies,
    host: HOST.host,
    inmate: HOST.inmate,
    completeTour: HOST.completeTour,
  });
  await upsertUser(INMATE);

  const initBudget = 5000;
  const transactions = [
    {
      id: 'a11c0e01-0000-4000-8000-000000000101',
      transactionId: 'a11c0e01-0000-4000-8000-000000000201',
      userId: HOST.id,
      houseId: HOUSE_ID,
      catId: CAT.salary,
      type: 'income',
      value: 4500,
    },
    {
      id: 'a11c0e01-0000-4000-8000-000000000102',
      transactionId: 'a11c0e01-0000-4000-8000-000000000202',
      userId: HOST.id,
      houseId: HOUSE_ID,
      catId: CAT.grocery,
      type: 'expense',
      value: 320.5,
    },
    {
      id: 'a11c0e01-0000-4000-8000-000000000103',
      transactionId: 'a11c0e01-0000-4000-8000-000000000203',
      userId: HOST.id,
      houseId: HOUSE_ID,
      catId: CAT.bills,
      type: 'expense',
      value: 180,
    },
    {
      id: 'a11c0e01-0000-4000-8000-000000000104',
      transactionId: 'a11c0e01-0000-4000-8000-000000000204',
      userId: INMATE.id,
      houseId: HOUSE_ID,
      catId: CAT.freelancing,
      type: 'income',
      value: 800,
    },
    {
      id: 'a11c0e01-0000-4000-8000-000000000105',
      transactionId: 'a11c0e01-0000-4000-8000-000000000205',
      userId: INMATE.id,
      houseId: HOUSE_ID,
      catId: CAT.eatingOut,
      type: 'expense',
      value: 95.2,
    },
    {
      id: 'a11c0e01-0000-4000-8000-000000000106',
      transactionId: 'a11c0e01-0000-4000-8000-000000000206',
      userId: INMATE.id,
      houseId: HOUSE_ID,
      catId: CAT.health,
      type: 'expense',
      value: 150,
    },
    {
      id: 'a11c0e01-0000-4000-8000-000000000107',
      transactionId: 'a11c0e01-0000-4000-8000-000000000207',
      userId: HOST.id,
      houseId: HOUSE_ID,
      catId: CAT.transport,
      type: 'expense',
      value: 60,
    },
  ];

  let balance = initBudget;
  for (const t of transactions) {
    balance += t.type === 'income' ? Number(t.value) : -Number(t.value);
  }
  balance = Math.round(balance * 100) / 100;

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  await prisma.$transaction(async (tx) => {
    await upsertHouseholdUser(tx, SUPERADMIN_HU);

    await tx.households.create({
      data: {
        houseId: HOUSE_ID,
        userId: HOST.id,
        userName: HOST.name,
        houseName: HOUSE_NAME,
        initBudget,
        currentBalance: balance,
      },
    });

    await upsertHouseholdUser(tx, {
      id: HOST_HU_ID,
      userId: HOST.id,
      userName: HOST.name,
      houseId: HOUSE_ID,
      role: 'host',
    });

    await upsertHouseholdUser(tx, {
      id: INMATE_HU_ID,
      userId: INMATE.id,
      userName: INMATE.name,
      houseId: HOUSE_ID,
      role: 'inmate',
    });

    await tx.initialMonthlyBudgets.create({
      data: {
        id: INIT_BUDGET_ID,
        houseId: HOUSE_ID,
        value: initBudget,
        validUntil,
      },
    });

    await tx.transactions.createMany({ data: transactions });

    await tx.notifications.create({
      data: {
        id: NOTICE_ID,
        category: 'usersActions',
        noticeData: DEMO_NOTICE_DATA,
        houseId: HOUSE_ID,
      },
    });

    await tx.messages.create({
      data: {
        id: 'a11c0e01-0000-4000-8000-000000000040',
        senderId: HOST.id,
        recipientId: INMATE.id,
        content: 'Welcome to ExampleHouse — demo seed message.',
        is_read: false,
      },
    });
  });

  console.log('Demo seed OK:', {
    superadmin: SUPERADMIN.email,
    host: { email: HOST.email, password: HOST.plainPassword },
    inmate: { email: INMATE.email, password: 'Testuser123!! (hash z dumpa)' },
    house: HOUSE_NAME,
    houseId: HOUSE_ID,
    transactions: transactions.length,
    currentBalance: balance,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
