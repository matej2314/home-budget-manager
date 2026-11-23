# Home Budget Manager — feature plan: backend Faza 7 (Persistencja Prisma / R6)

**Kotwica major:** `home-budget-manager_major_plan-backend.md` — **Faza 7** (kroki 7.1–7.3).  
**Źródła:** `docs/model_danych.md`, `docs/architektura.md` (R6), `docs/architektura_katalogi_pliki.md`, `docs/katalog_env.md`, `docs/data_flow.md`, `docs/testy.md`, `spec/SPEC-DANE.md` (D-1–D-18), `spec/SPEC-BACKEND.md` (B-6–B-9, B-1, B-5), `spec/SPEC-TESTY.md` (T-7, T-10, T-15), kod `backend/`.  
**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Pełna Faza 7 major backend: Prisma + Migrate, warstwa `database/`, usunięcie pool/`*Queries`/raw SQL, seed, atomowość saldo↔transakcja, scoped testy (T-15) |
| Pass rozwojowy | Helper atomowy saldo+transakcja w **KROK 2** (używany w KROK 3/5). Kolejność: 1 fundament → 2 API `database/` → 3 przełączenie call site’ów → 4 cleanup → 5 seed+testy. Brak przenosin między fazami major |
| Poza zakresem | E-mail outbound (Faza 8), piramida/E2E T-5 (Faza 9), frontend, drugi ORM, zmiana silnika DB, CI/Jenkins |
| Po implementacji (informacyjnie) | Major: Faza 7 + kroki 7.1–7.3 → `WYKONANY`; `MILESTONE — Dane wyłącznie przez Prisma` → `OSIĄGNIĘTY` — **edycja major poza tym skillem** |

### Założenia HOW (zatwierdzone)

1. Start schematu: `prisma db pull` z istniejącej MySQL, potem **weryfikacja** względem `docs/model_danych.md` (encje, pola kluczowe, brak driftu nazw/`inmate`).
2. Runtime Prisma: gotowy `DATABASE_URL` w `.env`. Równolegle w `.env` zostają `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (ops/compose/lokalny opis — **nie** drugi pool).
3. Nowe nazwy modułów w `database/` (nie stem `*Queries.js`).
4. Pin Prisma **6.x** (`prisma` + `@prisma/client`) — klasyczny `url = env("DATABASE_URL")` w `schema.prisma` (bez wymuszania Prisma 7 / `prisma.config.ts`).
5. `utils/` / `configs/` / `store/` **nie** importują `@prisma/client`; wołają wyłącznie API `database/*`.
6. `liveUpdateBalance`: po R6 **tylko** skutek uboczny WS (bez SQL); zapis salda w `database/transactions.js` wewnątrz `prisma.$transaction`.

### Biblioteki

| Biblioteka | Wersja | Ustalenie | Źródło |
|------------|--------|-----------|--------|
| `prisma` / `@prisma/client` | `^6` (najnowszy 6.x przy instalacji) | `db pull`, Migrate baseline (`migrate diff` + `migrate resolve --applied`), Client singleton, `prisma.$transaction`, seed przez `package.json#prisma.seed` | Context7 `/websites/prisma_io/v6` |
| `mysql2` | as-is → **usunięcie** w KROK 4 | Zakaz równoległego poola (B-6, D-3) | SPEC-DANE / SPEC-BACKEND |

---

## FAZA 1 — Persistencja Prisma (R6)

### KROK 1 — Fundament: zależności, `db pull`, migracja bazowa, singleton

**Status:** `WYKONANY`

**Cel:** Wprowadzić Prisma ORM + Migrate w `backend/prisma/`, `DATABASE_URL` w env, singleton klienta w `database/prismaClient.js` (major 7.1; B-6–B-8; D-5–D-7).

**Artefakty (nowe / zmieniane):**

- `backend/prisma/schema.prisma` (wynik `db pull` + weryfikacja docs)
- `backend/prisma/migrations/0_init/migration.sql` (baseline)
- `backend/database/prismaClient.js`
- `backend/package.json` (deps + skrypty + `prisma.seed` placeholder na KROK 5)
- `backend/.env.example` (`DATABASE_URL`, `DB_PORT`)

#### Procedura schematu (obowiązkowa przy implementacji)

```bash
cd backend
npm install prisma@^6 @prisma/client@^6 --save-exact   # albo bez --save-exact; pin major 6
npx prisma init --datasource-provider mysql
# Ustaw DATABASE_URL w .env (mysql://USER:PASS@HOST:PORT/DB)
npx prisma db pull
```

**Checklist weryfikacji `schema.prisma` ↔ `docs/model_danych.md`:**

| Encja docs | Tabela / model | Kluczowe pola do potwierdzenia po pull |
|------------|----------------|----------------------------------------|
| users | `users` | `id`, `name`, `email`, `password`, `role`, `host`, `inmate`, `avatarName`, `acceptCookies`, `completeTour` |
| households | `households` | `houseId`, `userId`, `userName`, `houseName`, `initBudget`, `currentBalance`, `createdAt`, `monthlyBalanceDate` |
| householdUsers | `householdUsers` | `id`, `userId`, `houseId`, `userName`, `role` (`host`\|`inmate`) |
| invitations | `invitations` | `id`, `status`, `invitingUserId`, `invitedUserId`, `houseId`, `hostId`, `date` |
| transactions | `transactions` | `id`, `transactionId`, `userId`, `houseId`, `catId`, `type`, `value`, `addedAt` |
| actionCategories | `actionCategories` | `id`, `name`, `type` |
| initialMonthlyBudgets | `initialMonthlyBudgets` | `id`, `houseId`, `value`, `validUntil`, `addedAt` |
| messages | `messages` | `id`, `senderId`, `recipientId`, `content`, `datetime`, `is_read` |
| notifications | `notifications` | `id`, `houseId`, `category`, `noticeData` |
| socketConnections | `socketConnections` | `id`, `userId`, `connectionId`, `expireDate` |
| snapshoty | `dailyTransactions`, `dailyBudget`, `monthly_balances`, `monthlyTransactionCounts` | zgodność z sekcją snapshotów docs |
| otoczka | `technologies`, `usersReviews` | jak docs |

Uwagi z as-is SQL (do świadomej weryfikacji po pull, **bez** ręcznego DDL „na skróty”):

- Membership bez domu: `houseId = 0` / `NULL` (kod miesza oba — pull pokaże typ kolumny; zachować zachowanie services).
- Rola globalna / membership: wyłącznie `inmate` (nie `mate`) — D-12.
- Nazwy kolumn snapshotów (`startDate` vs `StartDate`) — **źródło prawdy = wynik pull**.

Jeśli pull ujawni tabelę/pole poza docs → zanotuj drift; nie rozszerzaj produktu w tej fazie — tylko mapuj istniejące. Jeśli docs wymienia encję, a DB jej nie ma → stop implementacji i decyzja prowadzącego (luka docs↔DB), nie wymyślaj DDL w feature planie.

#### Baseline Migrate (istniejąca baza)

```bash
mkdir -p prisma/migrations/0_init
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
npx prisma migrate resolve --applied 0_init
npx prisma generate
```

(Context7 `/websites/prisma_io/v6` — baselining: `migrate diff` + `migrate resolve --applied`.)

#### Szkic startowy `schema.prisma` (zastępowany wynikiem `db pull`)

Poniższy blok to **szkielet datasource/generator** + przypomnienie modeli. Po `db pull` treść modeli pochodzi z DB; ten fragment zostawiamy tylko jako kotwicę generatora/URL, jeśli pull nadpisze cały plik — przywróć `url = env("DATABASE_URL")` i generator.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Modele: wynik `npx prisma db pull` — zweryfikuj checklistą powyżej.
```

#### Nowy plik — `backend/database/prismaClient.js`

```javascript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

/** Singleton Prisma Client (B-7 / D-1) — import wyłącznie z warstwy database/. */
export const prisma =
  globalForPrisma.__hbmPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__hbmPrisma = prisma;
}

