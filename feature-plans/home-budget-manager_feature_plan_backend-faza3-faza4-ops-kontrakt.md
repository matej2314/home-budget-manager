# Home Budget Manager — feature plan: backend Faza 3 + Faza 4 (ops + kontrakt)

**Kotwica major:** `home-budget-manager_major_plan-backend.md` — Faza 3 (kroki 3.1–3.3), MILESTONE „Fundament observability i bezpieczeństwa HTTP”, Faza 4 (kroki 4.1–4.3), MILESTONE „Kontrakt API v1 (z dual mount legacy)”.  
**Źródła:** `docs/` (`observability.md`, `bezpieczenstwo.md`, `dokumentacja_komunikacji.md`, `katalog_env.md`, `i18n_kontrakt_ui.md`, `testy.md`), `spec/SPEC-BACKEND.md` (B-10–B-11, B-14–B-16), `spec/SPEC-BEZPIECZENSTWO.md` (S-10–S-14, S-18), `spec/SPEC-KOMUNIKACJA.md` (K-1–K-2, K-8–K-9), `spec/SPEC-TESTY.md` (T-6, T-15), kod `backend/`.  
**Poza zakresem wycinka:** Faza 5+ (R1 `inmate` / pełne przepisanie `verifyRole`, rename `broadcastToHousehold`, adaptery cron/WS poza handshake auth, Prisma, e-mail K-14), frontend / cutover SPA, **usunięcie** montażu legacy, CI/Jenkins YAML.

**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

**Pass rozwojowy (zatwierdzony):** w FAZIE 1 kolejność HOW ≠ numeracja major 3.1→3.3 — **helmet/CORS przed health**, żeby scoped test health asertował nagłówki. FAZA 2: brak przesunięć vs major 4.1→4.3. Health **nie** wchodzi w dual mount legacy.

**Decyzje HOW (sesja):**

| Temat | Decyzja |
|-------|---------|
| Logger | Audyt: Winston Console zostaje; start/stop procesu przez `logger` (bez `console.log` na happy-path startu); zero file transport |
| Helmet | `app.use(helmet())` domyślne (Context7 `/helmetjs/helmet` v8 — first middleware); usunąć martwy import z `swaggerConfig.js` |
| Origins | Jeden moduł `configs/allowedOrigins.js` — Express CORS + Socket.io CORS; lista = unia as-is z `server.js` i `websocketConfig.js` |
| Health | Wyłącznie `GET /api/v1/health` → `{ status: "ok" }`; bez auth; bez dual mount legacy |
| App factory | Wydzielić `app.js` (middleware + routes, bez `listen` / cron / WS), `server.js` tylko bootstrap — pod Supertest |
| Dual mount | Ta sama tablica routerów: `app.use(path)` + `app.use('/api/v1' + path)`; nowe ścieżki tylko pod v1 |
| Envelope F4 | Domknąć kształt `status`+`message` na brzegu (`/auth/verify`, `verifyJWT`); **nie** przepisywać polskich komunikatów `verifyRole` (Faza 5) |
| OCR | `verifyJWT` **przed** multer na `POST /receipt` |
| WS | Handshake już czyta `SESSID`; scoped = unit `authMiddleware` (brak cookie / zły token → `next(Error)`); bez pełnego Socket.io E2E |

---

## Meta

| Pole | Wartość |
|------|---------|
| Plik | `feature-plans/home-budget-manager_feature_plan_backend-faza3-faza4-ops-kontrakt.md` |
| Nazwa projektu | `home-budget-manager` |
| Runtime | Node ≥ 22 / Docker `node:22.12-slim` |
| Model modułów | ESM |
| Biblioteki (Context7 / wersje z `backend/package.json`) | `helmet` ^8.1 (docs v8.3: `app.use(helmet())`), `cors` ^2.8, Express ^4.21, Winston Console, Jest + Supertest |

---

## Założenia

- Stack / zakazy: SPEC-BACKEND, SPEC-BEZPIECZENSTWO, SPEC-KOMUNIKACJA — bez Nest, bez OTel/Sentry, bez głębokiego health DB.
- Envelope sukcesu/błędu już mapuje `runController` (Faza 2); ten wycinek domyka **brzeg** (middleware, verify, health wyjątek body).
- Health (B-16) **nie** używa envelope i18n `{ status: "success", message }` — body liveness `{ status: "ok" }`.
- Usunięcie legacy HTTP = poza tym major (po cutoverze FE).
- T-15: scoped testy powierzchni Fazy 3 i 4; nie cały T-5.

