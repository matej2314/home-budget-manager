# Home Budget Manager — feature plan: backend Faza 9.1–9.2 (saldo reverse + authz delete)

**Kotwica major:** `home-budget-manager_major_plan-backend.md` — **Faza 9.1** (kroki 9.1.1–9.1.2) oraz **Faza 9.2** (kroki 9.2.1–9.2.2).  
**Źródła:** `docs/dokumentacja_koncepcyjna.md`, `docs/data_flow.md` (przepływ D), `docs/model_danych.md`, `docs/dokumentacja_komunikacji.md`, `docs/testy.md`, `spec/SPEC-DANE.md` (D-11 / D-11a / D-11b), `spec/SPEC-BEZPIECZENSTWO.md` (S-8 / S-8a), `spec/SPEC-BACKEND.md` (B-13 / B-20), `spec/SPEC-TESTY.md` (T-1 / T-5 / T-15), kod `backend/`.  
**Biblioteki:** Prisma Client v6 — interactive `$transaction` (Context7 `/websites/prisma_io/v6`); reszta = stdlib + istniejący Jest/Supertest w repo.  
**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Pełne major **Faza 9.1** + **Faza 9.2**: reverse salda przy delete, helper kwot 2 dp, authz delete (inmate own / host house-wide), 403/404, scoped unit + E2E (T-15) |
| Pass rozwojowy | Helper kwot **przed** reverse (przesunięcie względem major 9.1.1→9.1.2). Authz po reverse. **Kolejność `KROK` ≠ numeracja major.** Bez przenosin między fazami major |
| Poza zakresem | Fazy 9.3–9.4, Faza 10+, frontend UI/locale files (F-16–F-18 — osobny major FE), migracja schematu na cents/`Decimal`, zmiana major/docs/SPEC w tej sesji |
| Klucze i18n (API `message`) | `transactions.invalidAmount` (400 kwota); `authz.transactions.delete.denied` (403); istniejące `Transaction not found.` / kody TX_* tam gdzie bez zmiany semantyki. Tłumaczenia w `frontend/public/locales` — poza tym wycinkiem BE |
| Po implementacji (informacyjnie) | Major: Faza 9.1 + kroki 9.1.1–9.1.2 → `WYKONANY`; Faza 9.2 + kroki 9.2.1–9.2.2 → `WYKONANY`. Milestone „Reguły domeny…” **nie** — wymaga też 9.3–9.4 |

### Założenia HOW

1. **Reverse:** `nextBalance` dostaje typ **odwrotny** do `existing.type` (`expense`→`income`, `income`→`expense`). Typ i `value` zawsze z rekordu DB w tej samej transakcji Prisma — nie z body klienta.
2. **Kwoty:** jeden `parseAmount2dp` w `utils/validation.js` (B-13); odrzuca nie-liczbę, >2 dp, pusty; zwraca `number` zaokrąglony `Math.round(n*100)/100`. Używany przy add; `nextBalance` woła ten sam round na `value`.
3. **Authz (Faza 9.2):** lookup tx po `transactionId` + `houseId` aktora; zezwolenie gdy `tx.userId === actorId` **lub** `householdUsers.role === 'host'`. Brak uprawnień przy tx w domu → **403** + `authz.transactions.delete.denied`. Brak tx / tx innego domu → **404**.
4. Notice po delete bez zmian: `notifications.deletedAction` + `liveUpdateBalance` (WS).
5. FAZA 1 **nie** otwiera hostowi cudzych tx — nadal filtr `userId` aktora w delete DB; FAZA 2 zdejmuje ten filtr i dodaje regułę ownership.
6. Komenda scoped: istniejące pliki unit/E2E transakcji + nowe asercje; `npm test` w `backend/` (T-15).

---

## FAZA 1 — Saldo: reverse przy delete + walidacja kwot (2 dp)

Kotwica major: **Faza 9.1**.

### KROK 1 — Helper kwot (2 dp) + walidacja brzegu add

**Status:** `WYKONANY`

