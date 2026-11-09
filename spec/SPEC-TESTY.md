---
wersja: 4
data_utworzenia: 2026-11-09
data_modyfikacji: 2026-11-09
---

# SPEC — Testy (backend)

## Cel / zakres względem dokumentacji

Norma **pisania i egzekwowania testów backendu**: piramida Jest, ścieżki krytyczne, izolacja środowiska, Definition of Done przed merge/push.

Uszczegóławia: [docs/testy.md](../docs/testy.md), spójnie z [docs/data_flow.md](../docs/data_flow.md), [docs/deployment.md](../docs/deployment.md) (CI jako sygnał).  
Kontrakt HTTP → [SPEC-KOMUNIKACJA.md](./SPEC-KOMUNIKACJA.md). Seed/DB → [SPEC-DANE.md](./SPEC-DANE.md). Warstwy testowane → [SPEC-BACKEND.md](./SPEC-BACKEND.md).

## Wiążący styl z docs

| Ustalenie | Egzekwowanie |
|-----------|--------------|
| Narzędzie | **Jest** (unit, integration, E2E API) |
| Frontend | Świadomie **poza** strategią testów v1 |
| Prefiks | Testy HTTP używają **`/api/v1`** |
| Dane | Osobna MySQL + seed Prisma (nie prod) |
| Rola testów | Weryfikują **kontrakt, zachowanie aplikacji, charakter zwracanych danych** — nie zmieniają stylu architektury |
| Wyjątek vs styl globalny | **Brak** |

## Wymagania egzekwowalne

### Piramida

T-1. **Unit (priorytet wysoki):** `services`, `utils`, reguły (saldo, membership, role, zaproszenia) — bez zależności od Express/`res`.

T-2. **Integration (średni–wysoki):** HTTP przez Supertest (lub równoważne) + baza testowa — m.in. auth (`SESSID`), gospodarstwo, transakcje, zaproszenia.

T-3. **E2E API (wysoki na ścieżkach krytycznych):** wielostepowe scenariusze HTTP (cookie jar), bez UI przeglądarki.

T-4. **WebSocket:** wąski zakres — przy triggerach biznesowych obecność/kształt kluczowych eventów (`newMessage`, `notification`, `balance_update`), nie „cały Socket.io”.

### Scenariusze E2E API (minimum)

T-5. Pokryć (gdy dana ścieżka jest w zakresie zmiany / jako bramka krytyczna):

1. Auth: signup → login → `GET /api/v1/auth/verify` → logout.
2. Gospodarstwo: `user` → `POST /api/v1/house/new` → sesja `host` → `GET /api/v1/house/info`.
3. Zaproszenie → `inmate`: invite → accept (host) → dostęp rdzenia jako `inmate`.
4. Transakcja: `POST /api/v1/action/new` → widoczność na `GET /api/v1/action/my` + spójne saldo.
5. Wiadomość (opcjonalnie w pierwszym rzucie): `POST /api/v1/message/send` + zapis; WS jeśli tanie w setupie.

### Co asertować

T-6. Asercje na: status HTTP, envelope (`status`, `message` jako klucz / kontrakt), charakter i spójność zwracanych danych (rola, membership, saldo, kolekcje), skutki uboczne obserwowalne przez API (i ewentualnie wąski WS).

T-7. Zakaz testów „lustrzanych”: asercja prywatnych szczegółów Prisma/SQL zamiast zachowania.

### Środowisko

T-8. Osobna baza MySQL (lub kontener) — nie produkcja, nie współdzielona „na żywo” z demo bez izolacji.

T-9. Env testowy: sekrety JWT, CORS/origin pod klienta testowego; montowanie API pod `/api/v1`.

T-10. Seed Prisma / fixtures minimalne (user, kategorie gdy potrzeba) — zgodnie z SPEC-DANE D-15–D-17. Idempotentne sprzątanie lub rollback tam, gdzie praktyczne.

### Definition of Done

