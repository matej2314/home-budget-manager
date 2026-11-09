---
wersja: 6
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-09
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
| Backend | `backend/Dockerfile` → `node server.js` | `127.0.0.1:5053:5053` | Env `DB_HOST`, `BACKEND_ORIGIN`; volume `.env`; logi → **stdout** (bez volume `logs/` w stanie docelowym) |
| Frontend | multi-stage: build Vite → **nginx:alpine** | `127.0.0.1:5052:80` | SPA + `try_files` → `index.html` |
| MySQL | Poza tym compose | `main_db` w sieci `main_network` | Aplikacja łączy się po nazwie hosta DB |
| Sieć | `main_network` (external) | — | Współdzielona z resztą hosta |

phpMyAdmin: **narzędzie operatorskie** przy bazie (wzmianka w README / ops) — **nie** jest usługą w `docker-compose.yml` aplikacji; dostęp i hardening poza zakresem szczegółowym tego pliku.

Publiczne domeny (as-is): frontend `budgetapp.msliwowski.net`, API `budgetapi.msliwowski.net` (oraz origin w CORS).

## Sekrety i konfiguracja

| Zasada | Opis |
|--------|------|
| **Nigdy w git** | `.env`, tokeny Jenkins, `JWT_SECRET`, hasła DB |
| Production | Plik `.env` montowany do kontenera backendu z hosta; zmienne w compose (`DB_HOST`, origin) |
| CI | `secrets.JENKINS_URL`, `secrets.JENKINS_TOKEN` w GitHub Actions |
| Local | Własny `.env` w `backend/` (poza repo) |

Wymagane kategorie env backendu (orientacyjnie): port (`SERV_PORT`), `JWT_SECRET`, dane MySQL, origin frontendu/API zgodnie z CORS.

## Local — ścieżka deweloperska

1. MySQL dostępny lokalnie lub przez sieć (spójne dane połączenia w `.env`, w tym URL/połączenie wymagane przez Prisma).
2. **Backend:** w `backend/` → `npm install` → (po przejściu na ESM: `"type": "module"`) → (po R6) wygeneruj klienta i **zastosuj migracje** Prisma Migrate na bazie deweloperskiej → `npm run start` (nodemon / `server.js`).
3. **Frontend:** w `frontend/` → `npm install` → `npm run dev` (Vite, typowo `:5173`; origin na whitelist CORS).
4. Opcjonalnie: build frontu `npm run build` / podgląd jak w README.

Zmiany schematu DB wyłącznie przez Prisma Migrate (`schema.prisma` + `prisma/migrations/`) — norma w [architektura.md](./architektura.md) / [model_danych.md](./model_danych.md).

Socket i API w dev: lokalne URL w `frontend/src/url.js` (zakomentowane warianty localhost).

## Production — Docker

Skrót z root `docker-compose.yml`:

- Build kontekstów `./backend`, `./frontend` (katalogi procesów w rootcie repo — małe litery).
- `restart: always`.
- Backend: port 5053, volume `.env`, `DB_HOST=main_db`; logi aplikacji na **stdout** (as-is może jeszcze montować `logs/` — do usunięcia przy refaktorze loggera).
- Frontend: port hosta 5052 → 80 w kontenerze NGINX.

Obrazy:

- Backend: `node:22.12-slim`, `CMD node server.js`, expose 5053.
- Frontend: build na `node:20.19.0-slim`, runtime `nginx:alpine` + `nginx.conf` (SPA).

## CI / CD

```text
push → main
  → GitHub Actions (trigger-jenkins.yml)
    → POST webhook Jenkins (URL + token z secrets)
      → pipeline Jenkins (build/deploy obrazów — szczegóły joba na serwerze)
```

Bramka jakości przed pushem/mergem zmian backendu: testy Jest wg `testy.md`. Fail CI/Jenkins = sygnał operacyjny (`observability.md`).

## Migracje przy deployu (stan docelowy po R6)

| Krok | Norma |
|------|--------|
| Przed / wraz z nową wersją API | Zastosować zatwierdzone migracje z `prisma/migrations/` (`prisma migrate deploy` lub równoważne w pipeline) |
| Źródło | Tylko migracje z repo — bez ręcznego DDL na prod jako procesu |
| Fail migracji | Blokuje uznanie deployu za udany; diagnostyka z logów CLI / Jenkins |

Do czasu domknięcia R6 checklist poniżej nadal obowiązuje; krok migracji Prisma staje się obowiązkowy wraz z wprowadzeniem ORM.

## Checklist po deployu (smoke)

Po wdrożeniu (lub po zmianach kontraktu `/api/v1`):

1. (Po R6) Migracje Prisma zastosowane na `main_db` — schemat zgodny z repo.
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
- Migracje schematu DB jako formalny tool (jeśli pojawią się — osobna decyzja / docs).
