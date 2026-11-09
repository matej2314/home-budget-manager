---
wersja: 4
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-09
---

# Strategia testów — Home Budget Manager

## Cel i zakres v1

Strategia pod **utrzymanie i refaktor backendu**.  
**Frontend:** świadomie **poza zakresem** testów w tej wersji dokumentacji (bez Vitest/RTL/E2E UI).

As-is w repo: brak realnej suity (stub `npm test` w Backend). Ten dokument opisuje **normę docelową**, nie stan pokrycia.

## Narzędzie

| Obszar | Wybór |
|--------|--------|
| Backend (unit, integration, e2e API) | **Jest** |
| Frontend | Odłożone |
| E2E przeglądarkowe (Playwright/Cypress) | Poza v1 docs |

## Piramida (backend)

```text
        /\
       /  \     E2E API (wąskie, krytyczne ścieżki HTTP)
      /----\
     / integ \  HTTP + DB (+ ewentualnie WS w wąskim zakresie)
    /--------\
   /   unit   \  services, utils, reguły ról / salda
  /------------\
```

| Warstwa | Priorytet | Co pokrywać |
|---------|-----------|-------------|
| **Unit** | Wysoki | `services` (transakcje → saldo, zaproszenia, membership), `utils` walidacji, czysta logika bez Express |
| **Integration** | Średni–wysoki | Supertest (lub równoważne) + baza testowa: auth (`SESSID`), gospodarstwo, transakcje, zaproszenia |
| **E2E backend** | Wysoki na ścieżkach krytycznych | Pełne scenariusze **API** (wielostepowe), bez UI |
| **WebSocket** | Wąski | Przy triggerach biznesowych: obecność / kształt kluczowych eventów (`newMessage`, `notification`, `balance_update`) — nie „cały Socket.io” |
| **Frontend** | Brak w v1 | — |

## Scenariusze E2E backend (minimum)

Mapowanie na `data_flow.md` — asercje przez HTTP (cookie jar), nie przez przeglądarkę:

1. **Auth:** signup → login → `GET /api/v1/auth/verify` → logout.
2. **Gospodarstwo:** jako `user` → `POST /api/v1/house/new` → sesja `host` → `GET /api/v1/house/info`.
3. **Zaproszenie → inmate:** invite → accept (host) → dołączony użytkownik ma dostęp rdzenia jako `inmate`.
4. **Transakcja:** `POST /api/v1/action/new` → widoczność na `GET /api/v1/action/my` + spójne saldo (odczyt info domu / skutek uboczny).
5. **Wiadomość (opcjonalnie w pierwszym rzucie E2E):** `POST /api/v1/message/send` + weryfikacja zapisu; WS — jeśli tanie w setupie.

Prefiks ścieżek: **`/api/v1`** (norma kontraktu). Środowisko testowe musi montować ten prefiks zgodnie z docs.

## Środowisko testowe

- Osobna **baza MySQL** (lub kontener) — nie produkcja, nie współdzielona „na żywo” z demo bez izolacji.
- Env testowy: sekrety JWT, CORS/origin pod klienta testowego.
- Fixtures / **seed Prisma** (minimalny: user, kategorie jeśli wymagane przez transakcje) — norma seed w [model_danych.md](./model_danych.md); seed także dla trybu **dev**.
- Idempotentne sprzątanie lub transakcje/rollback tam, gdzie praktyczne.

## Reguła procesowa (DoD)

Testy są **częścią Definition of Done** kroku implementacji zmian w backendzie — tam, gdzie zmiana ma sens testowalny (reguła domenowa, endpoint, refaktor R1–R2, kontrakt).

**Wymagane przed merge / przed pushem commita** obejmującego taki krok:

1. Nowe lub zaktualizowane testy Jest przechodzą lokalnie.
2. Pokryty jest zachowany / zmieniony kontrakt zachowania (nie tylko „zielony build bez asercji”).
3. Ścieżki krytyczne z listy E2E nie są świadomie psute bez aktualizacji testów.

Wyjątki (np. czysty chore docs-only, komentarz): bez wymuszania testów — ale **nie** dotyczy zmian w `services`, routes, auth, rolach, transakcjach.

CI: docelowo te same komendy Jest co lokalnie; szczegół pipeline → `deployment.md` / konfiguracja CI, bez dublowania tu YAML-a.

## Czego nie robimy w v1 strategii

- Snapshotów / testów komponentów React.
- E2E przeglądarkowych jako bramki.
- Wymogu 100% coverage — liczy się **ryzyko reguł** (role, saldo, membership, auth), nie metryka sama w sobie.
- Testów „lustrzanych” implementacji (asercja prywatnych szczegółów Prisma / SQL zamiast zachowania).

## Powiązania

- Przepływy pod scenariusze: [data_flow.md](./data_flow.md)
- Kontrakt HTTP/WS: [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md)
- Pułapki: [anty_patterny.md](./anty_patterny.md)
- CI / deploy: [deployment.md](./deployment.md)