**Cel:** Wspólny parse/round max 2 dp (D-11b); `POST /action/new` odrzuca złą kwotę → 400 + `transactions.invalidAmount`. Major 9.1.2 (przesunięty przed reverse). SPEC-BACKEND B-13, SPEC-DANE D-11b.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/utils/validation.js` | dopisek `parseAmount2dp` |
| `backend/database/transactions.js` | `nextBalance` — round przez helper |
| `backend/services/transactions/addNewAction.js` | walidacja kwoty zamiast `(parseFloat*100)/100` |
| `backend/tests/unit/parse-amount-2dp.test.js` | **nowy** |
| `backend/tests/e2e/t5-business-edges.test.js` | scenariusz 400 dla >2 dp |

#### Refaktor — `backend/utils/validation.js` (dopisek przed `export`)

**teraz (fragment eksportu):**

```javascript
const validTransactionTypes = ['income', 'expense'];

export { registerValidations, loginValidations, validTransactionTypes, isNoSQL, isNoXSS, isValidNumber };
```

**zamień na:**

```javascript
const validTransactionTypes = ['income', 'expense'];

/**
 * Kwota aplikacji (D-11b): skończona liczba, max 2 miejsca po przecinku.
 * @returns {number|null} zaokrąglona kwota albo null gdy niepoprawna
 */
