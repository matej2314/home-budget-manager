---
wersja: 8
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-24
---

# Architektura — Home Budget Manager

## Cel dokumentu

Utrwala **stan faktyczny** architektury systemu (po lekkim refaktorze R1–R6 + ESM) oraz **kolejne kroki utrzymania** (cutover legacy HTTP, porty I/O). Nie jest planem wdrożenia ani kontraktem I/O (to osobne dokumenty w zestawie).

Powiązanie produktowe: rdzeń budżetu vs otoczka operacyjna — jak w [dokumentacja_koncepcyjna.md](./dokumentacja_koncepcyjna.md).

**Sync 2026-11-24:** docs dopasowane do kodu po major backend Fazy 1–9 i frontend 1–8; dual mount legacy HTTP nadal w API do major Fazy 10.

## Widok systemu (stan faktyczny)

System to **dwa deployable’e** plus zewnętrzna baza:

| Element | Rola |
|---------|------|
| **Frontend** (React + Vite, SPA; katalog procesu `frontend/`) | UI, routing, stan klienta, klient HTTP i Socket.io |
| **Backend** (Express, katalog procesu `backend/`) | HTTP API, Socket.io, cron w tym samym procesie, upload/OCR |
| **MySQL** | Magazyn stanu (poza `docker-compose` aplikacji; host DB w sieci zewnętrznej); dostęp przez **Prisma ORM** (norma docelowa) |

```mermaid
flowchart LR
  Browser[Przeglądarka SPA]
  API[Express API]
  WS[Socket.io]
  Cron[node-cron tasks]
  DB[(MySQL)]

  Browser -->|HTTP + cookie SESSID| API
  Browser -->|WebSocket| WS
  API --> DB
  WS --> DB
  Cron --> DB
  API --- WS
  API --- Cron
```

Compose buduje kontenery frontendu i backendu; obie usługi wchodzą w zewnętrzną sieć (`main_network`). Frontend serwowany przez NGINX w obrazie; backend nasłuchuje na porcie API.

## Styl architektury

### Styl globalny

**Modularny monolit warstwowy** w jednym procesie API oraz osobna SPA:

- Backend podzielony na **obszary** (auth, household, transactions, …), nie na mikroserwisy.
- Wewnątrz obszaru obowiązuje ten sam pipeline warstw.
- Frontend jest klientem SPA; nie ma BFF ani osobnego warstwy API-gateway w v1.

### Dziedziczenie stylu

**Wszystkie** obszary biznesowe i otoczka stosują **ten sam styl warstwowy**. Nie wprowadzamy osobnych stylów domenowych (np. bogaty model DDD w jednym module, a anemiczny w drugim) w ramach dokumentowanej normy v1.

### Wyjątki techniczne (nie wyjątki stylu domenowego)

| Mechanizm | Traktowanie |
|-----------|-------------|
| Socket.io | Adapter realtime w procesie API |
| `node-cron` (`tasks/`) | Adapter zadań cyklicznych w procesie API |
| Multer + Tesseract (OCR) | Adaptery I/O na brzegu HTTP |

Otoczka produktowa (landing, recenzje, galeria, panel `superadmin`) ma **ten sam styl warstw**, inną **rolę produktową** (operacyjna / prezentacyjna), nie inny wzorzec architektury.

### Poza zakresem styli (v1)

Świadomie nie przyjmujemy jako celu architektury v1:

- mikroserwisów,
- pełnego hexagonal / ports & adapters „na sztywno”,
- CQRS / event sourcingu,
- BFF,
- monorepo ze współdzielonym pakietem kontraktów front↔back.

## Warstwy backendu (norma docelowa)

```text
HTTP / WS / cron
        ↓
   routes (+ middlewares: JWT, role)
        ↓
   controllers   ← cienkie mapowanie req/res
        ↓
   services      ← reguły aplikacji / orkiestracja
        ↓
   database/     ← dostęp do danych wyłącznie przez Prisma Client
        ↓
   MySQL         ← schemat i migracje: Prisma Migrate
```

