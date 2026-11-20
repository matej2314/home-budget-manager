# Home Budget Manager — feature plan: backend Faza 6 (adaptery cron + WebSocket / R4)

**Kotwica major:** `home-budget-manager_major_plan-backend.md` — **Faza 6** (kroki 6.1–6.2).  
**Źródła:** `docs/architektura.md` (R4), `docs/architektura_katalogi_pliki.md`, `docs/data_flow.md` (G), `docs/dokumentacja_komunikacji.md` (katalog WS), `docs/model_danych.md` (snapshoty), `docs/anty_patterny.md` (§8–9), `spec/SPEC-BACKEND.md` (B-5, B-2, B-13), `spec/SPEC-KOMUNIKACJA.md` (K-9–K-12), `spec/SPEC-TESTY.md` (T-15), kod `backend/`.  
**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Pełna Faza 6 major backend: cron przez services; push WS jako skutek uboczny HTTP/service; scoped testy adapterów (T-15) |
| Pass rozwojowy | KROK 1 (services) → KROK 2 (cienkie tasks) → KROK 3 (audyt WS + testy). Brak innych przesunięć; bez przenosin między fazami major |
| Poza zakresem | Prisma / usunięcie pool (Faza 7), e-mail outbound (Faza 8), top-level `workers/`, zmiana katalogu eventów WS w docs/SPEC, przenosiny `liveUpdateBalance` z `utils/` |
| Po implementacji (informacyjnie) | Major: Faza 6 + kroki 6.1–6.2 → `WYKONANY`; `MILESTONE — Adaptery bez omijania warstwy aplikacji` → `OSIĄGNIĘTY` — **edycja major poza tym skillem** |

### Założenia HOW (zatwierdzone)

1. Persistencja w services nadal przez `pool` / SQL (Prisma = Faza 7).
2. Nowe use-case’y: `services/budget/` (bilans miesięczny + daily budget) oraz `services/transactions/` (daily transactions).
3. `liveUpdateBalance` zostaje w `utils/` (już wołany z services).
4. Bez workerów / osobnego procesu cron.

### Biblioteki

| Biblioteka | Wersja w projekcie | Ustalenie | Źródło |
|------------|-------------------|-----------|--------|
| `node-cron` | `^3.0.3` (`backend/package.json`) | `import cron from 'node-cron'`; `cron.schedule(expression, fn)` — adapter w `tasks/`, bez logiki domenowej w callbacku poza wywołaniem service | Context7 `/node-cron/node-cron` (API schedule); **pin do v3** jak w repo — nie brać opcji v4 (`TaskContext`, background file path) jeśli nie ma ich w zainstalowanej major 3 |
| Socket.io | `^4.8.1` | Emit wyłącznie przez istniejące `broadcastMessage` / `broadcastToHousehold` (K-11); bez nowego room API | SPEC-KOMUNIKACJA K-9–K-12 + docs |

---

## FAZA 1 — Adaptery cron i WebSocket (R4)

### KROK 1 — Services pod cron (bilans, daily budget, daily transactions)

**Status:** `WYKONANY`

**Cel:** Logika mutująca z `tasks/` żyje w `services/` (B-2, B-5, major 6.1). Taski jeszcze mogą trzymać stary kod do KROKU 2 — w tym kroku **powstają** serwisy z przeniesioną logiką (bez podwójnego uruchamiania crona: albo najpierw serwisy + natychmiast KROK 2 w jednym passie implementacji, albo serwisy eksportują funkcje, a taski przełączają się w KROKU 2 zanim merge).

**Artefakty (nowe):**

- `backend/services/budget/balanceHouseholdsMonthly.js`
- `backend/services/budget/saveDailyBudgetSnapshot.js`
- `backend/services/transactions/saveDailyTransactionsSnapshot.js`

**Uwagi przenosin:**

