# Home Budget Manager — feature plan: backend Faza 5 (R1 `inmate` + `broadcastToHousehold`)

**Kotwica major:** `home-budget-manager_major_plan-backend.md` — **Faza 5** (kroki 5.1–5.3).  
**Źródła:** `docs/` (koncepcja, bezpieczeństwo, komunikacja, model danych, dictionary, anty-patterny), `spec/SPEC-BACKEND.md` (B-12), `spec/SPEC-BEZPIECZENSTWO.md` (S-7–S-9), `spec/SPEC-KOMUNIKACJA.md` (K-11), `spec/SPEC-DANE.md` (D-12), `spec/SPEC-TESTY.md` (T-15), kod `backend/`.  
**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Pełna Faza 5 major backend: R1 (`mate` → `inmate`), grupa `mates` → `household`, one-shot UPDATE DB, rename kluczy i18n po stronie BE, rename `broadcastToHouseMates` → `broadcastToHousehold`, scoped testy authz |
| Pass rozwojowy | Kolejność KROK 2 (WS rename, major 5.3) **przed** KROK 3 (reguły + testy, major 5.2) — bez przenosin między fazami major |
| Poza zakresem | Frontend R1 (osobny major FE), Prisma (Faza 7), usuwanie dual mount legacy, zmiana modelu uprawnień host/inmate, Bearer/refresh |
| Po implementacji (informacyjnie) | Major: Faza 5 + kroki 5.1–5.3 → `WYKONANY`; `MILESTONE — Role zgodne z normą po stronie backendu` → `OSIĄGNIĘTY` — **edycja major poza tym skillem** |

### Założenia HOW (zatwierdzone w sesji)

1. Grupa middleware zamiast `mates`: **`household`** → `['host', 'inmate']`.
2. Istniejące wiersze `role = 'mate'`: **one-shot UPDATE** w KROKU 1.
3. Klucze i18n z „Mate” w nazwie: **hard rename** w BE (FE dogania we własnym R1).

### Ryzyko sesji JWT

Po hard cut JWT z `role: 'mate'` dostanie 403 na `verifyRole('household')` do wygaśnięcia / ponownego logowania. Brak trwałego aliasu (S-7).

---

## FAZA 1 — Role `inmate` (R1) + `broadcastToHousehold`

### KROK 1 — Rename `mate` → `inmate` (token, DB, middleware, routes, komunikaty)

**Status:** `WYKONANY`

**Cel:** W refaktorowanym backendzie rola domownika i grupa uprawnień są zgodne z B-12, S-7, D-12 oraz major krokiem 5.1 — bez `mate` / `mates` jako normy.

**Artefakty:**

- Nowy: `backend/scripts/r1-mate-to-inmate.sql`
- Zmiana (rdzeń): `backend/middlewares/verifyRole.js`
- Zmiana (zapisy roli): `backend/utils/householdUtils/saveNewHousemate.js` → rename pliku na `saveNewInmate.js`; `backend/services/household/addNewHouse.js`; `backend/services/users/addUserToHouse.js`; `backend/utils/householdUtils/addUserByMate.js` → `addUserByInmate.js`; call site’y importów
- Zmiana (queries): `backend/database/householdQueries.js`, `backend/database/usersQueries.js`, `backend/database/dashboardQueries.js`
- Zmiana (board): `backend/services/board/getBoardData.js`
- Zmiana (routes): wszystkie `verifyRole('mates')` → `verifyRole('household')` (`dashboardRoutes`, `transactionsRoutes`, `householdRoutes`, `initialMonthlyBudgetsRoutes`, `usersRoutes`)
- Zmiana (komunikaty / kody): `acceptInvitation.js`, `addUserByHost.js`, `deleteInhabitant.js`, `addUserByInmate.js` (po rename), swagger w `usersRoutes.js` / `invitationRoutes.js` / `initialMonthlyBudgetsRoutes.js`
- Docs (żywa edycja poza tym skillem, w tej samej implementacji): usunąć / zaktualizować noty driftu `mates`/`mate` w `docs/dokumentacja_komunikacji.md`, `docs/dictionary.md` (grupa mates), `docs/anty_patterny.md` — zgodnie z domknięciem R1 BE

#### Nowy plik — one-shot SQL

`backend/scripts/r1-mate-to-inmate.sql`:

```sql
-- R1: historyczna rola mate → inmate (users + householdUsers).
-- Uruchomić raz przeciwko DB aplikacji przed/przy deployu Fazy 5.
-- Po UPDATE: brak role = 'mate' w tych tabelach.

UPDATE users
SET role = 'inmate'
WHERE role = 'mate';

UPDATE householdUsers
SET role = 'inmate'
WHERE role = 'mate';
```