---

## FAZA 1 — Fundament operacyjny (major Faza 3)

**Kotwica major:** Faza 3 (3.1–3.3) + przygotowanie do MILESTONE „Fundament observability i bezpieczeństwa HTTP”.  
**SPEC / docs:** B-14–B-16, S-10–S-11, S-18; `docs/observability.md`, `docs/bezpieczenstwo.md`.

### KROK 1 — Logger stdout: audyt B-14/B-15

**Status:** `WYKONANY`

**Cel:** Potwierdzić Winston → Console jako jedyny transport aplikacji; start/stop procesu logowane przez logger (major 3.1).

**Artefakty:** `backend/configs/logger.js` (bez zmiany kontraktu API, o ile już Console), `backend/server.js` (refaktor logów bootstrap).

**Implementacja:**

1. `logger.js` — **zostaje** (stan po Fazie 1 już spełnia B-14):

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

2. Refaktor `server.js` — start/stop przez `logger` (fragment; pełne scalenie z KROK 2–3 w kolejnych krokach / finalnym `server.js` poniżej w KROK 3):

**teraz** (fragment):

```js
server.listen(port, () => {
  logger.info(`BACKEND SERVER RUNNING. PORT ${port}`);
  console.log(`SERVER RUNNING ON PORT ${port}`);
  // ...
});
// ...
console.log('Zatrzymywanie serwera...');
// ...
console.log('Serwer został zatrzymany');
```

**zamień na:**

```js
server.listen(port, () => {
  logger.info(`BACKEND SERVER RUNNING. PORT ${port}`);
  // ...
});
// ...
logger.info('Stopping server...');
// ...
logger.info('Server stopped');
```

Analogicznie w handlerach `SIGINT` / `SIGTERM` oraz w `catch` startu — bez duplikatu `console.log` na tych ścieżkach. Zakaz: przywracanie file transport / `winston-daily-rotate-file` / katalogu `logs/` jako normy.

**Biblioteki:** Winston Console (już w projekcie); bez nowego researchu.

**Testy:** w KROK 3 — asercja że `logger` ma wyłącznie Console (re-export smoke) **albo** rozszerzenie `tests/foundation/esm-smoke.test.js` o brak file transport (opcjonalnie, jeśli tanie). Minimum: istniejący smoke loggera zostaje zielony.

**DoD kroku:**

- Logi aplikacji idą na stdout procesu.
- Brak wymogu volume / katalogu plików logów.
- Start/stop nie spamują osobnym `console.log` obok loggera.

---

### KROK 2 — Helmet + CORS (przesunięcie rozwojowe vs major 3.3)

**Status:** `WYKONANY`

**Cel:** Montaż helmet na Express oraz spójna whitelist CORS z credentials (S-10–S-11); wspólna lista originów dla HTTP i WS (major 3.3 **przed** health).

**Artefakty:**

- **nowy:** `backend/configs/allowedOrigins.js`
- **zmiana:** `backend/server.js` / `backend/app.js` (powstaje w KROK 3 — tu treść middleware), `backend/configs/websocketConfig.js`, `backend/configs/swaggerConfig.js`

**Implementacja:**

#### Nowy plik — `backend/configs/allowedOrigins.js` (kompletny)

```js
/** Whitelist CORS (HTTP + Socket.io). Sync z docs/katalog_env.md przy zmianie domen. */
export const allowedOrigins = [
  'https://budgetapp.msliwowski.net',
  'https://budgetapi.msliwowski.net',
  'http://localhost:5173',
  'http://185.170.196.107:5052',
];
```

#### Helmet (Context7 `/helmetjs/helmet` v8)

```js
import helmet from 'helmet';

app.use(helmet()); // first security middleware — default headers (m.in. X-Content-Type-Options: nosniff)
```

#### CORS — refaktor względem as-is `server.js`

**teraz:**

```js
const allowedOrigins = ['https://budgetapp.msliwowski.net', 'http://localhost:5173', 'http://185.170.196.107:5052'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  })
);
```

**zamień na** (w fabryce app — KROK 3):

```js
import { allowedOrigins } from './configs/allowedOrigins.js';

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  })
);
```

Kolejność middleware (norma HOW): `helmet` → `cors` → `cookieParser` → body parsers → static / routes.

#### `websocketConfig.js` — CORS origin

**teraz:**