function parseAmount2dp(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const s = typeof raw === 'number' && Number.isFinite(raw) ? String(raw) : String(raw).trim();
  if (!/^-?\d+(\.\d{1,2})?$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

export {
  registerValidations,
  loginValidations,
  validTransactionTypes,
  isNoSQL,
  isNoXSS,
  isValidNumber,
  parseAmount2dp,
};
```

#### Refaktor — `nextBalance` w `backend/database/transactions.js`

**teraz:**

```javascript
import prisma from './prismaClient.js';

/** Czysta reguła salda (D-11) — eksport pod unit T-1; bez Prisma. */
export function nextBalance(currentBalance, initBudget, type, value) {
  let balance = parseFloat(currentBalance) || parseFloat(initBudget) || 0;
  const amount = parseFloat(value);
  if (type === 'income') balance += amount;
  else if (type === 'expense') balance -= amount;
  return parseFloat(balance);
}
```

**zamień na:**

```javascript
import prisma from './prismaClient.js';
import { parseAmount2dp } from '../utils/validation.js';

/** Czysta reguła salda (D-11 / D-11a) — eksport pod unit T-1; bez Prisma. */
export function nextBalance(currentBalance, initBudget, type, value) {
  let balance = parseFloat(currentBalance) || parseFloat(initBudget) || 0;
  const amount = parseAmount2dp(value);
  if (amount === null) return NaN;
  if (type === 'income') balance += amount;
  else if (type === 'expense') balance -= amount;
  return parseAmount2dp(balance) ?? balance;
}
```

#### Refaktor — `backend/services/transactions/addNewAction.js`

**teraz (fragment):**

```javascript
import { validTransactionTypes } from '../../utils/validation.js';
// ...
    const houseId = houseData.houseId;
    const valueToDb = (parseFloat(value) * 100) / 100;

    const { newBalance } = await createTransactionWithBalanceUpdate({
```

**zamień na:**

```javascript
import { validTransactionTypes, parseAmount2dp } from '../../utils/validation.js';
// ...
    const houseId = houseData.houseId;
    const valueToDb = parseAmount2dp(value);
    if (valueToDb === null) {
      throw new AppError({
        code: 'TX_AMOUNT',
        messageKey: 'transactions.invalidAmount',
        httpStatus: 400,
      });
    }

    const { newBalance } = await createTransactionWithBalanceUpdate({
```

(pozostała część `addNewAction` bez zmian — `value: valueToDb`.)

#### Nowy plik — `backend/tests/unit/parse-amount-2dp.test.js`

```javascript
import { describe, expect, test } from '@jest/globals';
import { parseAmount2dp } from '../../utils/validation.js';
import { nextBalance } from '../../database/transactions.js';

describe('parseAmount2dp (D-11b)', () => {
  test('akceptuje int i 1–2 dp', () => {
    expect(parseAmount2dp(10)).toBe(10);
    expect(parseAmount2dp('10.5')).toBe(10.5);
    expect(parseAmount2dp('10.55')).toBe(10.55);
  });

  test('odrzuca >2 dp, nie-liczbę, pusty', () => {
    expect(parseAmount2dp('10.555')).toBeNull();
    expect(parseAmount2dp('abc')).toBeNull();
    expect(parseAmount2dp('')).toBeNull();
    expect(parseAmount2dp(null)).toBeNull();
  });

  test('nextBalance używa round 2 dp', () => {
    expect(nextBalance(1000, 500, 'expense', '10.55')).toBe(989.45);
  });
});
```

#### Refaktor E2E — dopisek w `t5-business-edges.test.js`

Po teście `zły type transakcji → 400` dodać:

```javascript
  test('kwota >2 dp → 400 transactions.invalidAmount', async () => {
    const { agent } = await signupAndLogin(app, {
      userName: 'amtbad',
      email: 'amtbad@test.local',
    });
    await createHouse(agent, { houseName: 'E2E Amt', initBudget: 100 });

    const res = await agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: '10.999',
      catId: SEED_CAT.expenseEducation,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('transactions.invalidAmount');
  });
```

**DoD kroku:**

- `parseAmount2dp` eksportowany; add odrzuca złą kwotę 400 + klucz.
- Unit parse + nextBalance round zielony.
- E2E >2 dp → 400 zielony.

---

### KROK 2 — Reverse salda przy delete (type z rekordu)

**Status:** `WYKONANY`

**Cel:** Delete odwraca efekt wg `existing.type` (D-11a); brak hardkodu `balanceType: 'expense'`. Major 9.1.1. Aktualizacja testów as-is utrwalających bug.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/database/transactions.js` | `findTransaction…` + `type`; `deleteTransaction…` reverse; helper `reverseBalanceType` |
| `backend/services/transactions/deleteAction.js` | przekazanie `type` z rekordu (bez hardkodu expense) |
| `backend/tests/unit/delete-action-balance.test.js` | asercje reverse income/expense |
| `backend/tests/unit/balance-nextBalance.test.js` | dopisek reverse (opcjonalnie przez `reverseBalanceType`) |
| `backend/tests/e2e/t5-business-edges.test.js` | delete expense 900→1000; delete income |

#### Refaktor — `findTransactionByTransactionId` + reverse + delete DB

**teraz (`findTransaction…`):**

```javascript
export async function findTransactionByTransactionId(transactionId) {
  return prisma.transactions.findFirst({
    where: { transactionId },
    select: { userId: true, value: true, houseId: true },
  });
}
```

**zamień na:**

```javascript
export async function findTransactionByTransactionId(transactionId) {
  return prisma.transactions.findFirst({
    where: { transactionId },
    select: { userId: true, value: true, houseId: true, type: true },
  });
}

/** Typ korekty salda przy delete = odwrotność oryginalnego type (D-11a). */
export function reverseBalanceType(type) {
  if (type === 'income') return 'expense';
  if (type === 'expense') return 'income';
  return type;
}
```

**teraz (`deleteTransactionWithBalanceUpdate` — całe ciało / podpis):**

```javascript
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
```

**zamień na:**

```javascript
/**
 * Usunięcie transakcji + reverse salda wg existing.type (D-11a).
 * FAZA 1: nadal wymaga userId aktora w WHERE (własne tx).
 * FAZA 2 zdejmie filtr userId dla hosta.
 */
export async function deleteTransactionWithBalanceUpdate({
  userId,
  houseId,
  transactionId,
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
    const balanceType = reverseBalanceType(existing.type);
    const newBalance = nextBalance(
      house.currentBalance,
      house.initBudget,
      balanceType,
      existing.value,
    );
    await tx.households.update({
      where: { houseId },
      data: { currentBalance: newBalance },
    });

    return {
      deleted: true,
      houseId,
      newBalance,
      value: existing.value,
      type: existing.type,
    };
  });
}
```

Źródło Prisma: interactive `$transaction` z callbackiem `tx` (docs v6) — ten sam wzorzec co `createTransactionWithBalanceUpdate`.

#### Refaktor — `backend/services/transactions/deleteAction.js`

**teraz (fragment wywołania delete):**

```javascript
    const value = checkAction.value;

    const result = await deleteTransactionWithBalanceUpdate({
      userId,
      houseId,
      transactionId,
      balanceType: 'expense',
      value,
    });
```

**zamień na:**

```javascript
    const result = await deleteTransactionWithBalanceUpdate({
      userId,
      houseId,
      transactionId,
    });
```

(Pozostała orkiestracja: `checkTransaction`, notice, `liveUpdateBalance` — bez zmian w tym kroku. Nadal 400 przy „cudzej” przez filtr `userId` — to FAZA 2 przeniesie na 403.)

#### Refaktor — `backend/tests/unit/delete-action-balance.test.js`

**zamień cały plik na:**

```javascript
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { reverseBalanceType } from '../../database/transactions.js';

describe('reverseBalanceType (D-11a)', () => {
  test('expense → income, income → expense', () => {
    expect(reverseBalanceType('expense')).toBe('income');
    expect(reverseBalanceType('income')).toBe('expense');
  });
});

describe('deleteAction saldo (reverse type)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('woła deleteTransactionWithBalanceUpdate bez hardkodu expense', async () => {
    const deleteTransactionWithBalanceUpdate = jest.fn(async () => ({
      deleted: true,
      houseId: 'h-1',
      newBalance: 1000,
      value: 100,
      type: 'expense',
    }));

    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => ({ houseId: 'h-1', role: 'host' })),
    }));
    jest.unstable_mockModule('../../utils/checkUtils/checkTransaction.js', () => ({
      checkTransaction: jest.fn(async () => ({
        userId: 'u-1',
        value: 100,
        houseId: 'h-1',
        type: 'expense',
      })),
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      deleteTransactionWithBalanceUpdate,
      reverseBalanceType,
    }));
    jest.unstable_mockModule('../../utils/householdUtils/liveUpdateBalance.js', () => ({
      liveUpdateBalance: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification: jest.fn(),
    }));

    const { deleteAction } = await import('../../services/transactions/deleteAction.js');
    await deleteAction('tx-1', 'u-1');

    expect(deleteTransactionWithBalanceUpdate).toHaveBeenCalledWith({
      userId: 'u-1',
      houseId: 'h-1',
      transactionId: 'tx-1',
    });
    expect(deleteTransactionWithBalanceUpdate.mock.calls[0][0].balanceType).toBeUndefined();
  });

  test('brak transactionId → 400', async () => {
    const { deleteAction } = await import('../../services/transactions/deleteAction.js');
    await expect(deleteAction(null, 'u-1')).rejects.toMatchObject({
      httpStatus: 400,
      messageKey: 'Invalid input data.',
    });
  });
});
```

#### Refaktor E2E — zamiana testu as-is delete + dopisek income

**teraz:**

```javascript
  test('delete expense as-is: balanceType expense odejmuje ponownie (900→800)', async () => {
    // ...
    // as-is: delete zawsze woła nextBalance(..., 'expense', value)
    expect(Number(afterDel.body.dashboardData?.houseData?.[0]?.liveBalance)).toBe(800);
  });
```

**zamień na:**

```javascript
  test('delete expense → reverse (900→1000)', async () => {
    const { agent } = await signupAndLogin(app, {
      userName: 'delhst',
      email: 'delhst@test.local',
    });
    await createHouse(agent, { houseName: 'E2E Del House', initBudget: 1000 });

    const addRes = await agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 100,
      catId: SEED_CAT.expenseEducation,
    });
    expect(addRes.status).toBe(200);
    const txId = addRes.body.transactionId;

    const afterAdd = await agent.get('/api/v1/board/data/house');
    expect(Number(afterAdd.body.dashboardData?.houseData?.[0]?.liveBalance)).toBe(900);

    const delRes = await agent.delete('/api/v1/action/').send({ transactionId: txId });
    expect(delRes.status).toBe(200);

    const afterDel = await agent.get('/api/v1/board/data/house');
    expect(Number(afterDel.body.dashboardData?.houseData?.[0]?.liveBalance)).toBe(1000);
  });

  test('delete income → reverse (1050→1000)', async () => {
    const { agent } = await signupAndLogin(app, {
      userName: 'delinc',
      email: 'delinc@test.local',
    });
    await createHouse(agent, { houseName: 'E2E Del Inc', initBudget: 1000 });

    const addRes = await agent.post('/api/v1/action/new').send({
      type: 'income',
      value: 50,
      catId: SEED_CAT.incomeSalary,
    });
    expect(addRes.status).toBe(200);

    const afterAdd = await agent.get('/api/v1/board/data/house');
    expect(Number(afterAdd.body.dashboardData?.houseData?.[0]?.liveBalance)).toBe(1050);

    const delRes = await agent
      .delete('/api/v1/action/')
      .send({ transactionId: addRes.body.transactionId });
    expect(delRes.status).toBe(200);

    const afterDel = await agent.get('/api/v1/board/data/house');
    expect(Number(afterDel.body.dashboardData?.houseData?.[0]?.liveBalance)).toBe(1000);
  });
```

**Uwaga unit `balance-nextBalance.test.js`:** test `value nieparowalne → NaN` nadal aktualny (przez `parseAmount2dp` → null → NaN). Test `ujemna kwota income` — regex `parseAmount2dp` **akceptuje** `-50`; zachowanie bez zmiany semantyki. Jeśli asercja na `'abc'` wymaga doprecyzowania — zostaw jak jest (`Number.isNaN`).

**DoD kroku:**

- Brak `balanceType: 'expense'` w ścieżce delete.
- Unit reverse income/expense; E2E delete expense 900→1000 i delete income 1050→1000 zielone.

#### Propozycja commit message

```text
fix(transactions): reverse household balance on delete by original type

Apply opposite income/expense effect from the stored row and reject amounts
with more than two decimal places via a shared parse helper (D-11a/D-11b).
```

---

## FAZA 2 — Authz usuwania transakcji (inmate own / host house-wide)

Kotwica major: **Faza 9.2**. Zależy od FAZA 1 (reverse już poprawny — host delete cudzej asertuje saldo).

### KROK 1 — Reguła ownership w service / database

**Status:** `WYKONANY`

**Cel:** Lookup tx po `transactionId` + `houseId`; zezwolenie owner **lub** host (S-8a). Delete DB **bez** wymuszania `userId` aktora w `WHERE`. Major 9.2.1.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/database/transactions.js` | `deleteTransactionWithBalanceUpdate` — filtr bez `userId` aktora; opcjonalnie `findTransactionInHouse` |
| `backend/services/transactions/deleteAction.js` | authz host/owner; 403 vs 404 |
| `backend/tests/unit/delete-action-authz.test.js` | **nowy** |

#### Refaktor — `deleteTransactionWithBalanceUpdate` (zdjęcie filtra aktora)

**teraz (po FAZA 1):** `where: { transactionId, userId, houseId }`

**zamień na:**

```javascript
/**
 * Usunięcie tx w domu + reverse salda (D-11a).
 * Authz (owner|host) egzekwuje service — tu tylko houseId + transactionId.
 */
export async function deleteTransactionWithBalanceUpdate({ houseId, transactionId }) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.transactions.findFirst({
      where: { transactionId, houseId },
    });
    if (!existing) {
      return { deleted: false };
    }

    await tx.transactions.deleteMany({
      where: { transactionId, houseId },
    });

    const house = await tx.households.findUnique({ where: { houseId } });
    const balanceType = reverseBalanceType(existing.type);
    const newBalance = nextBalance(
      house.currentBalance,
      house.initBudget,
      balanceType,
      existing.value,
    );
    await tx.households.update({
      where: { houseId },
      data: { currentBalance: newBalance },
    });

    return {
      deleted: true,
      houseId,
      newBalance,
      value: existing.value,
      type: existing.type,
      ownerUserId: existing.userId,
    };
  });
}
```

#### Refaktor — `backend/services/transactions/deleteAction.js` (pełny plik docelowy)

```javascript
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import checkHouse from '../../utils/checkUtils/checkUserHouse.js';
import { checkTransaction } from '../../utils/checkUtils/checkTransaction.js';
import { deleteTransactionWithBalanceUpdate } from '../../database/transactions.js';
import { liveUpdateBalance } from '../../utils/householdUtils/liveUpdateBalance.js';
import { handleNotification } from '../../utils/handleNotification.js';
import { AppError } from '../../utils/errors/AppError.js';

const deleteAction = async (transactionId, userId) => {
  try {
    if (!transactionId) {
      logger.error('Transaction ID not found.');
      throw new AppError({ code: 'TX_1', messageKey: 'Invalid input data.', httpStatus: 400 });
    }

    const houseData = await checkHouse(userId);

    if (!houseData) {
      logger.error(`User ${userId} does not belong to any household.`);
      throw new AppError({
        code: 'TX_2',
        messageKey: 'User does not belong to any household.',
        httpStatus: 404,
      });
    }

    const houseId = houseData.houseId;
    const actorRole = houseData.role;

    const checkAction = await checkTransaction(transactionId);

    if (!checkAction || checkAction.houseId !== houseId) {
      logger.error(`Transaction ${transactionId} not found in house ${houseId}.`);
      throw new AppError({ code: 'TX_4', messageKey: 'Transaction not found.', httpStatus: 404 });
    }

    const isOwner = checkAction.userId === userId;
    const isHost = actorRole === 'host';
    if (!isOwner && !isHost) {
      logger.error(`User ${userId} forbidden to delete transaction ${transactionId}.`);
      throw new AppError({
        code: 'TX_3',
        messageKey: 'authz.transactions.delete.denied',
        httpStatus: 403,
      });
    }

    const result = await deleteTransactionWithBalanceUpdate({
      houseId,
      transactionId,
    });

    if (!result.deleted) {
      logger.error(`Transaction ${transactionId} not found.`);
      throw new AppError({ code: 'TX_4', messageKey: 'Transaction not found.', httpStatus: 404 });
    }

    await liveUpdateBalance(houseId, userId, result.newBalance);

    const id = uuidv4();

    await handleNotification({
      id,
      category: 'transactions',
      houseId,
      message: 'notifications.deletedAction',
      extraData: {
        user: userId,
        action: 'deleteTransaction',
      },
    });

    logger.info(`Transaction ${transactionId} deleted correctly.`);

    return {
      messageKey: `Transaction ${transactionId} deleted correctly.`,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`deleteAction error: ${error}`);
    throw new AppError({
      code: 'TX_5',
      messageKey: 'Failed to deleting transaction.',
      httpStatus: 500,
    });
  }
};

export { deleteAction };
```

#### Nowy plik — `backend/tests/unit/delete-action-authz.test.js`

```javascript
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('deleteAction authz (S-8a)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  async function loadDeleteAction(mocks) {
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: mocks.checkHouse,
    }));
    jest.unstable_mockModule('../../utils/checkUtils/checkTransaction.js', () => ({
      checkTransaction: mocks.checkTransaction,
    }));
    jest.unstable_mockModule('../../database/transactions.js', () => ({
      deleteTransactionWithBalanceUpdate: mocks.deleteTx,
    }));
    jest.unstable_mockModule('../../utils/householdUtils/liveUpdateBalance.js', () => ({
      liveUpdateBalance: jest.fn(),
    }));
    jest.unstable_mockModule('../../utils/handleNotification.js', () => ({
      handleNotification: jest.fn(),
    }));
    return import('../../services/transactions/deleteAction.js');
  }

  test('inmate na cudzej tx w domu → 403', async () => {
    const deleteTx = jest.fn();
    const { deleteAction } = await loadDeleteAction({
      checkHouse: jest.fn(async () => ({ houseId: 'h-1', role: 'inmate' })),
      checkTransaction: jest.fn(async () => ({
        userId: 'host-1',
        houseId: 'h-1',
        value: 40,
        type: 'expense',
      })),
      deleteTx,
    });

    await expect(deleteAction('tx-1', 'inmate-1')).rejects.toMatchObject({
      httpStatus: 403,
      messageKey: 'authz.transactions.delete.denied',
    });
    expect(deleteTx).not.toHaveBeenCalled();
  });

  test('host na cudzej tx w domu → delete bez userId aktora', async () => {
    const deleteTx = jest.fn(async () => ({
      deleted: true,
      houseId: 'h-1',
      newBalance: 500,
      value: 40,
      type: 'expense',
    }));
    const { deleteAction } = await loadDeleteAction({
      checkHouse: jest.fn(async () => ({ houseId: 'h-1', role: 'host' })),
      checkTransaction: jest.fn(async () => ({
        userId: 'inmate-1',
        houseId: 'h-1',
        value: 40,
        type: 'expense',
      })),
      deleteTx,
    });

    await deleteAction('tx-1', 'host-1');
    expect(deleteTx).toHaveBeenCalledWith({ houseId: 'h-1', transactionId: 'tx-1' });
  });

  test('tx innego domu → 404', async () => {
    const deleteTx = jest.fn();
    const { deleteAction } = await loadDeleteAction({
      checkHouse: jest.fn(async () => ({ houseId: 'h-1', role: 'host' })),
      checkTransaction: jest.fn(async () => ({
        userId: 'u-x',
        houseId: 'h-other',
        value: 10,
        type: 'expense',
      })),
      deleteTx,
    });

    await expect(deleteAction('tx-1', 'host-1')).rejects.toMatchObject({
      httpStatus: 404,
      code: 'TX_4',
    });
    expect(deleteTx).not.toHaveBeenCalled();
  });
});
```

**DoD kroku:**

- Host może usunąć tx innego członka tego samego `houseId`.
- Unit: inmate 403, host OK, zły dom 404.

---

### KROK 2 — Mapowanie 403/404 + testy E2E

**Status:** `WYKONANY`

**Cel:** E2E na `/api/v1`: inmate → 403 na cudzej; host kasuje cudzą → 200 + reverse salda; inmate własna → 200. Major 9.2.2, T-5 / T-15.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/tests/e2e/t5-business-edges.test.js` | zamiana 404→403; dopisek host delete cudzej + inmate own |
| `backend/tests/unit/delete-action-balance.test.js` | dopasowanie mocka wywołania (bez `userId` w args delete DB) po FAZA 2 |

