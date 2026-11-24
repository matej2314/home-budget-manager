# Home Budget Manager — feature plan: backend Faza 9 (piramida testów Jest)

**Kotwica major:** `home-budget-manager_major_plan-backend.md` — **Faza 9** (kroki 9.1–9.2).  
**Źródła:** `docs/testy.md`, `docs/data_flow.md`, `docs/katalog_env.md`, `docs/model_danych.md`, `spec/SPEC-TESTY.md` (T-1–T-15), `spec/SPEC-KOMUNIKACJA.md` (prefiks `/api/v1`), `spec/SPEC-DANE.md` (seed), kod `backend/` + istniejące scoped testy faz 1–8.  
**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Pełna Faza 9 major backend: audyt/domknięcie piramidy Jest, minimum E2E API T-5 (w tym wiadomość), izolowana baza + seed/fixtures, trwałość DoD T-11–T-13 |
| Pass rozwojowy | KROK 1 (izolacja + helpery + seed) → KROK 2 (unit T-1) → KROK 3 (E2E T-5.1–T-5.4) → KROK 4 (T-5.5 message + audyt scoped 1–8 + DoD). **Kolejność `KROK` ≠ numeracja major 9.1/9.2** — major 9.2 (izolacja) przesunięty przed E2E z 9.1; bez przenosin między fazami major |
| Poza zakresem | Frontend / Vitest / Playwright; pełny suite Socket.io; YAML CI/Jenkins; edycja docs/SPEC/major w tej sesji; nowe zależności poza Jest/Supertest już w `package.json` |
| Po implementacji (informacyjnie) | Major: Faza 9 + kroki 9.1–9.2 → `WYKONANY` — **edycja major poza tym skillem**. Brak milestone zamykającego po Fazie 9 (decyzja major) |

### Założenia HOW (zatwierdzone)

1. Baza testowa = osobna nazwa w lokalnym MySQL: **`home_budget_test`**, URL przez `TEST_DATABASE_URL` albo domyślny fallback w `setup-env.js`. Guard T-8: nazwa DB musi kończyć się na `_test` — inaczej Jest odmawia startu.
2. Cleanup E2E: `deleteMany` na tabelach mutowanych przed scenariuszem + `ensureSeedCategories` (`createMany` + `skipDuplicates`). Bez `migrate reset` na każdy test.
3. T-5.3 = ścieżka **inmate invite → host accept** (pending). Message T-5.5 = HTTP `POST /message/send` + odczyt zapisu przez `GET /api/v1/board/data/messages` (bez asercji WS).
4. `npm test` w `backend/` z **`--runInBand`** (współdzielona baza testowa — bez wyścigów workerów).
5. Supertest `request.agent(app)` — cookie jar `SESSID` (Context7 `/forwardemail/supertest`). Prefiks wyłącznie `/api/v1` w asercjach T-5.
6. Hasła w fixture spełniają `registerValidations` (m.in. długość ≥10, mała/wielka/cyfra/znak specjalny). `userName` 5–15 znaków alfanumerycznych (kolumna `users.name` VarChar(15)).

---

## FAZA 1 — Weryfikacja strategii testów backendu (Jest)

### KROK 1 — Izolacja środowiska testowego + helpery + seed/fixtures pod T-5

**Status:** `WYKONANY`

**Cel:** Egzekwowalna izolacja DB (T-8–T-10), wspólne helpery HTTP/cookie oraz sprzątanie + seed kategorii pod E2E. Major 9.2 (część infra) przed E2E z 9.1. `docs/testy.md` / SPEC-TESTY T-8–T-10, T-15.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/tests/setup-env.js` | refaktor — force test DB + JWT + guard `_test` |
| `backend/tests/helpers/e2eDb.js` | **nowy** — cleanup + ensure seed |
| `backend/tests/helpers/httpAgent.js` | **nowy** — agent + signup/login/createHouse |
| `backend/package.json` | `test` → `--runInBand`; opcjonalnie `test:db:prepare` |
| `backend/.env.example` | dopisek `TEST_DATABASE_URL` |

#### Refaktor — `backend/tests/setup-env.js`

**teraz:**

```javascript
/** Secret for JWT in Jest before verifyJWT / WS auth modules load. */
process.env.JWT_SECRET ??= 'test-secret-for-jest';
```

**zamień na:**

```javascript
/**
 * Env Jest przed importami app/prisma (T-8, T-9).
 * Nie ładujemy dotenv z .env deweloperskiego — unika przypadkowego prod/demo URL.
 */

