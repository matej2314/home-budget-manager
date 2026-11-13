# Graph Report - home-budget-manager  (2026-11-13)

## Corpus Check
- 315 files · ~132,940 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .traineddata 2, .conf 1)

## Summary
- 1279 nodes · 3254 edges · 76 communities (67 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `77f9841c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- showInfoToast
- HouseInfoPage.jsx
- index.js
- AppError
- Home Budget Manager — major plan (backend)
- DashBoardMenu.jsx
- Home Budget Manager — major plan (frontend)
- Grupy zasobów — operacje
- logger.js
- acceptInvitation.js
- Home Budget Manager — feature plan: frontend Faza 1 + Faza 2 (mapa SPA)
- Model danych — Home Budget Manager
- frontend/package.json
- dependencies
- dependencies
- checkUserHouse
- backend/package.json
- Architektura — Home Budget Manager
- websocketConfig.js
- householdController.js
- SPEC — Backend
- SPEC — Bezpieczeństwo
- registerUser.js
- SPEC — Testy (backend)
- SPEC — Dane (persistencja)
- SPEC — Frontend (SPA)
- devDependencies
- SPEC — Komunikacja (I/O)
- server.js
- Anty-patterny — Home Budget Manager
- Bezpieczeństwo — Home Budget Manager
- resolveAvatarPath.js
- Przepływy danych — Home Budget Manager
- Wdrożenie i operacje — Home Budget Manager
- Dokumentacja koncepcyjna — Home Budget Manager
- Observability — Home Budget Manager
- routerConfig.jsx
- MessagesList.jsx
- backend/utils/validation.js
- Architektura katalogów i plików — Home Budget Manager
- Strategia testów — Home Budget Manager
- KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma)
- swaggerConfig.js
- Słownik — Home Budget Manager
- i18n i kontrakt UI — Home Budget Manager
- react
- Katalog zmiennych środowiskowych — Home Budget Manager
- 3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`
- FAZA 1 — Aktualizacja zależności + ESM + scoped fundament
- react-i18next
- Project: Web Home Budget Manager
- Home Budget Manager — feature plan: backend Faza 1 + Faza 2 (Blok B + R2)
- KROK 4 — Audyt granic warstw + scoped testy mapy / B-10 / pipeline
- FAZA 2 — Blok B + pipeline R2 (cienkie controllery, B-10; bez Prisma)
- authContext.jsx
- 3.B — Auth (`services/auth/`)
- 3.D — Invitations (`services/invitations/`)
- KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout
- scripts
- SPEC — jak czytać
- devDependencies
- scripts
- Dokumentacja — Home Budget Manager
- 3.C — Board (`services/board/`)
- jest.config.js
- services-layout.test.js
- frontend/README.md
- imagesArray.js
- deleteAction.js
- DashBoardHeader.jsx
- DashboardPage.jsx
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `AppError` - 104 edges
2. `react-i18next` - 65 edges
3. `logger` - 58 edges
4. `runController()` - 58 edges
5. `react` - 55 edges
6. `pool` - 44 edges
7. `showInfoToast()` - 40 edges
8. `showErrorToast()` - 37 edges
9. `useIsMobile()` - 35 edges
10. `sendRequest()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `FastActions()` --indirect_call--> `AddReviewModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/components/modals/AddReviewModal.jsx
- `FastActions()` --indirect_call--> `ChangeEmailModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/components/modals/ChangeEmailModal.jsx
- `FastActions()` --indirect_call--> `CookiesModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/components/modals/CookiesModal.jsx
- `FastActions()` --indirect_call--> `showInfoToast()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/FastActionsSection.jsx → frontend/src/configs/toastify.jsx
- `MessagesList()` --indirect_call--> `DeleteMessageModal()`  [INFERRED]
  frontend/src/components/dashboard/dashboard-internal-components/MessagesList.jsx → frontend/src/components/modals/messagesModals/messagesModals.jsx

## Import Cycles
- None detected.

## Communities (76 total, 5 thin omitted)

### Community 0 - "showInfoToast"
Cohesion: 0.17
Nodes (33): AddTransactionForm(), AddUserToHouseForm(), ContactForm(), DeclareBudgetForm(), SubmitBtn(), LoginForm(), SendMessageForm(), SignUpForm() (+25 more)

### Community 1 - "HouseInfoPage.jsx"
Cohesion: 0.07
Nodes (39): BarChart(), LineChart(), BasicHouseInfo(), MostActiveMates(), NotificationsContainer(), OpenMenuButton(), BalanceBudgetComparison(), BudgetPerDay() (+31 more)

### Community 2 - "index.js"
Cohesion: 0.07
Nodes (39): extractReceipt(), createUserDirectory(), __dirname, __filename, deleteFiles(), __dirname, __filename, verifyJWT() (+31 more)

### Community 3 - "AppError"
Cohesion: 0.09
Nodes (39): actionCatCollection(), addNewActionCat(), deleteActionCat(), addAvatarHandler(), deleteAvatarHandler(), setCookieValue(), setTourValue(), saveImagesHandler() (+31 more)

### Community 4 - "Home Budget Manager — major plan (backend)"
Cohesion: 0.04
Nodes (46): Faza 1 — Aktualizacja zależności backendu, Faza 2 — Struktura katalogów (Blok B) + pipeline warstw (R2), Faza 3 — Fundament operacyjny backendu, Faza 4 — Kontrakt komunikacji po stronie backendu, Faza 5 — Role `inmate` (R1, zakres backend), Faza 6 — Adaptery cron i WebSocket (R4), Faza 7 — Persistencja Prisma (R6), Faza 8 — E-mail outbound (K-14) (+38 more)

### Community 5 - "DashBoardMenu.jsx"
Cohesion: 0.16
Nodes (13): HeaderIconsContainer(), NotificationDot(), DashBoardMenu(), useNotificationsStore, SocketContext, socketPath, adminLinksElements, linksElements (+5 more)

### Community 6 - "Home Budget Manager — major plan (frontend)"
Cohesion: 0.05
Nodes (39): Faza 1 — Aktualizacja zależności frontendu, Faza 2 — Układ SPA (R5) + granice prezentacja vs orkiestracja, Faza 3 — Model stanu (Context + Zustand), Faza 4 — Kontrakt klienta HTTP (`/api/v1`, credentials, envelope), Faza 5 — Role `inmate` w UI (R1, zakres frontend), Faza 6 — i18n: namespace `api` + mapowanie `message`, Faza 7 — Klient WebSocket wg kontraktu, Faza 8 — Bezpieczeństwo klienta i granica zaufania (+31 more)

### Community 7 - "Grupy zasobów — operacje"
Cohesion: 0.05
Nodes (38): As-is, Auth, Auth — `/api/v1/auth`, Awatary — `/api/v1/avatars`, Budżet miesięczny — `/api/v1/initmonthly`, Cel i zakres, Dashboard — `/api/v1/board`, Dokumentacja komunikacji — Home Budget Manager (+30 more)

### Community 8 - "logger.js"
Cohesion: 0.17
Nodes (10): logFormat, logger, extractPhotoData(), pool, extractReceiptTotal(), __dirname, __filename, getFilesList() (+2 more)

### Community 9 - "acceptInvitation.js"
Cohesion: 0.16
Nodes (15): broadcastMessage(), acceptInvitationHandler(), getInvitationsCollectionHandler(), rejectInvitationHandler(), acceptInvitation(), getInvitationsCollection(), rejectInvitation(), emitNotification() (+7 more)

### Community 10 - "Home Budget Manager — feature plan: frontend Faza 1 + Faza 2 (mapa SPA)"
Cohesion: 0.08
Nodes (25): `DashboardPage.jsx` — zamień ciało na cienką prezentację + hook, FAZA 1 — Aktualizacja zależności frontendu, FAZA 2 — Układ SPA (R5) + granice prezentacja vs orkiestracja, Historia sesji planu, Home Budget Manager — feature plan: frontend Faza 1 + Faza 2 (mapa SPA), `HouseInfoPage.jsx` — użyj hooka; gałąź roli zostaje jako odzwierciedlenie UX (bez rename R1), Kolejność implementacji w kroku, KROK 1 — Inwentaryzacja zależności vs stack SPEC-FRONTEND (+17 more)

### Community 11 - "Model danych — Home Budget Manager"
Cohesion: 0.08
Nodes (25): `actionCategories`, Cel, Diagram relacji (rdzeń), Galeria screenshotów, `households`, `householdUsers`, `initialMonthlyBudgets`, `invitations` (+17 more)

### Community 12 - "frontend/package.json"
Cohesion: 0.11
Nodes (20): name, private, type, version, autoprefixer, eslint, @eslint/js, eslint-plugin-react (+12 more)

### Community 13 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, bcrypt, cookie, cookie-parser, cors, dotenv, express, helmet (+14 more)

### Community 15 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, chart.js, framer-motion, i18next, i18next-browser-languagedetector, i18next-http-backend, @iconify/react, moment (+14 more)

### Community 16 - "checkUserHouse"
Cohesion: 0.17
Nodes (11): getBoardDataHandler(), deleteNotification(), GetNoticesCollection(), getBoardData(), deleteNotification(), getNoticesCollection(), deleteInhabitant(), deleteUser() (+3 more)

### Community 17 - "backend/package.json"
Cohesion: 0.10
Nodes (19): author, description, engines, node, license, main, name, type (+11 more)

### Community 18 - "Architektura — Home Budget Manager"
Cohesion: 0.10
Nodes (20): Architektura — Home Budget Manager, Bezpieczeństwo i granice zaufania, Cel dokumentu, Decyzje świadomie odroczone, Dostęp do danych: Prisma ORM, Dziedziczenie stylu, Frontend (as-is), Jak czytać dalej (+12 more)

### Community 19 - "websocketConfig.js"
Cohesion: 0.17
Nodes (13): broadcastToHouseMates(), initializeWebSocket(), addNewMonthlyBudgetHandler(), authMiddleware(), addNewMonthlyBudget(), getMysqlExpireDate(), handleBroadcastInitBudget(), addNewBudget() (+5 more)

### Community 20 - "householdController.js"
Cohesion: 0.23
Nodes (13): addNewHouse(), deleteHouse(), getAllHouses(), getHouseInfo(), addNewHouse(), signRoleToken(), deleteHouse(), getHouseInfo() (+5 more)

### Community 21 - "SPEC — Backend"
Cohesion: 0.12
Nodes (17): Błędy, Cel / zakres względem dokumentacji, Dane (Prisma), Helpery, Kryteria akceptacji (obserwowalne), Model modułów (ESM), Nie wolno, Observability (+9 more)

### Community 22 - "SPEC — Bezpieczeństwo"
Cohesion: 0.12
Nodes (17): Autoryzacja, Cel / zakres względem dokumentacji, Health, Helmet i CORS, Kryteria akceptacji (obserwowalne), Nie wolno, Poza zakresem tego SPEC, Sekrety i logi (+9 more)

### Community 23 - "registerUser.js"
Cohesion: 0.17
Nodes (11): jwtCookieOptions, loginUserHandler(), logoutUserHandler(), registerUserHandler(), loginUser(), logoutUser(), registerUser(), changeUserEmail() (+3 more)

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
Cohesion: 0.14
Nodes (14): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+6 more)

### Community 28 - "SPEC — Komunikacja (I/O)"
Cohesion: 0.14
Nodes (14): Cel / zakres względem dokumentacji, E-mail outbound, HTTP — kontrakt wspólny, HTTP — multipart, Kryteria akceptacji (obserwowalne), Nie wolno, Poza zakresem tego SPEC, SPEC — Komunikacja (I/O) (+6 more)

### Community 29 - "server.js"
Cohesion: 0.15
Nodes (12): setupRoutes(), allowedOrigins, app, __dirname, __filename, server, balanceHouseActions(), saveDailyBudget() (+4 more)

### Community 30 - "Anty-patterny — Home Budget Manager"
Cohesion: 0.15
Nodes (13): 10. Traktowanie otoczki jak rdzenia uprawnień budżetu, 11. (Bonus kontraktu) Nowe ścieżki bez prefiksu `/api/v1`, 1. Gruby controller / Prisma lub SQL poza warstwą `database`, 2. Reguły uprawnień tylko na froncie, 3. Drift ról (`mate` vs `inmate`, grupa `mates`), 4. Publiczny OCR / endpoint bez JWT „bo tak wyszło”, 5. Mieszane PL/EN w `message` jako kontrakt dla UI, 6. Logika biznesowa w komponencie React + dubel w API (+5 more)

### Community 31 - "Bezpieczeństwo — Home Budget Manager"
Cohesion: 0.15
Nodes (13): Autoryzacja (role), Bezpieczeństwo — Home Budget Manager, Cel, CORS, Granica zaufania, Health, Nagłówki HTTP (Helmet), Sekrety i logi (+5 more)

### Community 32 - "resolveAvatarPath.js"
Cohesion: 0.40
Nodes (4): getAvatar(), __dirname, __filename, resolveAvatarPath()

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

### Community 37 - "routerConfig.jsx"
Cohesion: 0.07
Nodes (33): App(), BackToUsMessage(), DescriptionSection(), Home(), TechnologiesSection(), CalendarModal(), localizer, savedLanguage (+25 more)

### Community 38 - "MessagesList.jsx"
Cohesion: 0.14
Nodes (19): MessagesFilterBtns(), MessagesList(), TransactionsList(), DashboardHeader(), MessagesCounter(), ReviewsSection(), DisplayMessageDetails(), ReplyMessageModal() (+11 more)

### Community 39 - "backend/utils/validation.js"
Cohesion: 0.27
Nodes (6): allowedRoles, isValidEmail(), isValidPassword(), isValidUsername(), registerValidations(), validTransactionTypes

### Community 40 - "Architektura katalogów i plików — Home Budget Manager"
Cohesion: 0.20
Nodes (10): Architektura katalogów i plików — Home Budget Manager, Blok A — as-is, Blok B — docelowe (lekki porządek), Cel dokumentu, Co się zmienia względem Bloku A (skrót), Czego drzewo docelowe nie robi, Jak czytać dalej, Relacja do lekkiego refaktoru (R1–R6 + ESM) (+2 more)

### Community 41 - "Strategia testów — Home Budget Manager"
Cohesion: 0.20
Nodes (10): Cel i zakres v1, Czego nie robimy w v1 strategii, Narzędzie, Piramida (backend), Powiązania, Refaktor fazowy (major plan backend), Reguła procesowa (DoD), Scenariusze E2E backend (minimum) (+2 more)

### Community 42 - "KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma)"
Cohesion: 0.20
Nodes (10): 3.A — Wspólna konwencja service → controller, 3.F — Budget (`services/budget/`), 3.G — Receipt (`services/receipt/` + cienki controller), 3.H — Shell (reviews, gallery) + rename’owane obszary już mające services, KROK 3 — Domknięcie sierot + cienkie controllery (pełny pipeline; bez Prisma), Nowy plik — `backend/controllers/receiptController.js`, Nowy plik — `backend/services/budget/addNewMonthlyBudget.js`, Nowy plik — `backend/services/receipt/extractReceiptTotal.js` (+2 more)

### Community 43 - "swaggerConfig.js"
Cohesion: 0.22
Nodes (8): __dirname, __filename, swaggerDocs(), swaggerOptions, swaggerSpec, helmet, swagger-jsdoc, swagger-ui-express

### Community 44 - "Słownik — Home Budget Manager"
Cohesion: 0.22
Nodes (9): Finanse, Gospodarstwo i członkostwo, Komunikacja w produkcie, Kontrakt I/O, Powiązane, Rdzeń vs otoczka (produkt), Role i tożsamość, Synonimy — preferencje docs (+1 more)

### Community 45 - "i18n i kontrakt UI — Home Budget Manager"
Cohesion: 0.22
Nodes (9): As-is vs kierunek, Cel, Fallback do czasu pełnej migracji, i18n i kontrakt UI — Home Budget Manager, Języki v1, Kontrakt API ↔ UI (norma docelowa), Namespace’y UI (as-is + rozszerzenie), Obowiązki przy zmianie (+1 more)

### Community 46 - "react"
Cohesion: 0.20
Nodes (14): DashBoard(), MatesList(), DisplayLiveBalance(), DisplayMatesList(), MonthlyBudget(), LastTransactionsList(), MatesCounter(), UserTransactionsModal() (+6 more)

### Community 47 - "Katalog zmiennych środowiskowych — Home Budget Manager"
Cohesion: 0.25
Nodes (8): Backend (wymagane / używane w kodzie), Cel, Checklist przy nowym środowisku, Compose / origin (production), Czego ten katalog nie obejmuje, E-mail outbound (kierunek — jeszcze nieużywane w kodzie), Frontend, Katalog zmiennych środowiskowych — Home Budget Manager

### Community 48 - "3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`"
Cohesion: 0.29
Nodes (7): 3.E — Notifications (`services/notifications/`) + naprawa `handleNotification`, Nowy plik — `backend/services/notifications/deleteNotification.js`, Nowy plik — `backend/services/notifications/emitNotification.js`, Nowy plik — `backend/services/notifications/getNoticesCollection.js`, Nowy plik — `backend/services/notifications/saveNotification.js`, Refaktor — `controllers/notificationController.js` → tylko HTTP (`getNoticesCollection`, `deleteNotification` przez `runController`). **Usuń** eksport `saveNotification` z controllera., Refaktor — `utils/handleNotification.js`

### Community 49 - "FAZA 1 — Aktualizacja zależności + ESM + scoped fundament"
Cohesion: 0.29
Nodes (7): FAZA 1 — Aktualizacja zależności + ESM + scoped fundament, KROK 1 — Inwentaryzacja zależności vs stack docs/SPEC, KROK 3 — Setup Jest (ESM) + smoke fundamentu, Lista wyjściowa (`backend/package.json` as-is), Nowy plik — `backend/jest.config.js`, Nowy plik — `backend/tests/foundation/esm-smoke.test.js`, Propozycja commit message

### Community 50 - "react-i18next"
Cohesion: 0.20
Nodes (13): FastActions(), ModalComponent(), AddTransactionModal(), AddUserToHouseModal(), DeclareBudgetModal(), SendMessageModal(), TransactionsCategoriesModal(), SignUpCookiesSettings() (+5 more)

### Community 51 - "Project: Web Home Budget Manager"
Cohesion: 0.29
Nodes (6): Conclusion, 🚀 Features, Installation, 💡 Project Idea, Project: Web Home Budget Manager, Tech stack / libraries

### Community 52 - "Home Budget Manager — feature plan: backend Faza 1 + Faza 2 (Blok B + R2)"
Cohesion: 0.33
Nodes (5): Home Budget Manager — feature plan: backend Faza 1 + Faza 2 (Blok B + R2), Meta, Weryfikacja wycinka, Założenia, Ślad do major (tylko informacyjnie — ten plan **nie** edytuje major)

### Community 53 - "KROK 4 — Audyt granic warstw + scoped testy mapy / B-10 / pipeline"
Cohesion: 0.33
Nodes (6): Audyt importów (wykonać przy implementacji; fail = poprawka w tym kroku), KROK 4 — Audyt granic warstw + scoped testy mapy / B-10 / pipeline, Nowy plik — `backend/tests/unit/appError-runController.test.js`, Nowy plik — `backend/tests/unit/board-getBoardData.test.js`, Nowy plik — `backend/tests/unit/services-layout.test.js`, Propozycja commit message

### Community 54 - "FAZA 2 — Blok B + pipeline R2 (cienkie controllery, B-10; bez Prisma)"
Cohesion: 0.33
Nodes (6): FAZA 2 — Blok B + pipeline R2 (cienkie controllery, B-10; bez Prisma), KROK 1 — Jednolity błąd aplikacji B-10 + helper controllera, KROK 2 — Podfoldery `services/<obszar>/` + `shell/` (mapa Bloku B), Mapa przeniesień (git mv / równoważne), Nowy plik — `backend/utils/errors/AppError.js`, Nowy plik — `backend/utils/http/runController.js`

### Community 55 - "authContext.jsx"
Cohesion: 0.38
Nodes (5): CustomAvatarInput, AuthProvider(), serverUrl, fetchData(), zustand

### Community 56 - "3.B — Auth (`services/auth/`)"
Cohesion: 0.40
Nodes (5): 3.B — Auth (`services/auth/`), Nowy plik — `backend/services/auth/loginUser.js`, Nowy plik — `backend/services/auth/logoutUser.js`, Nowy plik — `backend/services/auth/registerUser.js`, Refaktor — `backend/controllers/authController.js` (cały plik → cienki)

### Community 57 - "3.D — Invitations (`services/invitations/`)"
Cohesion: 0.40
Nodes (5): 3.D — Invitations (`services/invitations/`), Nowy plik — `backend/services/invitations/acceptInvitation.js`, Nowy plik — `backend/services/invitations/getInvitationsCollection.js`, Nowy plik — `backend/services/invitations/rejectInvitation.js`, Refaktor — `controllers/invitationController.js` → cienki `runController` + powyższe services (analogicznie do board/auth). Usuń SQL z controllera.

### Community 58 - "KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout"
Cohesion: 0.40
Nodes (5): KROK 2 — Upgrade lockfile + ESM + minimalny logger stdout, Nowy kształt — `backend/configs/logger.js` (kompletny), `package.json` — docelowy szkielet (wersje liczbowe = wynik `npm outdated` / install w momencie implementacji; linie major jak niżej), Refaktor — `backend/routes/index.js`, Refaktor — wzorzec CJS → ESM (stosować we wszystkich plikach)

### Community 59 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 60 - "SPEC — jak czytać"
Cohesion: 0.40
Nodes (5): Docs vs SPEC, Kolejność czytania (rekomendacja), Mapa obszar → plik, SPEC — jak czytać, Źródło

### Community 61 - "devDependencies"
Cohesion: 0.50
Nodes (4): devDependencies, jest, nodemon, supertest

### Community 62 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, dev, start, test

### Community 63 - "Dokumentacja — Home Budget Manager"
Cohesion: 0.50
Nodes (4): Dokumentacja — Home Budget Manager, Jak czytać (rekomendowana kolejność), Mapa temat → plik, Skróty decyzyjne

### Community 64 - "3.C — Board (`services/board/`)"
Cohesion: 0.50
Nodes (4): 3.C — Board (`services/board/`), Nowy plik — `backend/services/board/getBoardData.js`, Refaktor — `backend/controllers/boardController.js`, Refaktor — `backend/routes/dashboardRoutes.js` (handler)

### Community 72 - "deleteAction.js"
Cohesion: 0.25
Nodes (10): addNewAction(), deleteAction(), getAllActions(), getHouseActions(), addNewAction(), deleteAction(), getActionsCollection(), getHouseActions() (+2 more)

### Community 73 - "DashBoardHeader.jsx"
Cohesion: 0.35
Nodes (6): Authorization(), HomePageMenu(), AuthModal(), LogOutModal(), AuthContext, loggingOut()

### Community 74 - "DashboardPage.jsx"
Cohesion: 0.42
Nodes (7): showMessageToast(), DashboardPage(), useInvitationsStore, isHostRole(), isUserRole(), mateOrHostRole(), getClickHandler()

## Knowledge Gaps
- **520 isolated node(s):** `logFormat`, `__filename`, `__dirname`, `swaggerOptions`, `swaggerSpec` (+515 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 546 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `showInfoToast`, `HouseInfoPage.jsx`, `DashBoardMenu.jsx`, `routerConfig.jsx`, `MessagesList.jsx`, `DashBoardHeader.jsx`, `DashboardPage.jsx`, `frontend/package.json`, `react-i18next`, `authContext.jsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react-i18next` to `showInfoToast`, `HouseInfoPage.jsx`, `DashBoardMenu.jsx`, `routerConfig.jsx`, `MessagesList.jsx`, `DashBoardHeader.jsx`, `DashboardPage.jsx`, `frontend/package.json`, `react`, `authContext.jsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `frontend/package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `logFormat`, `__filename`, `__dirname` to the rest of the system?**
  _520 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HouseInfoPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07281772953414745 - nodes in this community are weakly interconnected._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07355769230769231 - nodes in this community are weakly interconnected._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._