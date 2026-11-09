---
wersja: 3
data_utworzenia: 2026-11-08
data_modyfikacji: 2026-11-09
---

# SPEC — Backend

## Cel / zakres względem dokumentacji

Norma implementacji **backendu Express** w katalogu procesu **`backend/`** (modularny monolit warstwowy w jednym procesie API): model modułów ESM, pipeline warstw, układ katalogów, dostęp do danych (Prisma), jednolite błędy, adaptery WS/cron/OCR oraz observability (logi na stdout, health).

Uszczegóławia: [docs/architektura.md](../docs/architektura.md), [docs/architektura_katalogi_pliki.md](../docs/architektura_katalogi_pliki.md), [docs/observability.md](../docs/observability.md), [docs/anty_patterny.md](../docs/anty_patterny.md).  
Kontrakt I/O endpointów → [SPEC-KOMUNIKACJA.md](./SPEC-KOMUNIKACJA.md) / [docs/dokumentacja_komunikacji.md](../docs/dokumentacja_komunikacji.md). Auth i role w szczegółach → [SPEC-BEZPIECZENSTWO.md](./SPEC-BEZPIECZENSTWO.md). Model encji → [SPEC-DANE.md](./SPEC-DANE.md). Testy → [SPEC-TESTY.md](./SPEC-TESTY.md).

## Wiążący styl z docs

| Ustalenie | Egzekwowanie w tym SPEC |
|-----------|-------------------------|
| Katalog procesu | Kod API w `backend/` (nie `Backend/`) |
| Modularny monolit warstwowy | `routes → controllers → services → database (Prisma) → MySQL` |
| Model modułów | **ES modules (ESM)** w stanie docelowym |
| Dziedziczenie stylu | **Wszystkie** obszary rdzenia i otoczki (`shell`) — ten sam pipeline |
| Wyjątki techniczne | Socket.io, `node-cron`, Multer + Tesseract = **adaptery w procesie API**, nie osobny styl domenowy |
| Wyjątek vs styl globalny | **Brak** — ten SPEC opisuje styl globalny backendu |

## Wymagania egzekwowalne

### Model modułów (ESM)

B-18. Proces API w `backend/` działa w modelu **ES modules**: `package.json` ma `"type": "module"`; kod aplikacji używa `import` / `export`.

B-19. Stan as-is (CommonJS: `require` / `module.exports`) jest do usunięcia przy fundamencie zależności — **przed** głębokim refaktorem katalogów i warstw. Nowy kod w CJS jest zabroniony po przyjęciu normy ESM.

### Warstwy i katalogi

B-1. Każdy nowy / refaktorowany przypadek użycia HTTP idzie ścieżką: route (+ middleware) → cienki controller → service → warstwa `database/` → Prisma → MySQL.

B-2. Logika biznesowa i orkiestracja żyją wyłącznie w `services/`. Controllery mapują wejście/wyjście HTTP (status, envelope) i wywołują service.

B-3. Podfoldery `services/<obszar>/` zgodne z drzewem docelowym w docs (`auth`, `household`, `invitations`, `transactions`, `categories`, `budget`, `board`, `messages`, `notifications`, `users`, `receipt`, `shell`, …) są **wymagane** przy porządkowaniu i nowym kodzie obszaru — nie dodawać logiki „luzem” poza obszarem bez uzasadnionej mapy w docs.

B-4. Otoczka produktowa (homepage, reviews, gallery, cookiesTour i pokrewne) ląduje w `services/shell/` (i odpowiadających modułach `database/`), nie w folderach rdzenia budżetowego. Obszar dashboardu (`/board`) ląduje w **`services/board/`**, nie w `shell/`.

B-5. `tasks/` (cron) wołają **te same** services co HTTP. Nie wolno im omijać services i iść prosto do `database/` / Prisma.

### Dane (Prisma)