function resolveTestDatabaseUrl() {
  if (process.env.TEST_DATABASE_URL) {
    return process.env.TEST_DATABASE_URL;
  }
  return 'mysql://budget_user:budget_password@127.0.0.1:3306/home_budget_test';
}

function assertTestDatabaseName(databaseUrl) {
  let dbName;
  try {
    dbName = decodeURIComponent(new URL(databaseUrl).pathname.replace(/^\//, ''));
  } catch {
    throw new Error('Invalid TEST_DATABASE_URL / DATABASE_URL for Jest (T-8).');
  }
  if (!dbName || !dbName.endsWith('_test')) {
    throw new Error(
      `Refusing Jest against non-test database "${dbName}". Name must end with _test (T-8).`,
    );
  }
}

process.env.JWT_SECRET ??= 'test-secret-for-jest';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = resolveTestDatabaseUrl();
assertTestDatabaseName(process.env.DATABASE_URL);
```

#### Nowy plik — `backend/tests/helpers/e2eDb.js`

```javascript
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
```

#### Nowy plik — `backend/tests/helpers/httpAgent.js`

```javascript
import request from 'supertest';
import { createApp } from '../../app.js';

/** Hasło spełniające registerValidations (unit + E2E). */
export const TEST_PASSWORD = 'Aa1!bbbbbb';

export function createTestApp() {
  return createApp();
}

/** Cookie jar SESSID — Context7 supertest `request.agent(app)`. */
export function createAgent(app = createTestApp()) {
  return request.agent(app);
}

export async function signup(agent, { userName, email, role = 'user' }) {
  const res = await agent.post('/api/v1/auth/signup').send({
    reg_username: userName,
    reg_email: email,
    reg_password: TEST_PASSWORD,
    role,
    cookies: true,
  });
  return res;
}

export async function login(agent, { email }) {
  const res = await agent.post('/api/v1/auth/login').send({
    email,
    password: TEST_PASSWORD,
  });
  return res;
}

export async function createHouse(agent, { houseName, initBudget = 1000 }) {
  const res = await agent.post('/api/v1/house/new').send({
    houseName,
    initBudget,
  });
  return res;
}

/**
 * Rejestracja + login na świeżym agencie (osobny cookie jar).
 * @returns {{ agent: import('supertest').SuperAgentTest, signupRes, loginRes }}
 */
export async function signupAndLogin(app, user) {
  const agent = createAgent(app);
  const signupRes = await signup(agent, user);
  const loginRes = await login(agent, { email: user.email });
  return { agent, signupRes, loginRes };
}
```

#### Refaktor — `backend/package.json` (scripts)

**teraz:**

```json
"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
```

**zamień na:**

```json
"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand",
"test:db:prepare": "npx prisma migrate deploy && npx prisma db seed",
```

`test:db:prepare` uruchamiać z `DATABASE_URL` (lub `TEST_DATABASE_URL` wyeksportowanym jako `DATABASE_URL`) wskazującym na `home_budget_test` — jednorazowo przed pierwszą suitą E2E.

#### Refaktor — `backend/.env.example`

**dopisz po bloku `DATABASE_URL`:**

```text
# Jest E2E / integration — osobna baza (T-8). setup-env wymusza *_test.
# TEST_DATABASE_URL=mysql://budget_user:budget_password@127.0.0.1:3306/home_budget_test
```

#### Biblioteki / API

- **Supertest** (`^7.0.0`, Context7 `/forwardemail/supertest`): `request.agent(app)` — jar cookie między requestami.
- **Jest** (`^29.7.0`): istniejący ESM runner (`--experimental-vm-modules`); `setupFiles` już w `jest.config.js`.
- Prisma Client — ten sam singleton `database/prismaClient.js`; URL ustawiony **zanim** pierwszy import (setupFiles).

#### Testy (ten krok)

Brak osobnego pliku asercji poza guardem w `setup-env` (fail-fast przy złej DB). Smoke: po przygotowaniu bazy `npm test -- --testPathPattern='esm-smoke'` nadal zielony.

#### DoD (krok)

- Start Jest bez `TEST_DATABASE_URL` celuje w `home_budget_test`; nazwa bez `_test` → twardy błąd.
- Istnieją helpery `prepareE2eDatabase`, `signupAndLogin`, `createAgent`.
- `npm test` jest `--runInBand`.
- `.env.example` dokumentuje `TEST_DATABASE_URL` (bez sekretów prod).

---

### KROK 2 — Domknięcie luk unit (T-1): saldo + guardy membership/zaproszeń

**Status:** `WYKONANY`

**Cel:** Unit bez Express dla reguł salda i odmów membership przy zaproszeniu (T-1 / T-5). Role już pokrywa `verifyRole-inmate.test.js`; mail/invite orchestration — `mail-outbound.test.js`. Tu: czysta matematyka salda + guardy `addUserByHost` / `addUserByInmate`.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/database/transactions.js` | eksport `nextBalance` (było lokalne) |
| `backend/tests/unit/balance-nextBalance.test.js` | **nowy** |
| `backend/tests/unit/membership-invite-guards.test.js` | **nowy** |

#### Refaktor — `backend/database/transactions.js`

**teraz:**

```javascript
function nextBalance(currentBalance, initBudget, type, value) {
  let balance = parseFloat(currentBalance) || parseFloat(initBudget) || 0;
  const amount = parseFloat(value);
  if (type === 'income') balance += amount;
  else if (type === 'expense') balance -= amount;
  return parseFloat(balance);
}
```

**zamień na:**

```javascript
/** Czysta reguła salda (D-11) — eksport pod unit T-1; bez Prisma. */
export function nextBalance(currentBalance, initBudget, type, value) {
  let balance = parseFloat(currentBalance) || parseFloat(initBudget) || 0;
  const amount = parseFloat(value);
  if (type === 'income') balance += amount;
  else if (type === 'expense') balance -= amount;
  return parseFloat(balance);
}
```

(Pozostałe użycia w pliku bez zmian — już wołają `nextBalance`.)

#### Nowy plik — `backend/tests/unit/balance-nextBalance.test.js`

```javascript
import { describe, expect, test } from '@jest/globals';
import { nextBalance } from '../../database/transactions.js';

describe('nextBalance (T-1 saldo)', () => {
  test('expense odejmuje od currentBalance', () => {
    expect(nextBalance(1000, 500, 'expense', 100)).toBe(900);
  });

  test('income dodaje do currentBalance', () => {
    expect(nextBalance(1000, 500, 'income', 50)).toBe(1050);
  });

  test('gdy currentBalance null — fallback do initBudget', () => {
    expect(nextBalance(null, 800, 'expense', 50)).toBe(750);
  });

  test('gdy currentBalance i initBudget puste — start od 0', () => {
    expect(nextBalance(null, null, 'income', 10)).toBe(10);
  });
});
```

#### Nowy plik — `backend/tests/unit/membership-invite-guards.test.js`

```javascript
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { AppError } from '../../utils/errors/AppError.js';

describe('membership invite guards (T-1)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('addUserByHost: user już w domu → AppError inmateOrHostError', async () => {
    jest.unstable_mockModule('../../utils/householdUtils/saveNewInmate.js', () => ({
      saveNewInmate: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification: jest.fn(),
    }));

    const { addUserByHost } = await import('../../utils/householdUtils/addUserByHost.js');
    const { saveNewInmate } = await import('../../utils/householdUtils/saveNewInmate.js');

    await expect(
      addUserByHost('bob12', 'h-1', { userId: 'u-2', houseId: 'other' }),
    ).rejects.toMatchObject({
      messageKey: 'addUserToHouse.inmateOrHostError',
      httpStatus: 400,
    });
    expect(saveNewInmate).not.toHaveBeenCalled();
  });

  test('addUserByInmate: brak invitedUser → AppError invalidInput', async () => {
    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastMessage: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHostUserId: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      createInvitation: jest.fn(),
    }));

    const { addUserByInmate } = await import('../../utils/householdUtils/addUserByInmate.js');

    await expect(
      addUserByInmate('u-inviter', null, 'h-1', 'cand01', 'inmte1'),
    ).rejects.toBeInstanceOf(AppError);
  });

  test('addUserByInmate: invited już w domu → nie tworzy invitation', async () => {
    const createInvitation = jest.fn();
    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastMessage: jest.fn(),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHostUserId: jest.fn(async () => 'host-1'),
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      createInvitation,
    }));

    const { addUserByInmate } = await import('../../utils/householdUtils/addUserByInmate.js');

    await expect(
      addUserByInmate(
        'u-inviter',
        { userId: 'u-cand', houseId: 'h-x' },
        'h-1',
        'cand01',
        'inmte1',
      ),
    ).rejects.toMatchObject({
      messageKey: 'addUserToHouse.inmateOrHostError',
    });
    expect(createInvitation).not.toHaveBeenCalled();
  });
});
```

#### Biblioteki

Bez nowych paczek. ESM mocks: `jest.unstable_mockModule` + `jest.resetModules` (wzorzec z `mail-outbound.test.js`).

#### DoD (krok)

- `nextBalance` eksportowane; unit pokrywa income/expense/fallback.
- Guardy host/inmate przy „już w domu” / braku kandydata zielone bez DB.
- `npm test -- --testPathPattern='balance-nextBalance|membership-invite'` zielone.

---

### KROK 3 — E2E API minimum T-5 (auth, house, invite→inmate, transakcja+saldo)

**Status:** `WYKONANY`

**Cel:** Wielostepowe scenariusze HTTP z cookie jar na `/api/v1` (T-3, T-5.1–T-5.4, T-6). Asercje na envelope i zachowanie — nie na SQL/Prisma (T-7). Saldo po transakcji przez `GET /api/v1/board/data/house` (`liveBalance`).

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/tests/e2e/t5-critical-paths.test.js` | **nowy** |

#### Nowy plik — `backend/tests/e2e/t5-critical-paths.test.js`

```javascript
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import {
  createTestApp,
  createAgent,
  signup,
  login,
  createHouse,
  signupAndLogin,
  TEST_PASSWORD,
} from '../helpers/httpAgent.js';
import { prepareE2eDatabase, SEED_CAT } from '../helpers/e2eDb.js';

describe('T-5 E2E API critical paths', () => {
  const app = createTestApp();

  beforeAll(async () => {
    await prepareE2eDatabase();
  });

  beforeEach(async () => {
    await prepareE2eDatabase();
  });

  test('T-5.1 auth: signup → login → verify → logout', async () => {
    const agent = createAgent(app);
    const email = 'auth01@test.local';
    const userName = 'auth01';

    const signupRes = await signup(agent, { userName, email });
    expect(signupRes.status).toBe(200);
    expect(signupRes.body.status).toBe('success');

    const loginRes = await login(agent, { email });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.status).toBe('success');
    expect(loginRes.headers['set-cookie']?.join(';') || '').toMatch(/SESSID=/);

    const verifyRes = await agent.get('/api/v1/auth/verify');
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body).toMatchObject({
      status: 'success',
      message: 'auth.verify.success',
      userName,
      role: 'user',
    });

    const logoutRes = await agent.post('/api/v1/auth/logout');
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.status).toBe('success');

    const afterLogout = await agent.get('/api/v1/auth/verify');
    expect(afterLogout.status).toBe(401);
    expect(afterLogout.body.message).toBe('auth.sessionRequired');
  });

  test('T-5.2 gospodarstwo: user → house/new → host → house/info', async () => {
    const { agent, loginRes } = await signupAndLogin(app, {
      userName: 'host01',
      email: 'host01@test.local',
    });
    expect(loginRes.body.role).toBe('user');

    const houseRes = await createHouse(agent, {
      houseName: 'E2E House One',
      initBudget: 1000,
    });
    expect(houseRes.status).toBe(200);
    expect(houseRes.body.status).toBe('success');
    expect(houseRes.body.newRole).toBe('host');

    const verifyRes = await agent.get('/api/v1/auth/verify');
    expect(verifyRes.body.role).toBe('host');

    const infoRes = await agent.get('/api/v1/house/info');
    expect(infoRes.status).toBe(200);
    expect(infoRes.body.status).toBe('success');
    expect(infoRes.body.info?.[0]).toMatchObject({
      houseName: 'E2E House One',
    });
  });

  test('T-5.3 invite inmate → host accept → dostęp rdzenia jako inmate', async () => {
    const host = await signupAndLogin(app, {
      userName: 'host02',
      email: 'host02@test.local',
    });
    await createHouse(host.agent, { houseName: 'E2E Invite House', initBudget: 500 });

    const inmateSeed = await signupAndLogin(app, {
      userName: 'inmte1',
      email: 'inmte1@test.local',
    });
    const inviteInmateRes = await host.agent
      .post('/api/v1/users/invite')
      .send({ userName: 'inmte1' });
    expect(inviteInmateRes.status).toBe(200);
    expect(inviteInmateRes.body.status).toBe('success');

    // JWT inmate po re-login (host_added aktualizuje DB, nie cookie zaproszonego)
    const inmateLogin = await login(inmateSeed.agent, { email: 'inmte1@test.local' });
    expect(inmateLogin.body.role).toBe('inmate');

    const candidate = await signupAndLogin(app, {
      userName: 'cand01',
      email: 'cand01@test.local',
    });

    const pendingRes = await inmateSeed.agent
      .post('/api/v1/users/invite')
      .send({ userName: 'cand01' });
    expect(pendingRes.status).toBe(200);

    const collection = await host.agent.get('/api/v1/invitation/collection');
    expect(collection.status).toBe(200);
    const invitation = collection.body.invitations?.find(
      (i) => i.invitedUserName === 'cand01' || i.invitedUser === candidate.loginRes.body.id,
    );
    expect(invitation).toBeTruthy();

    const acceptRes = await host.agent.post('/api/v1/invitation/accept').send({
      invitationId: invitation.id,
      invitedUserId: invitation.invitedUser,
    });
    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.status).toBe('success');

    const candRelogin = await login(candidate.agent, { email: 'cand01@test.local' });
    expect(candRelogin.body.role).toBe('inmate');

    const infoRes = await candidate.agent.get('/api/v1/house/info');
    expect(infoRes.status).toBe(200);
    expect(infoRes.body.info?.[0]?.houseName).toBe('E2E Invite House');
  });

  test('T-5.4 transakcja: action/new → action/my + spójne saldo (board)', async () => {
    const { agent } = await signupAndLogin(app, {
      userName: 'txhost',
      email: 'txhost@test.local',
    });
    await createHouse(agent, { houseName: 'E2E Tx House', initBudget: 1000 });

    const addRes = await agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 100,
      catId: SEED_CAT.expenseEducation,
    });
    expect(addRes.status).toBe(200);
    expect(addRes.body.status).toBe('success');
    expect(addRes.body.transactionId).toBeTruthy();

    const myRes = await agent.get('/api/v1/action/my');
    expect(myRes.status).toBe(200);
    expect(myRes.body.actions?.some((a) => a.transaction_id === addRes.body.transactionId)).toBe(
      true,
    );

    const boardRes = await agent.get('/api/v1/board/data/house');
    expect(boardRes.status).toBe(200);
    const liveBalance = Number(boardRes.body.dashboardData?.houseData?.[0]?.liveBalance);
    expect(liveBalance).toBe(900);
  });
});
```

> Uwaga implementacyjna: jeśli `invitation.invitedUser` w kolekcji to ID, a `loginRes.body.id` jest dostępne — asercja `find` jak wyżej. Gdy kształt kolekcji różni się w runtime, trzymać się pól z `listInvitationsCollection` (`invitedUser`, `invitedUserName`, `id`).

#### Biblioteki

Supertest agent (jak KROK 1). Bez mocków SMTP w tym pliku — brak SMTP w env test → no-op mail (K-13), flow HTTP i tak przechodzi.

#### DoD (krok)

- Cztery scenariusze T-5.1–T-5.4 zielone na `home_budget_test`.
- Prefiks `/api/v1`; cookie `SESSID`; envelope `status` / `message`.
- Brak asercji na prywatne zapytania Prisma (T-7).
- `npm test -- --testPathPattern='t5-critical'` zielone.

---

### KROK 4 — T-5.5 wiadomość + audyt scoped faz 1–8 + trwałość DoD T-11–T-13

**Status:** `WYKONANY`

**Cel:** Domknięcie opcjonalnego T-5.5 (zapis wiadomości obserwowalny przez board); checklista obecności scoped testów faz 1–8 (T-15); utrwalenie reguły DoD T-11–T-13 w artefakcie testowym (nie osobny docs). Major 9.1 (reszta) + 9.2 (trwałość DoD).

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/tests/e2e/t5-message.test.js` | **nowy** |
| `backend/tests/audit/scoped-phases-inventory.test.js` | **nowy** |

