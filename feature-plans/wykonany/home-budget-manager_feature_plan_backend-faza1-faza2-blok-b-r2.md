# Home Budget Manager — feature plan: backend Faza 1 + Faza 2 (Blok B + R2)

**Kotwica major:** `home-budget-manager_major_plan-backend.md` — Faza 1, MILESTONE „Backend na zaktualizowanych zależnościach”, Faza 2, MILESTONE „Struktura Blok B + pipeline R2”.  
**Źródła:** `docs/` (m.in. `architektura_katalogi_pliki.md` Blok B, `architektura.md` R2, `observability.md`, `testy.md`), `spec/SPEC-BACKEND.md` (B-1–B-4, B-10, B-13–B-15, B-18–B-19), `spec/SPEC-TESTY.md` (T-15), kod `backend/`.  
**Poza zakresem wycinka:** Faza 3+ (pełne observability/health/helmet-CORS jako norma fazy), dual mount `/api/v1`, R1 `inmate`, adaptery cron/WS (Faza 6), Prisma/R6 (Faza 7), frontend, CI/Jenkins.

**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

**Pass rozwojowy (zatwierdzony):** w FAZIE 2 kolejność HOW ≠ numeracja major 2.1→2.4 — najpierw B-10, potem mapa `services/`, potem sieroty + cienkie controllery, na końcu audyt granic + scoped testy. FAZA 1: bez przesunięć.

**Decyzje HOW (wywiad):** Express zostaje na linii **4.x**; w Fazie 1 usunięcie `winston-daily-rotate-file` + minimalny Winston → Console; Faza 2 obejmuje **wszystkie** istniejące ścieżki HTTP.

---

## Meta

| Pole | Wartość |
|------|---------|
| Plik | `feature-plans/home-budget-manager_feature_plan_backend-faza1-faza2-blok-b-r2.md` |
| Nazwa projektu | `home-budget-manager` |
| Runtime referencyjny | Docker `node:22.12-slim` (`backend/Dockerfile`); lokalnie dopuszczalne Node ≥ 22 |
| Model modułów po FAZIE 1 | ESM (`"type": "module"`) |
| Prisma w tym wycinku | **Nie** — `database/` zostaje na pool + `*Queries` |

---

## Założenia

- Stack i zakazy: `SPEC-BACKEND` (Express, Winston, ESM; bez Nest/DI/feature-modules; Prisma dopiero później).
- Envelope HTTP bez zmiany kontraktu ścieżek legacy: `{ status, message, … }`; przy B-10 pole `message` = `messageKey` (istniejące stringi / klucze i18n **zachować** — bez przepisywania copy).
- Cookie `SESSID` i `res.cookie` / `res.clearCookie` zostają w controllerze (brzeg HTTP); service auth zwraca dane do ustawienia cookie, nie woła `res`.
- `messageKey` w błędach = dotychczasowe teksty odpowiedzi (EN lub klucz i18n), bez nowej warstwy tłumaczeń.
- Biblioteki: Jest ESM wg docs Jest (`transform: {}` + `--experimental-vm-modules`); Winston Console; Express 4.x. Context7: resolve `/jestjs/jest`, `/expressjs/express`, `/winstonjs/winston`; szczegóły ESM Jest z oficjalnych docs (limit Context7).

---

## FAZA 1 — Aktualizacja zależności + ESM + scoped fundament

**Kotwica major:** Faza 1 (kroki 1.1–1.3) + przygotowanie do MILESTONE po Fazie 1.  
**SPEC:** B-18, B-19; T-15 (scoped); observability docs — usunięcie daily-rotate jako blokera startu (pełna norma loggera/health = Faza 3 major).

### KROK 1 — Inwentaryzacja zależności vs stack docs/SPEC

**Status:** `WYKONANY`

**Cel:** Jawna lista wyjściowa i decyzji upgrade / usunięcie przed zmianą lockfile (major 1.1).

**Artefakty:** brak nowych plików kodu — wynik to tabela w tym kroku (przy implementacji wolno trzymać checklistę tylko w PR/commit message; nie tworzyć osobnego docs).

#### Lista wyjściowa (`backend/package.json` as-is)

| Pakiet | Rola as-is | Decyzja |
|--------|------------|---------|
| `express` ^4.21.1 | HTTP | **Upgrade w linii 4.x** (bez Express 5) |
| `socket.io` | WS w procesie | Upgrade patch/minor w ramach API v4 |
| `mysql2` | pool / raw SQL | Upgrade; zostaje do Fazy 7 |
| `jsonwebtoken`, `bcrypt`, `cookie-parser`, `cors`, `dotenv`, `uuid`, `multer`, `sharp`, `tesseract.js`, `node-cron`, `http-status-codes`, `xlsx`, `swagger-jsdoc`, `swagger-ui-express` | stack używany | Upgrade do najnowszych zgodnych semver |
| `winston` | logger | Upgrade; transport → Console w KROK 2 |
| `winston-daily-rotate-file` | pliki logów | **Usunąć** (B-14 / docs observability) |
| `helmet` | zainstalowany, nieużyty w `server.js` | Zostawić (Faza 3 major) |
| `nodemailer` | zainstalowany | Zostawić (kontrakt e-mail w docs; podpięcie później) |
| `http` (npm `0.0.1-security`) | zbędny stub | **Usunąć**; używać `node:http` |
| `path` (npm) | zbędny stub | **Usunąć**; używać `node:path` |
| Jest / Supertest | brak | **Dodać** w KROK 3 (devDependencies) |
| `nodemon` | w skrypcie `start`, brak w manifestcie | Dodać do `devDependencies` albo zmienić `start`→`node` i `dev`→`nodemon` |

**DoD (krok):**

- Tabela decyzji powyżej obowiązuje przy upgrade.
- Brak otwartego sporu „co wyrzucamy przed ESM”.

### KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout

**Status:** `WYKONANY`

**Cel:** Manifest/lockfile zaktualizowane; cały `backend/**/*.js` na `import`/`export`; proces startuje (major 1.2 + część 1.3).

**Artefakty:**

- Zmiana: `backend/package.json`, `backend/package-lock.json`
- Zmiana: `backend/configs/logger.js` (minimalny Console)
- Zmiana mechaniczna: wszystkie `backend/**/*.js` (CJS → ESM), w tym `server.js`, `routes/index.js`
- Usunięcie zależności: `winston-daily-rotate-file`, `http`, `path` (npm)

#### `package.json` — docelowy szkielet (wersje liczbowe = wynik `npm outdated` / install w momencie implementacji; linie major jak niżej)