#### Refaktor E2E — inmate cudza

**teraz:**

```javascript
  test('inmate nie kasuje tx hosta → 404', async () => {
    // ...
    expect(delRes.status).toBe(404);
  });
```

**zamień na:**

```javascript
  test('inmate nie kasuje tx hosta → 403', async () => {
    const host = await signupAndLogin(app, {
      userName: 'txownr',
      email: 'txownr@test.local',
    });
    await createHouse(host.agent, { houseName: 'E2E OwnTx', initBudget: 500 });

    const inmate = await signupAndLogin(app, {
      userName: 'txinmt',
      email: 'txinmt@test.local',
    });
    expect((await host.agent.post('/api/v1/users/invite').send({ userName: 'txinmt' })).status).toBe(
      200,
    );
    await login(inmate.agent, { email: 'txinmt@test.local' });

    const addRes = await host.agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 40,
      catId: SEED_CAT.expenseEducation,
    });
    expect(addRes.status).toBe(200);

    const delRes = await inmate.agent
      .delete('/api/v1/action/')
      .send({ transactionId: addRes.body.transactionId });
    expect(delRes.status).toBe(403);
    expect(delRes.body.message).toBe('authz.transactions.delete.denied');
  });

  test('host kasuje tx inmate → 200 + reverse salda', async () => {
    const host = await signupAndLogin(app, {
      userName: 'hstdel',
      email: 'hstdel@test.local',
    });
    await createHouse(host.agent, { houseName: 'E2E HostDel', initBudget: 500 });

    const inmate = await signupAndLogin(app, {
      userName: 'inmdel',
      email: 'inmdel@test.local',
    });
    expect((await host.agent.post('/api/v1/users/invite').send({ userName: 'inmdel' })).status).toBe(
      200,
    );
    await login(inmate.agent, { email: 'inmdel@test.local' });

    const addRes = await inmate.agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 50,
      catId: SEED_CAT.expenseEducation,
    });
    expect(addRes.status).toBe(200);

    const afterAdd = await host.agent.get('/api/v1/board/data/house');
    expect(Number(afterAdd.body.dashboardData?.houseData?.[0]?.liveBalance)).toBe(450);

    const delRes = await host.agent
      .delete('/api/v1/action/')
      .send({ transactionId: addRes.body.transactionId });
    expect(delRes.status).toBe(200);

    const afterDel = await host.agent.get('/api/v1/board/data/house');
    expect(Number(afterDel.body.dashboardData?.houseData?.[0]?.liveBalance)).toBe(500);
  });

  test('inmate kasuje własną tx → 200', async () => {
    const host = await signupAndLogin(app, {
      userName: 'hstown',
      email: 'hstown@test.local',
    });
    await createHouse(host.agent, { houseName: 'E2E OwnOk', initBudget: 300 });

    const inmate = await signupAndLogin(app, {
      userName: 'inown1',
      email: 'inown1@test.local',
    });
    expect((await host.agent.post('/api/v1/users/invite').send({ userName: 'inown1' })).status).toBe(
      200,
    );
    await login(inmate.agent, { email: 'inown1@test.local' });

    const addRes = await inmate.agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 30,
      catId: SEED_CAT.expenseEducation,
    });
    expect(addRes.status).toBe(200);

    const delRes = await inmate.agent
      .delete('/api/v1/action/')
      .send({ transactionId: addRes.body.transactionId });
    expect(delRes.status).toBe(200);
  });
```