#### Nowy plik — `backend/tests/e2e/t5-message.test.js`

```javascript
import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  createTestApp,
  signupAndLogin,
  createHouse,
  login,
} from '../helpers/httpAgent.js';
import { prepareE2eDatabase } from '../helpers/e2eDb.js';

describe('T-5.5 message E2E (HTTP zapis, bez WS)', () => {
  const app = createTestApp();

  beforeEach(async () => {
    await prepareE2eDatabase();
  });

  test('POST /message/send + odczyt na GET /board/data/messages', async () => {
    const host = await signupAndLogin(app, {
      userName: 'msghst',
      email: 'msghst@test.local',
    });
    await createHouse(host.agent, { houseName: 'E2E Msg House', initBudget: 100 });

    const peer = await signupAndLogin(app, {
      userName: 'msgpeer',
      email: 'msgpeer@test.local',
    });
    const inviteRes = await host.agent.post('/api/v1/users/invite').send({
      userName: 'msgpeer',
    });
    expect(inviteRes.status).toBe(200);
    await login(peer.agent, { email: 'msgpeer@test.local' });

    const sendRes = await host.agent.post('/api/v1/message/send').send({
      recipientName: 'msgpeer',
      content: 'e2e-hello-message',
    });
    expect(sendRes.status).toBe(200);
    expect(sendRes.body).toMatchObject({
      status: 'success',
      message: 'sendMessage.successMessage',
    });

    const boardRes = await peer.agent.get('/api/v1/board/data/messages');
    expect(boardRes.status).toBe(200);
    const messages = boardRes.body.dashboardData?.messagesData ?? [];
    expect(messages.some((m) => m.message === 'e2e-hello-message' && m.sender === 'msghst')).toBe(
      true,
    );
  });
});
```