- Zachować harmonogramy i reguły biznesowe as-is (wyrażenia cron, okno dat, tabele snapshotów z `docs/model_danych.md`).
- Poprawka przy przenosinach: `handleNotification` / `emitNotification` wymaga pola **`id`**, nie `noticeId` (bug as-is w `balanceHouseTransactions.js` — bez tej poprawki notice + WS `notification` nie dostają ID).
- Log w daily transactions: `affectedRows` to liczba, nie tablica — przy przenosinach logować `affectedRows` bez `.length`.

#### Nowy plik — `backend/services/budget/balanceHouseholdsMonthly.js`

```javascript
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { handleNotification } from '../../utils/handleNotification.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Miesięczne bilansowanie gospodarstw + notice/WS notification (ten sam mechanizm co HTTP).
 * Wołane z tasks/ (cron) — bez omijania services (B-5).
 */
export async function balanceHouseholdsMonthly() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    logger.info('Bilansowanie rozpoczęte.');

    const [households] = await connection.query(
      `SELECT houseId, initBudget, monthlyBalanceDate, createdAt FROM households`
    );

    logger.info(`Finded ${households.length} households in database.`);

    if (households.length === 0) {
      await connection.commit();
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    for (const household of households) {
      const { houseId, monthlyBalanceDate, createdAt, initBudget } = household;

      const formattedBalanceDate = monthlyBalanceDate
        ? new Date(monthlyBalanceDate).toISOString().split('T')[0]
        : null;
      const formattedCreatedAt = new Date(createdAt).toISOString().split('T')[0];
      const dateLimit = formattedBalanceDate || formattedCreatedAt;

      logger.info(
        `Calculating the date for household ${houseId}, balanceDate: ${monthlyBalanceDate}, createdAt: ${createdAt}`
      );

      const nextBalanceDate = new Date(dateLimit);
      nextBalanceDate.setDate(nextBalanceDate.getDate() + 1);
      const nextBalanceDateStr = nextBalanceDate.toISOString().split('T')[0];

      if (today !== nextBalanceDateStr) {
        logger.info(
          `Household ${houseId} do not require finance balancing before ${nextBalanceDateStr}.`
        );
        continue;
      }

      logger.info(`Check transactions for household ${houseId} from ${dateLimit}.`);

      const [transactions] = await connection.query(
        `SELECT value, type FROM transactions WHERE houseId = ? AND DATE(addedAt) BETWEEN ? AND ?`,
        [houseId, dateLimit, nextBalanceDateStr]
      );

      logger.info(`Finded ${transactions.length} transactions for household ${houseId}.`);
      const transactionCountId = uuidv4();

      await connection.query(
        `INSERT INTO monthlyTransactionCounts (id, houseId, transactionCount, startDate, balanceDate) VALUES (?,?,?,?,?)`,
        [transactionCountId, houseId, transactions.length, dateLimit, today]
      );

      let newBalance = 0;

      if (!formattedBalanceDate) {
        newBalance = parseFloat(initBudget);
      } else {
        const [initialBudgetRows] = await connection.query(
          `SELECT value FROM initialMonthlyBudgets WHERE houseId = ? ORDER BY addedAt DESC LIMIT 1`,
          [houseId]
        );

        if (initialBudgetRows.length > 0) {
          newBalance = parseFloat(initialBudgetRows[0].value);
        } else {
          newBalance = parseFloat(initBudget);
        }
      }

      transactions.forEach((ts) => {
        if (ts.type === 'income') {
          newBalance += parseFloat(ts.value);
        } else if (ts.type === 'expense') {
          newBalance -= ts.value;
        }
      });

      const id = uuidv4();
      const newBalanceToDb = parseFloat(newBalance);
      const [insertBalance] = await connection.query(
        `INSERT INTO monthly_balances (id, monthly_balance, houseId, monthlyBalanceDate) VALUES(?, ?, ?, NOW());`,
        [id, newBalanceToDb, houseId]
      );

      if (insertBalance.affectedRows === 1) {
        await connection.query(
          'UPDATE households SET monthlyBalanceDate = NOW() WHERE houseId=?',
          [houseId]
        );
      }

      const noticeId = uuidv4();
      await handleNotification({
        id: noticeId,
        category: 'monthlyBalance',
        houseId,
        message: 'notifications.neMonthlyBalance',
      });

      logger.info(`Balance for household ${houseId} updated.`);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    logger.error(`An error occured during households finance balancing: ${error}`);
  } finally {
    connection.release();
  }
}
```