export default prisma;
```

#### Refaktor — `backend/package.json` (fragment)

**teraz** (fragment `dependencies` / `scripts`):

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
  "lint": "eslint ."
},
"dependencies": {
  "mysql2": "^3.11.3"
}
```

**zamień na** (dodatki; reszta deps bez zmian w tym kroku — `mysql2` zostaje do KROK 4):

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
  "lint": "eslint .",
  "prisma:generate": "prisma generate",
  "prisma:migrate:deploy": "prisma migrate deploy",
  "prisma:studio": "prisma studio"
},
"dependencies": {
  "@prisma/client": "^6.0.0",
  "mysql2": "^3.11.3"
},
"devDependencies": {
  "prisma": "^6.0.0"
},
"prisma": {
  "seed": "node prisma/seed.js"
}
```

(`seed.js` powstaje w KROK 5; wpis `prisma.seed` można dodać już tu albo w KROK 5 — byle przed DoD fazy.)

#### Refaktor — `backend/.env.example`

**teraz:**

```env
DB_HOST=127.0.0.1
DB_USER=budget_user
DB_PASSWORD=budget_password
DB_NAME=home_budget
```

**zamień na:**

```env
# MySQL — szczegóły ops / compose (bez drugiego poola w kodzie)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=budget_user
DB_PASSWORD=budget_password
DB_NAME=home_budget