```js
const allowedOrigins = ['http://localhost:5173', 'http://185.170.196.107:5052', 'https://budgetapp.msliwowski.net', 'https://budgetapi.msliwowski.net'];
if (allowedOrigins.includes(origin)) {
```

**zamień na:**

```js
import { allowedOrigins } from './allowedOrigins.js';
// ...
origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Unauthorized URL'), false);
  }
},
```

Uwaga: as-is WS **odrzuca** brak `Origin`; po zmianie dopuszczamy `!origin` jak HTTP (smoke lokalny / narzędzia). Credentials zostają `true`.

#### `swaggerConfig.js` — usuń martwy import

**teraz:**

```js
import helmet from 'helmet';
```

**zamień na:** usunięcie linii importu (helmet montowany wyłącznie na `app`).

**Biblioteki:** Helmet v8 — `app.use(helmet())` jako first middleware (Context7). CORS — istniejąca paczka; zakaz `Access-Control-Allow-Origin: *` przy credentials (S-11).

**Testy:** w KROK 3 (health + nagłówek helmet).

**DoD kroku:**

- Odpowiedzi API noszą skutki helmet (np. `X-Content-Type-Options: nosniff`).
- CORS z credentials nie używa `*`; whitelist wspólna HTTP/WS.

---

### KROK 3 — Health liveness + fabryka `app` + scoped testy Fazy 3

**Status:** `WYKONANY`

**Cel:** Publiczny `GET /api/v1/health` (B-16, S-18) oraz możliwość testów HTTP bez `listen`/cron/WS (major 3.2 + T-15).

**Artefakty:**

- **nowy:** `backend/app.js`
- **nowy:** `backend/routes/healthRoutes.js`
- **zmiana:** `backend/routes/index.js` (tylko montaż health **poza** dual mount — health wyłącznie v1; dual mount = FAZA 2)
- **zmiana:** `backend/server.js` (bootstrap)
- **nowy:** `backend/tests/foundation/ops-health-helmet.test.js`

**Implementacja:**

#### Nowy plik — `backend/routes/healthRoutes.js` (kompletny)

```js
import { Router } from 'express';

const router = Router();

/** Liveness procesu — bez auth, bez sekretów (B-16 / S-18). */
router.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
```

#### Refaktor — `backend/routes/index.js`

**teraz:**

```js
export default function setupRoutes(app) {
  for (const { path, router } of routes) {
    app.use(path, router);
  }
}
```

**zamień na** (FAZA 1 — jeszcze **bez** dual mount v1 na legacy routerach):

```js
import healthRoutes from './healthRoutes.js';
// ...pozostałe importy bez zmian...

export default function setupRoutes(app) {
  app.use('/api/v1/health', healthRoutes);

  for (const { path, router } of routes) {
    app.use(path, router);
  }
}
```

(W FAZIE 2 pętla dostanie drugi `app.use('/api/v1' + path, router)` — health **nie** jest w tablicy `routes`.)

#### Nowy plik — `backend/app.js` (kompletny)

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { allowedOrigins } from './configs/allowedOrigins.js';
import setupRoutes from './routes/index.js';
import swaggerDocs from './configs/swaggerConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fabryka Express bez listen / cron / WS — pod server.js i Supertest.
 */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
      preflightContinue: false,
    })
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/screens', express.static(path.join(__dirname, 'app-images')));

  app.all(['/sitemap.xml', '/robots.txt'], (_req, res) => {
    return res.status(404).send('sitemap not found');
  });

  setupRoutes(app);
  swaggerDocs(app);

  return app;
}

export default createApp;
```

#### Refaktor — `backend/server.js` (kompletny docelowy po FAZIE 1)

```js
import 'dotenv/config';
import http from 'node:http';
import logger from './configs/logger.js';
import balanceHouseActions from './tasks/balanceHouseTransactions.js';
import saveDailyTransactions from './tasks/saveDailyTransactions.js';
import saveDailyBudget from './tasks/saveDailyBudget.js';
import { initializeWebSocket } from './configs/websocketConfig.js';
import { clearSocketConnections } from './utils/clearSocketConnections.js';
import { createApp } from './app.js';

const app = createApp();
const port = process.env.SERV_PORT || 5053;
const server = http.createServer(app);