#### Nowy plik — `backend/services/budget/saveDailyBudgetSnapshot.js`

```javascript
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';

/** Dzienny snapshot salda per dom (`dailyBudget`). Cron → service (B-5). */
export async function saveDailyBudgetSnapshot() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [households] = await connection.query(
      'SELECT houseId, currentBalance FROM households'
    );

    logger.info(`Finded ${households.length} households.`);

    if (households.length === 0) {
      await connection.commit();
      return;
    }

    for (const house of households) {
      const id = uuidv4();
      const balanceToDb = house.currentBalance;

      const [addDailyBudget] = await connection.query(
        'INSERT INTO dailyBudget (id, houseId, value) VALUES (?, ?, ?);',
        [id, house.houseId, balanceToDb]
      );
      if (addDailyBudget.affectedRows === 0) {
        logger.error('Failed to save daily budget.');
      } else {
        logger.info('The daily budget of all households has been saved.');
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    logger.error(error);
  } finally {
    connection.release();
  }
}
```

#### Nowy plik — `backend/services/transactions/saveDailyTransactionsSnapshot.js`

```javascript
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';

/** Dzienny agregat liczby transakcji per dom (`dailyTransactions`). Cron → service (B-5). */
export async function saveDailyTransactionsSnapshot() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [households] = await connection.query('SELECT houseId from households');

    if (households.length === 0) {
      logger.error('No households found.');
      await connection.commit();
      return;
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 58, 0, 0);

    const getDailyTransactionsQuery = `
      SELECT houseId, COUNT(transactionId) AS transactionCount
      FROM transactions WHERE addedAt BETWEEN ? AND ? AND houseId IN (?)
      GROUP BY houseId;
    `;

    const houseIdMap = households.map((house) => house.houseId);

    const [rows] = await connection.query(getDailyTransactionsQuery, [
      startOfDay,
      endOfDay,
      houseIdMap,
    ]);

    if (rows.length === 0) {
      logger.error('No new transactions.');
      await connection.commit();
      return;
    }

    const valuesToInsert = rows.map((row) => [
      uuidv4(),
      row.transactionCount,
      row.houseId,
      now,
    ]);

    const addActionQuery =
      'INSERT INTO dailyTransactions (id, dailyActionCount, houseId, date) VALUES ?';

    const [addActionCount] = await connection.query(addActionQuery, [valuesToInsert]);

    if (addActionCount.affectedRows === rows.length) {
      logger.info(`Saved ${addActionCount.affectedRows} daily transactions.`);
    } else {
      logger.error(`No daily transactions saved.`);
    }

    await connection.commit();
  } catch (error) {
    logger.error(`saveDailyTransactions error: ${error}`);
    await connection.rollback();
  } finally {
    connection.release();
  }
}
```

#### DoD (krok)

- Trzy serwisy istnieją i zawierają logikę mutującą przeniesioną z tasków.
- `balanceHouseholdsMonthly` woła `handleNotification` z polem `id`.
- Brak nowego obszaru katalogów poza `budget/` / `transactions/`.

---

### KROK 2 — Cienkie taski: `cron.schedule` → service

**Status:** `WYKONANY`

**Cel:** `tasks/` to wyłącznie adaptery `node-cron` (R4, B-5): schedule + wywołanie service. Zero `pool` / raw SQL w `tasks/`.

**Artefakty (zmiana):**

- `backend/tasks/balanceHouseTransactions.js`
- `backend/tasks/saveDailyBudget.js`
- `backend/tasks/saveDailyTransactions.js`
- `backend/server.js` — **bez zmian** importów/nazw default exportów (zachować `balanceHouseActions`, `saveDailyBudget`, `saveDailyTransactions`).

#### Refaktor — `backend/tasks/balanceHouseTransactions.js`

**Zamień cały plik na:**

