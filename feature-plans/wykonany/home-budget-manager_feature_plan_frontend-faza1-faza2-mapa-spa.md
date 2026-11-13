# Home Budget Manager — feature plan: frontend Faza 1 + Faza 2 (mapa SPA)

**Kotwica major:** `home-budget-manager_major_plan-frontend.md` — Faza 1, MILESTONE „Frontend na zaktualizowanych zależnościach”, Faza 2, MILESTONE „Mapa SPA zgodna z normą katalogów”.  
**Źródła:** `docs/` (m.in. `architektura_katalogi_pliki.md` Blok B front, `dokumentacja_koncepcyjna.md` rdzeń/otoczka, `anty_patterny.md`, `deployment.md`), `spec/SPEC-FRONTEND.md` (F-1, F-2, F-7, F-15; stack), kod `frontend/`.  
**Poza zakresem wycinka:** Faza 3+ (model stanu Context/Zustand jako faza), cutover `/api/v1` (F4), R1 `mate`→`inmate` (F5), namespace i18n `api` (F6), pełne handlery WS (F7), Vitest/RTL/E2E, React Query/SWR, BFF, `features/<name>/`.

**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

**Pass rozwojowy (zatwierdzony):** brak przesunięć między fazami major. FAZA 1: inwentaryzacja → upgrade + dostosowanie build. FAZA 2: mapa katalogów → rdzeń vs otoczka → prezentacja vs orkiestracja (helpery/hooki przed podpięciem w JSX).

**Decyzje HOW (wywiad):** cel upgrade = **możliwie najnowsze** wersje w zatwierdzonym stacku; **obowiązkowo React 19** oraz **Tailwind CSS 4** z dostosowaniem kodu, aż `npm run build` przechodzi. Toolchain: **Vite 8** + `@vitejs/vite` plugin React 6 + `@tailwindcss/vite` (≥ 4.2.2 dla Vite 8).

---

## Meta

| Pole | Wartość |
|------|---------|
| Plik | `feature-plans/home-budget-manager_feature_plan_frontend-faza1-faza2-mapa-spa.md` |
| Nazwa projektu | `home-budget-manager` |
| Katalog procesu | `frontend/` |
| Runtime build (Docker as-is) | `node:20.19.0-slim` (`frontend/Dockerfile`) — spełnia minimum Vite 8 (Node ≥ 20.19); lokalnie Node 22/24 OK |
| Testy UI w wycinku | **Nie** (docs/SPEC-TESTY — poza strategią v1) |

---

## Założenia

- Stack i zakazy: `SPEC-FRONTEND` (React, Vite, React Router, Zustand, Context w `store/`, i18next, socket.io-client; **bez** React Query / SWR / BFF / `features/<name>/`).
- Układ katalogów: Blok B front w `docs/architektura_katalogi_pliki.md` — `pages/` (+ `dashboard-subpages/`, `adminpanel-subpages/`), `components/` (dashboard / forms / home-page / modals / admin / charts), `store/`, `configs/`, `hooks/`, `utils/`.
- R1 (`inmate`): **nie** w tym wycinku — porównania roli mogą nadal używać `mate` aż do Fazy 5 major; w FAZIE 2 nie utrwalamy `mate` jako „nowej normy”, tylko nie robimy big-bang rename.
- Uprawnienia: UI tylko odzwierciedla role; źródło prawdy = API (F-15). Orkiestracja nie reimplementuje reguł biznesowych jako lokalnego SoT.
- Biblioteki (Context7 + oficjalne docs / npm w dniu planu): Tailwind v4 — `@import "tailwindcss"` + `@tailwindcss/vite`, theme w CSS (`@theme`); React 19 — `createRoot` już w `main.jsx`; usunięte legacy API (`ReactDOM.render`, string refs, `propTypes` ignorowane). Wersje liczbowe w tabelach = **cel najnowszych** na npm w momencie implementacji (poniżej snapshot referencyjny).

**Snapshot referencyjny npm (orientacja HOW; przy implementacji `npm outdated` / install aktualizuje lockfile):**