| Warstwa | Odpowiedzialność | Anty-pattern do unikania |
|---------|------------------|---------------------------|
| `routes` | Montowanie ścieżek, podpięcie middleware | Logika biznesowa w routerze |
| `controllers` | Walidacja wejścia na brzegu, statusy HTTP, wywołanie service | Grube controllery z dostępem do DB / Prisma i regułami |
| `services` | Przypadki użycia, spójność reguł (gospodarstwo, transakcje, …) | Bezpośrednie `res.json` / zależność od Express; bezpośredni import Prisma Client |
| `database` | Klient Prisma, moduły dostępu do danych (zamiast historycznych `*Queries`) | Raw SQL; rozproszenie Prisma / SQL po controllerach i routes |
| `middlewares` | Auth (`SESSID`), autoryzacja ról, pomocnicze I/O plików | Duplikowanie auth w każdym handlerze |
| `configs` | Logger, Swagger, JWT cookie, WebSocket, OCR | Business rules w configu |
| `tasks` | Harmonogramy (bilans, dzienne snapshoty); wołają **te same** `services` co HTTP | Ukryta logika domenowa i bezpośrednie wołanie DB z pominięciem services |

### Model modułów Node (stan docelowy)

| Norma | Opis |
|-------|------|
| Format | **ES modules (ESM)** — obowiązujący model ładowania modułów w procesie API (`backend/`) |
| Manifest | `package.json` z `"type": "module"`; w kodzie `import` / `export` |
| Stan w repo | ESM wdrożone (major Faza 1); CommonJS nie jest modelem runtime |
| Poza normą | Mieszanie CJS i ESM „na stałe”; nowy kod w CJS |

Szczegóły drzewa: [architektura_katalogi_pliki.md](./architektura_katalogi_pliki.md). Norma egzekwowalna: [SPEC-BACKEND.md](../spec/SPEC-BACKEND.md).

### Dostęp do danych: Prisma ORM

| Norma | Opis |
|-------|------|
| ORM | **Prisma** jest jedynym zatwierdzonym dostępem do MySQL w stanie docelowym |
| Raw SQL | **Zabroniony** w nowym kodzie i w stanie docelowym (w tym `$queryRaw` / ad-hoc SQL „na skróty”) |
| Granica importu | Prisma Client żyje w warstwie `database/`; `services` / `utils` / configs wołają wyłącznie API tej warstwy; controllers / routes / tasks **nie** importują Prisma |
| Relacje w `database/` | Przy FK w `schema.prisma` zapytania złożone używają `include` / filtrów relacji (bez ręcznego joinu w JS) |
| Stan w repo | **R6 domknięte:** `backend/prisma/` + moduły Prisma w `database/`; brak pool / `*Queries` / raw SQL w ścieżkach runtime |

### Migracje schematu (stan docelowy)

| Norma | Opis |
|-------|------|
| Narzędzie | Wyłącznie **Prisma Migrate** |
| Źródło prawdy schematu | `prisma/schema.prisma` (w `backend/`) |
| Historia | Katalog `prisma/migrations/` w repozytorium — migracje są **obowiązkowe** przy każdej zmianie schematu |
| Dev | Tworzenie / stosowanie migracji przez workflow Prisma Migrate (np. `prisma migrate dev`) względem bazy deweloperskiej |
| Prod / deploy | Stosowanie już zatwierdzonych migracji (np. `prisma migrate deploy`) przed lub wraz z uruchomieniem nowej wersji API — bez ręcznego DDL „obok” Prisma |
| Poza normą | Ręczne zmiany schematu tylko w phpMyAdmin / kliencie SQL; `db push` jako stały proces prod zamiast migracji |

Szczegóły logicznego modelu encji: [model_danych.md](./model_danych.md). Drzewo katalogów (w tym `prisma/`): [architektura_katalogi_pliki.md](./architektura_katalogi_pliki.md).

Stan w repo **spełnia** model warstw z Prisma (`schema` + warstwa `database/`, major Faza 7 / R6) — bez wprowadzania nowego stylu architektury (hexagonal „na sztywno”, CQRS itd. nadal poza v1).

## Obszary (moduły) w API

### Rdzeń

| Obszar | Typowa powierzchnia w kodzie |
|--------|------------------------------|
| Auth | `/auth`, JWT cookie |
| Household | `/house` |
| Invitations | `/invitation` |
| Users / profil / awatary | `/users`, `/avatars` |
| Transactions | `/action` |
| Categories | `/actioncat` |
| Monthly budget | `/initmonthly` |
| Dashboard / board | `/board` — logika aplikacji w `services/board/` (norma katalogów) |
| Messages | `/message` |
| Notifications | `/notice` |
| Receipt / OCR | `/receipt` |

### Otoczka / operacje

| Obszar | Typowa powierzchnia |
|--------|---------------------|
| Homepage content | `/homepage` |
| Reviews | `/reviews` |
| Gallery | `/gallery` |
| Cookies / tour | `/cookiestour` |
| Superadmin (UI + uprawnienia) | panel frontendu + chronione endpointy |

