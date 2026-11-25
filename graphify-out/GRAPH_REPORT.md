# Graph Report - home-budget-manager  (2026-11-25)

## Corpus Check
- 384 files · ~184,756 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 9, .traineddata 2, .example 1)

## Summary
- 1906 nodes · 4319 edges · 111 communities (102 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4dd94e1b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Home Budget Manager — feature plan: backend Faza 3 + Faza 4 (ops + kontrakt)
- KROK 1 — Izolacja środowiska testowego + helpery + seed/fixtures pod T-5
- index.js
- httpAgent.js
- Home Budget Manager — major plan (backend)
- Home Budget Manager — feature plan: frontend Faza 3 + Faza 4 (stan + HTTP `/api/v1`)
- Home Budget Manager — major plan (frontend)
- Grupy zasobów — operacje
- Home Budget Manager — feature plan: frontend Fazy 6–8 (i18n `api`, WS, bezpieczeństwo klienta)
- Home Budget Manager — feature plan: frontend Faza 1 + Faza 2 (mapa SPA)
- Model danych — Home Budget Manager
- frontend/package.json
- dependencies
- dependencies
- logger.js
- backend/package.json
- Architektura — Home Budget Manager
- backend/utils/validation.js
- DashBoardMenu.jsx
- SPEC — Backend
- SPEC — Bezpieczeństwo
- KROK 1 — Helper kwot (2 dp) + walidacja brzegu add
- SPEC — Testy (backend)
- SPEC — Dane (persistencja)
- SPEC — Frontend (SPA)
- devDependencies
- SPEC — Komunikacja (I/O)
- KROK 1 — Adapter SMTP (nodemailer) + sekrety w env + scoped testy adaptera
- Anty-patterny — Home Budget Manager
- Bezpieczeństwo — Home Budget Manager
- KROK 1 — Rename `mate` → `inmate` (token, DB, middleware, routes, komunikaty)
- Przepływy danych — Home Budget Manager
- Wdrożenie i operacje — Home Budget Manager
- Dokumentacja koncepcyjna — Home Budget Manager
- Observability — Home Budget Manager
- react
- KROK 3 — Push WS jako skutek uboczny + scoped testy (T-15)
- routerConfig.jsx
- Architektura katalogów i plików — Home Budget Manager
- Strategia testów — Home Budget Manager
- socketContext.jsx
- useAuth
- Słownik — Home Budget Manager
- i18n i kontrakt UI — Home Budget Manager
- react-i18next
- Katalog zmiennych środowiskowych — Home Budget Manager
- App.jsx
- KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma)
- showInfoToast
- Project: Web Home Budget Manager
- app.js
- 3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`
- FAZA 1 — Aktualizacja zależności + ESM + scoped fundament
- KROK 1 — Szablony + podpięcia triggerów
- Home Budget Manager — feature plan: backend Faza 1 + Faza 2 (Blok B + R2)
- KROK 4 — Audyt granic warstw + scoped testy mapy / B-10 / pipeline
- FAZA 2 — Blok B + pipeline R2 (cienkie controllery, B-10; bez Prisma)
- scripts
- SPEC — jak czytać
- devDependencies
- scripts
- Dokumentacja — Home Budget Manager
- 3.B — Auth (`services/auth/`)
- jest.config.js
- services-layout.test.js
- frontend/README.md
- imagesArray.js
- balanceHouseholdsMonthly.js
- 3.D — Invitations (`services/invitations/`)
- KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout
- HouseInfoPage.jsx
- 3.C — Board (`services/board/`)
- prismaClient.js
- KROK 2 — Moduły `database/` na Prisma (API zamiast `*Queries`)
- addNewMonthlyBudget.js
- socketEventCatalog.js
- KROK 1 — Rename `mate` → `inmate` (guardy, URL, locale, kontrakt board)
- avatarController.js
- KROK 3 — Przełączenie services / utils / store / configs na API `database/`
- FAZA 1 — Persistencja Prisma (R6)
- Faza 11 — Porty I/O przed adapterami chmurowymi
- KROK 1 — Fundament: zależności, `db pull`, migracja bazowa, singleton
- Faza 2 — Struktura katalogów (Blok B) + pipeline warstw (R2)
- transactions.js
- Home Budget Manager — feature plan: backend Faza 7 (Persistencja Prisma / R6)
- Faza 10 — Cutover legacy HTTP (wyłącznie `/api/v1`)
- Faza 1 — Aktualizacja zależności backendu
- Faza 3 — Fundament operacyjny backendu
- calendarLocalizer.js
- scoped-phases-inventory.test.js
- getBoardData.js
- Faza 4 — Kontrakt komunikacji po stronie backendu
- addUserByInmate.js
- Faza 5 — Role `inmate` (R1, zakres backend)
- notifications.js
- Faza 7 — Persistencja Prisma (R6)
- Faza 8 — E-mail outbound (K-14)
- Faza 6 — Adaptery cron i WebSocket (R4)
- messagesController.js
- Faza 9 — Weryfikacja strategii testów backendu (Jest)
- households.js
- AppError
- AppModal.jsx
- swaggerConfig.js
- Faza 9.1 — Saldo: reverse przy delete + walidacja kwot (2 dp)
- Faza 9.2 — Authz usuwania transakcji (inmate own / host house-wide)
- Faza 9.3 — Zaproszenia: notice trwały, status-log, unit + E2E
- Faza 9.4 — Cztery szablony e-mail zaproszeń + mock w testach

## God Nodes (most connected - your core abstractions)
1. `AppError` - 104 edges
2. `react-i18next` - 67 edges
3. `runController()` - 59 edges
4. `logger` - 58 edges
5. `react` - 50 edges
6. `useAuth()` - 45 edges
7. `showInfoToast()` - 41 edges
8. `showErrorToast()` - 39 edges
9. `sendRequest()` - 31 edges
10. `@iconify/react` - 29 edges

## Surprising Connections (you probably didn't know these)
- `FastActions()` --indirect_call--> `AddReviewModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/components/modals/AddReviewModal.jsx
- `FastActions()` --indirect_call--> `AddTransactionModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/components/modals/AddTransactionModal.jsx
- `FastActions()` --indirect_call--> `ChangeEmailModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/components/modals/ChangeEmailModal.jsx
- `FastActions()` --indirect_call--> `CookiesModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/components/modals/CookiesModal.jsx
- `FastActions()` --indirect_call--> `showInfoToast()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/configs/toastify.jsx