| Pakiet | As-is | Cel |
|--------|-------|-----|
| `react` / `react-dom` | 18.3.1 | **19.x** (np. 19.3.1) |
| `@types/react` / `@types/react-dom` | 18.x | **19.x** |
| `vite` | 5.4.x | **8.x** (np. 8.3.7) |
| `@vitejs/plugin-react` | 4.x | **6.x** (wymaga Vite 8) |
| `tailwindcss` | 3.4.x | **4.x** (≥ 4.2.2) |
| `@tailwindcss/vite` | brak | **4.x** (≥ 4.2.2) |
| `autoprefixer` / `postcss` jako pipeline Tailwind | tak | **usunąć** z toru Tailwind (Vite plugin; autoprefix wbudowany) |
| `react-router-dom` | 7.1.x | najnowsze 7.x |
| `zustand` | 5.0.x | najnowsze 5.x |
| `i18next` | 24.x | **27.x** |
| `react-i18next` | 15.x | **18.x** (peer: i18next ≥ 27) |
| `i18next-http-backend` | 3.x | **4.x** |
| `socket.io-client` | 4.8.x | najnowsze 4.x |
| `framer-motion` | 11.x | **14.x** |
| `@iconify/react` | 5.x | **6.x** |
| `eslint` / `@eslint/js` | 9.x | **10.x** (dostosować flat config jeśli peer wymaga) |
| `eslint-plugin-react-hooks` | 5.x | **7.x** |
| `sitemap` | 8.x (nieużywany w `src/`) | **usunąć** |

---

## FAZA 1 — Aktualizacja zależności frontendu

**Kotwica major:** Faza 1 (kroki 1.1–1.2) + przygotowanie do MILESTONE „Frontend na zaktualizowanych zależnościach”.  
**SPEC / docs:** stack SPEC-FRONTEND; deployment — `npm run dev` / `npm run build`.

### KROK 1 — Inwentaryzacja zależności vs stack SPEC-FRONTEND

**Status:** `WYKONANY`

**Cel:** Jawna lista wyjściowa i decyzji upgrade / usunięcie przed zmianą lockfile (major 1.1).

**Artefakty:** brak nowych plików kodu — obowiązuje tabela decyzji poniżej.

#### Lista wyjściowa (`frontend/package.json` as-is) i decyzje

| Pakiet | Rola as-is | Decyzja |
|--------|------------|---------|
| `react`, `react-dom` | UI | **Upgrade do 19.x** |
| `@types/react`, `@types/react-dom` | typy (dev) | **Upgrade do 19.x** |
| `vite`, `@vitejs/plugin-react` | bundler | **Vite 8 + plugin-react 6** |
| `tailwindcss`, `postcss`, `autoprefixer` | CSS | **Tailwind 4 + `@tailwindcss/vite`**; usunąć `autoprefixer` z toru; `postcss.config.js` zbędny przy Vite plugin |
| `react-router-dom` | routing | Upgrade w linii 7.x |
| `zustand` | store domenowy | Upgrade 5.x |
| `i18next`, `react-i18next`, `i18next-*` | i18n | Upgrade do linii zgodnej z peermi (i18next 27 + react-i18next 18 + backend 4) |
| `socket.io-client` | WS klient | Upgrade 4.x |
| `framer-motion` | animacje | Upgrade 14.x; poprawić breaking importy/API jeśli build padnie |
| `@iconify/react` | ikony | Upgrade 6.x |
| `chart.js`, `react-chartjs-2`, `react-big-calendar`, `moment`, `react-modal`, `react-select`, `react-stars`, `react-toastify`, `react-responsive` | UI | Upgrade do najnowszych zgodnych z React 19 |
| `sitemap` | brak użycia w `src/` | **Usunąć** |
| ESLint flat + pluginy React | lint | Upgrade; `settings.react.version` → `'19.0'` (lub `'detect'`) |
| React Query / SWR | brak | **Nie dodawać** |

**DoD (krok):**

- Tabela decyzji powyżej obowiązuje przy upgrade.
- Brak otwartego sporu „czy React 19 / Tailwind 4 są w zakresie FAZY 1”.