try {
  server.listen(port, () => {
    logger.info(`BACKEND SERVER RUNNING. PORT ${port}`);
    initializeWebSocket(server);
    saveDailyTransactions();
    saveDailyBudget();
    balanceHouseActions();
  });
  server.setTimeout(0);

  process.on('SIGINT', async () => {
    await clearSocketConnections();
    logger.info('Stopping server...');
    server.close(() => {
      logger.info('Server stopped');
      process.exit(0);
    });
  });

  process.on('SIGTERM', async () => {
    await clearSocketConnections();
    logger.info('Stopping server...');
    server.close(() => {
      logger.info('Server stopped');
      process.exit(0);
    });
  });
} catch (error) {
  logger.error(`Failed to run API server : ${error}`);
}
```

#### Nowy plik — `backend/tests/foundation/ops-health-helmet.test.js` (kompletny)

```js
import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../app.js';

describe('Faza 3 — health + helmet', () => {
  const app = createApp();

  test('GET /api/v1/health is public liveness without secrets', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(res.body).not.toHaveProperty('JWT_SECRET');
    expect(JSON.stringify(res.body)).not.toMatch(/password|secret|token/i);
  });

  test('health response carries helmet X-Content-Type-Options', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  test('legacy /health is not required (no accidental dual mount)', async () => {
    const res = await request(app).get('/health');
    expect(res.status).not.toBe(200);
  });
});
```

**Biblioteki:** Supertest (już w devDeps); Express 4 `app.use` mount.

**DoD kroku:**

- `GET /api/v1/health` → 200, body bez sekretów, bez sesji.
- Scoped testy Fazy 3 zielone (`npm test` w `backend/` dla tego zakresu / całej komendy).
- `createApp()` nie startuje cron/WS.

---

#### Propozycja commit message

```text
feat(backend): add stdout ops foundation with health, helmet, and CORS

Expose public /api/v1/health, mount default helmet headers, and share
origin whitelist between Express and Socket.io before the v1 contract work.
```

---

## FAZA 2 — Kontrakt komunikacji (major Faza 4)

**Kotwica major:** Faza 4 (4.1–4.3) + przygotowanie do MILESTONE „Kontrakt API v1 (z dual mount legacy)”.  
**SPEC / docs:** K-1, K-2, K-8–K-9, B-10–B-11, S-12–S-14; `docs/dokumentacja_komunikacji.md`.

### KROK 1 — Prefiks `/api/v1` + dual mount legacy

**Status:** `WYKONANY`

**Cel:** Te same handlery pod `/api/v1/...` oraz legacy as-is; health pozostaje tylko v1; nowe ścieżki tylko v1 (major 4.1, K-1).

**Artefakty:** `backend/routes/index.js`

**Implementacja:**

**teraz** (po FAZIE 1):

```js
export default function setupRoutes(app) {
  app.use('/api/v1/health', healthRoutes);

  for (const { path, router } of routes) {
    app.use(path, router);
  }
}
```

**zamień na:**

```js
export default function setupRoutes(app) {
  // Wyłącznie v1 — poza dual mount legacy (B-16 / K-1).
  app.use('/api/v1/health', healthRoutes);

  for (const { path, router } of routes) {
    app.use(path, router);
    app.use(`/api/v1${path}`, router);
  }
}
```

Zakaz w tym kroku: dodawania **nowych** ścieżek tylko pod legacy; usuwania legacy.

**Testy:** w KROK 3 (smoke v1 + legacy na jednej ścieżce publicznej, np. homepage / reviews collection — bez auth).

**DoD kroku:**

- Chronione i publiczne endpointy z tablicy `routes` dostępne pod `/api/v1/...` **i** legacy.
- Health tylko `/api/v1/health`.

---

### KROK 2 — Envelope i `message` jako klucz na brzegu

**Status:** `WYKONANY`

**Cel:** Ujednolicić envelope sukces/błąd na lukach brzegu (K-2, B-11); bez migracji `verifyRole` PL (Faza 5).

**Artefakty:** `backend/middlewares/verifyJWT.js`, `backend/routes/authRoutes.js` (`GET /verify`), ewentualnie fallback w `runController` (tylko jeśli wciąż zdanie marketingowe zamiast klucza na 500).

**Implementacja:**

#### `verifyJWT.js`

**teraz:**

```js
if (!token) return res.status(statusCode.UNAUTHORIZED).json({
    status: 'error',
    message: 'Zaloguj się, aby zobaczyć zasoby.'
});
// ...
return res.status(statusCode.UNAUTHORIZED).json({
    status: 'error',
    message: 'Zaloguj się, aby zobaczyć zasoby.'
});
```

**zamień na:**

```js
const sessionRequired = {
  status: 'error',
  message: 'auth.sessionRequired',
};