# Prisma Client + Migrate (wymagane w runtime po R6)
DATABASE_URL=mysql://budget_user:budget_password@127.0.0.1:3306/home_budget
```

(Wartości przykładowe — bez sekretów prod. Lokalny `.env` uzupełnia prowadzący; **nie** commitować `.env`.)

#### DoD (krok)

- `schema.prisma` w repo po pull + checklista docs odhaczona (albo jawny drift zgłoszony).
- Migracja `0_init` w `prisma/migrations/` + `migrate resolve --applied` na bazie deweloperskiej.
- `prisma generate` przechodzi; `database/prismaClient.js` eksportuje singleton.
- `.env.example` ma `DATABASE_URL` oraz `DB_*` w tym `DB_PORT`.
- Żaden service/controller jeszcze nie musi być przełączony (to KROK 3).

---

### KROK 2 — Moduły `database/` na Prisma (API zamiast `*Queries`)

**Status:** `WYKONANY`

**Cel:** Pełne API dostępu do danych wyłącznie przez Prisma w `database/` (major 7.1; D-1–D-3; B-7). Helper atomowy saldo+transakcja powstaje **tu** (pass rozwojowy).

**Artefakty (nowe):**

| Plik | Obszar |
|------|--------|
| `backend/database/auth.js` | login/register lookups |
| `backend/database/users.js` | profil, membership props, avatar, cookies/tour |
| `backend/database/households.js` | domy + membership odczyty |
| `backend/database/invitations.js` | zaproszenia |
| `backend/database/transactions.js` | transakcje + **atomowość saldo** |
| `backend/database/categories.js` | `actionCategories` |
| `backend/database/budget.js` | `initialMonthlyBudgets` |
| `backend/database/board.js` | agregaty dashboard (dawne `dashboardQueries`) |
| `backend/database/messages.js` | wiadomości |
| `backend/database/notifications.js` | notice |
| `backend/database/sockets.js` | `socketConnections` + member userIds |
| `backend/database/snapshots.js` | daily/monthly snapshoty (cron) |
| `backend/database/shell.js` | `technologies`, `usersReviews` |

Nazwy modeli Prisma poniżej (`prisma.users`, …) zakładają domyślne mapowanie tabel MySQL po pull — jeśli pull wygeneruje inne identyfikatory modeli, **dostosuj** wywołania 1:1 do wygenerowanego clienta (bez `$queryRaw`).

#### Nowy plik — `backend/database/auth.js`

```javascript
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
```

#### Nowy plik — `backend/database/users.js`

```javascript
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
  return prisma.householdUsers.updateMany({ where: { houseId }, data: { houseId: null } });
}

export async function deleteTransactionsByUserId(userId) {
  return prisma.transactions.deleteMany({ where: { userId } });
}
```

#### Nowy plik — `backend/database/households.js`

```javascript
import prisma from './prismaClient.js';

export async function findHouseholdByName(houseName) {
  return prisma.households.findFirst({ where: { houseName } });
}

export async function findHouseholdById(houseId) {
  return prisma.households.findUnique({ where: { houseId } });
}

export async function createHousehold(data) {
  return prisma.households.create({ data });
}

export async function deleteHousehold(houseId, userId) {
  return prisma.households.deleteMany({ where: { houseId, userId } });
}

export async function deleteHouseholdById(houseId) {
  return prisma.households.delete({ where: { houseId } });
}

export async function listHousesWithMembers() {
  return prisma.households.findMany({
    include: { householdUsers: true },
    orderBy: { houseId: 'asc' },
  });
}

export async function findMembershipByUserId(userId) {
  return prisma.householdUsers.findFirst({
    where: {
      userId,
      NOT: [{ houseId: null }, { houseId: 0 }, { houseId: '0' }].filter(Boolean),
    },
  });
}

/** Membership jak as-is checkQuery: dowolny wiersz householdUsers dla userId (w tym houseId 0). */
export async function findHouseholdUserRow(userId) {
  return prisma.householdUsers.findFirst({ where: { userId } });
}

export async function listMemberUserIds(houseId) {
  const rows = await prisma.householdUsers.findMany({
    where: { houseId },
    select: { userId: true },
  });
  return rows.map((r) => r.userId);
}

export async function findHostUserId(houseId) {
  const row = await prisma.householdUsers.findFirst({
    where: { houseId, role: 'host' },
    select: { userId: true },
  });
  return row?.userId ?? null;
}

export async function listInmates(houseId) {
  return prisma.householdUsers.findMany({
    where: { houseId, role: 'inmate' },
  });
}

export async function getBalanceFields(houseId) {
  return prisma.households.findUnique({
    where: { houseId },
    select: { currentBalance: true, initBudget: true },
  });
}

export async function updateCurrentBalance(houseId, currentBalance) {
  return prisma.households.update({
    where: { houseId },
    data: { currentBalance },
  });
}

export async function listHouseholdsForMonthlyBalance() {
  return prisma.households.findMany({
    select: {
      houseId: true,
      initBudget: true,
      monthlyBalanceDate: true,
      createdAt: true,
    },
  });
}
```

> shortcut: filtr `houseId` 0/`'0'`/null w `findMembershipByUserId` dopasuj do **rzeczywistego typu** kolumny po pull; zostaw jedną spójną regułę „ma aktywny dom”.

#### Nowy plik — `backend/database/invitations.js`

```javascript
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
  return prisma.invitations.findMany({
    where: { status },
    include: {
      // Jeśli pull nie doda relacji — zamień na dwa findFirst po householdUsers.
    },
  });
}
```

Dla kolekcji zaproszeń (dawny JOIN po `householdUsers.userName`): po pull, jeśli brak relacji Prisma, złóż wynik w module bez raw SQL:

```javascript
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
```

#### Nowy plik — `backend/database/transactions.js`

```javascript
import prisma from './prismaClient.js';