```javascript
import cron from 'node-cron';
import { balanceHouseholdsMonthly } from '../services/budget/balanceHouseholdsMonthly.js';

const balanceHouseActions = () => {
  cron.schedule('58 23 * * *', async () => {
    await balanceHouseholdsMonthly();
  });
};

export default balanceHouseActions;
```

#### Refaktor — `backend/tasks/saveDailyBudget.js`

**Zamień cały plik na:**

```javascript
import cron from 'node-cron';
import { saveDailyBudgetSnapshot } from '../services/budget/saveDailyBudgetSnapshot.js';

const saveDailyBudget = () => {
  cron.schedule('50 23 * * *', async () => {
    await saveDailyBudgetSnapshot();
  });
};

export default saveDailyBudget;
```

#### Refaktor — `backend/tasks/saveDailyTransactions.js`

**Zamień cały plik na:**

```javascript
import cron from 'node-cron';
import { saveDailyTransactionsSnapshot } from '../services/transactions/saveDailyTransactionsSnapshot.js';

const saveDailyTransactions = () => {
  cron.schedule('45 23 * * *', async () => {
    await saveDailyTransactionsSnapshot();
  });
};

export default saveDailyTransactions;
```

#### DoD (krok)

- Żaden plik w `backend/tasks/` nie importuje `../database/db.js` ani nie zawiera `connection.query` / raw SQL.
- Wyrażenia cron bez zmian względem as-is (`45` / `50` / `58` o 23).
- `server.js` nadal rejestruje te same trzy taski przy starcie; brak katalogu `workers/`.

---

### KROK 3 — Push WS jako skutek uboczny + scoped testy (T-15)

**Status:** `WYKONANY`

**Cel:** Potwierdzić K-10–K-12: emitowane `type` z katalogu docs; adresowanie tylko przez `broadcastMessage` / `broadcastToHousehold`; biznesowy push = skutek uboczny service/HTTP (oraz cron→service→`emitNotification`). Scoped testy powierzchni Fazy 6 zielone.

**Artefakty:**

- Audyt (checklist poniżej) — bez zmiany katalogu eventów; ewentualny najmniejszy fix, jeśli znajdzie się emit spoza K-10 / zmyślony room.
- Nowy: `backend/tests/unit/adapters-cron-ws.test.js`

#### Audyt push (obowiązkowy w implementacji)

| Ścieżka | Oczekiwany `type` | Helper |
|---------|-------------------|--------|
| `emitNotification` / `handleNotification` | `notification` | `broadcastToHousehold` |
| `sendNewMessage` | `newMessage` | `broadcastMessage` |
| `liveUpdateBalance` (z `addNewAction` / `deleteAction`) | `balance_update` (+ opcjonalnie `error`) | `broadcastToHousehold` / `broadcastMessage` |
| `handleBroadcastInitBudget` | `initial_budget` | `broadcastToHousehold` |
| `addUserByInmate` | `invitation` | `broadcastMessage` |
| Handshake WS | `connect_success` / `error` | `socket.emit` lokalnie — OK (cykl życia, nie room API) |

Zakaz: nowe `type` / room API bez aktualizacji docs + SPEC-KOMUNIKACJA.

**Poza zakresem kroku:** przenosiny `liveUpdateBalance` / `handleBroadcastInitBudget` do `services/` (założenie 3); Prisma w `websocketConfig`.

#### Nowy plik — `backend/tests/unit/adapters-cron-ws.test.js`