## Import Cycles
- None detected.

## Communities (111 total, 6 thin omitted)

### Community 0 - "Home Budget Manager — feature plan: backend Faza 3 + Faza 4 (ops + kontrakt)"
Cohesion: 0.06
Nodes (33): Audyt uploadów, `authRoutes.js` — `GET /verify`, CORS — refaktor względem as-is `server.js`, FAZA 1 — Fundament operacyjny (major Faza 3), FAZA 2 — Kontrakt komunikacji (major Faza 4), Helmet (Context7 `/helmetjs/helmet` v8), Home Budget Manager — feature plan: backend Faza 3 + Faza 4 (ops + kontrakt), KROK 1 — Logger stdout: audyt B-14/B-15 (+25 more)

### Community 1 - "KROK 1 — Izolacja środowiska testowego + helpery + seed/fixtures pod T-5"
Cohesion: 0.06
Nodes (32): Biblioteki, Biblioteki, Biblioteki / API, DoD (krok), DoD (krok), DoD (krok), DoD (krok), FAZA 1 — Weryfikacja strategii testów backendu (Jest) (+24 more)

### Community 2 - "index.js"
Cohesion: 0.07
Nodes (41): updateAvatarName(), createUserDirectory(), __dirname, __filename, deleteFiles(), __dirname, __filename, sessionRequired (+33 more)

### Community 3 - "httpAgent.js"
Cohesion: 0.20
Nodes (16): resetMailTransporterForTests(), setMailTransporterForTests(), categoriesPath, __dirname, ensureSeedCategories(), prepareE2eDatabase(), resetMutatingTables(), SEED_CAT (+8 more)

### Community 4 - "Home Budget Manager — major plan (backend)"
Cohesion: 0.13
Nodes (14): Historia zmian planu (operacyjne), Home Budget Manager — major plan (backend), MILESTONE — Adaptery bez omijania warstwy aplikacji, MILESTONE — API wyłącznie pod `/api/v1`, MILESTONE — Backend na zaktualizowanych zależnościach, MILESTONE — Dane wyłącznie przez Prisma, MILESTONE — Fundament observability i bezpieczeństwa HTTP, MILESTONE — Kontrakt API v1 (z dual mount legacy) (+6 more)

### Community 5 - "Home Budget Manager — feature plan: frontend Faza 3 + Faza 4 (stan + HTTP `/api/v1`)"
Cohesion: 0.06
Nodes (34): Checklist jakości skilla, FAZA 1 — Model stanu (Context + Zustand), FAZA 2 — Kontrakt klienta HTTP (`/api/v1`, credentials, envelope), `fetchData.js` — kompletny docelowy, Gotowość WS (opis + minimalny kod), Home Budget Manager — feature plan: frontend Faza 3 + Faza 4 (stan + HTTP `/api/v1`), Implementacja, Implementacja — poprawki + spójny eksport (+26 more)

### Community 6 - "Home Budget Manager — major plan (frontend)"
Cohesion: 0.04
Nodes (46): Faza 1 — Aktualizacja zależności frontendu, Faza 2 — Układ SPA (R5) + granice prezentacja vs orkiestracja, Faza 3 — Model stanu (Context + Zustand), Faza 4 — Kontrakt klienta HTTP (`/api/v1`, credentials, envelope), Faza 5 — Role `inmate` w UI (R1, zakres frontend), Faza 6 — i18n: namespace `api` + mapowanie `message`, Faza 7 — Klient WebSocket wg kontraktu, Faza 8 — Bezpieczeństwo klienta i granica zaufania (+38 more)

### Community 7 - "Grupy zasobów — operacje"
Cohesion: 0.05
Nodes (38): Auth, Auth — `/api/v1/auth`, Awatary — `/api/v1/avatars`, Budżet miesięczny — `/api/v1/initmonthly`, Cel i zakres, Dashboard — `/api/v1/board`, Dokumentacja komunikacji — Home Budget Manager, Envelope odpowiedzi (+30 more)

### Community 8 - "Home Budget Manager — feature plan: frontend Fazy 6–8 (i18n `api`, WS, bezpieczeństwo klienta)"
Cohesion: 0.06
Nodes (33): Audyt (DoD checklist — wykonać przy implementacji), FAZA 1 — i18n: namespace `api` + mapowanie `message` [= major Faza 6], FAZA 2 — Klient WebSocket wg kontraktu [= major Faza 7], FAZA 3 — Bezpieczeństwo klienta i granica zaufania [= major Faza 8], Home Budget Manager — feature plan: frontend Fazy 6–8 (i18n `api`, WS, bezpieczeństwo klienta), KROK 1 — Brak sekretów w bundlu / `VITE_*`, KROK 1 — Handshake sesyjny + katalog dozwolonych `type`, KROK 1 — Namespace `api` (pl/en) + konwencja + helper (+25 more)