B-6. Jedyny zatwierdzony dostęp do MySQL w stanie docelowym: **Prisma ORM**. Raw SQL (w tym `$queryRaw` / ad-hoc SQL) jest zabroniony.

B-7. Prisma Client i operacje na modelu — wyłącznie w warstwie `database/` (singleton klienta + moduły dostępu). Controllers, routes, middlewares, tasks i `utils/` **nie** importują `@prisma/client` / klienta Prisma.

B-8. Schemat: `backend/prisma/schema.prisma`. Każda zmiana schematu = **obowiązkowa** migracja w `prisma/migrations/` (Prisma Migrate). Dev: workflow tworzenia migracji; prod/deploy: stosowanie zatwierdzonych migracji (`migrate deploy` lub równoważne) — bez ręcznego DDL jako procesu.

B-9. Stan as-is (pool + `*Queries`) jest do usunięcia w ramach refaktoru **R6**; nowy kod pisze się już pod B-6–B-8.

### Błędy

B-10. Service rzuca / zwraca jednolity obiekt błędu:

```text
{ code: string, messageKey: string, httpStatus: number, details?: unknown }
```

- `messageKey` — klucz i18n (kierunek envelope z docs), nie finalny tekst marketingowy PL/EN.
- `code` — identyfikator wewnętrzny (logi, diagnostyka); **nie** jest wymagany w envelope HTTP v1.
- Controller mapuje na HTTP `httpStatus` oraz body `{ status: "error", message: messageKey }` (+ ewentualne pola danych uzgodnione w kontrakcie).

B-11. Sukces HTTP pozostaje w envelope `{ status: "success", message: … }` zgodnie z kontraktem komunikacji; `message` sukcesu również jako klucz i18n w kierunku docs.

### Role (nazewnictwo w backendzie)

B-12. Rola domownika w kodzie backendu, tokenie i middleware: wyłącznie **`inmate`**. Nazwa `mate` i aliasy historyczne są zabronione w nowym / refaktorowanym kodzie (R1). Szczegóły grup uprawnień → SPEC-BEZPIECZENSTWO / [docs/bezpieczenstwo.md](../docs/bezpieczenstwo.md).

### Helpery

B-13. Wspólne helpery (walidacja techniczna, checki, household utils) w `utils/` — **bez** przypadków użycia i orkiestracji domenowej (ta zostaje w services).

### Observability

B-14. Logger: **Winston** z transportem na **stdout** procesu. Zakaz normy docelowej: zapis logów aplikacji do plików (`backend/logs/`, `winston-daily-rotate-file`, volume `logs/` w compose).

B-15. Obowiązkowo logować: start/stop serwera, błędy w ścieżkach API / WS / cron, krytyczne odmowy auth/roli gdy ścieżka już loguje. Zakaz: hasła, pełne JWT, zbędne PII w cleartext; spam `info` na każdy happy-path.

B-16. Endpoint `GET /api/v1/health`: publiczny, liveness procesu, proste body (np. `{ "status": "ok" }`), bez sekretów i bez obowiązkowego deep-check DB w v1.

B-17. Poza zakresem observability w tym SPEC: metryki, OpenTelemetry, Sentry/APM, RUM — zgodnie z docs.

## Wzorce projektowe i struktura

| Wymagane / dozwolone | Sens |
|----------------------|------|
| ESM | Jednolity model importów w procesie API |
| Warstwowy pipeline | Separacja HTTP / aplikacji / danych |
| Cienki controller | Statusy, walidacja brzegu, mapowanie błędów B-10 |
| Service = use-case | Reguły domu, transakcji, zaproszeń, board itd. |
| Moduły dostępu w `database/` | Enkapsulacja Prisma; łatwa podmiana testów |
| Adapter w procesie | WS, cron, OCR bez osobnych workerów w v1 |

## Wolno