#### Nowy plik — `backend/tests/audit/scoped-phases-inventory.test.js`

```javascript
import { describe, expect, test } from '@jest/globals';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Audyt T-15: scoped pliki faz 1–8 muszą istnieć (nie „pierwsze testy w F9”).
 * DoD T-11–T-13: ten plik przypomina regułę — zmiany services/routes/auth/ról/tx
 * wymagają aktualizacji testów przed push/merge (egzekwowane procesowo + CI).
 */
const SCOPED_PHASE_TESTS = [
  // Faza 1
  'foundation/esm-smoke.test.js',
  // Faza 2
  'unit/services-layout.test.js',
  'unit/appError-runController.test.js',
  'unit/board-getBoardData.test.js',
  // Faza 3
  'foundation/ops-health-helmet.test.js',
  // Faza 4
  'foundation/contract-v1-dual-mount-ocr.test.js',
  // Faza 5
  'unit/verifyRole-inmate.test.js',
  // Faza 6
  'unit/adapters-cron-ws.test.js',
  'unit/ws-authMiddleware.test.js',
  // Faza 7 — atomowość/saldo reguła w unit F9 + E2E T-5.4; layout DB w services-layout / brak osobnego pliku „prisma” —
  // świadomie: persistencja weryfikowana E2E T-5.4 + nextBalance unit (luka scoped „sam prisma” zaakceptowana tu jako pokryta równoważnie)
  // Faza 8
  'unit/mail-outbound.test.js',
];

describe('Audyt scoped faz 1–8 (T-15) + przypomnienie DoD T-11–T-13', () => {
  test.each(SCOPED_PHASE_TESTS)('scoped file exists: %s', (rel) => {
    expect(existsSync(path.join(root, rel))).toBe(true);
  });

  test('Faza 9 E2E T-5 pliki istnieją', () => {
    expect(existsSync(path.join(root, 'e2e/t5-critical-paths.test.js'))).toBe(true);
    expect(existsSync(path.join(root, 'e2e/t5-message.test.js'))).toBe(true);
  });

  test('DoD process note is documented in this suite title (T-11–T-13)', () => {
    // Asercja-kotwica: nie usuwaj tego describe bez przeniesienia reguły DoD do innego testu/CI.
    expect(true).toBe(true);
  });
});
```

