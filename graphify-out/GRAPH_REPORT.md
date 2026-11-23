# Graph Report - home-budget-manager  (2026-11-20)

## Corpus Check
- 343 files · ~152,616 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 6, .traineddata 2, .example 1)

## Summary
- 1508 nodes · 3614 edges · 87 communities (78 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1a191ff6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Home Budget Manager — feature plan: backend Faza 3 + Faza 4 (ops + kontrakt)
- runController
- index.js
- extractReceiptTotal.js
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
- useDashboardShell.js
- backend/package.json
- Architektura — Home Budget Manager
- websocketConfig.js
- householdController.js
- SPEC — Backend
- SPEC — Bezpieczeństwo
- authController.js
- SPEC — Testy (backend)
- SPEC — Dane (persistencja)
- SPEC — Frontend (SPA)
- devDependencies
- SPEC — Komunikacja (I/O)
- react
- Anty-patterny — Home Budget Manager
- Bezpieczeństwo — Home Budget Manager
- KROK 1 — Rename `mate` → `inmate` (token, DB, middleware, routes, komunikaty)
- Przepływy danych — Home Budget Manager
- Wdrożenie i operacje — Home Budget Manager
- Dokumentacja koncepcyjna — Home Budget Manager
- Observability — Home Budget Manager
- LanguageSelector.jsx
- KROK 3 — Push WS jako skutek uboczny + scoped testy (T-15)
- routerConfig.jsx
- Architektura katalogów i plików — Home Budget Manager
- Strategia testów — Home Budget Manager
- authContext.jsx
- swaggerConfig.js
- Słownik — Home Budget Manager
- i18n i kontrakt UI — Home Budget Manager
- react-i18next
- Katalog zmiennych środowiskowych — Home Budget Manager
- homePageDataController.js
- KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma)
- showInfoToast
- Project: Web Home Budget Manager
- app.js
- 3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`
- FAZA 1 — Aktualizacja zależności + ESM + scoped fundament
- useAuth
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
- getBoardData.js
- 3.D — Invitations (`services/invitations/`)
- KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout
- avatarController.js
- 3.C — Board (`services/board/`)
- logger.js
- MessagesList.jsx
- acceptInvitation.js
- socketEventCatalog.js
- KROK 1 — Rename `mate` → `inmate` (guardy, URL, locale, kontrakt board)
- App.jsx
- useIsMobile
- server.js
- backend/utils/validation.js
- AppError
- checkUserHouse
- adapters-cron-ws.test.js

## God Nodes (most connected - your core abstractions)
1. `AppError` - 104 edges
2. `react-i18next` - 67 edges
3. `runController()` - 59 edges
4. `logger` - 57 edges
5. `react` - 50 edges
6. `pool` - 44 edges
7. `useAuth()` - 43 edges
8. `showInfoToast()` - 41 edges
9. `showErrorToast()` - 39 edges
10. `sendRequest()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `FastActions()` --indirect_call--> `AddReviewModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/components/modals/AddReviewModal.jsx
- `FastActions()` --indirect_call--> `ChangeEmailModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/components/modals/ChangeEmailModal.jsx
- `FastActions()` --indirect_call--> `showInfoToast()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/configs/toastify.jsx
- `MessagesList()` --indirect_call--> `DeleteMessageModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/MessagesList.jsx → frontend/src/components/modals/messagesModals/messagesModals.jsx
- `TransactionsPage()` --indirect_call--> `AddTransactionModal()`  [INFERRED]
  frontend/src/pages/dashboard-subpages/TransactionsPage.jsx → frontend/src/components/modals/AddTransactionModal.jsx

## Import Cycles
- None detected.

## Communities (87 total, 6 thin omitted)

### Community 0 - "Home Budget Manager — feature plan: backend Faza 3 + Faza 4 (ops + kontrakt)"
Cohesion: 0.06
Nodes (33): Audyt uploadów, `authRoutes.js` — `GET /verify`, CORS — refaktor względem as-is `server.js`, FAZA 1 — Fundament operacyjny (major Faza 3), FAZA 2 — Kontrakt komunikacji (major Faza 4), Helmet (Context7 `/helmetjs/helmet` v8), Home Budget Manager — feature plan: backend Faza 3 + Faza 4 (ops + kontrakt), KROK 1 — Logger stdout: audyt B-14/B-15 (+25 more)