```javascript
import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tasksRoot = path.join(__dirname, '../../tasks');

describe('Faza 6 — tasks jako adaptery (B-5)', () => {
  test('żaden task nie importuje database/db ani pool', () => {
    const files = fs.readdirSync(tasksRoot).filter((f) => f.endsWith('.js'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const src = fs.readFileSync(path.join(tasksRoot, file), 'utf8');
      expect(src).not.toMatch(/database\/db/);
      expect(src).not.toMatch(/\bpool\b/);
      expect(src).not.toMatch(/\.query\s*\(/);
      expect(src).toMatch(/services\//);
      expect(src).toMatch(/node-cron/);
    }
  });
});

describe('Faza 6 — cron schedule → service', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('balanceHouseActions woła balanceHouseholdsMonthly w callbacku cron', async () => {
    const balanceHouseholdsMonthly = jest.fn(async () => {});
    let scheduledFn = null;

    jest.unstable_mockModule('node-cron', () => ({
      default: {
        schedule: jest.fn((_expr, fn) => {
          scheduledFn = fn;
        }),
      },
    }));

    jest.unstable_mockModule(
      '../../services/budget/balanceHouseholdsMonthly.js',
      () => ({ balanceHouseholdsMonthly })
    );

    const { default: balanceHouseActions } = await import(
      '../../tasks/balanceHouseTransactions.js'
    );
    const cron = (await import('node-cron')).default;

    balanceHouseActions();

    expect(cron.schedule).toHaveBeenCalledWith('58 23 * * *', expect.any(Function));
    expect(scheduledFn).toEqual(expect.any(Function));
    await scheduledFn();
    expect(balanceHouseholdsMonthly).toHaveBeenCalledTimes(1);
  });
});

describe('Faza 6 — WS push skutkiem ubocznym (K-10, K-11, K-12)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('emitNotification zapisuje notice i emituje type notification przez broadcastToHousehold', async () => {
    const saveNotification = jest.fn(async () => ({ messageKey: 'ok' }));
    const broadcastToHousehold = jest.fn(async () => {});

    jest.unstable_mockModule(
      '../../services/notifications/saveNotification.js',
      () => ({ saveNotification })
    );
    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastToHousehold,
      broadcastMessage: jest.fn(),
      initializeWebSocket: jest.fn(),
    }));

    const { emitNotification } = await import(
      '../../services/notifications/emitNotification.js'
    );

    await emitNotification({
      id: 'n-1',
      category: 'monthlyBalance',
      houseId: 'h-1',
      message: 'notifications.neMonthlyBalance',
    });

    expect(saveNotification).toHaveBeenCalledWith(
      'n-1',
      'monthlyBalance',
      expect.stringContaining('monthlyBalance'),
      'h-1'
    );
    expect(broadcastToHousehold).toHaveBeenCalledWith('h-1', {
      type: 'notification',
      data: expect.objectContaining({
        id: 'n-1',
        category: 'monthlyBalance',
        message: 'notifications.neMonthlyBalance',
      }),
    });
  });
});
```

#### Komenda

```bash
cd backend && npm test -- --testPathPattern='adapters-cron-ws'
```

(oraz pełne `npm test` bez regresji wcześniejszych scoped testów).

#### DoD (krok)

- Checklist audytu przejrzany; brak zmyślonych eventów/roomów.
- Testy `adapters-cron-ws` zielone: tasks bez DB; cron → service; `emitNotification` → `type: 'notification'` przez `broadcastToHousehold`.
- Brak top-level `workers/`.

---

#### Propozycja commit message

```text
feat(backend): route cron jobs through services and lock WS push helpers

Keep node-cron and Socket.io as in-process adapters (R4/B-5) so mutating
tasks no longer touch the DB directly and business pushes stay on the docs catalog.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| Major Faza 6 DoD | Mutujące tasks → services; typy WS z katalogu; brak workerów; scoped testy zielone |
| SPEC | B-5, B-2; K-9–K-12; T-15 |
| Docs | R4 / data_flow G (scheduler → service → MySQL / notice+WS) — bez wymogu edycji docs w tym skillu; przy implementacji można doprecyzować zdanie „Task czyta DB” → „service”, jeśli prowadzący chce |
| Nagłówki planu | Wyłącznie `FAZA` / `KROK`; commit message EN Conventional Commits na końcu fazy |
| Prisma | Nadal pool w services — świadomie do Fazy 7 |

## Ślad do major (informacyjnie, po implementacji)

- Faza 6 → `WYKONANY` (kroki 6.1, 6.2 → `WYKONANY`)
- `MILESTONE — Adaptery bez omijania warstwy aplikacji` → `OSIĄGNIĘTY`
- Start Fazy 7 — poza tym wycinkiem; akceptacja prowadzącego wg DoD milestone
