---
wersja: 2
data_utworzenia: 2026-11-09
data_modyfikacji: 2026-11-09
---

# SPEC — Frontend (SPA)

## Cel / zakres względem dokumentacji

Norma implementacji **klienta SPA** w katalogu procesu **`frontend/`**: routing, stan (Zustand + Context), komunikacja HTTP/WebSocket, i18n oraz granica UI vs reguły API.

Uszczegóławia: [docs/architektura.md](../docs/architektura.md) (Frontend, R5), [docs/architektura_katalogi_pliki.md](../docs/architektura_katalogi_pliki.md), [docs/i18n_kontrakt_ui.md](../docs/i18n_kontrakt_ui.md), [docs/anty_patterny.md](../docs/anty_patterny.md).  
Kontrakt I/O → [SPEC-KOMUNIKACJA.md](./SPEC-KOMUNIKACJA.md) / [docs/dokumentacja_komunikacji.md](../docs/dokumentacja_komunikacji.md). Auth egzekwowane na API → [SPEC-BEZPIECZENSTWO.md](./SPEC-BEZPIECZENSTWO.md).

## Wiążący styl z docs

| Ustalenie | Egzekwowanie |
|-----------|--------------|
| Katalog procesu | Kod SPA w `frontend/` (nie `Frontend/`) |
| SPA Vite + React Router | Jedyny klient web v1; strony publiczne + dashboard po sesji |
| Stan | **Zustand + Context** w katalogu `store/` — bez React Query / SWR w v1 (R5) |
| Komunikacja | HTTP z credentials + Socket.io-client; ścieżki pod **`/api/v1`** |
| Uprawnienia | UI odzwierciedla role; **źródło prawdy** = API |
| Deployable | Osobny frontend; **bez** BFF i bez kopiowania warstw Express 1:1 |
| Wyjątek vs styl globalny | **Brak** — osobny klient, ten sam kontrakt I/O |

## Wymagania egzekwowalne

### Struktura i routing

F-1. Układ katalogów zgodny z normą docs w `frontend/`: `pages/` (w tym dashboard / admin), `components/`, `store/`, `configs/`, `hooks/`, `utils/` — bez wymuszanej migracji na `features/<name>/` w v1.

F-2. Routing przez React Router: trasy publiczne (landing, about, contact, …) oraz chronione UX-em dashboardu; ochrona tras UI **nie zastępuje** middleware API.

F-3. URL API / socket w konfiguracji klienta (`url.js` lub równoważne) musi używać prefiksu `/api/v1` po refaktorze kontraktu — spójnie z SPEC-KOMUNIKACJA.

### Stan

F-4. **Context** (w `store/`): m.in. auth, socket, data, theme — stan sesji / połączenia / UI-cross-cutting.

F-5. **Zustand** (w `store/`): domenowe kolekcje i mutacje (m.in. transakcje, wiadomości, zaproszenia, powiadomienia) z **jasnym właścicielem** store’a per obszar.

F-6. Nie wrzucać „wszystkiego” do jednego globalnego store bez granicy: lokalny stan UI komponentu zostaje lokalny, gdy nie jest współdzielony.

F-7. Po udanej mutacji HTTP oraz po ustalonym evencie WS klient aktualizuje odpowiedni store / widok. Komponenty **nie** reimplementują reguł biznesowych (np. kto może usunąć domownika) — tylko orchestracja UI i prezentacja.

### Komunikacja

F-8. Żądania HTTP z `credentials: true` (cookie `SESSID`). Obsługa envelope `{ status, message }`: przy błędzie / sukcesie `message` mapowane przez i18n (F-11), nie hardcodowany tekst z API jako jedyny język UI.

F-9. Socket.io-client: handshake z sesją; obsługa wyłącznie ustalonych `type` z kontraktu (`notification`, `newMessage`, `balance_update`, …). Zakaz własnych roomów / eventów spoza normy.

F-10. Nazwa roli domownika w UI, guardach tras i komunikatach klienta: **`inmate`** (nie `mate`) — spójnie z R1 / docs.

