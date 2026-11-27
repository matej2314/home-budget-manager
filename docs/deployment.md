---
wersja: 11
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-27
---

# Wdrożenie i operacje — Home Budget Manager

## Cel

Środowiska, sposób uruchamiania, deploy i podstawowe operacje. Observability: [observability.md](./observability.md). Testy (DoD): [testy.md](./testy.md). Env: [katalog_env.md](./katalog_env.md).

## Środowiska

| Środowisko | Cel | Jak stoi |
|------------|-----|----------|
| **local** | Rozwój | npm w `backend/` i `frontend/` (Vite); opcjonalnie Docker |
| **production** | Demo / prod | Obrazy Docker + compose, sieć zewnętrzna, Jenkins po pushu na `main` |

Brak osobnego staging w normie v1 docs.

## Architektura runtime (production)

| Usługa | Obraz / proces | Host (compose) | Uwagi |
|--------|----------------|----------------|--------|
| Backend | `backend/Dockerfile` → `node server.js` | `127.0.0.1:5053:5053` | Volume `.env` (m.in. `BACKEND_ORIGIN`); compose może nadpisać `DB_HOST`; logi → **stdout** |
| Frontend | multi-stage: Vite build → `serve` `:3000` | `127.0.0.1:5052:3000` | Build-arg `VITE_BACKEND_ORIGIN` (= Vault `BACKEND_ORIGIN`); bez hardcoded URL w bundlu |
| MySQL | Poza tym compose | `main_db` w sieci `main_network` | Aplikacja łączy się po nazwie hosta DB |
| Sieć | `main_network` (external) | — | Współdzielona z resztą hosta |

phpMyAdmin: **narzędzie operatorskie** przy bazie (wzmianka w README / ops) — **nie** jest usługą w `docker-compose.yml` aplikacji; dostęp i hardening poza zakresem szczegółowym tego pliku.

Publiczne domeny (as-is): frontend `budgetapp.msliwowski.net`, API `budgetapi.msliwowski.net` (oraz origin w CORS).

## Sekrety i konfiguracja

| Zasada | Opis |
|--------|------|
| **Nigdy w git** | `.env`, tokeny Jenkins, `JWT_SECRET`, hasła DB |
| Production / homelab | Jenkins: Vault → `.env` (plik) w rootcie → `docker compose up -d --build`. Backend: `env_file: .env` (bez bind-mountu pliku). Front: `args.VITE_BACKEND_ORIGIN=${BACKEND_ORIGIN}` |
| CI | `secrets.JENKINS_URL`, `secrets.JENKINS_TOKEN` w GitHub Actions |
| Local | `backend/.env` + `frontend/.env` (`VITE_BACKEND_ORIGIN`, wzór w `.env.example`) |

Wymagane kategorie env backendu (orientacyjnie): port (`SERV_PORT`), `JWT_SECRET`, dane MySQL, `BACKEND_ORIGIN` / `FRONTEND_ORIGIN` zgodnie z CORS.

## Local — ścieżka deweloperska

**Stack w Dockerze (zalecany):** z roota repo, po `cp backend/.env.example backend/.env`:

1. `pnpm dev:stack:up` — `docker-compose.dev.yml`: MySQL + migrate/seed + backend (`nodemon`) + frontend (Vite `:5173`).
2. SPA: `http://localhost:5173`, API: `http://localhost:5053`.
3. `pnpm dev:stack:down` — stop bez kasowania volume DB (`home_budget_dev_mysql_data`).

**Bez pełnego stacka (jak wcześniej):**

1. MySQL lokalnie albo `docker-compose.db.yml`; spójne `DATABASE_URL` / `DB_*` w `backend/.env`.
2. **Backend:** w `backend/` → `npm install` → Prisma generate + migrate → `npm run dev`.
3. **Frontend:** w `frontend/` → `cp .env.example .env` → `npm install` → `npm run dev` (`:5173`).
4. Opcjonalnie: `VITE_BACKEND_ORIGIN=… npm run build`.