```json
{
  "name": "home-budget-webapp-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  },
  "engines": {
    "node": ">=22"
  },
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cookie": "^1.0.2",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.2",
    "helmet": "^8.1.0",
    "http-status-codes": "^2.3.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.11.3",
    "node-cron": "^3.0.3",
    "nodemailer": "^6.9.15",
    "sharp": "^0.33.5",
    "socket.io": "^4.8.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "tesseract.js": "^6.0.0",
    "uuid": "^10.0.0",
    "winston": "^3.15.0",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.1.0",
    "supertest": "^7.0.0"
  }
}
```

Uwaga: przy implementacji podnieś do najnowszych **w tych majorach** (Express **4**, Jest 29 lub 30 jeśli zielone na Node 22). **Nie** skakać na Express 5.

#### Nowy kształt — `backend/configs/logger.js` (kompletny)

```js
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} [${level.toUpperCase()}] : ${message}`;
});

const logger = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [new transports.Console()],
});

export default logger;
```

#### Refaktor — wzorzec CJS → ESM (stosować we wszystkich plikach)

**Teraz (przykład `server.js` — fragment):**

```js
const dotenv = require('dotenv').config({ path: './.env' });
const path = require('path');
const http = require('http');
const express = require('express');
const logger = require('./configs/logger.js');
const setupRoutes = require('./routes/index.js');
// ...
module.exports = /* brak — entry */;
```

**Zamień na (fragment entry):**

```js
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from './configs/logger.js';
import swaggerDocs from './configs/swaggerConfig.js';
import balanceHouseActions from './tasks/balanceHouseTransactions.js';
import saveDailyTransactions from './tasks/saveDailyTransactions.js';
import saveDailyBudget from './tasks/saveDailyBudget.js';
import { initializeWebSocket } from './configs/websocketConfig.js';
import { clearSocketConnections } from './utils/clearSocketConnections.js';
import setupRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

Reguły migracji (obowiązkowe w tym kroku):

| As-is | ESM |
|-------|-----|
| `require('x')` | `import … from 'x'` / `import x from 'x'` |
| `module.exports = fn` | `export default fn` |
| `exports.name = …` | `export async function name` / `export { name }` |
| `require('path')` / `require('http')` | `node:path` / `node:http` |
| `__dirname` | `fileURLToPath(import.meta.url)` jak wyżej |
| dynamiczny `require(\`./${file}\`)` w `routes/index.js` | **statyczne** importy routerów (poniżej) |

#### Refaktor — `backend/routes/index.js`

**Teraz:**

```js
const routes = [
    { path: '/auth', file: 'authRoutes.js' },
    // …
];

const setupRoutes = (app) => {
    routes.forEach(({ path, file }) => {
        const route = require(`./${file}`);
        app.use(path, route);
    });
};

module.exports = setupRoutes;
```

**Zamień na:**

```js
import authRoutes from './authRoutes.js';
import usersRoutes from './usersRoutes.js';
import householdRoutes from './householdRoutes.js';
import transactionsRoutes from './transactionsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import actionCatRoutes from './actionCatRoutes.js';
import messagesRoutes from './messagesRoutes.js';
import initialMonthlyBudgetsRoutes from './initialMonthlyBudgetsRoutes.js';
import receiptRoutes from './receiptRoutes.js';
import homePageDataRoutes from './homePageDataRoutes.js';
import noticeRoutes from './noticeRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import avatarsRoutes from './avatarsRoutes.js';
import invitationRoutes from './invitationRoutes.js';
import cookiesTourRoutes from './cookiesTourRoutes.js';
import reviewsRoutes from './reviewsRoutes.js';

const routes = [
  { path: '/auth', router: authRoutes },
  { path: '/users', router: usersRoutes },
  { path: '/house', router: householdRoutes },
  { path: '/action', router: transactionsRoutes },
  { path: '/board', router: dashboardRoutes },
  { path: '/actioncat', router: actionCatRoutes },
  { path: '/message', router: messagesRoutes },
  { path: '/initmonthly', router: initialMonthlyBudgetsRoutes },
  { path: '/receipt', router: receiptRoutes },
  { path: '/homepage', router: homePageDataRoutes },
  { path: '/notice', router: noticeRoutes },
  { path: '/gallery', router: galleryRoutes },
  { path: '/avatars', router: avatarsRoutes },
  { path: '/invitation', router: invitationRoutes },
  { path: '/cookiestour', router: cookiesTourRoutes },
  { path: '/reviews', router: reviewsRoutes },
];

export default function setupRoutes(app) {
  for (const { path, router } of routes) {
    app.use(path, router);
  }
}
```

Każdy plik `*Routes.js`: `export default router` zamiast `module.exports = router`.

**Kolejność w kroku:** (1) zmiana `package.json` + usunięcie stubów/daily-rotate, (2) logger Console, (3) masowa migracja importów, (4) `npm install`, (5) ręczny start `npm start` / `node server.js`.

**Biblioteki:** Express 4 ESM = standardowe `import express from 'express'` (docs Express / Context7 resolve). Winston: `transports.Console()` (Winston v3). Dotenv: `import 'dotenv/config'`.

**Testy:** w tym kroku jeszcze nie — KROK 3.

**DoD (krok):**

- `"type": "module"` w `backend/package.json`; zero `require`/`module.exports` w kodzie aplikacji (poza ewentualnym komentarzem historycznym — nie zostawiać żywego CJS).
- Brak `winston-daily-rotate-file`, `http`, `path` w dependencies.
- `node server.js` startuje bez błędu ładowania modułów (DB/env mogą logować ostrzeżenia — ale import graph musi być domknięty).

### KROK 3 — Setup Jest (ESM) + smoke fundamentu

**Status:** `WYKONANY`

**Cel:** Scoped testy Fazy 1 (T-15): Jest ładuje ESM; smoke importów entry / logger / setupRoutes (major 1.3).

**Artefakty:**

- Nowy: `backend/jest.config.js`
- Nowy: `backend/tests/foundation/esm-smoke.test.js`
- Zmiana: skrypt `test` w `package.json` (już w KROK 2)

#### Nowy plik — `backend/jest.config.js`

```js
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
};

export default config;
```

#### Nowy plik — `backend/tests/foundation/esm-smoke.test.js`

```js
import { describe, expect, test } from '@jest/globals';

describe('backend ESM foundation', () => {
  test('logger exports default winston-like API', async () => {
    const { default: logger } = await import('../../configs/logger.js');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  test('setupRoutes is a default-exported function', async () => {
    const { default: setupRoutes } = await import('../../routes/index.js');
    expect(typeof setupRoutes).toBe('function');
  });

  test('package type is module', async () => {
    const pkg = await import('../../package.json', { with: { type: 'json' } });
    expect(pkg.default.type).toBe('module');
  });
});
```