function nextBalance(currentBalance, initBudget, type, value) {
  let balance = parseFloat(currentBalance) || parseFloat(initBudget) || 0;
  const amount = parseFloat(value);
  if (type === 'income') balance += amount;
  else if (type === 'expense') balance -= amount;
  return parseFloat(balance);
}

/**
 * Atomowy zapis transakcji + aktualizacja households.currentBalance (D-11).
 * Zwraca { transactionId, houseId, newBalance }.
 */
export async function createTransactionWithBalanceUpdate({
  id,
  transactionId,
  userId,
  houseId,
  catId,
  type,
  value,
}) {
  return prisma.$transaction(async (tx) => {
    const house = await tx.households.findUnique({ where: { houseId } });
    if (!house) {
      throw new Error(`Household ${houseId} not found`);
    }

    await tx.transactions.create({
      data: {
        id,
        transactionId,
        userId,
        houseId,
        catId,
        type,
        value,
      },
    });

    const newBalance = nextBalance(house.currentBalance, house.initBudget, type, value);
    await tx.households.update({
      where: { houseId },
      data: { currentBalance: newBalance },
    });

    return { transactionId, houseId, newBalance };
  });
}

/**
 * Usunięcie transakcji + korekta salda.
 * As-is deleteAction woła liveUpdateBalance('expense', value, ...) — zachowaj tę samą regułę
 * (odejmowanie wartości usuwanego rekordu), o ile nie zmieniasz kontraktu produktu.
 */
export async function deleteTransactionWithBalanceUpdate({
  userId,
  houseId,
  transactionId,
  balanceType,
  value,
}) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.transactions.findFirst({
      where: { transactionId, userId, houseId },
    });
    if (!existing) {
      return { deleted: false };
    }

    await tx.transactions.deleteMany({
      where: { transactionId, userId, houseId },
    });

    const house = await tx.households.findUnique({ where: { houseId } });
    const newBalance = nextBalance(
      house.currentBalance,
      house.initBudget,
      balanceType,
      value,
    );
    await tx.households.update({
      where: { houseId },
      data: { currentBalance: newBalance },
    });

    return { deleted: true, houseId, newBalance, value: existing.value };
  });
}

export async function findTransactionByTransactionId(transactionId) {
  return prisma.transactions.findFirst({
    where: { transactionId },
    select: { userId: true, value: true, houseId: true },
  });
}

export async function listTransactionsByHouse(houseId) {
  return prisma.transactions.findMany({
    where: { houseId },
    include: { /* actionCategories jeśli relacja istnieje po pull */ },
    orderBy: { addedAt: 'desc' },
  });
}

export async function listAllTransactions() {
  return prisma.transactions.findMany({ orderBy: { transactionId: 'asc' } });
}

export async function deleteTransactionsByHouseId(houseId) {
  return prisma.transactions.deleteMany({ where: { houseId } });
}

export async function countTransactionsByHouse(houseId) {
  return prisma.transactions.count({ where: { houseId } });
}

export async function listTransactionsInDateRange(houseId, from, to) {
  return prisma.transactions.findMany({
    where: {
      houseId,
      addedAt: { gte: from, lte: to },
    },
    select: { value: true, type: true },
  });
}

export async function deleteTransactionsInDateRange(houseId, from, to) {
  return prisma.transactions.deleteMany({
    where: {
      houseId,
      addedAt: { gte: from, lte: to },
    },
  });
}
```

#### Nowy plik — `backend/database/categories.js`

```javascript
import prisma from './prismaClient.js';

export async function listCategories() {
  return prisma.actionCategories.findMany({ orderBy: { id: 'asc' } });
}

export async function createCategory({ id, name, type }) {
  return prisma.actionCategories.create({ data: { id, name, type } });
}

export async function deleteAllCategories() {
  return prisma.actionCategories.deleteMany();
}
```

#### Nowy plik — `backend/database/budget.js`

```javascript
import prisma from './prismaClient.js';

export async function createInitialMonthlyBudget(data) {
  return prisma.initialMonthlyBudgets.create({ data });
}

export async function listAddedAtByHouse(houseId) {
  return prisma.initialMonthlyBudgets.findMany({
    where: { houseId },
    select: { addedAt: true },
    orderBy: { addedAt: 'desc' },
  });
}

export async function updateInitialBudgetValue(id, value) {
  return prisma.initialMonthlyBudgets.update({
    where: { id },
    data: { value },
  });
}

export async function updateInitialBudgetByHouse(houseId, { value, validUntil }) {
  return prisma.initialMonthlyBudgets.updateMany({
    where: { houseId },
    data: { value, validUntil },
  });
}