### KROK 2 — Upgrade wersji + dostosowanie kodu pod przechodzący build

**Status:** `WYKONANY`

**Cel:** Lockfile/manifest na nowych majorach; Tailwind 4 + React 19 uruchamialne; `npm run build` przechodzi (major 1.2).

**Artefakty:**

- Zmiana: `frontend/package.json`, `frontend/package-lock.json`
- Zmiana: `frontend/vite.config.js`
- Zmiana: `frontend/src/index.css` (Tailwind v4 + `@theme`)
- Usunięcie: `frontend/tailwind.config.js` (po migracji tokenów do CSS)
- Usunięcie lub opróżnienie toru PostCSS Tailwind: `frontend/postcss.config.js` (przy `@tailwindcss/vite` — usunąć plik)
- Zmiana: `frontend/eslint.config.js` (`react.version`)
- Zmiana mechaniczna wg błędów build/lint: klasy Tailwind (`customGray` → token v4), peery framer-motion / i18n / iconify
- Opcjonalnie hygiene: `frontend/src/main.jsx` — albo owinąć `ThemeProvider`, albo usunąć nieużywany import (obecnie import bez użycia w drzewie)

#### `package.json` — docelowy szkielet (wersje = wynik install w dniu implementacji; linie major jak w snapshot)

```json
{
  "name": "home-budget-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@iconify/react": "^6.0.4",
    "chart.js": "^4.6.1",
    "framer-motion": "^14.11.0",
    "i18next": "^27.0.1",
    "i18next-browser-languagedetector": "^8.3.0",
    "i18next-http-backend": "^4.0.10",
    "moment": "^2.30.1",
    "react": "^19.3.1",
    "react-big-calendar": "^1.20.0",
    "react-chartjs-2": "^5.3.1",
    "react-dom": "^19.3.1",
    "react-i18next": "^18.0.1",
    "react-modal": "^3.16.3",
    "react-responsive": "^10.0.1",
    "react-router-dom": "^7.18.5",
    "react-select": "^5.10.2",
    "react-stars": "^2.2.5",
    "react-toastify": "^11.2.0",
    "socket.io-client": "^4.8.4",
    "zustand": "^5.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@tailwindcss/vite": "^4.3.5",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.3.0",
    "eslint": "^10.14.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.7",
    "globals": "^17.14.0",
    "tailwindcss": "^4.3.5",
    "vite": "^8.3.7"
  }
}
```

> Przy implementacji: jeśli konkretny peer zablokuje najnowszy patch, zejdź o jeden patch **w tej samej linii major** — bez rezygnacji z React 19 / Tailwind 4 / Vite 8. Jeśli `eslint` 10 rozjedzie flat config — dostosuj `eslint.config.js` minimalnie albo zostań na najnowszym 9.x **tylko** gdy 10 nie da się uruchomić bez przebudowy reguł poza wycinkiem; preferuj 10.

#### Kolejność implementacji w kroku

1. Zaktualizuj zależności (`npm install` wg decyzji); usuń `sitemap`, `autoprefixer` (i `postcss` jeśli nieużywany poza Tailwind).
2. Przełącz Vite + Tailwind:

**`vite.config.js` — zamień na:**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

3. Migracja CSS (oficjalny upgrade guide Tailwind v4; wolno wspomóc `npx @tailwindcss/upgrade`, potem ręcznie domknąć tokeny projektu):

**`src/index.css` — fragment startowy `teraz`:**

```css
@import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`zamień na` (nagłówek + theme; reszta `@layer utilities { … }` zostaje, z korektą nazw klas jeśli upgrade zmieni tokeny):**

```css
@import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
@import "tailwindcss";

@theme {
  --font-urbanist: Urbanist, sans-serif;
  --color-custom-gray: #303641;
  --breakpoint-indirect: 450px;
  --breakpoint-indirectxl: 550px;
}