### Community 10 - "Home Budget Manager — feature plan: frontend Faza 1 + Faza 2 (mapa SPA)"
Cohesion: 0.08
Nodes (25): `DashboardPage.jsx` — zamień ciało na cienką prezentację + hook, FAZA 1 — Aktualizacja zależności frontendu, FAZA 2 — Układ SPA (R5) + granice prezentacja vs orkiestracja, Historia sesji planu, Home Budget Manager — feature plan: frontend Faza 1 + Faza 2 (mapa SPA), `HouseInfoPage.jsx` — użyj hooka; gałąź roli zostaje jako odzwierciedlenie UX (bez rename R1), Kolejność implementacji w kroku, KROK 1 — Inwentaryzacja zależności vs stack SPEC-FRONTEND (+17 more)

### Community 11 - "Model danych — Home Budget Manager"
Cohesion: 0.08
Nodes (25): `actionCategories`, Cel, Diagram relacji (rdzeń), Galeria screenshotów, `households`, `householdUsers`, `initialMonthlyBudgets`, `invitations` (+17 more)

### Community 12 - "frontend/package.json"
Cohesion: 0.09
Nodes (22): eslint, @eslint/js, globals, name, private, type, version, eslint-plugin-react (+14 more)

### Community 13 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcrypt, cookie, cookie-parser, cors, dotenv, express, helmet (+15 more)

### Community 15 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, chart.js, framer-motion, i18next, i18next-browser-languagedetector, i18next-http-backend, @iconify/react, moment (+13 more)

### Community 16 - "logger.js"
Cohesion: 0.14
Nodes (19): logFormat, logger, extractPhotoData(), broadcastMessage(), broadcastToHousehold(), initializeWebSocket(), extractReceipt(), listMemberUserIds() (+11 more)

### Community 17 - "backend/package.json"
Cohesion: 0.09
Nodes (22): author, description, engines, node, eslint, @eslint/js, globals, license (+14 more)

### Community 18 - "Architektura — Home Budget Manager"
Cohesion: 0.10
Nodes (20): Architektura — Home Budget Manager, Bezpieczeństwo i granice zaufania, Cel dokumentu, Decyzje świadomie odroczone, Dostęp do danych: Prisma ORM, Dziedziczenie stylu, Frontend (stan faktyczny), Jak czytać dalej (+12 more)

### Community 19 - "backend/utils/validation.js"
Cohesion: 0.06
Nodes (41): jwtCookieOptions, loginUserHandler(), logoutUserHandler(), registerUserHandler(), createHouseholdUserRow(), createUser(), findSuperadmin(), findUserByEmail() (+33 more)

### Community 20 - "DashBoardMenu.jsx"
Cohesion: 0.06
Nodes (42): HeaderIconsContainer(), MostActiveMates(), NotificationDot(), NotificationsContainer(), OpenMenuButton(), DashBoardMenu(), SendMessageBtn(), Home() (+34 more)

### Community 21 - "SPEC — Backend"
Cohesion: 0.12
Nodes (17): Błędy, Cel / zakres względem dokumentacji, Dane (Prisma), Helpery, Kryteria akceptacji (obserwowalne), Model modułów (ESM), Nie wolno, Observability (+9 more)

### Community 22 - "SPEC — Bezpieczeństwo"
Cohesion: 0.12
Nodes (17): Autoryzacja, Cel / zakres względem dokumentacji, Health, Helmet i CORS, Kryteria akceptacji (obserwowalne), Nie wolno, Poza zakresem tego SPEC, Sekrety i logi (+9 more)

### Community 23 - "KROK 1 — Helper kwot (2 dp) + walidacja brzegu add"
Cohesion: 0.07
Nodes (27): Dopasowanie unit z FAZA 1 po zmianie sygnatury delete, FAZA 1 — Saldo: reverse przy delete + walidacja kwot (2 dp), FAZA 2 — Authz usuwania transakcji (inmate own / host house-wide), Home Budget Manager — feature plan: backend Faza 9.1–9.2 (saldo reverse + authz delete), KROK 1 — Helper kwot (2 dp) + walidacja brzegu add, KROK 1 — Reguła ownership w service / database, KROK 2 — Mapowanie 403/404 + testy E2E, KROK 2 — Reverse salda przy delete (type z rekordu) (+19 more)

### Community 24 - "SPEC — Testy (backend)"
Cohesion: 0.12
Nodes (16): Cel / zakres względem dokumentacji, CI, Co asertować, Definition of Done, Kryteria akceptacji (obserwowalne), Nie wolno, Piramida, Poza zakresem tego SPEC (+8 more)

### Community 25 - "SPEC — Dane (persistencja)"
Cohesion: 0.13
Nodes (15): Cel / zakres względem dokumentacji, Granica dostępu, Kryteria akceptacji (obserwowalne), Nie wolno, Poza zakresem tego SPEC, Prisma Studio, Reguły spójności modelu (egzekwowane w services + database), Schemat i migracje (+7 more)

### Community 26 - "SPEC — Frontend (SPA)"
Cohesion: 0.13
Nodes (15): Bezpieczeństwo klienta, Cel / zakres względem dokumentacji, i18n, Komunikacja, Kryteria akceptacji (obserwowalne), Nie wolno, Poza zakresem tego SPEC, SPEC — Frontend (SPA) (+7 more)

### Community 27 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss (+5 more)

### Community 28 - "SPEC — Komunikacja (I/O)"
Cohesion: 0.14
Nodes (14): Cel / zakres względem dokumentacji, E-mail outbound, HTTP — kontrakt wspólny, HTTP — multipart, Kryteria akceptacji (obserwowalne), Nie wolno, Poza zakresem tego SPEC, SPEC — Komunikacja (I/O) (+6 more)

### Community 29 - "KROK 1 — Adapter SMTP (nodemailer) + sekrety w env + scoped testy adaptera"
Cohesion: 0.08
Nodes (23): DoD (krok), DoD (krok), DoD (krok), FAZA 1 — E-mail outbound przy zaproszeniach (K-14), Home Budget Manager — feature plan: backend Faza 8 (e-mail outbound / K-14), Komenda, Komenda, Komenda (scoped) (+15 more)