export async function latestInitialBudgetValue(houseId) {
  const row = await prisma.initialMonthlyBudgets.findFirst({
    where: { houseId },
    orderBy: { addedAt: 'desc' },
    select: { value: true },
  });
  return row?.value ?? null;
}
```

#### Nowy plik — `backend/database/board.js`

Agregaty dawnego `dashboardQueries.js` — **bez** `$queryRaw`. Składaj przez `findUnique` / `findMany` / `include` / `orderBy`/`take`.

```javascript
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
  });
  // Dołącz categoryName / userName osobnymi odczytami lub include po pull relacji.
  const enriched = [];
  for (const t of rows) {
    const cat = await prisma.actionCategories.findUnique({ where: { id: t.catId } });
    const user = await prisma.users.findUnique({
      where: { id: t.userId },
      select: { name: true },
    });
    enriched.push({
      transactionId: t.transactionId,
      value: t.value,
      addedAt: t.addedAt,
      type: t.type,
      userId: t.userId,
      houseId: t.houseId,
      catId: t.catId,
      categoryName: cat?.name ?? null,
      userName: user?.name ?? null,
    });
  }
  return enriched;
}

export async function getDailyBoardData(houseId) {
  const dailyTx = await prisma.dailyTransactions.findMany({ where: { houseId } });
  const dailyBudget = await prisma.dailyBudget.findMany({ where: { houseId } });
  // Złóż kształt zgodny z dotychczasowym boardData.dailyData (join po houseId/datach w JS).
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
  });
  const enriched = [];
  for (const m of rows) {
    const sender = await prisma.users.findUnique({
      where: { id: m.senderId },
      select: { name: true },
    });
    const recipient = await prisma.users.findUnique({
      where: { id: m.recipientId },
      select: { name: true },
    });
    enriched.push({
      id: m.id,
      message: m.content,
      readed: m.is_read,
      date: m.datetime,
      sender: sender?.name ?? null,
      recipient: recipient?.name ?? null,
    });
  }
  return enriched;
}

export async function countMessagesForUser(userId) {
  return prisma.messages.count({
    where: { OR: [{ senderId: userId }, { recipientId: userId }] },
  });
}
```

> shortcut: N+1 na board przy dużych limitach — wystarczy na R6; upgrade = `include`/batch gdy pull da relacje albo osobny read-model (poza Fazą 7).

#### Nowy plik — `backend/database/messages.js`

```javascript
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
```

#### Nowy plik — `backend/database/notifications.js`

```javascript
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
```

#### Nowy plik — `backend/database/sockets.js`

```javascript
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
```

#### Nowy plik — `backend/database/snapshots.js`

```javascript
import prisma from './prismaClient.js';

export async function upsertDailyTransactionCount(data) {
  return prisma.dailyTransactions.create({ data });
}

export async function createDailyBudget(data) {
  return prisma.dailyBudget.create({ data });
}

export async function createMonthlyBalance(data) {
  return prisma.monthly_balances.create({ data });
}

export async function createMonthlyTransactionCount(data) {
  return prisma.monthlyTransactionCounts.create({ data });
}

export async function deleteDailyTransactionsInRange(houseId, from, to) {
  return prisma.dailyTransactions.deleteMany({
    where: { houseId, date: { gte: from, lte: to } },
  });
}

export async function deleteDailyBudgetInRange(houseId, from, to) {
  return prisma.dailyBudget.deleteMany({
    where: { houseId, date: { gte: from, lte: to } },
  });
}

export async function updateHouseholdMonthlyBalanceDate(houseId, monthlyBalanceDate) {
  return prisma.households.update({
    where: { houseId },
    data: { monthlyBalanceDate },
  });
}
```

(Dokładne nazwy modeli/pól po pull — dostosuj; zachowaj semantykę z `balanceHouseholdsMonthly` / `saveDaily*`. Zakaz `$queryRaw`.)

#### Nowy plik — `backend/database/shell.js`

```javascript
import prisma from './prismaClient.js';

export async function listTechnologies() {
  return prisma.technologies.findMany();
}

export async function createTechnology(data) {
  return prisma.technologies.create({ data });
}

export async function listReviews() {
  return prisma.usersReviews.findMany({ orderBy: { date: 'desc' } });
}

export async function createReview(data) {
  return prisma.usersReviews.create({ data });
}
```

#### DoD (krok)

- Wszystkie wymienione moduły istnieją; kompilują się względem wygenerowanego clienta.
- `createTransactionWithBalanceUpdate` / `deleteTransactionWithBalanceUpdate` używają `prisma.$transaction`.
- Brak `$queryRaw` / `$executeRaw` w `database/`.
- Controllers/services jeszcze mogą wisieć na pool — przełączenie = KROK 3.

---

### KROK 3 — Przełączenie services / utils / store / configs na API `database/`

**Status:** `WYKONANY`

**Cel:** Ścieżki runtime bez `pool` / `*Queries` (major 7.2; D-1–D-2; B-1).

**Zasada:** Usuń `import pool` i `import …Queries`. Wołaj funkcje z KROK 2. Usuń `getConnection` / `beginTransaction` mysql2 — atomowość tylko przez API `database/` (`$transaction` tam, gdzie multi-write).

#### Checklist plików do przełączenia

Services: `auth/*`, `household/*`, `invitations/*`, `transactions/*`, `categories/*`, `budget/*`, `board/getBoardData.js`, `messages/*`, `notifications/*`, `users/*`, `shell/**`.  
Utils: `checkUtils/*`, `dbUtils/*`, `householdUtils/*` (w tym `liveUpdateBalance`, `saveNewInmate`, `initMonthlyBudgetFunctions`), `clearSocketConnections.js`.  
Inne: `configs/websocketConfig.js`, `store/avatarStorage.js`.

#### Refaktor — `backend/utils/checkUtils/checkUserHouse.js`

**teraz:**

```javascript
import actionQueries from '../../database/transactionsQueries.js';

const checkUserHouse = async (connection, userId) => {
    const [result] = await connection.query(actionQueries.checkQuery, [userId]);
    return result.length > 0 ? result[0] : null;
};

export default checkUserHouse;
```

**zamień na:**

```javascript
import { findHouseholdUserRow } from '../../database/households.js';

const checkUserHouse = async (userId) => {
  return findHouseholdUserRow(userId);
};

export default checkUserHouse;
```

(Wszystkie call site’y: usuń argument `connection`.)

#### Refaktor — `backend/utils/householdUtils/liveUpdateBalance.js`

**teraz:** SQL + WS + `connection.release()` w `finally` (bug względem otwartej transakcji callera).

**zamień na** (tylko WS; saldo już zapisane w `database/transactions`):

```javascript
import logger from '../../configs/logger.js';
import { broadcastMessage, broadcastToHousehold } from '../../configs/websocketConfig.js';

/**
 * Skutek uboczny po udanej mutacji salda w database/ — bez SQL (R6 / D-3).
 */