Nazewnictwo ścieżek jest **as-is** z repo; przy refaktorze ról ważniejsza jest spójność semantyczna niż kosmetyka URL w pierwszym kroku.

## Frontend (stan faktyczny)

- **SPA** (Vite + React Router): strony publiczne (landing, about, contact) oraz dashboard po zalogowaniu.
- **Stan:** mieszanka **Zustand** (m.in. transakcje, wiadomości, zaproszenia, powiadomienia) oraz **Context** (auth, socket, data, theme).
- **Komunikacja:** HTTP do API pod **`/api/v1`** (`frontend/src/url.js`) + Socket.io-client do zdarzeń realtime.
- **i18n:** i18next (PL/EN); `message` z envelope mapowane przez namespace `api`.
- **Role w UI:** semantyka `inmate` (R1); kosmetyczne nazwy plików/komponentów typu `Mates*` mogą pozostać bez wpływu na JWT / middleware.

W dokumentowanej normie v1 **utrzymujemy ten model**. Wprowadzenie bibliotek server-state (React Query / SWR) nie jest celem architektury v1.

Szczegółowe drzewo katalogów: [architektura_katalogi_pliki.md](./architektura_katalogi_pliki.md).

## Bezpieczeństwo i granice zaufania

| Temat | Decyzja v1 |
|-------|------------|
| Auth | JWT w cookie `SESSID` (opcje cookie w konfiguracji backendu) |
| Autoryzacja | Middleware ról; norma produktowa: `user`, `host`, `inmate`, `superadmin` |
| CORS | Whitelist originów (prod + lokalny Vite) |
| Granica zaufania | Przeglądarka jest niezaufana; reguły uprawnień egzekwuje API |

**R1 w kodzie:** rola domownika w tokenie, middleware i kontraktach API to **`inmate`** (historia `mate` / grupa `mates` usunięta z refaktorowanych ścieżek).

## Lekki refaktor — status (2026-11-24)

Cel był: **czytelność i spójność**, nie przebudowa systemu od zera. Poniżej status względem major planów.

| ID | Kierunek | Status w repo | Uwagi / dalej |
|----|----------|---------------|---------------|
| **R1** | Role `inmate` | **Domknięte** (BE + FE) | Kosmetyka nazw UI `Mates*` opcjonalna |
| **R2** | Pipeline warstw | **Domknięte** | Controllers cienkie; reguły w `services/` |
| **R3** | Obszary (`board/` vs `shell/`) | **Domknięte** | |
| **ESM** | ES modules w `backend/` | **Domknięte** | |
| **R4** | WS / cron jako adaptery | **Domknięte** w procesie API | Workery nadal odroczone |
| **R5** | Frontend — mapa SPA / stan | **Domknięte** (bez React Query) | |
| **R6** | Prisma + Migrate | **Domknięte** | |
| **Domena 9.x** | Saldo reverse, authz delete, invite+mail+testy | **Otwarte** — major backend **Fazy 9.1–9.4** (+ FE Faza 9) | Norma w docs/SPEC 2026-11-24 |
| **Cutover HTTP** | Usunięcie dual mount legacy | **Otwarte** — major backend **Faza 10** | SPA już na v1; API nadal montuje legacy równolegle |
| **Porty I/O** | Mail / storage / OCR za portami | **Otwarte** — major backend **Faza 11** | Adaptery v1 lokalne; AWS poza tą fazą |

## Decyzje świadomie odroczone

- Osobne procesy workerów dla cron / ciężkiego I/O.
- Współdzielony pakiet typów/kontraktów między frontem a backem.
- Wydzielenie read-modeli pod ciężkie statystyki.
- Zmiana mechanizmu auth (np. osobny refresh token flow) — poza zatwierdzonym v1 (`SESSID`).
- Wdrożenie SDK AWS (SES, S3, …) — po Fazie 11, osobną decyzją.

## Jak czytać dalej

- Koncepcja produktu i role: [dokumentacja_koncepcyjna.md](./dokumentacja_koncepcyjna.md)
- Docelowe drzewo plików: [architektura_katalogi_pliki.md](./architektura_katalogi_pliki.md)
- Kontrakt I/O: [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md)
- Bezpieczeństwo (auth/role/uploady): [bezpieczenstwo.md](./bezpieczenstwo.md)
- Model danych: [model_danych.md](./model_danych.md)