DoD operacyjne: po uruchomieniu `SELECT COUNT(*) … WHERE role = 'mate'` na obu tabelach = `0`.

#### Refaktor — `verifyRole.js` (kompletna mapa uprawnień)

Plik: `backend/middlewares/verifyRole.js`

**Teraz:**

```javascript
        const permissions = {
            mates: ['host', 'mate'],
            host: ['host'],
            inmate: ['mate'],
            superadmin: ['superadmin'],
            user: ['user'],
        };

        const customMessages = {
            mates: {
                user: 'Nie masz uprawnień. Czynność tylko dla domowników lub gospodarzy.',
                superadmin: 'Nie masz uprawnień. Tylko gospodarze i domownicy mogą wykonać akcję',
            },
            host: {
                inmate: 'Czynność zarezerwowana dla gospodarzy. Skontaktuj się ze swoim gospodarzem.',
                user: 'Załóż gospodarstwo, aby wykonać tę akcję.',
                superadmin: 'Załóż gospodarstwo, aby wykonać tę akcję',
            },
            inmate: {
                host: 'Akcja tylko dla domowników. Nie masz uprawnień.',
                user: 'Nie masz wystarczających uprawnień. Załóż gospodarstwo lub zapisz się do wybranego.',
            },
            user: {
                host: 'Akcja tylko dla nowych użytkowników.',
                inmate: 'Akcja tylko dla nowych użytkowników.',
            },
            superadmin: {
                host: 'Nie masz wystarczających uprawnień. Skontaktuj się z administratorem witryny.',
                inmate: 'Nie masz wystarczających uprawnień. Skontaktuj się z administratorem witryny.',
                user: 'Nie masz wystarczających uprawnień. Skontaktuj się z administratorem witryny.',
            },
        };
```

**Zamień na:**

```javascript
        const permissions = {
            household: ['host', 'inmate'],
            host: ['host'],
            inmate: ['inmate'],
            superadmin: ['superadmin'],
            user: ['user'],
        };

        // message = klucz i18n (K-2 / B-10); FE mapuje w R1
        const customMessages = {
            household: {
                user: 'authz.household.denied.user',
                superadmin: 'authz.household.denied.superadmin',
            },
            host: {
                inmate: 'authz.host.denied.inmate',
                user: 'authz.host.denied.user',
                superadmin: 'authz.host.denied.superadmin',
            },
            inmate: {
                host: 'authz.inmate.denied.host',
                user: 'authz.inmate.denied.user',
            },
            user: {
                host: 'authz.user.denied.host',
                inmate: 'authz.user.denied.inmate',
            },
            superadmin: {
                host: 'authz.superadmin.denied.host',
                inmate: 'authz.superadmin.denied.inmate',
                user: 'authz.superadmin.denied.user',
            },
        };
```

Fallback (linia z `|| 'Brak uprawnień…'`):

**Teraz:** `|| 'Brak uprawnień do wykonania akcji'`  
**Zamień na:** `|| 'authz.denied'`

Oraz komunikat braku roli:

**Teraz:** `message: 'Użytkownik nie ma przypisanej roli.'`  
**Zamień na:** `message: 'authz.roleMissing'`

#### Refaktor — routes (`mates` → `household`)

We wszystkich call site’ach:

**Teraz:** `verifyRole('mates')`  
**Zamień na:** `verifyRole('household')`

Pliki: `dashboardRoutes.js`, `transactionsRoutes.js` (3×), `householdRoutes.js`, `initialMonthlyBudgetsRoutes.js`, `usersRoutes.js`.

#### Refaktor — zapisy roli `'mate'` → `'inmate'`

`backend/utils/householdUtils/saveNewHousemate.js` — **przenieś** do `saveNewInmate.js` i zamień body:

**Teraz:**

```javascript
    const [addMate] = await connection.query(usersQueries.mateQuery, [1, 'mate', invitedUserId]);
    if (addMate.affectedRows == 1) {
      await connection.query(usersQueries.updatehouseIdHu, [hostHouseId, invitedUserId]);
      await connection.query(usersQueries.updateroleHu, ['mate', invitedUserId]);
    }
    // …
      code: 'HOUSEMATE_SAVE_FAILED',
      messageKey: 'Failed to save new housemate.',
```

**Zamień na:**