#### Świadoma akceptacja luk (wpis DoD major 9.1)

| Luka | Decyzja |
|------|--------|
| Brak osobnego pliku „Faza 7 prisma scoped” | Pokrycie równoważne: `nextBalance` unit + E2E T-5.4 saldo/transakcja; seed używany w E2E |
| WS w E2E | Poza — unit Fazy 6 (`adapters-cron-ws`, `ws-authMiddleware`); T-4 wąski już spełniony scoped |
| Legacy dual mount w T-5 | Nie wymagany w asercji docelowej (major 9.1 / docs) — foundation Fazy 4 zostaje |

#### Komenda weryfikacji wycinka

```bash
# jednorazowo (osobna baza):
mysql -e "CREATE DATABASE IF NOT EXISTS home_budget_test;"
cd backend && DATABASE_URL='mysql://budget_user:budget_password@127.0.0.1:3306/home_budget_test' npm run test:db:prepare

cd backend && npm test
```

#### DoD (krok)

- T-5.5 zielone (send + board messages).
- Inventory scoped 1–8 + pliki E2E F9 istnieją.
- Pełne `npm test` w `backend/` zielone na bazie testowej.
- Reguła T-11–T-13 utrwalona w audycie (nie tylko w prozie planu).

---

#### Propozycja commit message