#### Dopasowanie unit z FAZA 1 po zmianie sygnatury delete

W `delete-action-balance.test.js` oczekiwane wywołanie:

```javascript
    expect(deleteTransactionWithBalanceUpdate).toHaveBeenCalledWith({
      houseId: 'h-1',
      transactionId: 'tx-1',
    });
```

(bez `userId` — po FAZA 2).

**DoD kroku:**

- E2E: inmate cudza → 403 + klucz; host cudza → 200 + saldo; inmate własna → 200.
- Unit authz + balance zielone razem ze scoped komendą.

#### Propozycja commit message

```text
feat(transactions): enforce host/inmate delete authorization in API

Allow hosts to remove any household transaction and return 403 when an
inmate targets someone else's row in the same house (S-8a).
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| D-11a reverse | E2E delete expense/income; unit `reverseBalanceType` |
| D-11b 2 dp | Unit `parseAmount2dp`; E2E `10.999` → 400 |
| S-8a authz | Unit + E2E 403/200 host/inmate |
| Notice / WS | Bez regresji ścieżki `notifications.deletedAction` + `liveUpdateBalance` (bez zmiany semantyki) |
| T-15 | `npm test` w `backend/` zielone dla zmienionych plików / pełnej suity lokalnej |
| Nagłówki | wyłącznie `FAZA` / `KROK`; commit EN na końcu każdej fazy |
| Warstwy | Brak edycji major/docs/SPEC; brak odwołań do planów pomocniczych w rootcie |

### Ślad do major (po implementacji — poza tym skillem)

- Faza 9.1 + 9.1.1 + 9.1.2 → `WYKONANY`
- Faza 9.2 + 9.2.1 + 9.2.2 → `WYKONANY`
- Milestone „Reguły domeny: saldo / authz tx / invite+mail” — **bez** `OSIĄGNIĘTY` (wymaga 9.3–9.4)