@layer utilities {
  /* … istniejące utility classes z as-is index.css … */
}
```

4. Po `@theme`: zaktualizuj wystąpienia klas zależnych od starych nazw tokenów, np. `bg-customGray` / `shadow-customGray` → `bg-custom-gray` / `shadow-custom-gray` (albo zachowaj camelCase **tylko** jeśli `@theme` zdefiniuje identyczny identyfikator i build to potwierdzi — domyślnie HOW zakłada kebab z `--color-custom-gray`).
5. Usuń `tailwind.config.js` i `postcss.config.js` po potwierdzeniu, że Vite plugin wystarcza.
6. `eslint.config.js` — `settings.react.version: '19.0'` (lub `'detect'`).
7. `main.jsx`: już jest `createRoot` (React 19 OK). Dopnij `ThemeProvider` wokół drzewa **albo** usuń martwy import — bez nowej architektury stanu.

**`main.jsx` — preferowane `zamień na` (owinięcie istniejącym Contextem):**

```jsx
import { AuthProvider } from './store/authContext.jsx';
import { ThemeProvider } from './store/ThemeContext.jsx';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
```

8. Uruchom `npm run build`; naprawiaj błędy kompilacji / peery aż build przejdzie. `npm run dev` musi wstawać bez braku modułów.
9. Docker: `frontend/Dockerfile` (`node:20.19.0-slim`) zostaje, o ile build w obrazie przechodzi; przy failu Node — podnieś tag Node w Dockerfile do LTS ≥ minimum Vite 8 (bez zmiany nginx stage).

**Biblioteki / API:** Context7 `/tailwindlabs/tailwindcss.com` — `@import "tailwindcss"`, `@tailwindcss/vite`, PostCSS `@tailwindcss/postcss` jako alternatywa (tu wybór: **Vite plugin**). React 19 upgrade guide (react.dev) — brak `ReactDOM.render` w projekcie. Vite 8 + `@tailwindcss/vite` ≥ 4.2.2.

**Testy:** brak nowych testów UI; weryfikacja = `npm run build` (+ ręczny smoke `npm run dev` wg DoD).

**DoD (krok):**

- Lockfile odzwierciedla React 19, Tailwind 4, Vite 8 (lub równoważne najnowsze w tych liniach).
- `npm run build` w `frontend/` kończy się sukcesem.
- SPA startuje lokalnie (`npm run dev`) bez konfliktu peer / brakujących modułów.
- Brak React Query / SWR w zależnościach.

#### Propozycja commit message

```text
feat(frontend): upgrade SPA stack to React 19, Vite 8, and Tailwind 4