### Community 1 - "runController"
Cohesion: 0.11
Nodes (24): actionCatCollection(), addNewActionCat(), deleteActionCat(), setCookieValue(), setTourValue(), saveImagesHandler(), addNewMonthlyBudgetHandler(), acceptInvitationHandler() (+16 more)

### Community 2 - "index.js"
Cohesion: 0.07
Nodes (40): createUserDirectory(), __dirname, __filename, deleteFiles(), __dirname, __filename, sessionRequired, verifyJWT() (+32 more)

### Community 3 - "extractReceiptTotal.js"
Cohesion: 0.39
Nodes (5): extractPhotoData(), extractReceipt(), extractReceiptTotal(), sharp, tesseract.js

### Community 4 - "Home Budget Manager — major plan (backend)"
Cohesion: 0.04
Nodes (46): Faza 1 — Aktualizacja zależności backendu, Faza 2 — Struktura katalogów (Blok B) + pipeline warstw (R2), Faza 3 — Fundament operacyjny backendu, Faza 4 — Kontrakt komunikacji po stronie backendu, Faza 5 — Role `inmate` (R1, zakres backend), Faza 6 — Adaptery cron i WebSocket (R4), Faza 7 — Persistencja Prisma (R6), Faza 8 — E-mail outbound (K-14) (+38 more)

### Community 5 - "Home Budget Manager — feature plan: frontend Faza 3 + Faza 4 (stan + HTTP `/api/v1`)"
Cohesion: 0.06
Nodes (34): Checklist jakości skilla, FAZA 1 — Model stanu (Context + Zustand), FAZA 2 — Kontrakt klienta HTTP (`/api/v1`, credentials, envelope), `fetchData.js` — kompletny docelowy, Gotowość WS (opis + minimalny kod), Home Budget Manager — feature plan: frontend Faza 3 + Faza 4 (stan + HTTP `/api/v1`), Implementacja, Implementacja — poprawki + spójny eksport (+26 more)

### Community 6 - "Home Budget Manager — major plan (frontend)"
Cohesion: 0.05
Nodes (40): Faza 1 — Aktualizacja zależności frontendu, Faza 2 — Układ SPA (R5) + granice prezentacja vs orkiestracja, Faza 3 — Model stanu (Context + Zustand), Faza 4 — Kontrakt klienta HTTP (`/api/v1`, credentials, envelope), Faza 5 — Role `inmate` w UI (R1, zakres frontend), Faza 6 — i18n: namespace `api` + mapowanie `message`, Faza 7 — Klient WebSocket wg kontraktu, Faza 8 — Bezpieczeństwo klienta i granica zaufania (+32 more)

### Community 7 - "Grupy zasobów — operacje"
Cohesion: 0.05
Nodes (38): As-is, Auth, Auth — `/api/v1/auth`, Awatary — `/api/v1/avatars`, Budżet miesięczny — `/api/v1/initmonthly`, Cel i zakres, Dashboard — `/api/v1/board`, Dokumentacja komunikacji — Home Budget Manager (+30 more)

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
Cohesion: 0.10
Nodes (20): eslint, @eslint/js, globals, name, private, type, version, eslint-plugin-react (+12 more)

### Community 13 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, bcrypt, cookie, cookie-parser, cors, dotenv, express, helmet (+14 more)

### Community 15 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, chart.js, framer-motion, i18next, i18next-browser-languagedetector, i18next-http-backend, @iconify/react, moment (+13 more)

### Community 16 - "useDashboardShell.js"
Cohesion: 0.40
Nodes (6): showMessageToast(), useDashboardShell(), inmateOrHostRole(), isHostRole(), isUserRole(), getClickHandler()

### Community 17 - "backend/package.json"
Cohesion: 0.10
Nodes (20): author, description, engines, node, eslint, @eslint/js, globals, license (+12 more)