### Community 30 - "Anty-patterny — Home Budget Manager"
Cohesion: 0.15
Nodes (13): 10. Traktowanie otoczki jak rdzenia uprawnień budżetu, 11. (Bonus kontraktu) Nowe ścieżki bez prefiksu `/api/v1`, 1. Gruby controller / Prisma lub SQL poza warstwą `database`, 2. Reguły uprawnień tylko na froncie, 3. Drift ról (`mate` vs `inmate`, grupa `mates`), 4. Publiczny OCR / endpoint bez JWT „bo tak wyszło”, 5. Mieszane PL/EN w `message` jako kontrakt dla UI, 6. Logika biznesowa w komponencie React + dubel w API (+5 more)

### Community 31 - "Bezpieczeństwo — Home Budget Manager"
Cohesion: 0.15
Nodes (13): Autoryzacja (role), Bezpieczeństwo — Home Budget Manager, Cel, CORS, Granica zaufania, Health, Nagłówki HTTP (Helmet), Sekrety i logi (+5 more)

### Community 32 - "KROK 1 — Rename `mate` → `inmate` (token, DB, middleware, routes, komunikaty)"
Cohesion: 0.07
Nodes (29): Audyt reguł (obowiązkowy checklist w implementacji), Biblioteki / API, DoD (krok), DoD (krok), DoD (krok), FAZA 1 — Role `inmate` (R1) + `broadcastToHousehold`, Home Budget Manager — feature plan: backend Faza 5 (R1 `inmate` + `broadcastToHousehold`), Komenda (+21 more)

### Community 33 - "Przepływy danych — Home Budget Manager"
Cohesion: 0.12
Nodes (16): A. Rejestracja i logowanie, B. Utworzenie gospodarstwa (`user` → `host`), C1. Host dodaje od razu, C2. Inmate inicjuje → host decyduje, C. Zaproszenie → `inmate`, Cel, D. Dodanie / usunięcie transakcji, Dodanie (+8 more)

### Community 34 - "Wdrożenie i operacje — Home Budget Manager"
Cohesion: 0.17
Nodes (12): Architektura runtime (production), Cel, Checklist po deployu (smoke), CI / CD, Local — ścieżka deweloperska, Migracje przy deployu (obowiązkowe — R6 wdrożone), Operacje codzienne (skrót), Poza zakresem tego dokumentu (+4 more)

### Community 35 - "Dokumentacja koncepcyjna — Home Budget Manager"
Cohesion: 0.17
Nodes (12): Cel produktu, Dla kogo jest dokumentacja, Dokumentacja koncepcyjna — Home Budget Manager, Główne założenia, Kryteria sukcesu (opis funkcjonalny), Otoczka / część operacyjna, Powiązane, Poza zakresem (+4 more)

### Community 36 - "Observability — Home Budget Manager"
Cohesion: 0.18
Nodes (11): Alerting i SLI/SLO, Cel, Filary v1, Gdzie powstają sygnały, Granice względem innych docs, Healthcheck (norma docs), Instrumentacja, Konwencje (+3 more)

### Community 37 - "react"
Cohesion: 0.26
Nodes (12): LossOrGainChart(), DisplayLiveBalance(), MonthlyBudget(), MatesCounter(), useHouseInfoDashboard(), useProcessedData(), DataContext, DataProvider() (+4 more)

### Community 38 - "KROK 3 — Push WS jako skutek uboczny + scoped testy (T-15)"
Cohesion: 0.08
Nodes (23): Audyt push (obowiązkowy w implementacji), Biblioteki, DoD (krok), DoD (krok), DoD (krok), FAZA 1 — Adaptery cron i WebSocket (R4), Home Budget Manager — feature plan: backend Faza 6 (adaptery cron + WebSocket / R4), Komenda (+15 more)

### Community 39 - "routerConfig.jsx"
Cohesion: 0.12
Nodes (24): DashboardHeader(), DescriptionSection(), TechnologiesSection(), showCookiesInfo(), useDocumentTitle(), AboutUs(), AdminPanelPage(), ManageUsers() (+16 more)

### Community 40 - "Architektura katalogów i plików — Home Budget Manager"
Cohesion: 0.20
Nodes (10): Architektura katalogów i plików — Home Budget Manager, Blok A — snapshot historyczny (przed lekkim refaktorem), Blok B — stan faktyczny (po lekkim refaktorze), Cel dokumentu, Co Blok B domknął względem snapshotu A (skrót), Czego drzewo v1 nadal nie robi, Jak czytać dalej, Relacja do lekkiego refaktoru (R1–R6 + ESM) (+2 more)

### Community 41 - "Strategia testów — Home Budget Manager"
Cohesion: 0.20
Nodes (10): Cel i zakres v1, Czego nie robimy w v1 strategii, Narzędzie, Piramida (backend), Powiązania, Refaktor fazowy (major plan backend), Reguła procesowa (DoD), Scenariusze E2E backend (minimum) (+2 more)

### Community 42 - "socketContext.jsx"
Cohesion: 0.23
Nodes (12): showMessageToast(), useDashboardShell(), DashboardPage(), useInvitationsStore, SocketContext, SocketProvider(), socketPath, notifyBoardRefresh() (+4 more)

### Community 43 - "useAuth"
Cohesion: 0.13
Nodes (22): FastActions(), MessagesFilterBtns(), MessagesList(), ModalComponent(), MessagesCounter(), TopCategoriesList(), AddUserToHouseModal(), DeclareBudgetModal() (+14 more)

### Community 44 - "Słownik — Home Budget Manager"
Cohesion: 0.22
Nodes (9): Finanse, Gospodarstwo i członkostwo, Komunikacja w produkcie, Kontrakt I/O, Powiązane, Rdzeń vs otoczka (produkt), Role i tożsamość, Synonimy — preferencje docs (+1 more)