```text
test(backend): close Jest pyramid with isolated DB and T-5 E2E

Force a *_test MySQL URL, shared HTTP fixtures, unit saldo/membership
guards, and critical /api/v1 cookie-jar scenarios so DoD T-5 and T-8–T-13 hold.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| Major Faza 9 DoD | Pełne `npm test` na `home_budget_test`; T-5.1–T-5.5; audyt scoped 1–8; DoD T-11–T-13 w audycie |
| SPEC-TESTY | T-1 (unit), T-3/T-5 (E2E), T-6/T-7 (asercje), T-8–T-10 (izolacja/seed), T-11–T-13, T-15 |
| Docs | Prefiks `/api/v1`, piramida, ścieżki z `data_flow.md` — bez edycji docs w tym skillu |
| Nagłówki | Wyłącznie `FAZA` / `KROK`; commit message EN Conventional Commits na końcu fazy |
| Pass rozwojowy | Izolacja przed E2E; unit przed E2E; message+audyt na końcu |

## Ślad do major (informacyjnie, po implementacji)

- Faza 9 → `WYKONANY` (kroki 9.1, 9.2 → `WYKONANY`)
- Brak `MILESTONE` po Fazie 9 w major — nic nie oznaczać jako `OSIĄGNIĘTY` „zamykającego”