### Community 18 - "Architektura — Home Budget Manager"
Cohesion: 0.10
Nodes (20): Architektura — Home Budget Manager, Bezpieczeństwo i granice zaufania, Cel dokumentu, Decyzje świadomie odroczone, Dostęp do danych: Prisma ORM, Dziedziczenie stylu, Frontend (as-is), Jak czytać dalej (+12 more)

### Community 19 - "websocketConfig.js"
Cohesion: 0.18
Nodes (10): broadcastToHousehold(), initializeWebSocket(), authMiddleware(), addNewMonthlyBudget(), getMysqlExpireDate(), handleBroadcastInitBudget(), addNewBudget(), clearExtraValues() (+2 more)

### Community 20 - "householdController.js"
Cohesion: 0.23
Nodes (13): addNewHouse(), deleteHouse(), getAllHouses(), getHouseInfo(), addNewHouse(), signRoleToken(), deleteHouse(), getHouseInfo() (+5 more)

### Community 21 - "SPEC — Backend"
Cohesion: 0.12
Nodes (17): Błędy, Cel / zakres względem dokumentacji, Dane (Prisma), Helpery, Kryteria akceptacji (obserwowalne), Model modułów (ESM), Nie wolno, Observability (+9 more)

### Community 22 - "SPEC — Bezpieczeństwo"
Cohesion: 0.12
Nodes (17): Autoryzacja, Cel / zakres względem dokumentacji, Health, Helmet i CORS, Kryteria akceptacji (obserwowalne), Nie wolno, Poza zakresem tego SPEC, Sekrety i logi (+9 more)

### Community 23 - "authController.js"
Cohesion: 0.24
Nodes (8): jwtCookieOptions, loginUserHandler(), logoutUserHandler(), registerUserHandler(), loginUser(), logoutUser(), registerUser(), loginValidations()

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

### Community 29 - "react"
Cohesion: 0.13
Nodes (24): MatesList(), LossOrGainChart(), DashBoardMenu(), DisplayLiveBalance(), DisplayMatesList(), MonthlyBudget(), MatesCounter(), MessagesCounter() (+16 more)

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
Cohesion: 0.17
Nodes (12): A. Rejestracja i logowanie, B. Utworzenie gospodarstwa (`user` → `host`), C. Zaproszenie → akceptacja → `inmate`, Cel, D. Dodanie transakcji, E. Wiadomość czatu, F. OCR paragonu → kwota → formularz transakcji, G. Zadania cykliczne (wewnętrzne) (+4 more)

### Community 34 - "Wdrożenie i operacje — Home Budget Manager"
Cohesion: 0.17
Nodes (12): Architektura runtime (production), Cel, Checklist po deployu (smoke), CI / CD, Local — ścieżka deweloperska, Migracje przy deployu (stan docelowy po R6), Operacje codzienne (skrót), Poza zakresem tego dokumentu (+4 more)

### Community 35 - "Dokumentacja koncepcyjna — Home Budget Manager"
Cohesion: 0.17
Nodes (12): Cel produktu, Dla kogo jest dokumentacja, Dokumentacja koncepcyjna — Home Budget Manager, Główne założenia, Kryteria sukcesu (opis funkcjonalny), Otoczka / część operacyjna, Powiązane, Poza zakresem (+4 more)

### Community 36 - "Observability — Home Budget Manager"
Cohesion: 0.18
Nodes (11): Alerting i SLI/SLO, Cel, Filary v1, Gdzie powstają sygnały, Granice względem innych docs, Healthcheck (norma docs), Instrumentacja, Konwencje (+3 more)

### Community 37 - "LanguageSelector.jsx"
Cohesion: 0.24
Nodes (10): languages, LanguageSwitch(), normalizeLang(), resolveInitialLang(), savedLanguage, getLocalStorage(), setLocalStorage(), i18next (+2 more)

### Community 38 - "KROK 3 — Push WS jako skutek uboczny + scoped testy (T-15)"
Cohesion: 0.08
Nodes (23): Audyt push (obowiązkowy w implementacji), Biblioteki, DoD (krok), DoD (krok), DoD (krok), FAZA 1 — Adaptery cron i WebSocket (R4), Home Budget Manager — feature plan: backend Faza 6 (adaptery cron + WebSocket / R4), Komenda (+15 more)