export const liveUpdateBalance = async (houseId, userId, newBalance) => {
  try {
    await broadcastToHousehold(houseId, {
      type: 'balance_update',
      data: { houseId, newBalance },
    });
  } catch (error) {
    logger.error(`liveupdate websocket error: ${error.message}`);
    broadcastMessage(userId, {
      type: 'error',
      data: { message: 'Websocket error.' },
    });
  }
};
```

#### Refaktor — `backend/services/transactions/addNewAction.js` (rdzeń)

**teraz:** `pool.getConnection` + `actionQueries` + `liveUpdateBalance(type, value, houseId, userId, connection)` wewnątrz transakcji mysql2.

**zamień na:**

```javascript
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import checkHouse from '../../utils/checkUtils/checkUserHouse.js';
import { validTransactionTypes } from '../../utils/validation.js';
import { createTransactionWithBalanceUpdate } from '../../database/transactions.js';
import { liveUpdateBalance } from '../../utils/householdUtils/liveUpdateBalance.js';
import { handleNotification } from '../../utils/handleNotification.js';
import { AppError } from '../../utils/errors/AppError.js';

const addNewAction = async (userId, type, value, catId) => {
  const transactionId = uuidv4();
  const id = uuidv4();
  const validTypes = validTransactionTypes;

  if (!type || !validTypes.includes(type)) {
    logger.error('Invalid input data.');
    throw new AppError({ code: 'TX_1', messageKey: 'Invalid input data.', httpStatus: 400 });
  }

  try {
    const houseData = await checkHouse(userId);
    if (!houseData || houseData.houseId === 0 || houseData.houseId === '0' || houseData.houseId == null) {
      logger.error(`User ${userId} does not belong to any household.`);
      throw new AppError({
        code: 'TRANSACT_F2',
        messageKey: `User ${userId} does not belong to any household.`,
        httpStatus: 500,
      });
    }

    const houseId = houseData.houseId;
    const valueToDb = (parseFloat(value) * 100) / 100;

    const { newBalance } = await createTransactionWithBalanceUpdate({
      id,
      transactionId,
      userId,
      houseId,
      catId,
      type,
      value: valueToDb,
    });

    logger.info(`Transaction ${transactionId} successfully added to household: ${houseId}.`);

    await liveUpdateBalance(houseId, userId, newBalance);

    await handleNotification({
      id,
      category: 'transactions',
      houseId,
      message: 'notifications.addedAction',
      extraData: { action: 'addTransaction' },
    });

    return {
      messageKey: 'addTransaction.addTransactionCorrect',
      transactionId,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`An error occured during adding transaction: ${error.message}`);
    throw new AppError({
      code: 'TRANSACT_F1',
      messageKey: 'addTransaction.addTransactionError',
      httpStatus: 500,
    });
  }
};

export { addNewAction };
```

Analogicznie `deleteAction.js`: `deleteTransactionWithBalanceUpdate` → `liveUpdateBalance(houseId, userId, newBalance)` → notice.

#### Refaktor — `backend/services/notifications/saveNotification.js`

**teraz:** `pool` + raw `INSERT`.

**zamień na:**

```javascript
import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';
import { createNotification } from '../../database/notifications.js';