if (!token) return res.status(statusCode.UNAUTHORIZED).json(sessionRequired);

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  req.userId = decoded.id;
  req.role = decoded.role;
  req.userName = decoded.userName;
  req.avatar = decoded.avatar;
  next();
} catch {
  return res.status(statusCode.UNAUTHORIZED).json(sessionRequired);
}
```

#### `authRoutes.js` — `GET /verify`

**teraz:**

```js
router.get('/verify', verifyJWT, (req, res) => {
    res.status(statusCode.OK).json({
        status: 'success',
        userId: req.userId,
        userName: req.userName,
        role: req.role,
        avatar: req.avatar
    });
});
```

**zamień na:**

```js
router.get('/verify', verifyJWT, (req, res) => {
    res.status(statusCode.OK).json({
        status: 'success',
        message: 'auth.verify.success',
        userId: req.userId,
        userName: req.userName,
        role: req.role,
        avatar: req.avatar,
    });
});
```

#### Poza zakresem tego kroku

- Polskie `message` w `verifyRole` — Faza 5 (R1).
- Przepisanie wszystkich historycznych EN-zdań w `messageKey` services na `dot.notation` — nie wymagane do DoD major 4.2, o ile envelope ma `status` + `message`.
- Health zostaje `{ status: "ok" }` bez pola `message`.

**Testy:** unit/HTTP w KROK 3 — brak cookie na chronionej ścieżce → `status: "error"`, `message: "auth.sessionRequired"`.

**DoD kroku:**

- Sukces `/auth/verify` (v1 i legacy) ma `status` + `message`.
- Odmowa JWT ma envelope z kluczem (nie polskim UI copy).

---

### KROK 3 — OCR/upload SESSID + handshake WS + scoped testy Fazy 4

**Status:** `WYKONANY`

**Cel:** OCR bez sesji → 401; uploady już chronione zostają; WS bez ważnego `SESSID` odrzucony (major 4.3, K-8–K-9, S-12–S-14) + T-15.

**Artefakty:**

- **zmiana:** `backend/routes/receiptRoutes.js`
- **audyt (bez zmiany jeśli OK):** `avatarsRoutes.js`, `galleryRoutes.js` — już `verifyJWT`
- **nowy:** `backend/tests/unit/ws-authMiddleware.test.js`
- **nowy:** `backend/tests/foundation/contract-v1-dual-mount-ocr.test.js`

**Implementacja:**

#### `receiptRoutes.js`

**teraz:**

```js
router.post('/', uploadReceipt.single('receipt'), extractReceipt);
```

**zamień na:**

```js
import verifyJWT from '../middlewares/verifyJWT.js';

router.post('/', verifyJWT, uploadReceipt.single('receipt'), extractReceipt);
```

Kolejność: **JWT przed multer** — odrzucenie bez sesji bez parsowania pliku.

#### Audyt uploadów

| Ścieżka | Oczekiwanie | Akcja |
|---------|-------------|-------|
| `POST /receipt` (+ `/api/v1/receipt`) | `verifyJWT` | dodać (powyżej) |
| `POST /avatars/save` | już `verifyJWT` | brak |
| `POST /gallery/save` | już `verifyJWT` + role | brak |

#### WS — `authMiddleware.js`

Kod as-is już wymaga cookie `SESSID` i `jwt.verify`. **Bez zmiany kontraktu**, o ile test unit przechodzi. Opcjonalny drobny polish: angielski tekst `Error` w `next` (nie envelope HTTP) — nie blokuje DoD.

#### Nowy plik — `backend/tests/unit/ws-authMiddleware.test.js` (kompletny)

```js
import { describe, expect, test, jest, beforeEach } from '@jest/globals';