```javascript
    const [addInmate] = await connection.query(usersQueries.inmateQuery, [1, 'inmate', invitedUserId]);
    if (addInmate.affectedRows == 1) {
      await connection.query(usersQueries.updatehouseIdHu, [hostHouseId, invitedUserId]);
      await connection.query(usersQueries.updateroleHu, ['inmate', invitedUserId]);
    }
    // …
      code: 'INMATE_SAVE_FAILED',
      messageKey: 'Failed to save new inmate.',
```

Eksport: `saveNewInmate`; zaktualizuj importy (m.in. `acceptInvitation.js`).

`backend/services/household/addNewHouse.js`:

**Teraz:** `houseQueries.mateQuery, [1, 'mate', userId]`  
**Zamień na:** `houseQueries.inmateQuery, [1, 'inmate', userId]`

(Token `inmate` przy join istniejącego domu — już poprawny; zostaw.)

`backend/services/users/addUserToHouse.js`:

**Teraz:**

```javascript
import { addUserByMate } from '../../utils/householdUtils/addUserByMate.js';
// …
    if (role === 'mate') {
      const addByMate = await addUserByMate(
```

**Zamień na:**

```javascript
import { addUserByInmate } from '../../utils/householdUtils/addUserByInmate.js';
// …
    if (role === 'inmate') {
      const addByInmate = await addUserByInmate(
```

(oraz zmienne / return `addByInmate.messageKey`).

#### Refaktor — `addUserByMate.js` → `addUserByInmate.js`

Przenieś plik; rename eksportu i logów; kody błędów:

| Teraz | Zamień na |
|-------|-----------|
| `USERS_MATE_BADREQ` | `USERS_INMATE_BADREQ` |
| `USERS_MATE_INMATE` | `USERS_INMATE_ALREADY_IN_HOUSE` |
| `USERS_MATE_ERROR` | `USERS_INMATE_ERROR` |
| `addUserToHouse.correctlyAddedByMate` | `addUserToHouse.correctlyAddedByInmate` |

#### Refaktor — queries (klucze bez `mate`)

`householdQueries.js` / `usersQueries.js`:

**Teraz:** `mateQuery: 'UPDATE users SET inmate = ?, role = ? WHERE id = ?'`  
**Zamień na:** `inmateQuery: 'UPDATE users SET inmate = ?, role = ? WHERE id = ?'`

(wszystkie odwołania `*.mateQuery` → `*.inmateQuery`, w tym `resetInmatesProps` w `modifyUsersProps.js`).

`dashboardQueries.js`:

**Teraz:** `matesData: 'SELECT …'`  
**Zamień na:** `inmatesData: 'SELECT …'`

#### Refaktor — board filter / pole odpowiedzi

`getBoardData.js`:

**Teraz:**

```javascript
    if (filter === 'all' || filter === 'mates') {
      const [matesData] = await connection.query(dashboardQueries.matesData, [userHouseId]);
      boardData.houseMates = matesData;
    }
```

**Zamień na:**

```javascript
    if (filter === 'all' || filter === 'inmates') {
      const [inmatesData] = await connection.query(dashboardQueries.inmatesData, [userHouseId]);
      boardData.inmates = inmatesData;
    }
```

*(Kontrakt JSON zmienia się względem FE as-is — FE R1 musi przejść na `inmates` / filtr `inmates`.)*

Sprawdź `countTotalPages` i test `board-getBoardData.test.js` pod stary filtr `mates` — zaktualizuj do `inmates`.

#### Tabela rename kluczy i18n (BE → kontrakt FE)

| Teraz (BE) | Zamień na |
|------------|-----------|
| `addUserToHouse.correctlyAddedByMate` | `addUserToHouse.correctlyAddedByInmate` |
| `notifications.addedHouseMate` | `notifications.addedInmate` |
| `notifications.deletedHouseMate` | `notifications.deletedInmate` |
| `Failed to save new housemate.` | `Failed to save new inmate.` |
| `Failed to delete housemate.` | `Failed to delete inmate.` |
| (verifyRole PL prose) | klucze `authz.*` jak wyżej |

Call site’y powiadomień: `acceptInvitation.js`, `addUserByHost.js`, `deleteInhabitant.js`.

Swagger w routes: zamień „mates” / „housemate” / „mate” w opisach na `household` / `inmate` (bez utrzymywania starej nomenklatury jako normy).

#### Biblioteki / API

Brak nowego API zewnętrznego. JWT nadal: `{ id, userName, role }` (`jsonwebtoken` już w projekcie). Context7 nie wymagany.

#### Testy (część KROKU 1)