### i18n

F-11. i18next: języki **`pl`** + **`en`** (`fallbackLng: en`). Namespace’y UI jak w docs; namespace **`api`** na klucze zwracane w `message` z backendu.

F-12. Konwencja: API zwraca klucz → SPA robi `t(message)` / `t(key, { ns: 'api' })`. Jedna wybrana konwencja prefiksu (`api:…` vs zawsze `ns: 'api'`) i konsekwentne trzymanie się jej w nowym kodzie.

F-13. Pełna migracja istniejących kluczy (`authMessages.*` itd.) **nie** musi być big-bang w jednym PR; nowy kod idzie od razu pod F-11/F-12.

### Bezpieczeństwo klienta

F-14. Brak sekretów (JWT secret, hasła DB, SMTP, tokeny CI) w bundlu / `VITE_*` / repo frontu.

F-15. Ukrycie przycisku / trasy w React **nie** jest autoryzacją — każde chronione działanie i tak idzie przez API.

## Wzorce projektowe i struktura

| Wymagane / dozwolone | Sens |
|----------------------|------|
| Presentational vs orchestracja | Widoki formatują; fetch/mutacje i store poza „grubym JSX z regułami” |
| Context + Zustand | Sesja/socket/UI vs kolekcje domenowe — bez server-state library w v1 |
| Kontrakt-driven WS/HTTP | Tylko powierzchnie z SPEC-KOMUNIKACJA |
| i18n na brzegu UI | Jedyny właściciel brzmienia PL/EN dla użytkownika |

## Wolno

- Porządkować komponenty i podstrony dashboard / adminpanel w istniejącym drzewie.
- Stopniowo przenosić klucze API do namespace `api`.
- Aktualizować store z handlerów WS po ustalonych eventach.
- Trzymać theme / tour / cookies w Context lub lekkim store UI.

## Nie wolno

- Wprowadzać React Query / SWR / analogów server-state w v1.
- Dublować reguł host/inmate/superadmin wyłącznie w UI jako źródło prawdy.
- Sekretów w zmiennych `VITE_*` ani w kodzie klienta.
- Własnych protokołów WS (roomy, typy) spoza docs/SPEC-KOMUNIKACJA.
- BFF ani przenoszenia logiki Prisma/SQL do frontu.
- Wymuszania architektury `features/<name>/` jako jedynego układu v1.

## Zatwierdzony stack (obszar)

| Element | Status |
|---------|--------|
| React | Tak |
| Vite | Tak |
| React Router | Tak |
| Zustand | Tak |
| React Context (w `store/`) | Tak |
| i18next | Tak |
| socket.io-client | Tak |

## Kryteria akceptacji (obserwowalne)

- [ ] Po zalogowaniu chronione widoki wołają API pod `/api/v1` z credentials; błąd 401/403 jest obsłużony w UI bez „udawania” uprawnień.
- [ ] Mutacja (np. transakcja) aktualizuje widok/store; ewentualny WS `balance_update` / `notification` nie wymaga zmyślonego room API.
- [ ] `message` z API jest tłumaczone przez i18n (namespace `api` lub równoważna konwencja), nie wyświetlane na sztywno jako jedyny język kontraktu.
- [ ] W refaktorowanym UI nie ma roli `mate` — jest `inmate`.
- [ ] W bundlu / env frontu nie ma sekretów serwerowych.

## Poza zakresem tego SPEC

- Testy UI (Vitest/RTL/E2E przeglądarkowe) — poza strategią v1; patrz [docs/testy.md](../docs/testy.md) / [SPEC-TESTY.md](./SPEC-TESTY.md).
- React Query / SWR, BFF, natywna aplikacja mobilna.
- Big-bang migracji wszystkich kluczy i18n w jednym PR.
- Norma warstw Express / Prisma → SPEC-BACKEND.
- Pełny katalog endpointów → SPEC-KOMUNIKACJA / docs komunikacji.