### Community 39 - "routerConfig.jsx"
Cohesion: 0.12
Nodes (23): CustomAvatarInput, DashboardHeader(), DescriptionSection(), TechnologiesSection(), localizer, useDocumentTitle(), AboutUs(), AdminPanelPage() (+15 more)

### Community 40 - "Architektura katalogów i plików — Home Budget Manager"
Cohesion: 0.20
Nodes (10): Architektura katalogów i plików — Home Budget Manager, Blok A — as-is, Blok B — docelowe (lekki porządek), Cel dokumentu, Co się zmienia względem Bloku A (skrót), Czego drzewo docelowe nie robi, Jak czytać dalej, Relacja do lekkiego refaktoru (R1–R6 + ESM) (+2 more)

### Community 41 - "Strategia testów — Home Budget Manager"
Cohesion: 0.20
Nodes (10): Cel i zakres v1, Czego nie robimy w v1 strategii, Narzędzie, Piramida (backend), Powiązania, Refaktor fazowy (major plan backend), Reguła procesowa (DoD), Scenariusze E2E backend (minimum) (+2 more)

### Community 42 - "authContext.jsx"
Cohesion: 0.24
Nodes (13): DashBoardForUser(), AuthContext, AuthProvider(), useInvitationsStore, apiBaseUrl, notifyForbidden(), notifyUnauthorized(), registerAuthFailureHandlers() (+5 more)

### Community 43 - "swaggerConfig.js"
Cohesion: 0.29
Nodes (6): __dirname, __filename, swaggerOptions, swaggerSpec, swagger-jsdoc, swagger-ui-express

### Community 44 - "Słownik — Home Budget Manager"
Cohesion: 0.22
Nodes (9): Finanse, Gospodarstwo i członkostwo, Komunikacja w produkcie, Kontrakt I/O, Powiązane, Rdzeń vs otoczka (produkt), Role i tożsamość, Synonimy — preferencje docs (+1 more)

### Community 45 - "i18n i kontrakt UI — Home Budget Manager"
Cohesion: 0.22
Nodes (9): As-is vs kierunek, Cel, Fallback do czasu pełnej migracji, i18n i kontrakt UI — Home Budget Manager, Języki v1, Kontrakt API ↔ UI (norma docelowa), Namespace’y UI (as-is + rozszerzenie), Obowiązki przy zmianie (+1 more)

### Community 46 - "react-i18next"
Cohesion: 0.23
Nodes (13): FastActions(), Authorization(), AddTransactionModal(), AddUserToHouseModal(), AppModal(), CalendarModal(), CookiesModal(), DeclareBudgetModal() (+5 more)

### Community 47 - "Katalog zmiennych środowiskowych — Home Budget Manager"
Cohesion: 0.25
Nodes (8): Backend (wymagane / używane w kodzie), Cel, Checklist przy nowym środowisku, Compose / origin (production), Czego ten katalog nie obejmuje, E-mail outbound (kierunek — jeszcze nieużywane w kodzie), Frontend, Katalog zmiennych środowiskowych — Home Budget Manager

### Community 48 - "homePageDataController.js"
Cohesion: 0.31
Nodes (7): addTechnology(), getDataCollection(), addTechnologyContent(), getHomePageCollection(), __dirname, __filename, getFilesList()

### Community 49 - "KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma)"
Cohesion: 0.20
Nodes (10): 3.A — Wspólna konwencja service → controller, 3.F — Budget (`services/budget/`), 3.G — Receipt (`services/receipt/` + cienki controller), 3.H — Shell (reviews, gallery) + rename’owane obszary już mające services, KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma), Nowy plik — `backend/controllers/receiptController.js`, Nowy plik — `backend/services/budget/addNewMonthlyBudget.js`, Nowy plik — `backend/services/receipt/extractReceiptTotal.js` (+2 more)