Zmiany schematu DB wyłącznie przez Prisma Migrate (`schema.prisma` + `prisma/migrations/`) — norma w [architektura.md](./architektura.md) / [model_danych.md](./model_danych.md).

Socket i API: `frontend/src/url.js` czyta wyłącznie `VITE_BACKEND_ORIGIN` (brak hardcoded domen).

## Production — Docker

Skrót z root `docker-compose.yml`:

- Build kontekstów `./backend`, `./frontend` (katalogi procesów w rootcie repo — małe litery).
- `restart: always`.
- Backend: port 5053, `env_file: .env` (zmienne z Vault w `process.env`; unika pułapki „`.env` jako katalog” przy bind-mouncie), `DB_HOST=main_db`.
- Frontend: port hosta 5052 → 3000 (`serve`); build-arg z `${BACKEND_ORIGIN}` w `.env` projektu — **job Jenkins bez zmian**.
- Jeśli na hoście zostało `./.env` jako **katalog** z wcześniejszego mountu: `rm -rf .env`, odtwórz plik z Vault/Jenkins, dopiero `up`.

Obrazy:

- Backend: `node` Alpine/runner, `CMD node server.js`, expose 5053.
- Frontend: builder Vite z wymaganym `VITE_BACKEND_ORIGIN`, runtime `serve` na `:3000`.

## CI / CD

```text
push → main
  → GitHub Actions (trigger-jenkins.yml)
    → POST webhook Jenkins (URL + token z secrets)
      → pipeline Jenkins (build/deploy obrazów — szczegóły joba na serwerze)
```

Bramka jakości przed pushem/mergem zmian backendu: testy Jest wg `testy.md`. Fail CI/Jenkins = sygnał operacyjny (`observability.md`).

## Migracje przy deployu (obowiązkowe — R6 wdrożone)

| Krok | Norma |
|------|--------|
| Przed / wraz z nową wersją API | Zastosować zatwierdzone migracje z `prisma/migrations/` (`prisma migrate deploy` lub równoważne w pipeline) |
| Źródło | Tylko migracje z repo — bez ręcznego DDL na prod jako procesu |
| Fail migracji | Blokuje uznanie deployu za udany; diagnostyka z logów CLI / Jenkins |

**Sync 2026-11-24:** migracje Prisma są częścią normalnego deployu, nie „stanem po przyszłym R6”.

## Checklist po deployu (smoke)

Po wdrożeniu (lub po zmianach kontraktu `/api/v1`):

1. Migracje Prisma zastosowane na `main_db` — schemat zgodny z repo.
2. `GET /api/v1/health` → **200** / status ok.
3. Smoke logowania: `POST /api/v1/auth/login` (konto testowe / stagingowe) → cookie `SESSID`.
4. Opcjonalnie: otwarcie SPA na domenie frontu + wywołanie chronionego zasobu (np. verify).
5. Przy incydencie: logi kontenera / procesu (**stdout**), status kontenerów, łączność z `main_db`.

## Operacje codzienne (skrót)

| Temat | Działanie |
|-------|-----------|
| Logi | Winston → **stdout**; odczyt przez runtime (`docker logs` / host); bez plików `backend/logs/` w normie docelowej — [observability.md](./observability.md) |
| Restart | Polityka compose `restart: always`; ręczny restart kontenera przy złym stanie |
| DB | Diagnostyka: phpMyAdmin / klient SQL — ostrożnie na prod; **zmiany schematu tylko Prisma Migrate** |
| Cert / TLS | Terminacja po stronie hosta / reverse proxy (poza tym compose) |

## Poza zakresem tego dokumentu

- Pełna konfiguracja jobów Jenkins (krok po kroku na serwerze).
- Hardening phpMyAdmin.
- Staging environment.
- Pełny playbook cutoveru dual mount (major Faza 10) i portów I/O (Faza 11) — w major planie backendu.