Bring dependencies to the current approved stack and adapt CSS/toolchain so production build passes before layout refactor.
```

---

## FAZA 2 — Układ SPA (R5) + granice prezentacja vs orkiestracja

**Kotwica major:** Faza 2 (kroki 2.1–2.3) + MILESTONE „Mapa SPA zgodna z normą katalogów”.  
**SPEC / docs:** F-1, F-2, F-7, F-15; Blok B front; rdzeń vs otoczka w `dokumentacja_koncepcyjna.md`; anty-pattern „logika biznesowa w komponencie”.

### KROK 1 — Mapa katalogów: audit as-is ↔ Blok B + outliery

**Status:** `WYKONANY`

**Cel:** Krytyczne obszary UI mają dom w katalogach normy; jawna mapa bez migracji na `features/<name>/` (major 2.1).

**Artefakty:**

- Przeniesienie: `frontend/src/pages/dashboard-subpages/AdminPanelPage.jsx` → `frontend/src/pages/adminpanel-subpages/AdminPanelPage.jsx`
- Zmiana importu: `frontend/src/configs/routerConfig.jsx`
- Bez nowych drzew `contexts/` / `features/`

#### Mapa docelowa (norma + decyzje as-is)

| Obszar | Dom normy | Stan as-is / decyzja HOW |
|--------|-----------|---------------------------|
| Strony publiczne | `pages/` | `HomePage`, `AboutUsPage`, `ContactPage`, `ErrorPage` — zostają |
| Rdzeń budżetu (strony) | `pages/dashboard-subpages/` | kalendarz, transakcje, mates, messages, stats, house info, profile, dashboard user — zostają |
| Otoczka superadmin (strony) | `pages/adminpanel-subpages/` | `ManageUsers` już tu; **`AdminPanelPage` przenieść tutaj** |
| Komponenty dashboard | `components/dashboard/` (+ internal / charts) | zostają; bez wymuszania spłaszczenia nazw |
| Landing / otoczka UI | `components/home-page-components/` | zostają |
| Formularze / modale / charts / admin | `components/forms|modals|charts|admin-panel-components/` | zostają |
| Shared shell UI | `components/*.jsx` (root) | `LanguageSelector`, `BackToUsMessage`, `SignUpCookiesSettings`, `StarRating` — **zostają w root** jako współdzielona otoczka (nie `features/`) |
| Stan | `store/` | Context + Zustand już tu; **bez** osobnego `contexts/` |
| Routing / i18n / toast / calendar | `configs/` | zostają |
| Hooki / utils | `hooks/`, `utils/` | zostają; nowe hooki orkiestracji w KROK 3 |

**`routerConfig.jsx` — `teraz`:**

```js
import AdminPanelPage from '../pages/dashboard-subpages/AdminPanelPage';
```

**`zamień na`:**

```js
import AdminPanelPage from '../pages/adminpanel-subpages/AdminPanelPage';
```

Trasa URL `/dashboard/adminpanel` **zostaje** (zagnieżdżenie pod layoutem dashboardu as-is) — zmiana dotyczy **domu pliku**, nie redesignu ścieżek URL w tym wycinku.

**DoD (krok):**

- `AdminPanelPage` leży w `adminpanel-subpages/`; router importuje z nowego miejsca; build przechodzi.
- Brak katalogu `features/<name>/` i brak `src/contexts/`.
- Mapa powyżej jest obowiązującą wykładnią domów plików dla reszty FAZY 2.

### KROK 2 — Podział rdzeń UX vs otoczka

**Status:** `WYKONANY`

**Cel:** Rdzeń budżetu i otoczka (landing / superadmin) nie mieszają się w mapie stron/komponentów bez świadomego uzasadnienia (major 2.2).

**Artefakty:**

- Zmiana (komentarz-mapa w routerze — krótki, tylko granice): `frontend/src/configs/routerConfig.jsx`
- Bez przenosin masowych poza domknięciem z KROK 1

#### Reguły podziału (egzekwowane w tym kroku)

| Strefa | Zawartość | Zakaz |
|--------|-----------|--------|
| Rdzeń | `dashboard-subpages/*` (poza admin), `components/dashboard/**`, domenowe store’y transakcji/messages/… | Traktowanie panelu `superadmin` jako „hosta gospodarstwa” |
| Otoczka landing | `HomePage` + `home-page-components/**`, about/contact | Wkładanie logiki bilansu domu do landing |
| Otoczka operatorska | `adminpanel-subpages/**`, `admin-panel-components/**` | Mieszanie CRUD użytkowników witryny z regułami składu gospodarstwa w jednym „grubym” widoku bez granicy |

**Świadomy wyjątek (zostaje, udokumentowany w komentarzu przy trasie):** layout `path: 'dashboard'` owija też `adminpanel` — wspólny shell menu/sesji; pliki stron admina pozostają w `adminpanel-subpages/`. `DashboardForUser` w `dashboard-subpages/` obsługuje rolę `user` (bez domu) — UX mostkujący, nie panel superadmin.

**`routerConfig.jsx` — dopisek przy bloku dashboard (fragment `zamień na` w miejscu definicji trasy admin):**

```jsx
            {
                // otoczka operatorska (superadmin): pliki w adminpanel-subpages/; URL pod shellem dashboardu as-is
                path: 'adminpanel', element: <AdminPanelPage />,
                children: [
                    { path: 'manage-users', element: <ManageUsers /> },
                ]
            },
```

**DoD (krok):**

- Pliki superadmin są pod `adminpanel-subpages/` (+ komponenty admin).
- Rdzeń budżetu nie trzyma stron panelu witryny w `dashboard-subpages/` (poza mostkiem `DashboardForUser`).
- Komentarz w routerze oznacza otoczkę admin bez zmiany kontraktu URL.

### KROK 3 — Widoki prezentacyjne vs orkiestracja

**Status:** `WYKONANY`

**Cel:** W objętych powierzchniach: fetch/mutacje/składanie danych poza grubym JSX z regułami; UI nie jest SoT uprawnień (major 2.3, F-7, F-15).

**Zakres objętych powierzchni (domknięty HOW — nie cały SPA):**

1. `pages/DashboardPage.jsx` — sesja + zaproszenia + nawigacja roli `user`
2. `pages/dashboard-subpages/HouseInfoPage.jsx` — składanie danych chartów/list z Context/store
3. `components/dashboard/dashboard-internal-components/MatesList.jsx` — akcje UI bez lokalnego „kto może usunąć” jako reguły biznesowej

**Poza tym krokiem:** rename `mate`→`inmate`, cutover `/api/v1`, przebudowa wszystkich modalów.

**Artefakty:**

- Nowy: `frontend/src/hooks/useDashboardShell.js`
- Nowy: `frontend/src/hooks/useHouseInfoDashboard.js`
- Zmiana: trzy pliki objęte (refaktory poniżej)
- Bez zmian kontraktu API

#### Nowy plik: `hooks/useDashboardShell.js`

```js
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../store/authContext';
import { useSocket } from '../store/socketContext';
import { useInvitationsStore } from '../store/invitationsStore';
import { mateOrHostRole, isHostRole, isUserRole } from '../utils/checkUserRole';
import useModal from './useModal';
import { showMessageToast } from '../configs/toastify';

/**
 * Orkiestracja shelledu dashboardu: sesja, zaproszenia, toast nowych wiadomości.
 * Reguły uprawnień egzekwuje API — tu tylko odzwierciedlenie roli w UX.
 */
