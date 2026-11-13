# Home Budget Manager — major plan (backend)

**Źródła:** `docs/` oraz `spec/SPEC-*.md` (przede wszystkim SPEC-BACKEND, SPEC-KOMUNIKACJA, SPEC-BEZPIECZENSTWO, SPEC-DANE, SPEC-TESTY).  
**Zakres tego pliku:** wyłącznie backend (`backend/`) — aktualizacja zależności, ESM, refaktor do stanu docelowego z dokumentacji i SPEC.  
**Poza planem:** frontend (`frontend/`, w tym R5), playbook CI/Jenkins, workery poza procesem API, metryki / OTel / Sentry.

**Statusy (fazy / kroki):** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`  
**Milestone:** domyślnie bez statusu; po spełnieniu DoD → wyłącznie `OSIĄGNIĘTY`  
**Milestone zamykający całość:** nie — bramki tylko między fazami.

### Historia zmian planu (operacyjne)

- **2026-11-13 — sync statusów z feature planu:** po wycinku `feature-plans/home-budget-manager_feature_plan_backend-faza1-faza2-blok-b-r2.md` oznaczono Fazę 1 (kroki 1.1–1.3) i Fazę 2 (kroki 2.1–2.4) jako `WYKONANY` oraz milestone’y „Backend na zaktualizowanych zależnościach” i „Struktura Blok B + pipeline R2” jako `OSIĄGNIĘTY` (zgodnie ze „Ślad do major”).
- **Scalenie Fazy 2 + dawnej Fazy 6 (opcja B):** mapa katalogów Blok B i pipeline R2 (cienkie controllery, B-10) w **jednej** fazie — bez etapu „gruba logika pod właściwym folderem”. Prisma (dawna Faza 8) pozostaje późniejszą fazą globalną.
- **Dual mount HTTP (opcja 1):** Faza kontraktu montuje `/api/v1` **oraz** legacy ścieżki as-is; usunięcie legacy poza tym major (po przejściu klienta SPA na v1).
- **Przenumerowanie:** po scaleniu: dawne Fazy 7→6, 8→7, 9→8, 10→9. Scoped T-15: fazy **1–8**; weryfikacja piramidy = **Faza 9**.
- **Rename helpera WS (opcja 1):** w Fazie 5 (R1) `broadcastToHouseMates` → **`broadcastToHousehold`** — bez drugiego API i bez trwałego aliasu; aktualizacja call site’ów oraz docs/SPEC.

### Testy równolegle (norma planu)

Zgodnie z `docs/testy.md` i SPEC-TESTY **T-15**: **każda faza 1–8** domyka **scoped** testy powierzchni tej fazy (pliki Jest + zielona komenda testów w `backend/`). Nie odkładamy pierwszej asercji na Fazę 9.  
**Faza 9** = weryfikacja / domknięcie piramidy i minimum E2E (T-5) — nie „pierwsze testy w projekcie”.  
Scoped ≠ cały T-5 w każdej fazie: tylko zakres właśnie zmieniany.

---

## Faza 1 — Aktualizacja zależności backendu

**Status:** `WYKONANY`

**Opis:** Pierwszy etap prac backendu: inwentaryzacja zależności z lockfile / manifestu, aktualizacja do możliwie najnowszych wersji w granicach zatwierdzonego stacku z docs/SPEC oraz przejście na ES modules (norma docs/SPEC-BACKEND B-18–B-19). Cel: dalszy refaktor startuje na aktualnym fundamencie zależności i ESM, a nie na historycznym CJS.

**DoD (faza):**

- Zależności backendu są zaktualizowane względem stanu wyjściowego lockfile i mieszczą się w stacku docs/SPEC.
- Backend działa w modelu ES modules (`"type": "module"`, import/export).
- Backend da się uruchomić po upgrade.
- Scoped testy fundamentu (setup Jest + smoke startu / ładowania ESM) istnieją i komenda testów jest zielona dla tego zakresu (T-15).

### Krok 1.1 — Inwentaryzacja zależności

**Status:** `WYKONANY`

**Opis:** Spis zależności produkcyjnych i deweloperskich z `backend/package.json` / `package-lock` oraz oznaczenie pozycji sprzecznych z normą docelową (np. zapis logów do plików zamiast stdout — zgodnie z `docs/observability.md` / SPEC-BACKEND). Uwzględnić pozycje „zainstalowane ≠ wdrożone” (np. `helmet`, `nodemailer`) oraz do usunięcia przy normie docelowej (np. `winston-daily-rotate-file`).

**DoD (krok):**

- Jest jawna lista zależności wyjściowych i pozycji do podniesienia / usunięcia względem normy docs/SPEC.
- Pozycje poza stackiem docelowym oraz „deps bez użycia zgodnego z normą” są nazwane przed upgrade.

### Krok 1.2 — Aktualizacja wersji i przejście na ES modules

**Status:** `WYKONANY`

**Opis:** Podniesienie zależności do możliwie najnowszych wersji zgodnych ze stackiem docs/SPEC oraz **przejście na moduły ES modules** w `backend/` (import/export, spójny model ładowania modułów w całym procesie API).

**DoD (krok):**

- Lockfile / manifest odzwierciedlają zaktualizowane wersje.
- Backend używa ES modules jako obowiązującego modelu modułów.
- Brak otwartego sporu „czy upgrade + ESM są domknięte przed Fazą 2”.

### Krok 1.3 — Weryfikacja uruchamialności i scoped testy fundamentu

**Status:** `WYKONANY`

**Opis:** Potwierdzenie, że po aktualizacji i ESM proces API startuje; równolegle setup Jest i smoke testów fundamentu (ładowanie entry / krytycznych importów ESM) — zanim ruszy refaktor struktury i pipeline.

**DoD (krok):**

- Backend uruchamia się w środowisku deweloperskim / lokalnym zgodnym z docs deployment.
- Krytyczne odmowy startu (brakujące moduły, błędny model importów) są usunięte.
- Pliki testów scoped fazy 1 + zielona komenda Jest dla tego zakresu.

---

## MILESTONE — Backend na zaktualizowanych zależnościach

**Status:** `OSIĄGNIĘTY`

**Opis:** Bramka po Fazie 1. Zależności, ES modules i scoped testy fundamentu są domknięte; wolno wchodzić w refaktor struktury katalogów **wraz z** pipeline R2.

**DoD (milestone):**

- Faza 1 ma status `WYKONANY` (lub wszystkie obowiązkowe DoD jej kroków są spełnione).
- Backend działa na zaktualizowanych zależnościach i ES modules.
- Prowadzący prace akceptuje start Fazy 2.

---

## Faza 2 — Struktura katalogów (Blok B) + pipeline warstw (R2)

**Status:** `WYKONANY`

**Opis:** Jedna faza zamiast dawnego rozdzielenia „najpierw mapa folderów, potem cienkie controllery”: przeniesienie `backend/` do drzewa docelowego z `docs/architektura_katalogi_pliki.md` (**Blok B**) **oraz** domknięcie pipeline `routes → controllers → services → database` (R2, SPEC-BACKEND B-1–B-4, B-10) w tym samym przejściu. Podfoldery `services/<obszar>/` (w tym **`services/board/`**), `shell/` dla otoczki; przy przenosinach **od razu** cienki controller + reguły w service — **bez** etapu „gruba logika pod właściwym obszarem”.

**Refaktor względem:** wcześniejsza Faza 2 (tylko mapa katalogów, dopuszczająca tymczasowo gruby controller) + wcześniejsza Faza 6 (pipeline R2). Cel operacyjny: jeden pass po obszarach sierocych zamiast dwóch.

**Zakres tej fazy (jawne ograniczenie):** pełna migracja na Prisma pozostaje w **Fazie 7** — tu `database/` może nadal opierać się o historyczny dostęp (pool / `*Queries`), byle granica warstw była respektowana (controllers/routes/tasks nie omijają `database/` / services). Nie uznawać Fazy 2 za domknięcie R6.

**DoD (faza):**

- Układ katalogów backendu odpowiada Blokowi B (z wyjątkiem domknięcia Prisma z Fazy 7).
- Rdzeń (w tym `board/`) i otoczka (`shell/`) są rozdzielone w mapie services zgodnie z docs.
- Refaktorowane przypadki użycia HTTP przechodzą pełny pipeline warstw; logika biznesowa nie siedzi w routes ani w grubych controllerach.
- Błędy z services mają kształt B-10 i mapują się na envelope HTTP.
- Services nie zależą od Express (`res.json` itd.).
- Scoped testy mapy obszarów + reguł/services / mapowania błędów dla objętych ścieżek są zielone (T-15).

### Krok 2.1 — Podfoldery services rdzenia i shell

**Status:** `WYKONANY`

**Opis:** Uporządkowanie services pod obszary z `docs/architektura.md`: auth, household, invitations, transactions, categories, budget, **board**, messages, notifications, users, receipt oraz `shell/` (homepage, reviews, gallery, cookiesTour).

**DoD (krok):**

- Każdy obszar rdzenia i otoczki z normy ma dom w `services/<obszar>/` lub świadome uzasadnienie wyjątku w docs.
- Istnieje **`services/board/`** jako dom logiki aplikacji ścieżki `/board` (nie w `shell/`).
- Otoczka nie miesza się z folderami rdzenia budżetowego.

### Krok 2.2 — Domknięcie luk as-is: mapa + cienkie controllery

**Status:** `WYKONANY`

**Opis:** Domknięcie obszarów rozproszonych w as-is (m.in. zaproszenia, budżet, **board/dashboard**, powiadomienia, receipt/OCR): przeniesienie do mapy Bloku B **wraz z** przesunięciem reguł i orkiestracji do services; controllery tylko mapują wejście/wyjście HTTP i wołają service.

**DoD (krok):**

- Brak „sierot” logiki zaproszeń / budżetu / board / powiadomień / OCR poza mapą obszarów z Bloku B.
- Controllery refaktorowanych ścieżek nie zawierają reguł domenowych ani bezpośredniego dostępu do DB.
- Services nie zależą od Express.

### Krok 2.3 — Układ warstw i granice (Blok B, bez Prisma)

**Status:** `WYKONANY`

**Opis:** Spójność poziomego układu `routes` / `controllers` / `services` / `database` / `configs` / `tasks` / `store` / `utils` z drzewem docelowym; pilnowanie granic importów. Przygotowanie miejsca pod Prisma bez wdrażania pełnego R6. Domknięcie adapterów cron/WS — Faza 6.

**DoD (krok):**

- Warstwy odpowiadają Blokowi B pod względem układu katalogów.
- Controllers / routes / middlewares / tasks / utils nie omijają services ani nie trzymają dostępu do danych poza regułą warstwy `database/` (pełne usunięcie raw SQL / pool — Faza 7).
- Pełna podmiana dostępu do danych na Prisma jest jawnie odłożona do Fazy 7.

### Krok 2.4 — Jednolity kształt błędu aplikacji (B-10)

**Status:** `WYKONANY`

**Opis:** Ujednolicenie obiektu błędu service (`code`, `messageKey`, `httpStatus`, opcjonalne `details`) i mapowania na HTTP (SPEC-BACKEND B-10).

**DoD (krok):**

- Refaktorowane ścieżki zwracają błędy w kształcie B-10 po stronie aplikacji.
- Odpowiedź HTTP błędu ma `status: "error"` i `message` = `messageKey`.
- Scoped testy pipeline / B-10 dla objętych ścieżek są zielone.

---

## MILESTONE — Struktura Blok B + pipeline R2

**Status:** `OSIĄGNIĘTY`

**Opis:** Bramka po Fazie 2. Katalogi, mapa obszarów (w tym `board/`) oraz cienkie controllery / B-10 są domknięte na refaktorowanych ścieżkach; Prisma jeszcze nie. Kolejne fazy budują observability, kontrakt HTTP i adaptery wewnątrz tej struktury.

**DoD (milestone):**

- Faza 2 ma status `WYKONANY`.
- Drzewo backendu jest zgodne z Blokiem B w zakresie tej fazy; R2/B-10 spełniają DoD fazy (bez wymogu domkniętego R6).
- Prowadzący prace akceptuje start Fazy 3.

---

## Faza 3 — Fundament operacyjny backendu

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Domknięcie normy observability i bazowego bezpieczeństwa HTTP: logger na stdout, publiczny health liveness, helmet oraz CORS zgodne z `docs/observability.md`, `docs/bezpieczenstwo.md`, SPEC-BACKEND i SPEC-BEZPIECZENSTWO.

**DoD (faza):**

- Logi aplikacji idą na stdout; norma plików logów / daily-rotate nie obowiązuje w stanie docelowym tej fazy.
- `GET /api/v1/health` jest publiczny, bez sekretów w body.
- Helmet i CORS są w stanie zgodnym z normą docs/SPEC.
- Scoped testy powierzchni tej fazy (np. health publiczny, smoke logger/helmet) istnieją i są zielone (T-15).

### Krok 3.1 — Logger na stdout

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Ustalenie Winston → stdout jako jedynego kanału logów aplikacji; odejście od zapisu do plików jako normy (`docs/observability.md`, SPEC-BACKEND B-14–B-15).

**DoD (krok):**

- Aplikacja emituje logi na stdout procesu.
- Brak wymogu volume / katalogu plików logów jako normy docelowej.

### Krok 3.2 — Health liveness

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Publiczny endpoint liveness procesu pod `/api/v1/health` — proste body, bez auth i bez sekretów (SPEC-BACKEND B-16, SPEC-BEZPIECZENSTWO S-18).

**DoD (krok):**

- `GET /api/v1/health` odpowiada sukcesem bez sesji.
- Body nie zawiera sekretów ani zbędnych szczegółów infrastruktury.
- Test scoped asertuje publiczny health (bez wymogu pełnego T-5).

### Krok 3.3 — Helmet i CORS

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Montaż helmet na aplikacji Express oraz whitelist CORS z credentials — zgodnie z SPEC-BEZPIECZENSTWO S-10–S-11 i docs bezpieczeństwa. DoD = **zachowanie** (nagłówki / whitelist), nie sam fakt obecności paczki w `package.json`.

**DoD (krok):**

- Odpowiedzi API noszą skutki helmet (stan po wdrożeniu normy).
- CORS z credentials nie używa `*` jako origin; whitelist jest spójna z docs.

---

## MILESTONE — Fundament observability i bezpieczeństwa HTTP

**Opis:** Bramka po Fazie 3. Backend ma obserwowalny fundament logów/health oraz bazowe nagłówki/CORS zanim wchodzi w kontrakt I/O.

**DoD (milestone):**

- Faza 3 ma status `WYKONANY`.
- Logger, health i helmet/CORS spełniają DoD fazy.
- Prowadzący prace akceptuje start Fazy 4.

---

## Faza 4 — Kontrakt komunikacji po stronie backendu

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Egzekwowanie kontraktu I/O po stronie API: prefiks `/api/v1` z **równoległym** montażem legacy (as-is bez prefiksu) do czasu przejścia klienta SPA, envelope sukces/błąd z `message` jako kluczem i18n, ochrona OCR/uploadów sesją oraz handshake WebSocket ze `SESSID` — zgodnie z `docs/dokumentacja_komunikacji.md`, SPEC-KOMUNIKACJA i powiązanymi SPEC bezpieczeństwa.

**DoD (faza):**

- Powierzchnia HTTP API jest dostępna pod `/api/v1` **oraz** (przejściowo) pod legacy ścieżkami as-is dla tych samych handlerów.
- Nowe ścieżki powstają wyłącznie pod `/api/v1`.
- Odpowiedzi sukces/błąd mają envelope ze `status` i `message` (klucz).
- OCR/upload bez sesji są odrzucane; WS bez ważnej sesji nie nawiązuje autoryzowanej sesji aplikacji.
- Scoped testy kontraktu tej fazy (v1 + legacy smoke, envelope, odmowa OCR bez sesji) istnieją i są zielone (T-15).

### Krok 4.1 — Prefiks `/api/v1` + dual mount legacy

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Montowanie ścieżek API pod `/api/v1/...` (SPEC-KOMUNIKACJA K-1) **równolegle** z legacy montażem as-is (`/auth`, `/house`, … — ten sam router / te same handlery), żeby SPA poza tym major nie traciła dostępu. Nowe endpointy tylko pod v1. Usunięcie aliasów legacy — **poza tym major**, po potwierdzeniu że klient woła v1 (zewnętrzna bramka FE / osobny major).

**DoD (krok):**

- Chronione i publiczne endpointy backendu są dostępne pod `/api/v1/...`.
- Te same handlery odpowiadają też pod ścieżkami legacy (dual mount), dopóki legacy nie zostanie świadomie usunięte poza tym planem.
- Nowe ścieżki poza `/api/v1` (i poza uzgodnionym dual mount legacy) nie są wprowadzane.
- Scoped test asertuje co najmniej jedną ścieżkę na v1 i równoważny smoke na legacy (gdy legacy jeszcze żyje).

### Krok 4.2 — Envelope i klucze i18n

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Ujednolicenie envelope HTTP oraz kierunku `message` / `messageKey` jako klucza i18n (SPEC-KOMUNIKACJA K-2, SPEC-BACKEND B-10–B-11, `docs/i18n_kontrakt_ui.md`). Dotyczy odpowiedzi niezależnie od prefiksu (v1 i legacy).

**DoD (krok):**

- Sukces i błąd mają `status` + `message` zgodnie z kontraktem.
- `message` w kierunku normy jest kluczem, nie finalnym tekstem marketingowym jednego języka.

### Krok 4.3 — OCR, uploady i handshake WS

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Wymuszenie `SESSID` na OCR i uploadach oraz odrzucenie handshake Socket.io bez ważnej sesji (SPEC-KOMUNIKACJA K-8–K-9, SPEC-BEZPIECZENSTWO S-12–S-14).

**DoD (krok):**

- OCR / upload bez sesji kończy się odmową auth.
- Połączenie WS bez ważnego cookie sesji jest odrzucane.
- Scoped testy pokrywają co najmniej odmowę OCR/upload bez sesji (WS — gdy tanie w setupie).

---

## MILESTONE — Kontrakt API v1 (z dual mount legacy)

**Opis:** Bramka po Fazie 4. Kontrakt HTTP/WS po stronie backendu jest domknięty na poziomie prefiksu v1, kompatybilności legacy, envelope i auth brzegu. Usunięcie legacy nie jest DoD tej bramki.

**DoD (milestone):**

- Faza 4 ma status `WYKONANY`.
- Prefiks v1 + dual mount, envelope oraz ochrona OCR/WS spełniają DoD fazy.
- Prowadzący prace akceptuje start Fazy 5.
- Uwaga zakresu: usunięcie legacy oraz pełne przełączenie SPA na `/api/v1` — **poza** tym major (zewnętrzna bramka FE).

---

## Faza 5 — Role `inmate` (R1, zakres backend)

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Ujednolicenie nazwy roli domownika na `inmate` w tokenie, middleware, komunikatach i grupach uprawnień backendu oraz spójność reguł `user` / `host` / `inmate` / `superadmin` po stronie API — zgodnie z `docs/dokumentacja_koncepcyjna.md`, `docs/bezpieczenstwo.md`, SPEC-BACKEND B-12 i SPEC-BEZPIECZENSTWO (R1 bez zmiany modelu uprawnień host/inmate). Cut aliasów historycznych — bez utrzymywania `mate` / `mates` jako trwałej kompatybilności w refaktorowanym kodzie. W tym samym oknie R1: rename helpera WS `broadcastToHouseMates` → **`broadcastToHousehold`** (bez zmiany kontraktu eventów `type` / payload).

**DoD (faza):**

- W refaktorowanym kodzie backendu nie ma roli `mate` / grupy `mates` — jest `inmate`.
- Helper push do domu nazywa się `broadcastToHousehold`; brak `broadcastToHouseMates` / trwałego aliasu w refaktorowanym kodzie.
- Reguły host vs inmate vs user vs superadmin są egzekwowane na API zgodnie z docs.
- Scoped testy authz (odmowa złej roli; akceptacja `inmate` tam, gdzie norma) istnieją i są zielone (T-15).

### Krok 5.1 — Rename w tokenie, middleware i komunikatach

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Zamiana historycznej nazwy `mate` na `inmate` we wszystkich miejscach backendu objętych R1 (token, middleware, komunikaty, grupy).

**DoD (krok):**

- Refaktorowany backend używa wyłącznie `inmate` dla roli domownika.
- Brak aliasów historycznych w nowym / refaktorowanym kodzie ścieżek authz.

### Krok 5.2 — Reguły ról po stronie API

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Potwierdzenie reguł produktowych na serwerze: host zarządza składem; inmate korzysta z rdzenia bez uprawnień hosta; user bez domu; superadmin ≠ host gospodarstwa (SPEC-BEZPIECZENSTWO S-7–S-9).

**DoD (krok):**

- Chroniony endpoint z niewystarczającą rolą kończy się odmową uprawnień.
- Membership / `houseId` weryfikuje serwer — bez ufania samemu body klienta.
- Scoped testy pokrywają krytyczne odmowy / akceptacje ról zmienione w tej fazie.

### Krok 5.3 — Rename `broadcastToHouseMates` → `broadcastToHousehold`

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Refaktor względem: helper `broadcastToHouseMates` w `configs/websocketConfig.js` oraz call site’y (`handleNotification`, `liveUpdateBalance`, `handleBroadcastInitBudget`, …). Cel: jedna funkcja **`broadcastToHousehold(houseId, { type, data })`** — bez drugiego API roomów, bez trwałego aliasu eksportu pod starą nazwą. Kontrakt WS (`type`, payload) bez zmian. Zaktualizować docs komunikacji i SPEC-KOMUNIKACJA (K-11) w tym samym przejściu.

**DoD (krok):**

- W refaktorowanym backendzie eksport i wywołania używają `broadcastToHousehold`.
- Brak `broadcastToHouseMates` jako normy / trwałego aliasu w objętych plikach.
- Docs / SPEC wskazują `broadcastToHousehold` (nie `…Mates`).
- Semantyka push (wszyscy członkowie domu z aktywnym socketem) i katalog `type` bez zmian.

---

## MILESTONE — Role zgodne z normą po stronie backendu

**Opis:** Bramka po Fazie 5. Backend egzekwuje normę ról `inmate` oraz nazwę helpera `broadcastToHousehold`; pełne domknięcie produktowe z UI pozostaje poza tym major.

**DoD (milestone):**

- Faza 5 ma status `WYKONANY`.
- R1 w zakresie backendu (w tym Krok 5.3) jest domknięte według DoD fazy.
- Prowadzący prace akceptuje start Fazy 6.

---

## Faza 6 — Adaptery cron i WebSocket (R4)

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Utrzymanie cron i Socket.io jako adapterów w procesie API: `tasks/` wołają te same services co HTTP; push WS jest skutkiem ubocznym przepływu aplikacji, z katalogiem eventów z docs — bez workerów i bez omijania services (`docs/architektura.md` R4, SPEC-BACKEND B-5, SPEC-KOMUNIKACJA K-9–K-12).

**Refaktor względem numeracji:** wcześniejsza Faza 7 w poprzedniej wersji planu.

**DoD (faza):**

- Taski mutujące dane nie omijają services.
- Emitowane typy zdarzeń WS mieszczą się w katalogu docs; adresowanie przez ustalone helpery broadcast.
- Brak top-level workerów jako celu v1.
- Scoped testy adapterów (cron → service; kluczowy event WS gdy tanie) istnieją i są zielone (T-15).

### Krok 6.1 — Cron przez services

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Harmonogramy (bilans, snapshoty itd.) wołają services — nie warstwę danych / raw SQL bezpośrednio.

**DoD (krok):**

- Mutujące `tasks/` przechodzą przez services.
- Brak bezpośredniego raw SQL / ORM z tasków w ścieżkach objętych tą fazą (docelowo całość — wraz z Fazą 7).

### Krok 6.2 — Push WS jako skutek uboczny

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Emisja ustalonych eventów (`notification`, `newMessage`, `balance_update`, …) po mutacjach HTTP/service; adresowanie przez `broadcastMessage` / `broadcastToHousehold` (nazwa po Kroku 5.3) bez osobnego „room API”.

**DoD (krok):**

- Po mutacji wyzwalającej push klient otrzymuje ustalony `type` z katalogu docs.
- Brak zmyślonych eventów / roomów poza normą bez aktualizacji docs/SPEC.
- Scoped testy pokrywają co najmniej jedną ścieżkę push (lub równoważny unit helperów broadcast), gdy setup na to pozwala.

---

## MILESTONE — Adaptery bez omijania warstwy aplikacji

**Opis:** Bramka po Fazie 6. Cron i WS są adapterami nad services; można wchodzić w persistencję Prisma.

**DoD (milestone):**

- Faza 6 ma status `WYKONANY`.
- Adaptery spełniają DoD fazy.
- Prowadzący prace akceptuje start Fazy 7.

---

## Faza 7 — Persistencja Prisma (R6)

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Wprowadzenie Prisma ORM + Migrate jako jedynego dostępu do MySQL: schemat i migracje w repo (`backend/prisma/`), warstwa `database/` na kliencie Prisma, usunięcie pool / `*Queries` / raw SQL ze stanu docelowego, seed dev/test oraz atomowość saldo + transakcja — zgodnie z `docs/model_danych.md`, `docs/architektura.md` (R6), SPEC-DANE i SPEC-BACKEND B-6–B-9. Reguły salda z Fazy 2 (services) pozostają w services — tu dokładana jest atomowość Prisma, bez drugiego modelu spójności.

**Refaktor względem numeracji:** wcześniejsza Faza 8 w poprzedniej wersji planu.

**DoD (faza):**

- Odczyty/zapisy runtime idą przez Prisma w `database/`.
- Zmiany schematu mają migracje w historii Prisma Migrate.
- Seed wypełnia bazę dev/test minimalnym zestawem; mutacja transakcji utrzymuje spójne saldo domu.
- Scoped testy persistencji (seed + atomowość saldo/transakcja na ścieżkach objętych) istnieją i są zielone (T-15).

### Krok 7.1 — Schemat, migracje i warstwa `database/`

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** `backend/prisma/schema.prisma` jako źródło prawdy schematu; obowiązkowe migracje; singleton klienta i moduły dostępu wyłącznie w `database/`.

**DoD (krok):**

- Schemat i migracje są w repozytorium zgodnie z normą docs/SPEC-DANE.
- Controllers / routes / tasks / utils / services nie importują klienta Prisma bezpośrednio (services wołają API `database/`).

### Krok 7.2 — Migracja z pool / `*Queries` i zakaz raw SQL

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Przejście ścieżek runtime z historycznego pool + `*Queries` na Prisma; usunięcie raw SQL (w tym ad-hoc / `$queryRaw`) ze stanu docelowego.

**DoD (krok):**

- W ścieżkach runtime brak `*Queries` / pool raw SQL.
- Raw SQL nie jest używany jako norma dostępu do danych.

### Krok 7.3 — Seed oraz spójność saldo + transakcja

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Seed Prisma dla dev i test (bez seeda na prod deploy); orkiestracja mutacji transakcji z aktualizacją salda domu w jednej atomowej operacji aplikacji (SPEC-DANE D-11, D-15–D-17) — ta sama reguła salda z services (Faza 2), wzmocniona transakcją Prisma.

**DoD (krok):**

- Seed powtarzalnie wypełnia bazę dev/test minimalnym zestawem.
- Po sukcesie API dodania transakcji saldo domu jest spójne (brak trwałego rozjazdu).
- Scoped testy seed + spójność salda są zielone.

---

## MILESTONE — Dane wyłącznie przez Prisma

**Opis:** Bramka po Fazie 7. Persistencja jest na Prisma; wolno dodać outbound e-mail. Testy scoped już towarzyszyły fazom — seed wzmacnia kolejne asercje.

**DoD (milestone):**

- Faza 7 ma status `WYKONANY`.
- R6 spełnia DoD fazy (Prisma, migracje, brak raw SQL w stanie docelowym, seed).
- Prowadzący prace akceptuje start Fazy 8.

---

## Faza 8 — E-mail outbound (K-14)

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Wdrożenie wychodzącego e-maila przy zaproszeniach: wysyłka po walidacji HTTP w service, treść z linkiem/instrukcją i kontekstem domu, sekrety SMTP wyłącznie w env. Mail uzupełnia HTTP/WS — nie zastępuje ich jako jedynego kanału (SPEC-KOMUNIKACJA K-13–K-14, `docs/dokumentacja_komunikacji.md`, `docs/katalog_env.md`). DoD = **podpięcie zachowania** (nawet jeśli `nodemailer` już jest w deps).

**Refaktor względem numeracji:** wcześniejsza Faza 9 w poprzedniej wersji planu.

**DoD (faza):**

- Po walidacji operacji zaproszenia może wyjść e-mail do kandydata.
- Sekrety SMTP nie są w repozytorium.
- Flow zaproszenia nadal działa bez skrzynki jako jedynego kanału (HTTP/WS / notice pozostają).
- Scoped testy (trigger po walidacji; mock transportu SMTP) istnieją i są zielone (T-15).

### Krok 8.1 — Trigger z service po walidacji HTTP

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Podpięcie wysyłki jako skutku ubocznego service zaproszeń po udanej walidacji HTTP — nie jako osobna powierzchnia produktu.

**DoD (krok):**

- E-mail wychodzi dopiero po walidacji reguł zaproszenia w service.
- Brak oparcia produktu wyłącznie na mailu przed/bez HTTP.

### Krok 8.2 — Treść i sekrety SMTP

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Treść z instrukcją/linkiem dołączenia i kontekstem domu; konfiguracja transportu z env (bez sekretów w git).

**DoD (krok):**

- Wiadomość zawiera instrukcję/link dołączenia i kontekst domu.
- Sekrety SMTP są tylko w env / secrets runtime.

### Krok 8.3 — Mail nie jest jedynym kanałem

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Potwierdzenie, że zaproszenia i powiadomienia pozostają dostępne przez HTTP i WS / notice zgodnie z K-13.

**DoD (krok):**

- Flow zaproszenia da się domknąć bez polegania wyłącznie na dostarczeniu maila.
- Awaria skrzynki nie jest jedyną ścieżką blokującą produktowe zaproszenie w normie v1.
- Scoped testy K-14 (mock SMTP) są zielone.

---

## MILESTONE — Outbound e-mail przy zaproszeniach

**Opis:** Bramka po Fazie 8. Outbound przy zaproszeniach jest wdrożony zgodnie z K-14; można wejść w weryfikację pełnej piramidy testów.

**DoD (milestone):**

- Faza 8 ma status `WYKONANY`.
- K-14 w zakresie tego major jest spełnione według DoD fazy.
- Prowadzący prace akceptuje start Fazy 9.

---

## Faza 9 — Weryfikacja strategii testów backendu (Jest)

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** **Weryfikacja i domknięcie** piramidy Jest zbudowanej równolegle w fazach 1–8: unit / integration / E2E API, minimum ścieżek krytycznych T-5, izolowana baza + seed, egzekwowanie DoD T-11–T-13. Nie jest to faza „pierwszych testów” — to audyt kompletności względem SPEC-TESTY / `docs/testy.md`. Frontend świadomie poza strategią v1.

**Refaktor względem numeracji:** wcześniejsza Faza 10 w poprzedniej wersji planu.

**DoD (faza):**

- Ustalona komenda testów w `backend/` przechodzi lokalnie na bazie testowej (pełna suita faz, nie tylko ostatni scoped).
- Scenariusze krytyczne E2E API (auth, gospodarstwo, zaproszenie→inmate, transakcja) istnieją lub są świadomie pokryte równoważnie według SPEC-TESTY T-5.
- Potwierdzone, że fazy 1–8 miały scoped zielone testy (T-15) i że DoD T-11–T-13 obowiązuje przy dalszych zmianach.

### Krok 9.1 — Audyt piramidy i domknięcie T-5

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Przegląd luk względem T-1–T-5; uzupełnienie brakujących E2E / unit na ścieżkach krytycznych; wąski WS tylko jako skutek uboczny, gdy tanie w setupie.

**DoD (krok):**

- Jest pokrycie unit dla reguł (saldo, membership, role, zaproszenia) sensownie wymaganych przez T-1 / T-5.
- Scenariusz auth E2E API asertuje kontrakt `/api/v1` + cookie sesji (legacy dual mount nie jest wymagany w asercji docelowej T-5).
- Asercje dotyczą zachowania i kontraktu, nie prywatnych zapytań SQL/Prisma.
- Luki ze scoped faz 1–8 są domknięte albo świadomie zaakceptowane z wpisem w DoD.

### Krok 9.2 — Izolacja, seed i trwałość DoD

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Potwierdzenie osobnej bazy testowej, seed/fixtures oraz trwałego egzekwowania DoD przed merge/push (SPEC-TESTY T-8–T-13, T-15).

**DoD (krok):**

- Testy nie biegają na produkcji ani na nieizolowanym demo.
- Seed/fixtures wystarczają do ścieżek krytycznych T-5.
- Zasada DoD testów (w tym scoped per faza przy dalszym major / zmianach) jest przyjęta i stosowana.

<!-- Brak MILESTONE zamykającego po Fazie 9 — decyzja wywiadu. -->