### Community 45 - "i18n i kontrakt UI — Home Budget Manager"
Cohesion: 0.22
Nodes (9): As-is vs kierunek, Cel, Fallback do czasu pełnej migracji, i18n i kontrakt UI — Home Budget Manager, Języki v1, Kontrakt API ↔ UI (norma docelowa), Namespace’y UI (as-is + rozszerzenie), Obowiązki przy zmianie (+1 more)

### Community 46 - "react-i18next"
Cohesion: 0.12
Nodes (21): DashBoard(), CustomAvatarInput, MatesList(), TransactionsList(), DisplayMatesList(), LastTransactionsList(), HomePageMenu(), ReviewsSection() (+13 more)

### Community 47 - "Katalog zmiennych środowiskowych — Home Budget Manager"
Cohesion: 0.25
Nodes (8): Backend (wymagane / używane w kodzie), Cel, Checklist przy nowym środowisku, Compose / origin (production), Czego ten katalog nie obejmuje, E-mail outbound (opcjonalne), Frontend, Katalog zmiennych środowiskowych — Home Budget Manager

### Community 48 - "App.jsx"
Cohesion: 0.24
Nodes (6): App(), BackToUsMessage(), routes, ThemeContext, ThemeProvider(), react-toastify

### Community 49 - "KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma)"
Cohesion: 0.20
Nodes (10): 3.A — Wspólna konwencja service → controller, 3.F — Budget (`services/budget/`), 3.G — Receipt (`services/receipt/` + cienki controller), 3.H — Shell (reviews, gallery) + rename’owane obszary już mające services, KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma), Nowy plik — `backend/controllers/receiptController.js`, Nowy plik — `backend/services/budget/addNewMonthlyBudget.js`, Nowy plik — `backend/services/receipt/extractReceiptTotal.js` (+2 more)

### Community 50 - "showInfoToast"
Cohesion: 0.16
Nodes (38): AddTransactionForm(), AddUserToHouseForm(), ContactForm(), DeclareBudgetForm(), SubmitBtn(), LoginForm(), SendMessageForm(), SignUpForm() (+30 more)

### Community 51 - "Project: Web Home Budget Manager"
Cohesion: 0.29
Nodes (6): Conclusion, 🚀 Features, Installation, 💡 Project Idea, Project: Web Home Budget Manager, Tech stack / libraries

### Community 52 - "app.js"
Cohesion: 0.19
Nodes (11): createApp(), __dirname, __filename, allowedOrigins, swaggerDocs(), setupRoutes(), cookie-parser, cors (+3 more)