Smoke jednostkowy mapy uprawnień może wejść w KROK 3 (jeden plik testów authz na finalnym stanie). Tu: po rename grepem w `backend/` (bez `frontend/`, bez `node_modules`, bez historycznych komentarzy „R1”) **zero** dopasowań `\bmate\b` / `\bmates\b` / `broadcastToHouseMates` / `HouseMate` w ścieżkach objętych refaktorem — wyjątek: ten feature plan / major / docs drift do domknięcia w tej samej implementacji.

#### DoD (krok)

- One-shot SQL istnieje; po uruchomieniu brak `role = 'mate'` w `users` i `householdUsers`.
- Nowe zapisy i JWT używają wyłącznie `inmate` dla domownika.
- `verifyRole('household')` na byłych ścieżkach `mates`; mapa bez `mates`/`mate`.
- Klucze i18n z tabeli powyżej oraz kody `USERS_INMATE_*` / `INMATE_SAVE_FAILED` w refaktorowanych plikach.
- Brak plików / eksportów `*ByMate` / `saveNewHousemate` jako normy.

---

### KROK 2 — Rename `broadcastToHouseMates` → `broadcastToHousehold`

**Status:** `WYKONANY`

**Cel:** Jedna funkcja push do domu pod nazwą z K-11 / major 5.3; bez trwałego aliasu; kontrakt eventów `type` / payload bez zmian.

**Artefakty:**

- Zmiana: `backend/configs/websocketConfig.js`
- Call site’y: `backend/services/notifications/emitNotification.js`, `backend/utils/householdUtils/liveUpdateBalance.js`, `backend/utils/handleBroadcastInitBudget.js`
- Docs/SPEC (implementacja): upewnić się, że `docs/dokumentacja_komunikacji.md` i `spec/SPEC-KOMUNIKACJA.md` K-11 wskazują wyłącznie `broadcastToHousehold` (SPEC już ma normę — domknąć ewentualne pozostałości as-is w docs)

#### Refaktor — definicja + eksport

Plik: `backend/configs/websocketConfig.js`

**Teraz:**

```javascript
const broadcastToHouseMates = async (houseId, { type, data } = {}) => {
	// … body bez zmiany semantyki …
};

export { initializeWebSocket, broadcastMessage, broadcastToHouseMates };
```

**Zamień na:**

```javascript
const broadcastToHousehold = async (houseId, { type, data } = {}) => {
	if (!ioInstance) {
		logger.error('Failed to initialize Websocket server.');
		return;
	}

	const connection = await pool.getConnection();

	try {
		const [members] = await connection.query(
			'SELECT userId FROM householdUsers WHERE houseId = ?',
			[houseId]
		);

		if (members.length === 0) {
			logger.error(`Not found members for household: ${houseId}`);
			return;
		}

		const [usersConnections] = await connection.query(
			`SELECT connectionId FROM socketConnections WHERE userId IN (?)`,
			[members.map((row) => row.userId)]
		);

		if (!usersConnections || usersConnections.length === 0) {
			logger.error(`Connections not found for members of household: ${houseId}`);
			return;
		}

		usersConnections.forEach((row) => {
			const socket = ioInstance.sockets.sockets.get(row.connectionId);
			if (socket) {
				socket.emit(type, data);
			}
		});
		logger.info(`Websocket message for household: ${houseId} was sent`);
	} catch {
		logger.error(
			`An error occurred during broadcasting websocket message for household: ${houseId}`
		);
	} finally {
		if (connection) connection.release();
	}
};

export { initializeWebSocket, broadcastMessage, broadcastToHousehold };
```

#### Refaktor — call site’y

**Teraz (wszędzie):** `import { … broadcastToHouseMates … }` + wywołanie `broadcastToHouseMates(...)`  
**Zamień na:** `broadcastToHousehold` (import + call).

Semantyka `type` (`notification`, `balance_update`, `initial_budget`, …) **bez zmian**.

#### DoD (krok)

- Eksport i wszystkie wywołania używają `broadcastToHousehold`.
- Brak `broadcastToHouseMates` / trwałego aliasu w `backend/`.
- Docs/SPEC wskazują `broadcastToHousehold`.
- Katalog `type` eventów bez zmian.

---

### KROK 3 — Reguły ról na API + scoped testy authz (T-15)

**Status:** `WYKONANY`

**Cel:** Egzekwowanie S-8 / S-9 / major 5.2 na brzegu API: zła rola → 403 z kluczem; `household` akceptuje `host` i `inmate`; host-only pozostaje host-only; membership z serwera (bez ufania samemu `houseId` z body). Scoped testy zielone (T-15).