export default function useDashboardShell() {
  const navigate = useNavigate();
  const { loginStatus, isAuthenticated, user } = useContext(AuthContext);
  const { connected, messages } = useSocket();
  const {
    invitationsData,
    invitationsLoading,
    invitationsLoadingError,
    fetchInvitations,
    fetchedInvitations,
  } = useInvitationsStore();
  const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null, data: null });
  const { t } = useTranslation('common');

  const liveMessages = connected && messages?.newMessages;
  const dbInvitations = (!invitationsLoading && !invitationsLoadingError && invitationsData) || [];
  const invitationsMessages = connected && messages?.invitations;
  const isMateOrHost = mateOrHostRole(user);
  const isUser = isUserRole(user);
  const isHost = isHostRole(user);

  const allInvitations = [
    ...(Array.isArray(dbInvitations) ? dbInvitations : []),
    ...(Array.isArray(invitationsMessages) ? invitationsMessages : []),
  ];

  useEffect(() => {
    if (connected && liveMessages?.length > 0) {
      showMessageToast(t('notifications.newMessageNotice'));
    }

    if (!loginStatus.isLoading && isAuthenticated && isUser) {
      navigate('/userDashboard');
    }

    if (!invitationsLoading && !invitationsLoadingError && !fetchedInvitations && allInvitations.length === 0) {
      fetchInvitations();
    }

    if (allInvitations.length > 0) {
      openModal('invitation', allInvitations);
    }
  }, [liveMessages, connected, loginStatus, isAuthenticated, isUser, fetchedInvitations]);

  return {
    loginStatus,
    isMateOrHost,
    isHost,
    modal,
    closeModal,
  };
}
```

#### `DashboardPage.jsx` — zamień ciało na cienką prezentację + hook

**`zamień na` (cały plik):**

```jsx
import DashBoardMenu from '../components/dashboard/dashboardComponents/DashBoardMenu';
import { InvitationModal } from '../components/modals/invitationModal';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useDashboardShell from '../hooks/useDashboardShell';
import { Outlet } from 'react-router-dom';
import LoadingModal from '../components/modals/LoadingModal';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { loginStatus, isMateOrHost, isHost, modal, closeModal } = useDashboardShell();

  if (loginStatus.isLoading) return <LoadingModal isOpen={loginStatus.isLoading} />;

  return isMateOrHost ? (
    <main className="w-full h-full flex flex-row justify-around items-stretch overflow-y-hidden bg-slate-200">
      <DashBoardMenu />
      <Outlet />
      {isHost && modal && modal.type === 'invitation' ? (
        <InvitationModal isOpen={modal.isOpen} onRequestClose={closeModal} invitationsData={modal.data} />
      ) : null}
    </main>
  ) : null;
}
```

#### Nowy plik: `hooks/useHouseInfoDashboard.js`

```js
import { useContext, useEffect, useMemo } from 'react';
import { DataContext } from '../store/dataContext';
import { AuthContext } from '../store/authContext';
import { useTransactionsStore } from '../store/transactionsStore';
import useProcessedData from './useProcessedData';
import { getData } from '../utils/getData';