export async function saveNotification(id, category, noticeData, houseId) {
  if (!category || !noticeData || !houseId) {
    throw new AppError({
      code: 'NOTICE_INVALID_INPUT',
      messageKey: 'Invalid input data.',
      httpStatus: 400,
    });
  }

  try {
    await createNotification({ id, category, noticeData, houseId });
    return { messageKey: 'Notification saved correctly.' };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`saveNotification error: ${error}`);
    throw new AppError({
      code: 'NOTICE_SAVE_INTERNAL',
      messageKey: 'Failed to save notification.',
      httpStatus: 500,
    });
  }
}
```

#### Refaktor — `backend/configs/websocketConfig.js` (fragmenty DB)

**teraz:** `import pool` + `socketQueries` + raw `SELECT userId FROM householdUsers`.

**zamień importy / odczyty na:**

```javascript
import {
  findConnectionByUserId,
  saveConnection,
  deleteConnectionByUserId,
  listConnectionIdsByUserIds,
} from '../database/sockets.js';
import { listMemberUserIds } from '../database/households.js';
```

W handlerze `connection` / `broadcastMessage` / `broadcastToHousehold` zamień `pool.query(...)` na powyższe funkcje (bez trzymania mysql2 connection).

#### Refaktor — `backend/store/avatarStorage.js`

**teraz:** `pool.query('UPDATE users SET avatarName…')`.

**zamień na:** `await updateAvatarName(userId, avatarFileName)` z `database/users.js`.

#### Refaktor — `backend/utils/dbUtils/modifyUsersProps.js`

Usuń `connection`; wołaj `setUserHostFlags` / `setUserInmateFlags` / `updateHouseholdUserRole` / `updateHouseholdUserHouseId` z `database/users.js`. Call site’y w `addNewHouse` / `deleteHouse` bez przekazywania connection.

#### Refaktor — `backend/utils/dbUtils/countTotalPages.js`

**zamień** raw `COUNT(*)` na `countTransactionsByHouse` / `countMessagesForUser` z `database/transactions.js` / `board.js`.

#### Cron services (`balanceHouseholdsMonthly`, `saveDaily*`)

Przepisz pętle SQL na `snapshots.js` + `transactions.listTransactionsInDateRange` + `budget.latestInitialBudgetValue` + `households.updateCurrentBalance` w **jednym** `prisma.$transaction` per gospodarstwo tam, gdzie as-is robił multi-write (zachowaj reguły dat 1:1).

#### DoD (krok)

- Żaden plik spoza `database/prismaClient.js` nie importuje `@prisma/client`.
- Brak `import … from '…/db.js'` i `*Queries` w services/utils/configs/store.
- `addNewAction` / `deleteAction` używają atomowego API z KROK 2; WS po sukcesie.
- Zachowanie HTTP/WS as-is (te same messageKey / typy eventów).

---

### KROK 4 — Usunięcie pool / mysql2 / `*Queries`; zero raw SQL

**Status:** `WYKONANY`

**Cel:** Domknięcie stanu docelowego R6 (major 7.2; B-6, B-9; D-3).

**Usuń pliki:**

- `backend/database/db.js`
- `backend/database/authQueries.js`
- `backend/database/dashboardQueries.js`
- `backend/database/householdQueries.js`
- `backend/database/initialMonthlyBudgetQueries.js`
- `backend/database/invitationsQueries.js`
- `backend/database/messagesQueries.js`
- `backend/database/transactionCategoriesQueries.js`
- `backend/database/transactionsQueries.js`
- `backend/database/usersQueries.js`
- `backend/database/websocketQueries.js`

**package.json:** usuń zależność `mysql2`.

**Audyt (musi być pusto):**

```bash
cd backend
rg -n "mysql2|createPool|from ['\"].*/db\.js|Queries\.js|\$queryRaw|\$executeRaw" --glob '!node_modules' --glob '!prisma/**'
```

#### DoD (krok)

- Brak wymienionych plików i `mysql2` w deps.
- Audyt rg bez trafień w runtime (poza ewentualnymi komentarzami historycznymi — lepiej zero).
- Aplikacja startuje na Prisma (`DATABASE_URL`).

---

### KROK 5 — Seed + spójność saldo↔transakcja + scoped testy (T-15)

**Status:** `WYKONANY`

**Cel:** Seed Prisma (D-15–D-17) oraz dowód atomowości / braku pool (major 7.3; T-10, T-15). Bez asercji na prywatne SQL (T-7).

#### Nowy plik — `backend/prisma/seed.js`

```javascript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * Minimalny seed dev/test (D-16). Nie uruchamiać na prod deploy.
 * Idempotentny względem emaila seed usera / kategorii po name.
 */
async function main() {
  const passwordHash = await bcrypt.hash('SeedPassword123!', 10);
  const userId = uuidv4();
  const houseId = uuidv4();
  const catIncomeId = uuidv4();
  const catExpenseId = uuidv4();

  const existing = await prisma.users.findFirst({
    where: { email: 'seed.host@example.com' },
  });
  if (existing) {
    console.log('Seed: użytkownik seed.host@example.com już istnieje — skip create.');
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.users.create({
      data: {
        id: userId,
        name: 'seed-host',
        email: 'seed.host@example.com',
        password: passwordHash,
        role: 'host',
        host: 1,
        inmate: 0,
        acceptCookies: 1,
        completeTour: 1,
      },
    });

    await tx.households.create({
      data: {
        houseId,
        userId,
        userName: 'seed-host',
        houseName: 'Seed House',
        initBudget: 1000,
        currentBalance: 1000,
      },
    });

    await tx.householdUsers.create({
      data: {
        id: uuidv4(),
        userId,
        houseId,
        userName: 'seed-host',
        role: 'host',
      },
    });

    await tx.actionCategories.createMany({
      data: [
        { id: catIncomeId, name: 'Seed Income', type: 'income' },
        { id: catExpenseId, name: 'Seed Expense', type: 'expense' },
      ],
    });
  });

  console.log('Seed OK:', { userId, houseId, email: 'seed.host@example.com' });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