T-11. Zmiana backendu z sensem testowalnym (reguła domenowa, endpoint, R1–R2/R6/ESM, kontrakt) **wymaga** nowych lub zaktualizowanych testów Jest **przed merge / przed pushem** takiego commita.

T-12. DoD obejmuje: testy przechodzą lokalnie; pokryty zachowany/zmieniony kontrakt zachowania; ścieżki krytyczne E2E nie są świadomie psute bez aktualizacji testów.

T-13. Wyjątki bez wymuszania testów: czysty chore docs-only, komentarz. **Nie** dotyczy zmian w `services`, routes, auth, rolach, transakcjach, warstwie danych.

T-15. Przy refaktorze według major planu backendu (`home-budget-manager_major_plan-backend.md`): **każda faza 1–8** ma scoped testy powierzchni tej fazy (pliki + zielona komenda Jest w `backend/`) jako część DoD fazy. **Faza 9** (weryfikacja / domknięcie piramidy i minimum E2E T-5) = audyt kompletności, nie pierwsze testy w projekcie. Fazy 1–8 **nie** muszą powtarzać całego T-5 — tylko zmieniany zakres. Major frontend nie wprowadza fazy testów UI (poza strategią v1).

### CI

T-14. CI uruchamia **te same** komendy Jest co lokalnie. Fail testów / builda = sygnał blokujący (Jenkins/CI wg docs). Ten SPEC **nie** zawiera YAML pipeline.

## Wzorce projektowe i struktura

| Wymagane / dozwolone | Sens |
|----------------------|------|
| Test zachowania na granicach | Kontrakt HTTP + reguły w services |
| Izolacja DB + seed | Powtarzalność, brak ryzyka prod |
| Cookie jar w E2E API | Realistyczna sesja `SESSID` |
| Wąski WS | Skutek uboczny mutacji, nie suite transportowa |

## Wolno

- Mockować zewnętrzne adaptery (OCR/Tesseract, SMTP) w unit/integration, gdy nie są przedmiotem scenariusza.
- Stopniowo budować suitę od ścieżek T-5.
- Współdzielić helpery setupu (login, create house) w testach.

## Nie wolno

- Uznawać Vitest/RTL/Playwright/Cypress za bramkę v1 tego projektu.
- Wymagać 100% coverage jako celu samego w sobie.
- Asercji na prywatne zapytania Prisma/SQL zamiast zachowania.
- Odpalania testów na bazie produkcyjnej lub nieizolowanym demo.
- Pomijania DoD (T-11–T-13) przy zmianach services/routes/auth/ról/transakcji/danych.

## Zatwierdzony stack (obszar)

| Element | Status |
|---------|--------|
| Jest | Tak |
| Supertest (lub równoważne) | Tak |
| MySQL (baza testowa) | Tak |
| Seed Prisma | Tak |

Nic poza tą listą w v1 strategii testów.

## Kryteria akceptacji (obserwowalne)

- [ ] `npm test` (lub ustalona komenda Jest w `backend/`) przechodzi lokalnie na bazie testowej.
- [ ] Fazy major planu backendu domykają scoped zielone testy obszaru fazy (T-15), nie tylko końcową suitę.
- [ ] Scenariusz auth E2E API (T-5.1) istnieje i asertuje kontrakt `/api/v1` + cookie.
- [ ] Zmiana reguły salda/membership ma test unit lub integration dowodzący zachowania.
- [ ] CI failuje przy padających testach Jest (po podpięciu pipeline).
- [ ] Brak testów FE jako wymogu v1 w tym SPEC.

## Poza zakresem tego SPEC

- Testy komponentów React, Vitest, RTL, snapshoty UI.
- E2E przeglądarkowe (Playwright/Cypress) jako bramka.
- Pełne pokrycie transportu Socket.io.
- Konfiguracja YAML Jenkins/GitHub Actions.
- Norma warstw / Prisma poza aspektami testowalności → SPEC-BACKEND / SPEC-DANE.