- Refaktorować istniejący kod do ESM, podfolderów `services/<obszar>/` (w tym `board/`) i Prisma zgodnie z fundamentem ESM / R2/R3/R6.
- Trzymać konfigurację (logger, JWT cookie, websocket, swagger, tesseract) w `configs/`.
- Używać Multer w `store/` wyłącznie jako adapter uploadu na brzegu HTTP.
- Logować na stdout i czytać logi przez runtime kontenera / hosta.

## Nie wolno

- Nowego kodu w CommonJS po przyjęciu normy ESM; trwałego mieszania CJS/ESM jako modelu docelowego.
- Logiki biznesowej w `routes` ani grubego controllera z Prisma / SQL / regułami.
- `res.json` / zależności od Express wewnątrz `services`.
- Importu Prisma poza `database/`.
- Raw SQL i równoległego poola MySQL obok Prisma w stanie docelowym.
- Kontenera DI / IoC.
- Hexagonal „na sztywno”, CQRS, event sourcingu, BFF, NestJS, top-level `workers/` w v1.
- Feature-modules `modules/<feature>/` z wewnętrznymi warstwami zamiast poziomego układu warstw.
- Drugiego ORM (TypeORM, Sequelize itd.) obok Prisma.
- Zapisu logów aplikacji do plików jako normy docelowej.
- Traktowania logiki `/board` jako otoczki `shell/` — to rdzeń (`services/board/`).

## Zatwierdzony stack (obszar)

| Element | Status |
|---------|--------|
| Katalog procesu `backend/` | Tak |
| ES modules (`"type": "module"`) | Tak (docelowo; as-is CJS → refaktor) |
| Express | Tak |
| Socket.io (w procesie API) | Tak |
| node-cron (`tasks/`) | Tak |
| multer | Tak |
| Tesseract (OCR) | Tak |
| Prisma ORM + Prisma Migrate | Tak (docelowo, R6) |
| MySQL | Tak (silnik) |
| Winston → stdout | Tak |
| bcrypt / JWT cookie `SESSID` | Tak (szczegóły w SPEC-BEZPIECZENSTWO) |

**Zakazane w tym obszarze:** NestJS, BFF, TypeORM/Sequelize jako zamiennik/równoległy ORM, Sentry, OTel, Prometheus w aplikacji v1; CommonJS jako norma docelowa.

## Kryteria akceptacji (obserwowalne)

- [ ] `backend/package.json` ma `"type": "module"`; entry i moduły aplikacji ładują się przez ESM.
- [ ] Nowy endpoint przechodzi pełny pipeline warstw; SQL/Prisma nie występuje w controllerze.
- [ ] Obszar `/board` ma dom w `services/board/` (po porządkowaniu obszarów).
- [ ] Cron mutujący dane woła service, nie Prisma bezpośrednio.
- [ ] Zmiana schematu ma odpowiadającą migrację w `prisma/migrations/`.
- [ ] Błąd z service ma kształt B-10; odpowiedź HTTP ma `status: "error"` i `message` = `messageKey`.
- [ ] W refaktorowanym kodzie nie ma roli `mate` — jest `inmate`.
- [ ] Logger emituje na stdout; brak wymogu volume plików logów w normie docelowej.
- [ ] `GET /api/v1/health` odpowiada 200 bez auth i bez sekretów w body.

## Poza zakresem tego SPEC

- Frontend (SPA w `frontend/`, Zustand, i18n UI) → SPEC-FRONTEND.
- Pełny katalog ścieżek HTTP/WS/e-mail i semantyka eventów → SPEC-KOMUNIKACJA / docs komunikacji.
- Szczegółowy model encji i mapowanie Prisma schema pole-po-polu → SPEC-DANE / [docs/model_danych.md](../docs/model_danych.md).
- Strategia i DoD testów Jest → SPEC-TESTY.
- Pełny playbook Jenkins / compose krok po kroku → [docs/deployment.md](../docs/deployment.md).
- Implementacja workerów poza procesem API.