> Seed skrypt **może** importować `@prisma/client` bezpośrednio (narzędzie CLI, nie warstwa HTTP). Runtime aplikacji nadal tylko przez `database/`.

Uruchomienie: `cd backend && npx prisma db seed` (wymaga `DATABASE_URL` non-prod).

#### Nowy plik — `backend/tests/unit/prisma-r6-persistence.test.js`

```javascript
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, '../..');

function walkJsFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'prisma' || entry.name === 'coverage') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJsFiles(full, acc);
    else if (entry.name.endsWith('.js')) acc.push(full);
  }
  return acc;
}

describe('R6 persistence (scoped T-15)', () => {
  test('brak mysql2/pool/*Queries/$queryRaw poza dozwolonym prismaClient', () => {
    const files = walkJsFiles(backendRoot);
    const offenders = [];
    for (const file of files) {
      const rel = path.relative(backendRoot, file);
      if (rel.startsWith('tests' + path.sep)) continue;
      const text = fs.readFileSync(file, 'utf8');
      if (/from ['"]mysql2/.test(text) || /createPool\s*\(/.test(text)) {
        offenders.push(`${rel}: mysql2/pool`);
      }
      if (/Queries\.js['"]/.test(text) || /database\/db\.js['"]/.test(text)) {
        offenders.push(`${rel}: legacy Queries/db`);
      }
      if (/\$queryRaw|\$executeRaw/.test(text)) {
        offenders.push(`${rel}: raw prisma`);
      }
      if (
        /@prisma\/client/.test(text) &&
        !rel.endsWith(`database${path.sep}prismaClient.js`) &&
        !rel.endsWith(`prisma${path.sep}seed.js`)
      ) {
        offenders.push(`${rel}: Prisma Client poza database/seed`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('createTransactionWithBalanceUpdate aktualizuje saldo w jednej transakcji klienta', async () => {
    const create = jest.fn(async () => ({}));
    const update = jest.fn(async () => ({}));
    const findUnique = jest.fn(async () => ({
      currentBalance: 100,
      initBudget: 100,
    }));

    const tx = {
      households: { findUnique, update },
      transactions: { create },
    };

    jest.unstable_mockModule('../../database/prismaClient.js', () => ({
      default: {
        $transaction: async (fn) => fn(tx),
      },
      prisma: {
        $transaction: async (fn) => fn(tx),
      },
    }));

    const { createTransactionWithBalanceUpdate } = await import(
      '../../database/transactions.js'
    );

    const result = await createTransactionWithBalanceUpdate({
      id: 'id-1',
      transactionId: 'tx-1',
      userId: 'u-1',
      houseId: 'h-1',
      catId: 'c-1',
      type: 'expense',
      value: 40,
    });

    expect(create).toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith({
      where: { houseId: 'h-1' },
      data: { currentBalance: 60 },
    });
    expect(result.newBalance).toBe(60);
  });
});
```

#### Komenda

```bash
cd backend && npm test -- --testPathPattern='prisma-r6-persistence'
```

oraz pełne `npm test` (bez regresji wcześniejszych scoped).

Opcjonalnie lokalnie: `npx prisma db seed` na bazie dev/test.

#### DoD (krok)

- Seed powtarzalnie tworzy minimalny zestaw (user host + dom + kategorie) albo no-op gdy już jest.
- Test audytu importów zielony; test atomowości salda zielony (zachowanie helpera, nie SQL string).
- Po sukcesie ścieżki dodania transakcji saldo domu spójne (helper + ręczny smoke na seed userze).

---

#### Propozycja commit message

```text
feat(backend): persist MySQL exclusively through Prisma Migrate

Replace the mysql2 pool and *Queries modules with database/ Prisma
access so schema history, seed, and balance updates stay atomic under R6.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| Major Faza 7 DoD | Runtime przez Prisma w `database/`; migracje w repo; seed; saldo↔tx spójne; scoped testy zielone |
| SPEC | B-6–B-9; D-1–D-3, D-5–D-7, D-11, D-15–D-17; T-7, T-10, T-15 |
| Docs | R6 / `model_danych` / `katalog_env` (`DATABASE_URL` + `DB_*`) |
| Nagłówki | Wyłącznie `FAZA` / `KROK`; commit message EN Conventional Commits |
| Env | Runtime = `DATABASE_URL`; `.env` ma też `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` |
| Nazwy modułów | Nowe (`auth.js`, `transactions.js`, …) — bez `*Queries.js` |

## Ślad do major (informacyjnie, po implementacji)

- Faza 7 → `WYKONANY` (kroki 7.1, 7.2, 7.3 → `WYKONANY`)
- `MILESTONE — Dane wyłącznie przez Prisma` → `OSIĄGNIĘTY`
- Start Fazy 8 — poza tym wycinkiem