describe('WS authMiddleware (K-9 / S-14)', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-for-ws-auth';
  });

  test('rejects handshake without SESSID cookie', async () => {
    const { default: authMiddleware } = await import(
      '../../middlewares/websocket/authMiddleware.js'
    );
    const socket = { request: { headers: {} } };
    const next = jest.fn();
    authMiddleware(socket, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
  });

  test('rejects handshake with invalid SESSID', async () => {
    const { default: authMiddleware } = await import(
      '../../middlewares/websocket/authMiddleware.js'
    );
    const socket = {
      request: { headers: { cookie: 'SESSID=not-a-valid-jwt' } },
    };
    const next = jest.fn();
    await new Promise((resolve) => {
      authMiddleware(socket, (...args) => {
        next(...args);
        resolve();
      });
    });
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
```

#### Nowy plik — `backend/tests/foundation/contract-v1-dual-mount-ocr.test.js` (kompletny)

```js
import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../app.js';

describe('Faza 4 — dual mount + envelope + OCR auth', () => {
  const app = createApp();

  test('public collection available on legacy and /api/v1', async () => {
    const legacy = await request(app).get('/reviews/collection');
    const v1 = await request(app).get('/api/v1/reviews/collection');
    expect(legacy.status).toBe(v1.status);
    expect(v1.body).toHaveProperty('status');
    expect(v1.body).toHaveProperty('message');
  });

  test('POST /api/v1/receipt without SESSID is 401 envelope', async () => {
    const res = await request(app).post('/api/v1/receipt');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      status: 'error',
      message: 'auth.sessionRequired',
    });
  });

  test('POST /receipt legacy without SESSID is also 401', async () => {
    const res = await request(app).post('/receipt');
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('auth.sessionRequired');
  });
});
```

Uwaga: jeśli `GET /reviews/collection` wymaga DB i pada w CI bez MySQL — zamień smoke dual mount na inną **publiczną** ścieżkę z as-is (np. `GET /homepage/dataCollection`) albo na asercję samego montażu routera przez dwa requesty 401 na tym samym chronionym path (`/api/v1/auth/verify` vs `/auth/verify` bez cookie — oba 401, ten sam envelope). **Preferowany fallback bez DB:**

```js
test('dual mount: /auth/verify and /api/v1/auth/verify without cookie', async () => {
  const legacy = await request(app).get('/auth/verify');
  const v1 = await request(app).get('/api/v1/auth/verify');
  expect(legacy.status).toBe(401);
  expect(v1.status).toBe(401);
  expect(v1.body.message).toBe('auth.sessionRequired');
  expect(legacy.body.message).toBe(v1.body.message);
});
```

Przy implementacji **użyj fallbacku bez DB** jako domyślnego smoke dual mount (ponytail / stabilne CI lokalne).

**Biblioteki:** jsonwebtoken (istniejący); Socket.io auth middleware bez nowego API.

**DoD kroku:**

- OCR/upload bez sesji → odmowa auth (401 + envelope).
- WS bez ważnego cookie → `next(Error)` (unit).
- Scoped testy Fazy 4 zielone.

---

#### Propozycja commit message

```text
feat(backend): dual-mount /api/v1 and enforce session on OCR

Keep legacy aliases for SPA cutover, require SESSID on receipt upload,
and close HTTP envelope gaps on verify and JWT denial paths.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| Logger stdout | `logger.js` = Console; brak daily-rotate / volume logs |
| Health | `GET /api/v1/health` → `{ status: "ok" }`, bez cookie; brak `/health` legacy 200 |
| Helmet | nagłówek `X-Content-Type-Options: nosniff` na health |
| CORS | wspólne `allowedOrigins`; credentials bez `*` |
| Dual mount | ta sama odpowiedź kontraktu na legacy i `/api/v1` (smoke 401 verify) |
| Envelope brzegu | `auth.verify.success` / `auth.sessionRequired` |
| OCR | `POST /api/v1/receipt` bez cookie → 401 |
| WS | unit `authMiddleware` |
| T-15 | `cd backend && npm test` zielone |
| Poza zakresem | brak usunięcia legacy; brak R1 `inmate`; brak Prisma |

**Checklist zgodności docs/SPEC:** B-14–B-16, B-10–B-11 (brzeg), S-10–S-14, S-18, K-1–K-2, K-8–K-9, T-15.

---

## Ślad do major (tylko informacyjnie — ten plan **nie** edytuje major)

Po **późniejszej** implementacji (poza tą sesją), prowadzący może oznaczyć:

| Element major | Oczekiwany status po implementacji |
|---------------|-------------------------------------|
| Faza 3 | `WYKONANY` |
| MILESTONE — Fundament observability i bezpieczeństwa HTTP | `OSIĄGNIĘTY` |
| Faza 4 | `WYKONANY` |
| MILESTONE — Kontrakt API v1 (z dual mount legacy) | `OSIĄGNIĘTY` |

Kroki major 3.1–3.3 i 4.1–4.3 → `WYKONANY` wraz z fazami. Edycja major = poza tym skillem / opcjonalnie przy ręcznym `/feature-implementation`.