### Community 53 - "3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`"
Cohesion: 0.29
Nodes (7): 3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`, Nowy plik — `backend/services/notifications/deleteNotification.js`, Nowy plik — `backend/services/notifications/emitNotification.js`, Nowy plik — `backend/services/notifications/getNoticesCollection.js`, Nowy plik — `backend/services/notifications/saveNotification.js`, Refaktor — `controllers/notificationController.js` → tylko HTTP (`getNoticesCollection`, `deleteNotification` przez `runController`). **Usuń** eksport `saveNotification` z controllera., Refaktor — `utils/handleNotification.js`

### Community 54 - "FAZA 1 — Aktualizacja zależności + ESM + scoped fundament"
Cohesion: 0.29
Nodes (7): FAZA 1 — Aktualizacja zależności + ESM + scoped fundament, KROK 1 — Inwentaryzacja zależności vs stack docs/SPEC, KROK 3 — Setup Jest (ESM) + smoke fundamentu, Lista wyjściowa (`backend/package.json` as-is), Nowy plik — `backend/jest.config.js`, Nowy plik — `backend/tests/foundation/esm-smoke.test.js`, Propozycja commit message

### Community 55 - "KROK 1 — Szablony + podpięcia triggerów"
Cohesion: 0.06
Nodes (31): Aktualizacja — `backend/tests/unit/mail-outbound.test.js`, Dopisek — `backend/tests/unit/invitation-accept-reject.test.js`, E2E — dopisek w `t5-business-edges.test.js` (reject), E2E — dopisek w `t5-critical-paths.test.js` (T-5.3), FAZA 1 — Zaproszenia: notice trwały, status-log, unit + E2E, FAZA 2 — Cztery szablony e-mail zaproszeń + mock w testach, Home Budget Manager — feature plan: backend Faza 9.3–9.4 (zaproszenia notice + 4 szablony e-mail), KROK 1 — Notice trwały przy pending + scope collection po hostId (+23 more)

### Community 56 - "Home Budget Manager — feature plan: backend Faza 1 + Faza 2 (Blok B + R2)"
Cohesion: 0.33
Nodes (5): Home Budget Manager — feature plan: backend Faza 1 + Faza 2 (Blok B + R2), Meta, Weryfikacja wycinka, Założenia, Ślad do major (tylko informacyjnie — ten plan **nie** edytuje major)

### Community 57 - "KROK 4 — Audyt granic warstw + scoped testy mapy / B-10 / pipeline"
Cohesion: 0.33
Nodes (6): Audyt importów (wykonać przy implementacji; fail = poprawka w tym kroku), KROK 4 — Audyt granic warstw + scoped testy mapy / B-10 / pipeline, Nowy plik — `backend/tests/unit/appError-runController.test.js`, Nowy plik — `backend/tests/unit/board-getBoardData.test.js`, Nowy plik — `backend/tests/unit/services-layout.test.js`, Propozycja commit message

### Community 58 - "FAZA 2 — Blok B + pipeline R2 (cienkie controllery, B-10; bez Prisma)"
Cohesion: 0.33
Nodes (6): FAZA 2 — Blok B + pipeline R2 (cienkie controllery, B-10; bez Prisma), KROK 1 — Jednolity błąd aplikacji B-10 + helper controllera, KROK 2 — Podfoldery `services/<obszar>/` + `shell/` (mapa Bloku B), Mapa przeniesień (git mv / równoważne), Nowy plik — `backend/utils/errors/AppError.js`, Nowy plik — `backend/utils/http/runController.js`

### Community 59 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 60 - "SPEC — jak czytać"
Cohesion: 0.40
Nodes (5): Docs vs SPEC, Kolejność czytania (rekomendacja), Mapa obszar → plik, SPEC — jak czytać, Źródło

### Community 61 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, @eslint/js, globals, jest, nodemon, supertest

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, dev, lint, posttest:e2e, pretest:e2e, prisma:generate, prisma:migrate:deploy, prisma:seed (+6 more)

### Community 63 - "Dokumentacja — Home Budget Manager"
Cohesion: 0.50
Nodes (4): Dokumentacja — Home Budget Manager, Jak czytać (rekomendowana kolejność), Mapa temat → plik, Skróty decyzyjne

### Community 64 - "3.B — Auth (`services/auth/`)"
Cohesion: 0.40
Nodes (5): 3.B — Auth (`services/auth/`), Nowy plik — `backend/services/auth/loginUser.js`, Nowy plik — `backend/services/auth/logoutUser.js`, Nowy plik — `backend/services/auth/registerUser.js`, Refaktor — `backend/controllers/authController.js` (cały plik → cienki)

### Community 69 - "balanceHouseholdsMonthly.js"
Cohesion: 0.14
Nodes (20): latestInitialBudgetValue(), getBalanceFields(), listHouseholdsForMonthlyBalance(), createDailyBudget(), createMonthlyBalance(), createMonthlyTransactionCount(), updateHouseholdMonthlyBalanceDate(), upsertDailyTransactionCount() (+12 more)

### Community 70 - "3.D — Invitations (`services/invitations/`)"
Cohesion: 0.40
Nodes (5): 3.D — Invitations (`services/invitations/`), Nowy plik — `backend/services/invitations/acceptInvitation.js`, Nowy plik — `backend/services/invitations/getInvitationsCollection.js`, Nowy plik — `backend/services/invitations/rejectInvitation.js`, Refaktor — `controllers/invitationController.js` → cienki `runController` + powyższe services (analogicznie do board/auth). Usuń SQL z controllera.

### Community 71 - "KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout"
Cohesion: 0.40
Nodes (5): KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout, Nowy kształt — `backend/configs/logger.js` (kompletny), `package.json` — docelowy szkielet (wersje liczbowe = wynik `npm outdated` / install w momencie implementacji; linie major jak niżej), Refaktor — `backend/routes/index.js`, Refaktor — wzorzec CJS → ESM (stosować we wszystkich plikach)

### Community 72 - "HouseInfoPage.jsx"
Cohesion: 0.19
Nodes (11): BarChart(), LineChart(), BasicHouseInfo(), BalanceBudgetComparison(), BudgetPerDay(), CategoriesValuesChart(), TransactionsOverTime(), TransactionsPerDay() (+3 more)

### Community 73 - "3.C — Board (`services/board/`)"
Cohesion: 0.50
Nodes (4): 3.C — Board (`services/board/`), Nowy plik — `backend/services/board/getBoardData.js`, Refaktor — `backend/controllers/boardController.js`, Refaktor — `backend/routes/dashboardRoutes.js` (handler)

### Community 74 - "prismaClient.js"
Cohesion: 0.15
Nodes (18): addTechnology(), getDataCollection(), addReviewHandler(), getReviewsCollectionHandler(), prisma, createReview(), createTechnology(), listReviews() (+10 more)

### Community 75 - "KROK 2 — Moduły `database/` na Prisma (API zamiast `*Queries`)"
Cohesion: 0.13
Nodes (15): DoD (krok), KROK 2 — Moduły `database/` na Prisma (API zamiast `*Queries`), Nowy plik — `backend/database/auth.js`, Nowy plik — `backend/database/board.js`, Nowy plik — `backend/database/budget.js`, Nowy plik — `backend/database/categories.js`, Nowy plik — `backend/database/households.js`, Nowy plik — `backend/database/invitations.js` (+7 more)

### Community 76 - "addNewMonthlyBudget.js"
Cohesion: 0.18
Nodes (12): addNewMonthlyBudgetHandler(), listAddedAtByHouse(), updateInitialBudgetByHouse(), updateInitBudget(), deleteDailyBudgetInRange(), deleteDailyTransactionsInRange(), deleteTransactionsInDateRange(), addNewMonthlyBudget() (+4 more)

### Community 78 - "KROK 1 — Rename `mate` → `inmate` (guardy, URL, locale, kontrakt board)"
Cohesion: 0.09
Nodes (21): 403 widoczne w UX, Audyt UX vs S-8 (checklist implementacji), DoD (krok), DoD (krok), FAZA 1 — Role `inmate` w UI (R1), Home Budget Manager — feature plan: frontend Faza 5 (R1 `inmate` w UI), KROK 1 — Rename `mate` → `inmate` (guardy, URL, locale, kontrakt board), KROK 2 — UI odzwierciedla role; prawda = API (F-15) (+13 more)

### Community 79 - "avatarController.js"
Cohesion: 0.26
Nodes (8): addAvatarHandler(), deleteAvatarHandler(), getAvatar(), addAvatar(), deleteAvatar(), __dirname, __filename, resolveAvatarPath()

### Community 81 - "KROK 3 — Przełączenie services / utils / store / configs na API `database/`"
Cohesion: 0.17
Nodes (12): Checklist plików do przełączenia, Cron services (`balanceHouseholdsMonthly`, `saveDaily*`), DoD (krok), KROK 3 — Przełączenie services / utils / store / configs na API `database/`, Refaktor — `backend/configs/websocketConfig.js` (fragmenty DB), Refaktor — `backend/services/notifications/saveNotification.js`, Refaktor — `backend/services/transactions/addNewAction.js` (rdzeń), Refaktor — `backend/store/avatarStorage.js` (+4 more)

### Community 82 - "FAZA 1 — Persistencja Prisma (R6)"
Cohesion: 0.22
Nodes (9): DoD (krok), DoD (krok), FAZA 1 — Persistencja Prisma (R6), Komenda, KROK 4 — Usunięcie pool / mysql2 / `*Queries`; zero raw SQL, KROK 5 — Seed + spójność saldo↔transakcja + scoped testy (T-15), Nowy plik — `backend/prisma/seed.js`, Nowy plik — `backend/tests/unit/prisma-r6-persistence.test.js` (+1 more)

### Community 83 - "Faza 11 — Porty I/O przed adapterami chmurowymi"
Cohesion: 0.40
Nodes (5): Faza 11 — Porty I/O przed adapterami chmurowymi, Krok 11.1 — Port `MailSender` + adapter SMTP, Krok 11.2 — Port `ObjectStorage` + adapter dyskowy, Krok 11.3 — Port `OcrEngine` + adapter Tesseract, Krok 11.4 — Granice importów i scoped regresja

### Community 84 - "KROK 1 — Fundament: zależności, `db pull`, migracja bazowa, singleton"
Cohesion: 0.25
Nodes (8): Baseline Migrate (istniejąca baza), DoD (krok), KROK 1 — Fundament: zależności, `db pull`, migracja bazowa, singleton, Nowy plik — `backend/database/prismaClient.js`, Procedura schematu (obowiązkowa przy implementacji), Refaktor — `backend/.env.example`, Refaktor — `backend/package.json` (fragment), Szkic startowy `schema.prisma` (zastępowany wynikiem `db pull`)

### Community 85 - "Faza 2 — Struktura katalogów (Blok B) + pipeline warstw (R2)"
Cohesion: 0.40
Nodes (5): Faza 2 — Struktura katalogów (Blok B) + pipeline warstw (R2), Krok 2.1 — Podfoldery services rdzenia i shell, Krok 2.2 — Domknięcie luk as-is: mapa + cienkie controllery, Krok 2.3 — Układ warstw i granice (Blok B, bez Prisma), Krok 2.4 — Jednolity kształt błędu aplikacji (B-10)

### Community 86 - "transactions.js"
Cohesion: 0.13
Nodes (24): addNewAction(), deleteAction(), getAllActions(), getHouseActions(), findHouseholdUserRow(), createTransactionWithBalanceUpdate(), deleteTransactionWithBalanceUpdate(), findTransactionByTransactionId() (+16 more)

### Community 87 - "Home Budget Manager — feature plan: backend Faza 7 (Persistencja Prisma / R6)"
Cohesion: 0.29
Nodes (6): Biblioteki, Home Budget Manager — feature plan: backend Faza 7 (Persistencja Prisma / R6), Meta, Weryfikacja wycinka, Założenia HOW (zatwierdzone), Ślad do major (informacyjnie, po implementacji)

### Community 88 - "Faza 10 — Cutover legacy HTTP (wyłącznie `/api/v1`)"
Cohesion: 0.50
Nodes (4): Faza 10 — Cutover legacy HTTP (wyłącznie `/api/v1`), Krok 10.1 — Usunięcie montażu legacy w routerze, Krok 10.2 — Testy: v1 działa, legacy nie jest kontraktem, Krok 10.3 — Spójność kontraktu z docs

### Community 89 - "Faza 1 — Aktualizacja zależności backendu"
Cohesion: 0.50
Nodes (4): Faza 1 — Aktualizacja zależności backendu, Krok 1.1 — Inwentaryzacja zależności, Krok 1.2 — Aktualizacja wersji i przejście na ES modules, Krok 1.3 — Weryfikacja uruchamialności i scoped testy fundamentu

### Community 90 - "Faza 3 — Fundament operacyjny backendu"
Cohesion: 0.50
Nodes (4): Faza 3 — Fundament operacyjny backendu, Krok 3.1 — Logger na stdout, Krok 3.2 — Health liveness, Krok 3.3 — Helmet i CORS

### Community 91 - "calendarLocalizer.js"
Cohesion: 0.50
Nodes (3): localizer, moment, react-big-calendar

### Community 93 - "getBoardData.js"
Cohesion: 0.12
Nodes (26): actionCatCollection(), addNewActionCat(), deleteActionCat(), getBoardDataHandler(), countMessagesForUser(), getDailyBoardData(), getHouseBoardData(), getInmatesBoardData() (+18 more)

### Community 95 - "Faza 4 — Kontrakt komunikacji po stronie backendu"
Cohesion: 0.50
Nodes (4): Faza 4 — Kontrakt komunikacji po stronie backendu, Krok 4.1 — Prefiks `/api/v1` + dual mount legacy, Krok 4.2 — Envelope i klucze i18n, Krok 4.3 — OCR, uploady i handshake WS

### Community 96 - "addUserByInmate.js"
Cohesion: 0.12
Nodes (18): getMailTransporter(), acceptInvitationHandler(), getInvitationsCollectionHandler(), rejectInvitationHandler(), findHostUserId(), createInvitation(), findInvitationById(), listInvitationsCollection() (+10 more)

### Community 97 - "Faza 5 — Role `inmate` (R1, zakres backend)"
Cohesion: 0.50
Nodes (4): Faza 5 — Role `inmate` (R1, zakres backend), Krok 5.1 — Rename w tokenie, middleware i komunikatach, Krok 5.2 — Reguły ról po stronie API, Krok 5.3 — Rename `broadcastToHouseMates` → `broadcastToHousehold`

### Community 98 - "notifications.js"
Cohesion: 0.26
Nodes (10): deleteNotification(), GetNoticesCollection(), createNotification(), deleteNotification(), findNotificationById(), listNotificationsByHouse(), deleteNotification(), getNoticesCollection() (+2 more)

### Community 99 - "Faza 7 — Persistencja Prisma (R6)"
Cohesion: 0.50
Nodes (4): Faza 7 — Persistencja Prisma (R6), Krok 7.1 — Schemat, migracje i warstwa `database/`, Krok 7.2 — Migracja z pool / `*Queries` i zakaz raw SQL, Krok 7.3 — Seed oraz spójność saldo + transakcja

### Community 100 - "Faza 8 — E-mail outbound (K-14)"
Cohesion: 0.50
Nodes (4): Faza 8 — E-mail outbound (K-14), Krok 8.1 — Trigger z service po walidacji HTTP, Krok 8.2 — Treść i sekrety SMTP, Krok 8.3 — Mail nie jest jedynym kanałem

### Community 101 - "Faza 6 — Adaptery cron i WebSocket (R4)"
Cohesion: 0.67
Nodes (3): Faza 6 — Adaptery cron i WebSocket (R4), Krok 6.1 — Cron przez services, Krok 6.2 — Push WS jako skutek uboczny

### Community 102 - "messagesController.js"
Cohesion: 0.26
Nodes (10): deleteMessage(), markMessage(), sendMessage(), createMessage(), deleteMessageById(), findUserIdByName(), markMessageRead(), delMessage() (+2 more)

### Community 103 - "Faza 9 — Weryfikacja strategii testów backendu (Jest)"
Cohesion: 0.67
Nodes (3): Faza 9 — Weryfikacja strategii testów backendu (Jest), Krok 9.1 — Audyt piramidy i domknięcie T-5, Krok 9.2 — Izolacja, seed i trwałość DoD

### Community 105 - "households.js"
Cohesion: 0.14
Nodes (25): deleteUser(), createHousehold(), deleteHousehold(), findHouseholdByName(), listInmates(), deleteTransactionsByHouseId(), clearHouseIdForHouse(), deleteHouseholdUsersByUserId() (+17 more)

### Community 107 - "AppError"
Cohesion: 0.11
Nodes (32): setCookieValue(), setTourValue(), saveImagesHandler(), addNewHouse(), deleteHouse(), getAllHouses(), getHouseInfo(), addUserToHouse() (+24 more)

### Community 108 - "AppModal.jsx"
Cohesion: 0.33
Nodes (6): Authorization(), AppModal(), AuthModal(), CalendarModal(), LogOutModal(), ModalHeader()

### Community 109 - "swaggerConfig.js"
Cohesion: 0.29
Nodes (6): __dirname, __filename, swaggerOptions, swaggerSpec, swagger-jsdoc, swagger-ui-express

### Community 112 - "Faza 9.1 — Saldo: reverse przy delete + walidacja kwot (2 dp)"
Cohesion: 0.67
Nodes (3): Faza 9.1 — Saldo: reverse przy delete + walidacja kwot (2 dp), Krok 9.1.1 — Reverse salda przy usuwaniu transakcji, Krok 9.1.2 — Walidacja i helper kwot (2 dp)

### Community 113 - "Faza 9.2 — Authz usuwania transakcji (inmate own / host house-wide)"
Cohesion: 0.67
Nodes (3): Faza 9.2 — Authz usuwania transakcji (inmate own / host house-wide), Krok 9.2.1 — Reguła ownership w service / database, Krok 9.2.2 — Mapowanie 403/404 + testy E2E

### Community 114 - "Faza 9.3 — Zaproszenia: notice trwały, status-log, unit + E2E"
Cohesion: 0.67
Nodes (3): Faza 9.3 — Zaproszenia: notice trwały, status-log, unit + E2E, Krok 9.3.1 — Notice trwały przy pending + status-log, Krok 9.3.2 — Unit + E2E API zaproszeń

### Community 115 - "Faza 9.4 — Cztery szablony e-mail zaproszeń + mock w testach"
Cohesion: 0.67
Nodes (3): Faza 9.4 — Cztery szablony e-mail zaproszeń + mock w testach, Krok 9.4.1 — Implementacja szablonów i podpięć, Krok 9.4.2 — Unit / E2E z mockiem SMTP

## Knowledge Gaps
- **835 isolated node(s):** `__filename`, `__dirname`, `logFormat`, `__filename`, `__dirname` (+830 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 888 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `AppError` to `addUserByInmate.js`, `notifications.js`, `messagesController.js`, `households.js`, `prismaClient.js`, `addNewMonthlyBudget.js`, `avatarController.js`, `logger.js`, `backend/utils/validation.js`, `transactions.js`, `getBoardData.js`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `logger` connect `logger.js` to `addUserByInmate.js`, `index.js`, `notifications.js`, `balanceHouseholdsMonthly.js`, `messagesController.js`, `households.js`, `prismaClient.js`, `AppError`, `addNewMonthlyBudget.js`, `backend/utils/validation.js`, `transactions.js`, `getBoardData.js`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `react`, `routerConfig.jsx`, `HouseInfoPage.jsx`, `socketContext.jsx`, `useAuth`, `frontend/package.json`, `AppModal.jsx`, `App.jsx`, `showInfoToast`, `DashBoardMenu.jsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `logFormat` to the rest of the system?**
  _835 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home Budget Manager — feature plan: backend Faza 3 + Faza 4 (ops + kontrakt)` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `KROK 1 — Izolacja środowiska testowego + helpery + seed/fixtures pod T-5` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06947996589940324 - nodes in this community are weakly interconnected._