### Community 50 - "showInfoToast"
Cohesion: 0.17
Nodes (30): AddTransactionForm(), AddUserToHouseForm(), ContactForm(), DeclareBudgetForm(), SubmitBtn(), LoginForm(), SendMessageForm(), SignUpForm() (+22 more)

### Community 51 - "Project: Web Home Budget Manager"
Cohesion: 0.29
Nodes (6): Conclusion, 🚀 Features, Installation, 💡 Project Idea, Project: Web Home Budget Manager, Tech stack / libraries

### Community 52 - "app.js"
Cohesion: 0.21
Nodes (10): createApp(), __dirname, __filename, allowedOrigins, swaggerDocs(), setupRoutes(), cookie-parser, cors (+2 more)

### Community 53 - "3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`"
Cohesion: 0.29
Nodes (7): 3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`, Nowy plik — `backend/services/notifications/deleteNotification.js`, Nowy plik — `backend/services/notifications/emitNotification.js`, Nowy plik — `backend/services/notifications/getNoticesCollection.js`, Nowy plik — `backend/services/notifications/saveNotification.js`, Refaktor — `controllers/notificationController.js` → tylko HTTP (`getNoticesCollection`, `deleteNotification` przez `runController`). **Usuń** eksport `saveNotification` z controllera., Refaktor — `utils/handleNotification.js`

### Community 54 - "FAZA 1 — Aktualizacja zależności + ESM + scoped fundament"
Cohesion: 0.29
Nodes (7): FAZA 1 — Aktualizacja zależności + ESM + scoped fundament, KROK 1 — Inwentaryzacja zależności vs stack docs/SPEC, KROK 3 — Setup Jest (ESM) + smoke fundamentu, Lista wyjściowa (`backend/package.json` as-is), Nowy plik — `backend/jest.config.js`, Nowy plik — `backend/tests/foundation/esm-smoke.test.js`, Propozycja commit message

### Community 55 - "useAuth"
Cohesion: 0.16
Nodes (20): DashBoard(), TransactionsList(), LastTransactionsList(), Home(), HomePageMenu(), AuthModal(), DeleteTransactionModal(), LogOutModal() (+12 more)

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
Cohesion: 0.40
Nodes (5): scripts, dev, lint, start, test

### Community 63 - "Dokumentacja — Home Budget Manager"
Cohesion: 0.50
Nodes (4): Dokumentacja — Home Budget Manager, Jak czytać (rekomendowana kolejność), Mapa temat → plik, Skróty decyzyjne

### Community 64 - "3.B — Auth (`services/auth/`)"
Cohesion: 0.40
Nodes (5): 3.B — Auth (`services/auth/`), Nowy plik — `backend/services/auth/loginUser.js`, Nowy plik — `backend/services/auth/logoutUser.js`, Nowy plik — `backend/services/auth/registerUser.js`, Refaktor — `backend/controllers/authController.js` (cały plik → cienki)

### Community 69 - "getBoardData.js"
Cohesion: 0.39
Nodes (3): getBoardDataHandler(), getBoardData(), countTotalPages()

### Community 70 - "3.D — Invitations (`services/invitations/`)"
Cohesion: 0.40
Nodes (5): 3.D — Invitations (`services/invitations/`), Nowy plik — `backend/services/invitations/acceptInvitation.js`, Nowy plik — `backend/services/invitations/getInvitationsCollection.js`, Nowy plik — `backend/services/invitations/rejectInvitation.js`, Refaktor — `controllers/invitationController.js` → cienki `runController` + powyższe services (analogicznie do board/auth). Usuń SQL z controllera.

### Community 71 - "KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout"
Cohesion: 0.40
Nodes (5): KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout, Nowy kształt — `backend/configs/logger.js` (kompletny), `package.json` — docelowy szkielet (wersje liczbowe = wynik `npm outdated` / install w momencie implementacji; linie major jak niżej), Refaktor — `backend/routes/index.js`, Refaktor — wzorzec CJS → ESM (stosować we wszystkich plikach)

### Community 72 - "avatarController.js"
Cohesion: 0.26
Nodes (8): addAvatarHandler(), deleteAvatarHandler(), getAvatar(), addAvatar(), deleteAvatar(), __dirname, __filename, resolveAvatarPath()

### Community 73 - "3.C — Board (`services/board/`)"
Cohesion: 0.50
Nodes (4): 3.C — Board (`services/board/`), Nowy plik — `backend/services/board/getBoardData.js`, Refaktor — `backend/controllers/boardController.js`, Refaktor — `backend/routes/dashboardRoutes.js` (handler)

### Community 74 - "logger.js"
Cohesion: 0.25
Nodes (4): logFormat, logger, pool, bcrypt

### Community 75 - "MessagesList.jsx"
Cohesion: 0.08
Nodes (30): BarChart(), LineChart(), BasicHouseInfo(), MessagesFilterBtns(), MessagesList(), ModalComponent(), BalanceBudgetComparison(), BudgetPerDay() (+22 more)

### Community 76 - "acceptInvitation.js"
Cohesion: 0.26
Nodes (7): acceptInvitation(), emitNotification(), saveNotification(), addUserByHost(), saveNewInmate(), invitationStatus, uuid

### Community 78 - "KROK 1 — Rename `mate` → `inmate` (guardy, URL, locale, kontrakt board)"
Cohesion: 0.09
Nodes (21): 403 widoczne w UX, Audyt UX vs S-8 (checklist implementacji), DoD (krok), DoD (krok), FAZA 1 — Role `inmate` w UI (R1), Home Budget Manager — feature plan: frontend Faza 5 (R1 `inmate` w UI), KROK 1 — Rename `mate` → `inmate` (guardy, URL, locale, kontrakt board), KROK 2 — UI odzwierciedla role; prawda = API (F-15) (+13 more)

### Community 79 - "App.jsx"
Cohesion: 0.24
Nodes (6): App(), BackToUsMessage(), routes, ThemeContext, ThemeProvider(), react-toastify

### Community 81 - "useIsMobile"
Cohesion: 0.10
Nodes (24): HeaderIconsContainer(), MostActiveMates(), NotificationDot(), NotificationsContainer(), OpenMenuButton(), SendMessageBtn(), AppGallery(), ScreenShotModal() (+16 more)

### Community 83 - "server.js"
Cohesion: 0.23
Nodes (10): app, server, balanceHouseholdsMonthly(), saveDailyBudgetSnapshot(), saveDailyTransactionsSnapshot(), balanceHouseActions(), saveDailyBudget(), saveDailyTransactions() (+2 more)

### Community 84 - "backend/utils/validation.js"
Cohesion: 0.27
Nodes (6): allowedRoles, isValidEmail(), isValidPassword(), isValidUsername(), registerValidations(), validTransactionTypes

### Community 85 - "AppError"
Cohesion: 0.15
Nodes (21): broadcastMessage(), deleteMessage(), markMessage(), sendMessage(), addUserToHouse(), changeEmail(), deleteInhabitant(), deleteUser() (+13 more)

### Community 86 - "checkUserHouse"
Cohesion: 0.17
Nodes (16): deleteNotification(), GetNoticesCollection(), addNewAction(), deleteAction(), getAllActions(), getHouseActions(), deleteNotification(), getNoticesCollection() (+8 more)

## Knowledge Gaps
- **658 isolated node(s):** `__filename`, `__dirname`, `logFormat`, `__filename`, `__dirname` (+653 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 692 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `LanguageSelector.jsx`, `routerConfig.jsx`, `authContext.jsx`, `MessagesList.jsx`, `frontend/package.json`, `react-i18next`, `App.jsx`, `useDashboardShell.js`, `useIsMobile`, `showInfoToast`, `useAuth`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `LanguageSelector.jsx`, `routerConfig.jsx`, `authContext.jsx`, `MessagesList.jsx`, `frontend/package.json`, `App.jsx`, `useDashboardShell.js`, `useIsMobile`, `showInfoToast`, `useAuth`, `react`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `frontend/package.json`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `logFormat` to the rest of the system?**
  _658 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home Budget Manager — feature plan: backend Faza 3 + Faza 4 (ops + kontrakt)` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `runController` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07067603160667252 - nodes in this community are weakly interconnected._