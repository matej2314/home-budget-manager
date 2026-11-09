---
wersja: 1
data_utworzenia: 2026-11-09
data_modyfikacji: 2026-11-09
---

# SPEC — Dane (persistencja)

## Cel / zakres względem dokumentacji

Norma implementacji **dostępu do MySQL**, mapowania modelu, migracji, seeda oraz narzędzi operatorskich (Prisma Studio) — bez dublowania pełnego opisu encji z docs.

Uszczegóławia: [docs/model_danych.md](../docs/model_danych.md), [docs/architektura.md](../docs/architektura.md) (R6, warstwa `database/`), [docs/architektura_katalogi_pliki.md](../docs/architektura_katalogi_pliki.md), [docs/data_flow.md](../docs/data_flow.md).  
Pipeline i zakaz Prisma poza `database/` → [SPEC-BACKEND.md](./SPEC-BACKEND.md). Testy korzystające z seeda → [SPEC-TESTY.md](./SPEC-TESTY.md).

## Wiążący styl z docs

| Ustalenie | Egzekwowanie |
|-----------|--------------|
| Silnik | MySQL |
| ORM | **Prisma** — jedyny dostęp w stanie docelowym |
| Warstwa | Operacje DB wyłącznie przez `database/` → Prisma Client |
| Schemat | `prisma/schema.prisma` + obowiązkowe migracje |
| Reguły produktowe | Jedno gospodarstwo na użytkownika; wspólny budżet domu; role `user\|host\|inmate\|superadmin` |
| Wyjątek vs styl globalny | **Brak** — persistencja to warstwa `database/` w tym samym monolicie |

## Wymagania egzekwowalne

### Granica dostępu

D-1. Controllers, routes, middlewares, tasks i `utils/` **nie** importują Prisma Client. Wyłącznie moduły w `database/` (oraz wygenerowany klient używany stamtąd).

D-2. `services` wołają wyłącznie API warstwy `database/` — bez omijania jej bezpośrednim Prisma w service.

D-3. Raw SQL jest zabroniony w stanie docelowym, w tym `$queryRaw` / `$executeRaw` i ad-hoc SQL „na skróty”. Historyczny pool + `*Queries` usuwa refaktor **R6**.

D-4. Drugi ORM (TypeORM, Sequelize, Knex jako warstwa modelu itd.) obok Prisma — zabroniony.

### Schemat i migracje

D-5. Źródło prawdy schematu: `Backend/prisma/schema.prisma`. Modele odpowiadają encjom z [docs/model_danych.md](../docs/model_danych.md) (mapowanie nazw tabel/pól w schema).

D-6. Każda zmiana schematu = aktualizacja `schema.prisma` + **obowiązkowa** migracja w `prisma/migrations/` (Prisma Migrate).

D-7. Dev: tworzenie/stosowanie migracji workflow Prisma Migrate względem bazy deweloperskiej. Prod/deploy: stosowanie zatwierdzonych migracji z repo (`migrate deploy` lub równoważne) — bez ręcznego DDL jako procesu utrzymania.

D-8. phpMyAdmin / klient SQL: diagnostyka i odczyty; **nie** pipeline zmian schematu.

### Reguły spójności modelu (egzekwowane w services + database)

D-9. Użytkownik należy do **co najwyżej jednego** gospodarstwa naraz; rola `user` = brak aktywnego membershipu budżetowego.

D-10. Transakcja finansowa zawsze w kontekście `houseId` członka domu. Wspólny budżet domu — bez osobnych „kont prywatnych” w produkcie v1.

D-11. Mutacja transakcji utrzymuje spójność z saldem domu (`households.currentBalance` lub równoważne w schema): zapis w **jednej** orkiestracji service (transakcja Prisma / równoważna atomowość) — nie połowiczne zapisy rozjechane po controllerach.

D-12. Role w modelu i danych: globalnie i w membership używać **`inmate`** (nie `mate`). `householdUsers.role`: `host` \| `inmate`.

D-13. Snapshoty / projekcje cron (`dailyTransactions`, `dailyBudget`, `monthly_balances`, …) zasilane przez **services** wołane z `tasks/` — nie raw SQL z tasków.

D-14. Usunięcie domu / użytkownika czyści powiązane membership i transakcje zgodnie z logiką w services (norma docs).

### Seed

D-15. Projekt ma **seed Prisma** używany w trybach **dev** i **test**.

D-16. Seed = minimalny, powtarzalny zestaw (m.in. użytkownik; kategorie, gdy wymagane przez transakcje). Bez sekretów produkcyjnych i bez uruchamiania seeda jako części deployu **produkcyjnego**.

D-17. Środowisko testowe korzysta z osobnej bazy + seed/fixtures zgodnie z [docs/testy.md](../docs/testy.md); szczegóły DoD testów → SPEC-TESTY.

### Prisma Studio

D-18. **Prisma Studio** dozwolone do podglądu/inspekcji na bazach **non-prod** (dev/test). Nie zastępuje migracji, seeda ani warstwy `database/` w runtime aplikacji. Na produkcji — tylko świadomie i ostrożnie; nie jest powierzchnią produktu.

## Wzorce projektowe i struktura

| Wymagane / dozwolone | Sens |
|----------------------|------|
| Repository-like moduły w `database/` | Enkapsulacja Prisma per obszar |
| Transakcja Prisma dla multi-write | Atomowość saldo + transakcja itd. |
| Schema-first + Migrate | Historia schematu w git |
| Seed skryptowy | Powtarzalny dev/test |

## Wolno

- Mapować nazwy modeli Prisma na istniejące tabele przy migracji R6 (introspection → schema → migracje jako proces domknięcia).
- Rozszerzać seed o dane potrzebne do lokalnych ścieżek krytycznych.
- Używać Prisma Studio lokalnie / na bazie testowej.

## Nie wolno

- Raw SQL / `$queryRaw` w normie docelowej.
- Ręcznego DDL jako standardu zmian schematu.
- Importu Prisma poza `database/`.
- Osobnych kont prywatnych w modelu produktu v1.
- Drugiego ORM.
- Seeda na produkcji jako kroku deployu.
- Traktowania Studio jako API aplikacji.

## Zatwierdzony stack (obszar)

| Element | Status |
|---------|--------|
| MySQL | Tak |
| Prisma ORM | Tak |
| Prisma Migrate | Tak |
| Prisma seed | Tak (dev + test) |
| Prisma Studio | Tak (ops/dev; non-prod) |

## Kryteria akceptacji (obserwowalne)

- [ ] Po R6: brak `*Queries`/pool raw SQL w ścieżkach runtime; odczyty/zapisy przez Prisma w `database/`.
- [ ] Zmiana pola w modelu ma migrację w `prisma/migrations/`.
- [ ] Dodanie transakcji aktualizuje saldo domu atomowo (brak trwałego rozjazdu po sukcesie API).
- [ ] `npm`/`npx` seed (lub równoważne) wypełnia bazę dev/test minimalnym zestawem.
- [ ] W danych/refaktorze rola domownika to `inmate`.
- [ ] Task cron nie wykonuje raw SQL — woła service.

## Poza zakresem tego SPEC

- Pełna lista indeksów i mikro-optymalizacja typów kolumn.
- CQRS / osobne read-modele / optymalizacja ciężkiego dashboardu.
- Pełny dump DDL poza `schema.prisma`.
- Strategia testów Jest → SPEC-TESTY.
- Kontrakt HTTP/WS → SPEC-KOMUNIKACJA.