/** Orkiestracja danych widoku house info — bez reguł uprawnień jako SoT. */
export default function useHouseInfoDashboard() {
  const { data, isLoading, error: contextError } = useContext(DataContext);
  const { actionsLoading, actionsDataError, actionsData, isTransactionsFetched, fetchTransactions } =
    useTransactionsStore();
  const { user } = useContext(AuthContext);
  const { houseData, houseMates, statsData, dailyData } = data;

  useEffect(() => {
    if (!isTransactionsFetched) {
      fetchTransactions();
    }
  }, [isTransactionsFetched, fetchTransactions]);

  const basicHouseInfo = (!isLoading && !contextError && houseData[0]) || [];
  const dailyInfo = getData(isLoading, contextError, true, dailyData, []);
  const stats = getData(isLoading, contextError, true, statsData, []);
  const matesData = getData(isLoading, contextError, true, houseMates, []);
  const transactions = (!actionsDataError && !actionsLoading && isTransactionsFetched && actionsData) || [];

  const { actionCountLabels } = useMemo(() => {
    if (!stats || !stats.length) {
      return { actionCountLabels: [] };
    }
    return {
      actionCountLabels: stats.map(
        (item) => `${item.countStartDate} - ${item.monthlyBalanceDate}`,
      ),
    };
  }, [stats]);

  const { labels, monthlyBalances, definedBudgets, monthlyTransactionCounts } = useProcessedData(stats, {
    labels: 'monthlyBalanceDate',
    monthlyBalances: 'monthlyBalanceValue',
    definedBudgets: 'definedMonthlyBudgets',
    monthlyTransactionCounts: 'transactionCount',
  });

  const { actionLabels, dailyTransactions, dailyBudgetLabels, dailyBudgetValues } = useProcessedData(
    dailyInfo,
    {
      actionLabels: 'dailyActionsDate',
      dailyTransactions: 'dailyActionCount',
      dailyBudgetLabels: 'dailyBudgetDate',
      dailyBudgetValues: 'dailyBudgetValue',
    },
  );

  return {
    user,
    isLoading,
    houseMates,
    basicHouseInfo,
    dailyInfo,
    matesData,
    transactions,
    actionsData,
    chartMonthly: { labels, monthlyBalances, definedBudgets, monthlyTransactionCounts, actionCountLabels },
    chartDaily: { actionLabels, dailyTransactions, dailyBudgetLabels, dailyBudgetValues },
  };
}
```

#### `HouseInfoPage.jsx` — użyj hooka; gałąź roli zostaje jako odzwierciedlenie UX (bez rename R1)

W pliku: usuń lokalne `useContext` / `useProcessedData` / `fetchTransactions` na rzecz:

```jsx
const {
  user,
  isLoading,
  houseMates,
  basicHouseInfo,
  dailyInfo,
  matesData,
  transactions,
  actionsData,
  chartMonthly,
  chartDaily,
} = useHouseInfoDashboard();
```

i podawaj `chartMonthly` / `chartDaily` do istniejących komponentów chartów (te same propsy co as-is). Warunek `user.role === 'host' || user.role === 'mate'` **zostaje** do Fazy 5 major (R1).

#### `MatesList.jsx` — prezentacja; przycisk delete tylko hint UX

**`teraz` (fragment):**

```jsx
<button
    type="button"
    className="w-fit h-fit"
    hidden={user.role !== 'superadmin'}
    title={t("matesList.deleteBtnTitle")}