Jeśli Node/Jest w danej wersji nie przyjmie importu JSON z `with: { type: 'json' }`, zamień trzeci test na odczyt przez `fs.readFileSync` + `JSON.parse` (ten sam asert).

**Biblioteki:** Jest ESM — oficjalne docs: `transform: {}` + `node --experimental-vm-modules …/jest.js` ([ECMAScript Modules · Jest](https://jestjs.io/docs/ecmascript-modules)).

**DoD (krok):**

- `npm test` w `backend/` zielone dla scoped foundation.
- Komenda testów = skrypt z `package.json` (ta sama, którą później CI ma odpalać — bez wymogu YAML w tym wycinku).

#### Propozycja commit message

```text
feat(backend): adopt ESM and upgrade foundation dependencies

Move the API process to type module, drop file log rotation and stub
packages, and add Jest smoke coverage for the new load path.
```

---

## FAZA 2 — Blok B + pipeline R2 (cienkie controllery, B-10; bez Prisma)

**Kotwica major:** Faza 2 (2.1–2.4 w major; HOW przesunięty) + MILESTONE „Struktura Blok B + pipeline R2”.  
**SPEC:** B-1–B-4, B-10, B-13; T-1/T-15 scoped.  
**Docs:** Blok B + R2 w `architektura.md` / `architektura_katalogi_pliki.md`.

### KROK 1 — Jednolity błąd aplikacji B-10 + helper controllera

**Status:** `WYKONANY`

**Cel:** Wspólny kształt błędu i mapowanie na envelope HTTP zanim ruszy migracja controllerów (przesunięcie rozwojowe względem major 2.4).

**Artefakty:**

- Nowy: `backend/utils/errors/AppError.js`
- Nowy: `backend/utils/http/runController.js`

#### Nowy plik — `backend/utils/errors/AppError.js`

```js
export class AppError extends Error {
  /**
   * @param {{ code: string, messageKey: string, httpStatus: number, details?: unknown }} params
   */
  constructor({ code, messageKey, httpStatus, details }) {
    super(messageKey);
    this.name = 'AppError';
    this.code = code;
    this.messageKey = messageKey;
    this.httpStatus = httpStatus;
    this.details = details;
  }
}

export function isAppError(error) {
  return error instanceof AppError;
}
```

#### Nowy plik — `backend/utils/http/runController.js`

```js
import logger from '../../configs/logger.js';
import { isAppError } from '../errors/AppError.js';

/**
 * Cienki adapter HTTP: service zwraca sukces { messageKey, httpStatus?, …data }
 * albo rzuca AppError. Bez reguł domenowych.
 * @param {import('express').Response} res
 * @param {() => Promise<Record<string, unknown> | void>} action
 */
export async function runController(res, action) {
  try {
    const result = (await action()) ?? { messageKey: 'OK' };
    const httpStatus = Number(result.httpStatus) || 200;
    const { httpStatus: _hs, messageKey, ...data } = result;
    return res.status(httpStatus).json({
      status: 'success',
      message: messageKey,
      ...data,
    });
  } catch (error) {
    if (isAppError(error)) {
      const body = {
        status: 'error',
        message: error.messageKey,
      };
      if (error.details && typeof error.details === 'object' && !Array.isArray(error.details)) {
        Object.assign(body, error.details);
      }
      return res.status(error.httpStatus).json(body);
    }

    logger.error(`Unhandled controller error: ${error?.message || error}`);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
}
```

**Testy (szkic w KROK 4 — tu minimum):** unit `AppError` shape; unit `runController` z mockiem `res` (można dodać już w tym kroku plik `tests/unit/appError.test.js` jeśli wygodniej — DoD fazy wymaga zielonych w KROK 4).

**DoD (krok):**

- Istnieją `AppError` i `runController` zgodne z B-10 / B-11 (sukces też przez `messageKey`).
- Żaden service jeszcze nie musi ich używać — ale API jest gotowe przed KROK 3.

### KROK 2 — Podfoldery `services/<obszar>/` + `shell/` (mapa Bloku B)

**Status:** `WYKONANY`

**Cel:** Dom katalogowy obszarów z docs/SPEC B-3–B-4 (major 2.1), **przed** przenoszeniem logiki sierot.

**Artefakty:** przeniesienia/rename istniejących plików + puste/docelowe katalogi pod nowe obszary.

#### Mapa przeniesień (git mv / równoważne)

| As-is | Docelowo (Blok B) |
|-------|-------------------|
| `services/actionCatServices/*` | `services/categories/*` |
| `services/transactionServices/*` | `services/transactions/*` |
| `services/householdServices/*` | `services/household/*` |
| `services/messagesServices/*` | `services/messages/*` |
| `services/usersServices/*` | `services/users/*` |
| `services/cookiesTourServices/*` | `services/shell/cookiesTour/*` |
| `services/homePageDataServices/*` | `services/shell/homepage/*` |
| *(brak)* | `services/auth/` |
| *(brak)* | `services/board/` |
| *(brak)* | `services/invitations/` |
| *(brak)* | `services/budget/` |
| *(brak)* | `services/notifications/` |
| *(brak)* | `services/receipt/` |
| *(brak)* | `services/shell/reviews/` |
| *(brak)* | `services/shell/gallery/` |

Po `mv`: zaktualizuj **wszystkie** importy wskazujące stare ścieżki (controllers, inne services). Jeszcze **nie** wyciągaj logiki z grubych controllerów — to KROK 3. Katalogi `auth/`, `board/`, … mogą dostać plik `.gitkeep` albo od razu pliki z KROK 3 w tym samym commicie fazy (preferencja: utworzyć pliki w KROK 3, tu tylko folder map + rename istniejących).

**DoD (krok):**

- Drzewo `services/` ma domy obszarów Bloku B (rdzeń + `shell/`); istnieje ścieżka `services/board/`.
- Brak `*Services` w nazwach folderów as-is.
- Importy po rename się resolve’ują (smoke / start).

### KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma)

**Status:** `WYKONANY`

**Cel:** Każda ścieżka HTTP z as-is: route → cienki controller → service → `database/*Queries` / pool (B-1–B-2). Controllers bez SQL i bez reguł; services bez `res` (major 2.2).

**Artefakty (nowe services + przerobione controllery/routes):** zestaw poniżej. Helpery domenowe wołane dziś z controllerów (`saveNewHousemate`, `initMonthlyBudgetFunctions`, OCR) zostają wywoływane **z services** (nie z controllerów). `handleNotification` przestaje importować controller.

**Kolejność implementacji wewnątrz kroku (zależności):** 3.A → 3.E (notifications + `emitNotification`) → 3.B auth → 3.C board → 3.D invitations → 3.F budget → 3.G receipt → 3.H pozostałe obszary. Invitations zależą od `emitNotification`.

---

#### 3.A — Wspólna konwencja service → controller

- Błąd: `throw new AppError({ code, messageKey, httpStatus })`.
- Sukces: `return { messageKey, httpStatus?, …payload }` (te same pola co dziś w JSON poza `status`).
- Controller: wyłącznie odczyt `req` + `runController` / ustawienie cookie.
- Istniejące services po rename: w tym kroku **przejść** z `{ status: 'error'|'badreq'|… }` na `AppError` + sukces bez pola `status` (albo mapować w service wrapperze — preferowane: throw AppError w miejscu dotychczasowych gałęzi error).

---

#### 3.B — Auth (`services/auth/`)

##### Nowy plik — `backend/services/auth/registerUser.js`

```js
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import queries from '../../database/authQueries.js';
import { registerValidations } from '../../utils/validation.js';
import { checkUserEmail } from '../../utils/checkUtils/checkUserEmail.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function registerUser({
  reg_username,
  reg_email,
  reg_password,
  role,
  cookies,
}) {
  const validations = registerValidations(reg_username, reg_email, reg_password, role);
  const connection = await pool.getConnection();

  try {
    const checkEmail = await checkUserEmail(connection, reg_email);
    if (checkEmail && checkEmail.email === reg_email) {
      throw new AppError({
        code: 'AUTH_EMAIL_EXISTS',
        messageKey: 'Entered e-mail address already exists.',
        httpStatus: 409,
      });
    }

    for (const validation of validations) {
      if (!validation.isValid) {
        logger.error(validation.message);
        throw new AppError({
          code: 'AUTH_REGISTER_VALIDATION',
          messageKey: validation.message,
          httpStatus: 400,
        });
      }
    }

    if (role === 'superadmin') {
      const [rows] = await connection.query(queries.registerAdminCheck);
      if (rows.length > 0) {
        throw new AppError({
          code: 'AUTH_SUPERADMIN_EXISTS',
          messageKey: 'Superadmin account already exists.',
          httpStatus: 400,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(reg_password, 10);
    const userId = uuidv4();

    const [result] = await connection.query(queries.register, {
      id: userId,
      role,
      name: reg_username,
      password: hashedPassword,
      email: reg_email,
      acceptCookies: cookies ? cookies : 0,
    });

    if (result.affectedRows === 1) {
      await connection.query(queries.houseUsers, {
        id: uuidv4(),
        userId,
        userName: reg_username,
        houseId: 0,
        role,
      });
    }

    return {
      messageKey: 'User successfully registered. Now you can sign in.',
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Register error: ${error}`);
    throw new AppError({
      code: 'AUTH_REGISTER_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Nowy plik — `backend/services/auth/loginUser.js`

```js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import queries from '../../database/authQueries.js';
import { loginValidations } from '../../utils/validation.js';
import { AppError } from '../../utils/errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function loginUser({ email, password }) {
  const validations = loginValidations(email, password);
  for (const validation of validations) {
    if (!validation.isValid) {
      logger.error(validation.message);
      throw new AppError({
        code: 'AUTH_LOGIN_VALIDATION',
        messageKey: validation.message,
        httpStatus: 400,
      });
    }
  }

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(queries.login, [email]);
    if (rows.length === 0) {
      logger.error('Incorrect e-mail address.');
      throw new AppError({
        code: 'AUTH_LOGIN_BAD_EMAIL',
        messageKey: 'Incorrect user data.',
        httpStatus: 401,
      });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.error('incorrect password.');
      throw new AppError({
        code: 'AUTH_LOGIN_BAD_PASSWORD',
        messageKey: 'Incorrect login data.',
        httpStatus: 401,
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, userName: user.name },
      JWT_SECRET,
      { expiresIn: '24h' },
    );

    logger.info(`User ${user.name} logged in correctly.`);

    return {
      messageKey: 'User logged in correctly.',
      token,
      userName: user.name,
      role: user.role,
      id: user.id,
      cookies: user.acceptCookies,
      tour: user.completeTour,
      avatar: user.avatarName,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Log in error: ${error.message}`);
    throw new AppError({
      code: 'AUTH_LOGIN_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Nowy plik — `backend/services/auth/logoutUser.js`

```js
import pool from '../../database/db.js';
import socketQueries from '../../database/websocketQueries.js';

export async function logoutUser(userId) {
  await pool.query(socketQueries.deleteConnection, [userId]);
  return { messageKey: 'Logged out correctly.' };
}
```

##### Refaktor — `backend/controllers/authController.js` (cały plik → cienki)

**Zamień całość na:**

```js
import jwtCookieOptions from '../configs/jwtCookieOptions.js';
import { runController } from '../utils/http/runController.js';
import { registerUser } from '../services/auth/registerUser.js';
import { loginUser } from '../services/auth/loginUser.js';
import { logoutUser } from '../services/auth/logoutUser.js';

export async function registerUserHandler(req, res) {
  return runController(res, () => registerUser(req.body));
}

export async function loginUserHandler(req, res) {
  try {
    const result = await loginUser(req.body);
    const { token, messageKey, ...publicData } = result;
    res.cookie('SESSID', token, {
      ...jwtCookieOptions,
      maxAge: 86400000,
    });
    return res.status(200).json({
      status: 'success',
      message: messageKey,
      ...publicData,
    });
  } catch (error) {
    return runController(res, async () => {
      throw error;
    });
  }
}

export async function logoutUserHandler(req, res) {
  return runController(res, async () => {
    const result = await logoutUser(req.userId);
    res.clearCookie('SESSID', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return result;
  });
}
```

Zaktualizuj `authRoutes.js`: handlery → `registerUserHandler`, `loginUserHandler`, `logoutUserHandler` (albo nazwy eksportów zgodne z dotychczasowymi importami — wtedy eksportuj aliasy `registerUser` = handler). Preferowane aliasy dla minimalnego diffu routes:

```js
export {
  registerUserHandler as registerUser,
  loginUserHandler as loginUser,
  logoutUserHandler as logoutUser,
};
```

---

#### 3.C — Board (`services/board/`)

##### Nowy plik — `backend/services/board/getBoardData.js`

```js
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import dashboardQueries from '../../database/dashboardQueries.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { countTotalPages } from '../../utils/dbUtils/countTotalPages.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function getBoardData(userId, filter = 'all', page = 1, limit = 10) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const userHouse = await checkUserHouse(connection, userId);
    if (!userHouse) {
      logger.error(`No user's ${userId} household.`);
      throw new AppError({
        code: 'BOARD_NO_HOUSE',
        messageKey: `No user's household.`,
        httpStatus: 404,
      });
    }

    const userHouseId = userHouse.houseId;
    const boardData = {};
    const offset = (page - 1) * limit;

    if (filter === 'all' || filter === 'house') {
      const [householdData] = await connection.query(dashboardQueries.householdData, [
        userHouseId,
      ]);
      if (!householdData) {
        throw new AppError({
          code: 'BOARD_NO_HOUSE_INFO',
          messageKey: 'No household information.',
          httpStatus: 404,
        });
      }
      boardData.houseData = householdData;
    }

    if (filter === 'all' || filter === 'mates') {
      const [matesData] = await connection.query(dashboardQueries.matesData, [userHouseId]);
      boardData.houseMates = matesData;
    }

    if (filter === 'transactions') {
      const [transactionsData] = await connection.query(dashboardQueries.transactionsData, [
        userHouseId,
        limit,
        offset,
      ]);
      boardData.actionsData = transactionsData;
      const totalPages = await countTotalPages(filter, userHouseId);
      boardData.totalPages = totalPages ? totalPages.pages : 0;
    }

    if (filter === 'all' || filter === 'daily') {
      const [dailyData] = await connection.query(dashboardQueries.dailyData, [userHouseId]);
      boardData.dailyData = dailyData;
    }

    if (filter === 'all' || filter === 'categories') {
      const [actionsCatData] = await connection.query(dashboardQueries.actionCatData);
      boardData.actionCatData = actionsCatData;
    }

    if (filter === 'messages') {
      const [messagesData] = await connection.query(dashboardQueries.messagesData, [
        userId,
        userId,
        limit,
        offset,
      ]);
      boardData.messagesData = messagesData;
      const totalPages = await countTotalPages(filter, userHouseId, userId);
      boardData.totalPages = totalPages ? totalPages.pages : 0;
    }

    if (filter === 'all' || filter === 'stats') {
      const [statsData] = await connection.query(dashboardQueries.statsQuery, [userHouseId]);
      boardData.statsData = statsData;
    }

    await connection.commit();
    boardData.page = page;

    return {
      messageKey: 'Dashboard data fetched correctly.',
      dashboardData: boardData,
    };
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    logger.error(`getBoardData error: ${error.message}`);
    throw new AppError({
      code: 'BOARD_INTERNAL',
      messageKey: error.message || 'Internal server error.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Refaktor — `backend/controllers/boardController.js`

**Zamień całość na:**

```js
import { runController } from '../utils/http/runController.js';
import { getBoardData } from '../services/board/getBoardData.js';

export async function getBoardDataHandler(req, res) {
  const userId = req.userId;
  const filter = req.params.filter;
  const page = req.params.page;
  return runController(res, () => getBoardData(userId, filter, page));
}
```

##### Refaktor — `backend/routes/dashboardRoutes.js` (handler)

**Teraz:** inline `switch (response.status)` wołający `getBoardData` z controllera-jako-service.

**Zamień fragment route na:**

```js
import { getBoardDataHandler } from '../controllers/boardController.js';
// …
router.get('/data/:filter?/:page?', verifyJWT, verifyRole('mates'), getBoardDataHandler);
```

(Usuń lokalny `switch` i bezpośrednie mapowanie statusów.)

---

#### 3.D — Invitations (`services/invitations/`)

##### Nowy plik — `backend/services/invitations/acceptInvitation.js`

```js
import { v4 as uuidv4 } from 'uuid';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import usersQueries from '../../database/usersQueries.js';
import invitationQueries from '../../database/invitationsQueries.js';
import { saveNewHousemate } from '../../utils/householdUtils/saveNewHousemate.js';
import { emitNotification } from '../notifications/emitNotification.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function acceptInvitation({ invitationId, invitedUserId, hostId }) {
  const connection = await pool.getConnection();
  try {
    const hostHouseId = await checkUserHouse(connection, hostId);
    if (!hostHouseId || !hostHouseId.houseId) {
      throw new AppError({
        code: 'INVITE_HOST_NO_HOUSE',
        messageKey: `You don't belong to any household`,
        httpStatus: 400,
      });
    }

    const houseId = hostHouseId.houseId;
    const saveMate = await saveNewHousemate(usersQueries, invitedUserId, houseId, connection);
    if (saveMate.status === 'error') {
      throw new AppError({
        code: 'INVITE_SAVE_MATE_FAILED',
        messageKey: 'Failed to accept invitation. Failed to save new housemate.',
        httpStatus: 500,
      });
    }

    const [confirmInvitation] = await connection.query(invitationQueries.acceptQuery, [
      invitationStatus.accepted,
      invitationId,
      hostId,
    ]);
    if (confirmInvitation.affectedRows === 0) {
      throw new AppError({
        code: 'INVITE_ACCEPT_FAILED',
        messageKey: 'Failed to accept invitation.',
        httpStatus: 500,
      });
    }

    await emitNotification({
      id: uuidv4(),
      category: 'usersActions',
      houseId,
      message: 'notifications.addedHouseMate',
    });

    return {
      messageKey: `Invitation of user ${invitedUserId} correctly accepted.`,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`acceptInvitation error: ${error}`);
    throw new AppError({
      code: 'INVITE_ACCEPT_INTERNAL',
      messageKey: 'Internal server error.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Nowy plik — `backend/services/invitations/rejectInvitation.js`

```js
import { v4 as uuidv4 } from 'uuid';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import invitationQueries from '../../database/invitationsQueries.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { emitNotification } from '../notifications/emitNotification.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function rejectInvitation({ invitationId, hostId }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(invitationQueries.getInvitationQuery, [invitationId]);
    const invitationData = rows[0];

    if (!invitationData || invitationData.status !== 'new') {
      await connection.rollback();
      throw new AppError({
        code: 'INVITE_NOT_FOUND',
        messageKey: 'Invitation not found',
        httpStatus: 404,
      });
    }

    const [rejectResult] = await connection.query(invitationQueries.rejectQuery, [
      invitationStatus.rejected,
      invitationId,
    ]);
    if (rejectResult.affectedRows == 0) {
      await connection.rollback();
      throw new AppError({
        code: 'INVITE_REJECT_NOT_FOUND',
        messageKey: 'Invitation not found',
        httpStatus: 404,
      });
    }

    await emitNotification({
      id: uuidv4(),
      category: 'usersActions',
      houseId: invitationData.houseId,
      message: 'Rejected invitation of new user',
      extraData: { invitedUserId: invitationData.invitedUserId },
    });

    await connection.commit();
    return { messageKey: 'Invitation successfully rejected.' };
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    logger.error(`error in rejectInvitation: ${error}`);
    throw new AppError({
      code: 'INVITE_REJECT_INTERNAL',
      messageKey: 'Internal server error',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Nowy plik — `backend/services/invitations/getInvitationsCollection.js`

```js
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import invitationQueries from '../../database/invitationsQueries.js';
import { invitationStatus } from '../../utils/invitationStatus.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function getInvitationsCollection() {
  const connection = await pool.getConnection();
  try {
    const [invitations] = await connection.query(
      invitationQueries.invitationsCollectionQuery,
      [invitationStatus.new],
    );
    return { messageKey: 'Invitations fetched correctly.', invitations };
  } catch (error) {
    logger.error(`getInvitationsCollection error: ${error}`);
    throw new AppError({
      code: 'INVITE_COLLECTION_INTERNAL',
      messageKey: 'Internal server error',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Refaktor — `controllers/invitationController.js` → cienki `runController` + powyższe services (analogicznie do board/auth). Usuń SQL z controllera.

---

#### 3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`

##### Nowy plik — `backend/services/notifications/saveNotification.js`

```js
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function saveNotification(id, category, noticeData, houseId) {
  if (!category || !noticeData || !houseId) {
    throw new AppError({
      code: 'NOTICE_INVALID_INPUT',
      messageKey: 'Invalid input data.',
      httpStatus: 400,
    });
  }

  const connection = await pool.getConnection();
  try {
    const [addNotice] = await connection.query(
      `INSERT INTO notifications (id, category, noticeData, houseId) VALUES (?, ?, ?, ?)`,
      [id, category, noticeData, houseId],
    );
    if (addNotice.affectedRows === 0) {
      throw new AppError({
        code: 'NOTICE_SAVE_FAILED',
        messageKey: 'Failed to add notification.',
        httpStatus: 500,
      });
    }
    return { messageKey: 'Notification saved correctly.' };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`saveNotification error: ${error}`);
    throw new AppError({
      code: 'NOTICE_SAVE_INTERNAL',
      messageKey: 'Failed to save notification.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Nowy plik — `backend/services/notifications/getNoticesCollection.js`

```js
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function getNoticesCollection(userId) {
  if (!userId) {
    throw new AppError({
      code: 'NOTICE_BAD_USER',
      messageKey: 'Incorrect input data.',
      httpStatus: 400,
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const checkHouse = await checkUserHouse(connection, userId);
    if (!checkHouse) {
      logger.error(`User ${userId} does not belong to any household.`);
      await connection.rollback();
      throw new AppError({
        code: 'NOTICE_NO_HOUSE',
        messageKey: 'User does not belong to any household.',
        httpStatus: 403,
      });
    }

    const houseId = checkHouse.houseId;
    const [notifications] = await connection.query(
      `SELECT id, category, noticeData FROM notifications WHERE houseId=?`,
      [houseId],
    );

    if (notifications.length === 0) {
      await connection.commit();
      throw new AppError({
        code: 'NOTICE_NOT_FOUND',
        messageKey: 'Notifications not found.',
        httpStatus: 404,
      });
    }

    await connection.commit();
    return {
      messageKey: 'Notifications fetched correctly.',
      notifications,
    };
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    logger.error(`ERROR in getNoticesCollection: ${error}`);
    throw new AppError({
      code: 'NOTICE_COLLECTION_INTERNAL',
      messageKey: 'Failed to fetch notifications.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Nowy plik — `backend/services/notifications/deleteNotification.js`

```js
import pool from '../../database/db.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { checkNotice } from '../../utils/checkUtils/checkNotice.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function deleteNotification({ noticeId, userId }) {
  if (!noticeId) {
    throw new AppError({
      code: 'NOTICE_DELETE_BAD_INPUT',
      messageKey: 'Invalid input data.',
      httpStatus: 400,
    });
  }

  const connection = await pool.getConnection();
  const noticeExist = await checkNotice(noticeId, connection);
  if (!noticeExist) {
    connection.release();
    throw new AppError({
      code: 'NOTICE_DELETE_NOT_FOUND',
      messageKey: 'Notification not found.',
      httpStatus: 404,
    });
  }

  try {
    await connection.beginTransaction();
    const checkHouse = await checkUserHouse(connection, userId);
    if (!checkHouse) {
      throw new AppError({
        code: 'NOTICE_DELETE_NO_HOUSE',
        messageKey: 'User does not belong to any household',
        httpStatus: 403,
      });
    }

    const [deleteNotice] = await connection.query(
      'DELETE FROM notifications WHERE id=? AND houseId=?',
      [noticeId, checkHouse.houseId],
    );
    if (deleteNotice.affectedRows == 0) {
      throw new AppError({
        code: 'NOTICE_DELETE_FAILED',
        messageKey: 'Failed to delete notification',
        httpStatus: 404,
      });
    }

    await connection.commit();
    return { messageKey: 'Notification removed correctly' };
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError({
      code: 'NOTICE_DELETE_INTERNAL',
      messageKey: 'Failed to delete notification.',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Nowy plik — `backend/services/notifications/emitNotification.js`

Zastępuje orkiestrację z `utils/handleNotification.js` (controller → service naruszało warstwy).

```js
import { saveNotification } from './saveNotification.js';
import { broadcastToHouseMates } from '../../configs/websocketConfig.js';

export async function emitNotification({ id, category, houseId, message, extraData = {} }) {
  const data = { id, category, message, ...extraData };
  await saveNotification(id, category, JSON.stringify(data), houseId);
  await broadcastToHouseMates(houseId, { type: 'notification', data });
}
```

##### Refaktor — `utils/handleNotification.js`

**Teraz:** import `saveNotification` z `controllers/notificationController`.

**Zamień na re-export / cienki delegat (albo usuń plik i popraw call site’y):**

```js
export { emitNotification as handleNotification } from '../services/notifications/emitNotification.js';
```

Wszystkie dotychczasowe `handleNotification(...)` działają; docelowo call site’y mogą importować `emitNotification` wprost z service (preferowane przy ruszanym pliku).

##### Refaktor — `controllers/notificationController.js` → tylko HTTP (`getNoticesCollection`, `deleteNotification` przez `runController`). **Usuń** eksport `saveNotification` z controllera.

---

#### 3.F — Budget (`services/budget/`)

##### Nowy plik — `backend/services/budget/addNewMonthlyBudget.js`

Przenieś logikę 1:1 z `initMonthlyBudgetController.js` (transakcja, `addNewBudget`, `clearExtraValues`, `handleBroadcastInitBudget`), zamieniając `return res.status…` na `throw new AppError` / `return { messageKey, httpStatus: 201 }`.

```js
import { v4 as uuidv4 } from 'uuid';
import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import {
  addNewBudget,
  clearExtraValues,
} from '../../utils/householdUtils/initMonthlyBudgetFunctions.js';
import { handleBroadcastInitBudget } from '../../utils/handleBroadcastInitBudget.js';
import initialBudgetQueries from '../../database/initialMonthlyBudgetQueries.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function addNewMonthlyBudget({ userId, value }) {
  const id = uuidv4();
  if (!value) {
    throw new AppError({
      code: 'BUDGET_INPUT',
      messageKey: 'declareBudget.inputError',
      httpStatus: 400,
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const checkHouse = await checkUserHouse(connection, userId);
    if (!checkHouse) {
      logger.error(`User ${userId} does not belong to any household.`);
      throw new AppError({
        code: 'BUDGET_NO_HOUSE',
        messageKey: 'declareBudget.userError',
        httpStatus: 400,
      });
    }

    const userHouse = checkHouse.houseId;
    const [checkBudgetDate] = await connection.query(initialBudgetQueries.getAddedAt, [
      userHouse,
    ]);

    if (checkBudgetDate.length && checkBudgetDate[0].addedAt) {
      const lastAddedAt = new Date(checkBudgetDate[0].addedAt);
      const currentDate = new Date();
      const diffDays = Math.ceil(Math.abs(currentDate - lastAddedAt) / (1000 * 60 * 60 * 24));

      if (diffDays <= 7 || diffDays >= 30) {
        const { addedAtFormatted, validUntilFormatted, valueToDb } = await addNewBudget(
          connection,
          value,
          userHouse,
        );
        await connection.query('UPDATE households SET initBudget = ? WHERE houseId =?', [
          valueToDb,
          userHouse,
        ]);
        if (diffDays <= 7) {
          await clearExtraValues(connection, userHouse, lastAddedAt);
          logger.info(`Deleted extra values for household: ${userHouse}`);
        }
        logger.info(
          `Monthly budget of household ${userHouse} added on ${new Date().toLocaleString()}`,
        );
        await connection.commit();
        await handleBroadcastInitBudget(
          id,
          valueToDb,
          addedAtFormatted,
          validUntilFormatted,
          userHouse,
        );
        return {
          httpStatus: 201,
          messageKey: 'declareBudget.declaredCorrectlyMessage',
        };
      }

      throw new AppError({
        code: 'BUDGET_CONDITION',
        messageKey: 'declareBudget.conditionError',
        httpStatus: 400,
      });
    }

    if (checkBudgetDate.length && !checkBudgetDate[0].addedAt) {
      const { addedAtFormatted, validUntilFormatted, valueToDb } = await addNewBudget(
        connection,
        value,
        userHouse,
      );
      await connection.query('UPDATE households SET initBudget = ? WHERE houseId =?', [
        valueToDb,
        userHouse,
      ]);
      logger.info(
        `Monthly budget of household ${userHouse} added on ${new Date().toLocaleString()}`,
      );
      await connection.commit();
      await handleBroadcastInitBudget(
        id,
        valueToDb,
        addedAtFormatted,
        validUntilFormatted,
        userHouse,
      );
      return {
        httpStatus: 201,
        messageKey: 'declareBudget.declaredCorrectlyMessage',
      };
    }

    throw new AppError({
      code: 'BUDGET_UNEXPECTED',
      messageKey: 'declareBudget.declareInternalError',
      httpStatus: 500,
    });
  } catch (error) {
    await connection.rollback();
    if (error instanceof AppError) throw error;
    logger.error(`An error occured during declaring new monthly budget: ${error.message}`);
    throw new AppError({
      code: 'BUDGET_INTERNAL',
      messageKey: 'declareBudget.declareInternalError',
      httpStatus: 500,
    });
  } finally {
    connection.release();
  }
}
```

##### Refaktor — `initMonthlyBudgetController.js` → cienki `runController(() => addNewMonthlyBudget({ userId: req.userId, value: req.body.value }))`.

---

#### 3.G — Receipt (`services/receipt/` + cienki controller)

##### Nowy plik — `backend/services/receipt/extractReceiptTotal.js`

```js
import { extractPhotoData } from '../../configs/tesseract.js';
import { AppError } from '../../utils/errors/AppError.js';
import logger from '../../configs/logger.js';

export async function extractReceiptTotal(fileBuffer) {
  if (!fileBuffer) {
    throw new AppError({
      code: 'RECEIPT_NO_FILE',
      messageKey: 'Upload correct file.',
      httpStatus: 400,
    });
  }

  try {
    const totalAmount = await extractPhotoData(fileBuffer);
    if (!totalAmount) {
      throw new AppError({
        code: 'RECEIPT_OCR_INVALID',
        messageKey: 'addTransaction.invalidRecognizeInput',
        httpStatus: 400,
      });
    }
    return { messageKey: 'Receipt recognized.', value: totalAmount };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Image processing error: ${error}`);
    throw new AppError({
      code: 'RECEIPT_OCR_INTERNAL',
      messageKey: 'addTransaction.recognizeInternalError',
      httpStatus: 500,
    });
  }
}
```

##### Nowy plik — `backend/controllers/receiptController.js`

```js
import { runController } from '../utils/http/runController.js';
import { extractReceiptTotal } from '../services/receipt/extractReceiptTotal.js';

export async function extractReceipt(req, res) {
  return runController(res, async () => {
    const result = await extractReceiptTotal(req.file?.buffer);
    if (req.file) req.file.buffer = null;
    return result;
  });
}
```

##### Refaktor — `routes/receiptRoutes.js`

**Teraz:** logika OCR w route.

**Zamień handler na:**

```js
import { extractReceipt } from '../controllers/receiptController.js';
import { uploadReceipt } from '../store/receiptStorage.js';

router.post('/', uploadReceipt.single('receipt'), extractReceipt);
```

(Swagger w pliku routes zostaje.)

---

#### 3.H — Shell (reviews, gallery) + rename’owane obszary już mające services

| Obszar | Działanie |
|--------|-----------|
| `shell/homepage`, `shell/cookiesTour` | Już przeniesione w KROK 2; controllery przerobić na `runController` + AppError w services (zastąpić `switch(response.status)`). |
| `shell/reviews`, `shell/gallery` | Wyciągnąć logikę z `reviewsController` / `galleryController` do `services/shell/reviews/*` i `services/shell/gallery/*` (ten sam wzorzec co receipt/auth). |
| `household`, `transactions`, `categories`, `messages`, `users` (+ avatars) | Po rename: usunąć SQL/`pool` z controllerów jeśli jeszcze jest; services rzucają `AppError`; controllery tylko `runController`. |
| Avatars | Logika FS zostaje w service `services/users/` (lub `services/users/avatar*`); multer zostaje w route/`store`. |

Dla każdego istniejącego service zwracającego `{ status: 'badreq'|'error'|'success', message }`:

**Teraz (wzorzec):**

```js
if (!name) {
  return { status: 'badreq', message: '…' };
}
```

**Zamień na:**

```js
if (!name) {
  throw new AppError({ code: '…', messageKey: '…', httpStatus: 400 });
}
```

Controller traci `switch` — zostaje `runController`.

---

**DoD (krok):**

- Brak sierot: auth, invitations, budget, board, notifications, receipt, shell mają services; controllery bez SQL i bez reguł domenowych.
- Żaden service nie importuje `express` / nie woła `res.json`.
- `saveNotification` nie żyje w controllerze; emisja notyfikacji idzie przez `services/notifications`.
- `database/` nadal może być pool/`*Queries` (bez Prisma).

### KROK 4 — Audyt granic warstw + scoped testy mapy / B-10 / pipeline

**Status:** `WYKONANY`

**Cel:** Potwierdzenie Bloku B (układ katalogów, granice importów) oraz zielone scoped testy Fazy 2 (major 2.3–2.4 + T-15).

**Artefakty:**

- Nowy: `backend/tests/unit/appError-runController.test.js`
- Nowy: `backend/tests/unit/services-layout.test.js`
- Nowy: `backend/tests/unit/board-getBoardData.test.js` (mock pool / AppError ścieżka bez house)
- Checklist audytu (w DoD; bez osobnego docs)

#### Audyt importów (wykonać przy implementacji; fail = poprawka w tym kroku)

| Zakaz | Gdzie sprawdzić |
|-------|-----------------|
| `pool` / `*Queries` / raw SQL w `controllers/`, `routes/` (poza ewentualnym brakiem), `middlewares/` | rg |
| `res.` / `express` w `services/` | rg |
| Logika `/board` poza `services/board/` | rg |
| Otoczka homepage/reviews/gallery/cookiesTour poza `services/shell/` | drzewo |
| Import controllera z `utils/` lub `services/` (poza re-exportem przejściowym) | rg `controllers/` w services/utils |

Prisma / `prisma/` — **nie** wymagać w tym wycinku.

#### Nowy plik — `backend/tests/unit/appError-runController.test.js`

```js
import { describe, expect, test, jest } from '@jest/globals';
import { AppError } from '../../utils/errors/AppError.js';
import { runController } from '../../utils/http/runController.js';

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('B-10 AppError + runController', () => {
  test('AppError carries code, messageKey, httpStatus', () => {
    const err = new AppError({
      code: 'X',
      messageKey: 'errors.x',
      httpStatus: 400,
    });
    expect(err.code).toBe('X');
    expect(err.messageKey).toBe('errors.x');
    expect(err.httpStatus).toBe(400);
  });

  test('runController maps AppError to error envelope', async () => {
    const res = mockRes();
    await runController(res, async () => {
      throw new AppError({
        code: 'Y',
        messageKey: 'errors.y',
        httpStatus: 404,
      });
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'errors.y',
    });
  });

  test('runController maps success messageKey', async () => {
    const res = mockRes();
    await runController(res, async () => ({ messageKey: 'ok', value: 1 }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'ok',
      value: 1,
    });
  });
});
```

#### Nowy plik — `backend/tests/unit/services-layout.test.js`

```js
import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const servicesRoot = path.join(__dirname, '../../services');

describe('Blok B services map', () => {
  test('required area folders exist', () => {
    const required = [
      'auth',
      'household',
      'invitations',
      'transactions',
      'categories',
      'budget',
      'board',
      'messages',
      'notifications',
      'users',
      'receipt',
      'shell',
    ];
    for (const name of required) {
      expect(fs.existsSync(path.join(servicesRoot, name))).toBe(true);
    }
    expect(fs.existsSync(path.join(servicesRoot, 'shell', 'homepage'))).toBe(true);
    expect(fs.existsSync(path.join(servicesRoot, 'board'))).toBe(true);
  });
});
```

#### Nowy plik — `backend/tests/unit/board-getBoardData.test.js`

```js
import { describe, expect, test, jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
  default: async () => null,
}));

jest.unstable_mockModule('../../database/db.js', () => ({
  default: {
    getConnection: async () => ({
      beginTransaction: async () => {},
      rollback: async () => {},
      release: () => {},
      query: async () => [[]],
    }),
  },
}));

const { getBoardData } = await import('../../services/board/getBoardData.js');
const { AppError } = await import('../../utils/errors/AppError.js');

describe('getBoardData service', () => {
  test('throws AppError 404 when user has no household', async () => {
    await expect(getBoardData('user-1')).rejects.toMatchObject({
      httpStatus: 404,
      messageKey: `No user's household.`,
    });
    await expect(getBoardData('user-1')).rejects.toBeInstanceOf(AppError);
  });
});
```

(Jeśli podwójne wywołanie z `rejects` jest problematyczne przy stanie mocka — zostaw jedno `expect`.)

**DoD (krok):**

- Audyt granic bez naruszeń z tabeli.
- `npm test` zielone (foundation + unit B-10 + layout + board).
- Faza 2 spełnia DoD major (mapa Blok B w zakresie bez Prisma; R2/B-10 na refaktorowanych ścieżkach).

#### Propozycja commit message

```text
refactor(backend): align services map with Block B and thin R2 controllers

Introduce AppError mapping, move orphan domain logic into area services
including board and shell, and keep database access on legacy queries.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| ESM + upgrade | `"type":"module"`, start procesu, brak CJS w app code |
| Logger bez daily-rotate | brak paczki; Console transport |
| Blok B | drzewo `services/<obszar>` + `shell/` + `board/` |
| R2 | controllers bez SQL; services bez `res` |
| B-10 | błędy przez `AppError`; HTTP `status:"error"`, `message` = messageKey |
| Bez Prisma | brak wymogu `prisma/` w tym wycinku |
| T-15 | `npm test` zielone scoped Fazy 1 i 2 |
| Zgodność SPEC | B-1–B-4, B-10, B-18–B-19; nie B-6 (Prisma) |

---

## Ślad do major (tylko informacyjnie — ten plan **nie** edytuje major)

Po **późniejszej** implementacji (poza tą sesją), prowadzący może oznaczyć:

| Element major | Oczekiwany status po implementacji |
|---------------|-------------------------------------|
| Faza 1 | `WYKONANY` |
| MILESTONE — Backend na zaktualizowanych zależnościach | `OSIĄGNIĘTY` |
| Faza 2 | `WYKONANY` |
| MILESTONE — Struktura Blok B + pipeline R2 | `OSIĄGNIĘTY` |

Kroki major 1.1–1.3 i 2.1–2.4 → `WYKONANY` wraz z fazami. Edycja major = poza tym skillem / opcjonalnie przy ręcznym `/feature-implementation`.