**Artefakty:**

- Audyt / ewentualne dopięcie: ścieżki `verifyRole('host')` (zaproszenia, delete inhabitant/house) vs `verifyRole('household')`; services już biorące `houseId` z `checkUserHouse` (np. `addUserToHouse`) — bez regresji
- Nowy: `backend/tests/unit/verifyRole-inmate.test.js`
- Opcjonalnie uzupełnienie: `backend/tests/foundation/…` smoke 403 na jednej trasie `household` z rolą `user` (gdy tanie z `createApp` + JWT fixture)

#### Audyt reguł (obowiązkowy checklist w implementacji)

| Reguła (S-8) | Jak sprawdzić |
|--------------|---------------|
| `host` zarządza składem | `verifyRole('host')` na delete inhabitant / akceptacja zaproszeń — inmate → 403 |
| `inmate` ma rdzeń bez host-ops | `verifyRole('household')` + JWT `inmate` → 200 na smoke transakcji/board (gdy DB/fixture pozwala) **albo** unit middleware `next()` |
| `user` bez domu | `user` na `household` → 403 `authz.household.denied.user` |
| `superadmin` ≠ host | `superadmin` na `household` / `host` → 403 (nie „awans” do hosta) |
| S-9 membership | `addUserToHouse` / board / transakcje: `houseId` z `checkUserHouse(connection, userId)`, nie z body klienta jako źródło prawdy |

Jeśli audyt znajdzie lukę (np. endpoint host-ops bez `verifyRole('host')`), **napraw w tym kroku** najmniejszym diffem — bez zmiany modelu uprawnień.

#### Nowy plik — test jednostkowy middleware

`backend/tests/unit/verifyRole-inmate.test.js`:

```javascript
import { describe, expect, test, jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import verifyRole from '../../middlewares/verifyRole.js';

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('verifyRole — R1 inmate / household (S-7, S-8)', () => {
  test('household: host → next()', () => {
    const mw = verifyRole('household');
    const req = { role: 'host' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('household: inmate → next()', () => {
    const mw = verifyRole('household');
    const req = { role: 'inmate' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('household: mate (legacy) → 403, bez next', () => {
    const mw = verifyRole('household');
    const req = { role: 'mate' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error' })
    );
  });

  test('household: user → 403 z kluczem authz.household.denied.user', () => {
    const mw = verifyRole('household');
    const req = { role: 'user' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'authz.household.denied.user',
    });
  });

  test('host: inmate → 403 authz.host.denied.inmate', () => {
    const mw = verifyRole('host');
    const req = { role: 'inmate' };
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'authz.host.denied.inmate',
    });
  });

  test('brak req.role → 403 authz.roleMissing', () => {
    const mw = verifyRole('household');
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    mw(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'authz.roleMissing',
    });
  });
});
```

#### Komenda

```bash
cd backend && npm test -- --testPathPattern='verifyRole-inmate'
```

(oraz pełne `npm test` w zakresie bez regresji wcześniejszych scoped testów).

#### DoD (krok)

- Checklist S-8/S-9 przejrzany; ewentualne luki domknięte.
- Testy unit powyżej zielone; odmowa złej roli i akceptacja `inmate` na `household` obserwowalne.
- Legacy `mate` w tokenie **nie** przechodzi `household`.

---

#### Propozycja commit message

```text
feat(authz): unify household role as inmate and rename WS broadcast helper

Cut historical mate/mates aliases, migrate DB roles, and align middleware
with S-7/S-8; broadcastToHousehold matches K-11 without a legacy export alias.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| Major Faza 5 DoD | Brak `mate`/`mates`/`broadcastToHouseMates` w refaktorowanym BE; `inmate` + `household` + `broadcastToHousehold` |
| SPEC | B-12, S-7–S-9, K-11, D-12, T-15 |
| Docs | Drift R1 w komunikacji / dictionary usunięty lub zaktualizowany przy implementacji |
| Testy | `verifyRole-inmate` (+ ewentualny foundation smoke) zielone |
| FE | Świadomy hard cut kluczy / pola `inmates` — poza tym major BE; FE R1 dogania |
| Nagłówki planu | Wyłącznie `FAZA` / `KROK`; commit message EN Conventional Commits na końcu fazy |

## Ślad do major (informacyjnie, po implementacji)

- Faza 5 → `WYKONANY` (kroki 5.1, 5.2, 5.3 → `WYKONANY`)
- `MILESTONE — Role zgodne z normą po stronie backendu` → `OSIĄGNIĘTY`
- Start Fazy 6 — poza tym wycinkiem