>
    <Icon icon='mi:delete' width={20} height={20} />
</button>
```

**`zamień na`:**

```jsx
{/* Hint UX — usuwanie egzekwuje wyłącznie API; brak lokalnej reguły biznesowej / handlera SoT */}
<button
    type="button"
    className="w-fit h-fit"
    hidden={user.role !== 'superadmin'}
    title={t("matesList.deleteBtnTitle")}
    disabled
    aria-disabled="true"
>
    <Icon icon='mi:delete' width={20} height={20} />
</button>
```

> Przycisk bez handlera usuwania po stronie klienta w tym wycinku — nie udajemy operacji; pełne podpięcie delete = poza tym wycinkiem / po kontrakcie API.

**Biblioteki:** bez nowych; React hooks + istniejący React Router / i18n / store.

**Testy:** brak UI testów; DoD = przegląd objętych plików + `npm run build`.

**DoD (krok):**

- `DashboardPage` i `HouseInfoPage` delegują orkiestrację do hooków; JSX głównie składa widok.
- `MatesList` nie dodaje klientowej implementacji „kto może usunąć domownika” jako SoT (brak lokalnego delete flow).
- `npm run build` nadal przechodzi.
- Brak wprowadzenia React Query / nowego drzewa feature-modules.

#### Propozycja commit message

```text
refactor(frontend): align SPA folders and split dashboard orchestration from views

Move admin pages into the shell tree and extract dashboard/house-info hooks so UI reflects roles without owning business rules.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| Kotwica major F1+F2 + milestone mapy SPA | Oba fazowe DoD major pokryte krokami powyżej |
| SPEC-FRONTEND F-1 / F-2 | Drzewo `pages|components|store|configs|hooks|utils`; routing w `configs/routerConfig.jsx` |
| SPEC F-7 / F-15 (objęte widoki) | Hooki orkiestracji; brak SoT uprawnień w JSX |
| Stack | React 19 + Vite 8 + Tailwind 4; brak RQ/SWR |
| Build | `cd frontend && npm run build` |
| Docs Blok B / rdzeń–otoczka | `AdminPanelPage` w `adminpanel-subpages/`; landing vs dashboard rozdzielone |
| Poza zakresem | Brak `/api/v1`, R1 rename, i18n `api`, Faza 3 store redesign |
| Nagłówki planu | wyłącznie `FAZA` / `KROK`; commit messages EN Conventional Commits |
| Major nietknięty tą sesją | statusy major tylko informacyjnie poniżej |

---

## Ślad do major (po późniejszej implementacji — informacyjnie)

Po realnym wdrożeniu tego feature planu (osobna sesja / ręczne `/feature-implementation`) sensowne oznaczenia w `home-budget-manager_major_plan-frontend.md`:

| Element major | Status docelowy |
|---------------|-----------------|
| Faza 1 — Aktualizacja zależności frontendu | `WYKONANY` |
| Krok 1.1, 1.2 | `WYKONANY` |
| MILESTONE — Frontend na zaktualizowanych zależnościach | `OSIĄGNIĘTY` |
| Faza 2 — Układ SPA (R5) + granice prezentacja vs orkiestracja | `WYKONANY` |
| Krok 2.1, 2.2, 2.3 | `WYKONANY` |
| MILESTONE — Mapa SPA zgodna z normą katalogów | `OSIĄGNIĘTY` |

Ten plik feature planu **nie** zmienia major.

---

## Historia sesji planu

- Utworzono wycinek FAZA 1–2 frontend; HOW upgrade: React 19 + Tailwind 4 + Vite 8; mapa SPA bez `features/`; orkiestracja ograniczona do Dashboard / HouseInfo / MatesList.
