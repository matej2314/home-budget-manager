# Home Budget Manager — feature plan: frontend Faza 3 + Faza 4 (stan + HTTP `/api/v1`)

**Kotwica major:** `home-budget-manager_major_plan-frontend.md` — Faza 3, MILESTONE „Stan zgodny z R5 / F-4–F-7”, Faza 4, MILESTONE „SPA woła API pod `/api/v1`”.  
**Źródła:** `docs/` (m.in. `architektura_katalogi_pliki.md`, `dokumentacja_komunikacji.md`, `i18n_kontrakt_ui.md`, `katalog_env.md`, `anty_patterny.md`), `spec/SPEC-FRONTEND.md` (F-3–F-8, F-15), `spec/SPEC-KOMUNIKACJA.md` (K-1–K-4), `spec/SPEC-BEZPIECZENSTWO.md` (klient), kod `frontend/`.  
**Poza zakresem wycinka:** Faza 5 (`inmate`), Faza 6 (pełny namespace `api` + migracja kluczy), Faza 7 (pełne handlery WS / protokół), Faza 8 (szersze bezpieczeństwo klienta), Vitest/RTL/E2E, React Query/SWR, BFF, proxy Vite, usunięcie legacy mount po stronie BE.

**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

**Pass rozwojowy (zatwierdzony):** brak przesunięć między fazami major (3 → 4). Wewnątrz FAZA 2: w KROK 1 wchodzi też ujednolicenie raw `fetch` (OCR, awatar) pod `apiBaseUrl` / helper multipart — żeby KROK 2–3 nie omijały tych ścieżek.

**Decyzje HOW (wywiad):**

| Temat | Decyzja |
|-------|---------|
| 401 | Toast + wywołanie `logout` z `AuthContext` (przez mostek poza React) |
| 403 | Toast / komunikat; **bez** automatycznego logout (rola niewystarczająca ≠ brak sesji) |
| Dev | Tylko `apiBaseUrl` w `url.js` — **bez** proxy Vite |

**Bramka zewnętrzna (opisowo, nie stop planu):** cutover HTTP w FAZIE 2 zakłada dostępność powierzchni BE pod `/api/v1` (major backend Faza 4 / dual mount). Do czasu tej gotowości lokalnie można trzymać `apiBaseUrl` i ćwiczyć wobec dual mount; legacy bez prefiksu **nie** jest normą docelową klienta po tej fazie.

---

## Meta

| Pole | Wartość |
|------|---------|
| Plik | `feature-plans/home-budget-manager_feature_plan_frontend-faza3-faza4-stan-http.md` |
| Nazwa projektu | `home-budget-manager` |
| Katalog procesu | `frontend/` |
| Stack stanu | Context + Zustand w `store/` (SPEC-FRONTEND F-4–F-6); bez React Query / SWR |
| Testy UI w wycinku | **Nie** (docs/SPEC-TESTY — poza strategią v1) |

---

## Założenia

- Context (cross-cutting): `authContext`, `socketContext`, `dataContext`, `ThemeContext` — sesja / połączenie WS / agregaty board / theme. **Bez** przenoszenia list domenowych (transakcje, wiadomości, zaproszenia, powiadomienia) do Context „przy okazji”.
- Zustand (domena): `transactionsStore`, `messagesStore`, `invitationsStore`, `notificationsStore`, `homePageStore` — jeden właściciel kolekcji per obszar.
- `DataContext` zostaje właścicielem **agregatów board** (`houseData`, `houseMates`, `actionsCatData`, `statsData`, `dailyData`) + `refreshData` — to Context „data” z F-4, nie drugi globalny worek na wszystkie kolekcje.
- Socket Context: połączenie + bufory ephemeral pod UI (np. toast/header); **kolekcja powiadomień HTTP/WS** → wyłącznie `notificationsStore` (`getState()` poza React — Zustand v5).
- Odświeżanie po mutacji HTTP: wywołanie `fetch*` właściwego store / `refreshData` — bez server-state library.
- Pełne podpięcie katalogu eventów WS = major Faza 7; tu tylko **gotowość** (właściciel store + brak własnego protokołu).
- Prefiks HTTP: `apiBaseUrl = \`${serverUrl}/api/v1\``. Assety statyczne spoza kontraktu API (np. `/screens/…` w galerii) zostają na `serverUrl`.
- Envelope: wspólne odczytywanie `status` / `message`; UI traktuje `message` jako kandydat na klucz i18n (fallback: surowy string) — pełny ns `api` = major F6.
- Biblioteki (Context7 `/pmndrs/zustand` v5): `create` + `useStore.getState()` / `setState` poza komponentami do handlerów socket — bez osobnego `createStore` vanilla, skoro store’y już są hookami Zustand.

---

## FAZA 1 — Model stanu (Context + Zustand)

**Kotwica major:** Faza 3 (kroki 3.1–3.3) + przygotowanie do MILESTONE „Stan zgodny z R5 / F-4–F-7”.  
**SPEC / docs:** SPEC-FRONTEND F-4–F-7; `docs/architektura_katalogi_pliki.md` (Context + Zustand w `store/`).

### KROK 1 — Context: sesja / socket / data / theme

**Status:** `WYKONANY`

**Cel:** Domknięcie granic Contextów cross-cutting w `store/` — auth / socket / data / theme bez wrzucania list domenowych do Context (major 3.1, F-4).

**Artefakty (zmieniane):**

- `frontend/src/store/authContext.jsx`
- `frontend/src/store/socketContext.jsx`
- `frontend/src/store/dataContext.jsx`
- `frontend/src/store/ThemeContext.jsx`
- `frontend/src/main.jsx` / `frontend/src/configs/routerConfig.jsx` (providers — bez zmiany drzewa katalogów)

#### Implementacja

**1. Auth — dodać `useAuth` + jawne API (bez zmiany zachowania login/register):**

```jsx
// fragment na końcu authContext.jsx — dodać
import { useContext } from 'react';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
```

`AuthProvider` nadal trzyma: `user`, `isAuthenticated`, `login` / `logout` / `register` / `checkSession`, statusy loading/error. **Bez** list transakcji / wiadomości w Context.

**2. Theme — już OK** (`theme` + `toggleTheme` + `useTheme`). Tylko poprawka literówki w komunikacie błędu (opcjonalnie, 1 linia): `'must be used within a ThemeProvider'`.

**3. Data — granica Context „data”:**

`DataContext` zostaje przy agregatach board. Upewnij się, że value **nie** ekspanduje w stronę list stronnicowanych (transakcje/wiadomości — to Zustand).

```jsx
// dataContext.jsx — value Provider (zamień na): jawny kontrakt
<DataContext.Provider
  value={{
    data,
    isLoading: data.loading,
    dataError: data.dataError,
    refreshData,
  }}
>
  {children}
</DataContext.Provider>
```

**4. Socket — Connection Context; powiadomienia domenowe → store:**

**teraz** (`socketContext.jsx`): handler `notification` aktualizuje **i** lokalny `messages.notifications`, **i** `useNotificationsStore` — podwójne źródło.

**zamień na:** Context trzyma tylko połączenie + bufory ephemeral (balance / newMessage / invitation / initBudgets) potrzebne headerowi; `notification` idzie **wyłącznie** do Zustand:

```jsx
newSocket.on('notification', (data) => {
  const { category, ...noticeData } = data;
  if (!category) {
    console.error('Notification category is missing:', data);
    return;
  }
  const existing = useNotificationsStore.getState().notifications[category] || [];
  if (!existing.some((n) => n.id === noticeData.id)) {
    useNotificationsStore.getState().addNotification(category, noticeData);
  }
});
```

Usuń z `messages` stanu socketu pole `notifications` oraz `deleteNotification` oparte o Context — usuwanie zostaje w `notificationsStore.removeNotification` (już używane w `HeaderIconsContainer`).

Provider value po zmianie:

```jsx
value={{ socket, connected, messages, sendMessage, error }}
```

**5. Providers (as-is — bez nowego drzewa `contexts/`):**

- `main.jsx`: `ThemeProvider` → `AuthProvider` → `App`
- `routerConfig.jsx` (trasy dashboard): `DataProvider` → `SocketProvider` → outlet

**DoD (krok):**

- Cztery obszary cross-cutting mają dom w Context w `store/`.
- Context nie jest jedynym pojemnikiem na transakcje / wiadomości / zaproszenia / powiadomienia.
- Socket nie dubluje kolekcji powiadomień względem `notificationsStore`.

---

### KROK 2 — Zustand: właściciele store per obszar

**Status:** `WYKONANY`

**Cel:** Jawny właściciel kolekcji domenowej per obszar + spójne eksporty / drobne bugi uniemożliwiające poprawne odświeżanie (major 3.2, F-5).

**Artefakty:**

- `frontend/src/store/transactionsStore.js`
- `frontend/src/store/messagesStore.js`
- `frontend/src/store/invitationsStore.js`
- `frontend/src/store/notificationsStore.js`
- `frontend/src/store/homePageStore.js`
- `frontend/src/components/dashboard/dashboardComponents/DashBoardHeader.jsx` (bug: store bez wywołania hooka)

#### Mapa właścicieli (norma wycinka)

| Obszar | Właściciel | Nie wrzucać do |
|--------|------------|----------------|
| Transakcje (lista + paginacja) | `useTransactionsStore` | `DataContext`, `AuthContext` |
| Wiadomości (lista + paginacja) | `useMessagesStore` | Socket Context jako SoT listy |
| Zaproszenia (kolekcja) | `useInvitationsStore` | Socket — tylko push ephemeral |
| Powiadomienia (po kategoriach) | `useNotificationsStore` | Socket Context |
| Dane landing / about | `useHomePageStore` | `DataContext` |
| Agregaty board (dom, mates, cats, stats, daily) | `DataContext` | Nowy „mega-Zustand” |

#### Implementacja — poprawki + spójny eksport

**`notificationsStore.js` — kompletny plik docelowy (najmniejszy kompletny):**

```js
import { create } from 'zustand';
import fetchData from '../utils/asyncUtils/fetchData';
import sendRequest from '../utils/asyncUtils/sendRequest';
import { apiBaseUrl } from '../url';

const useNotificationsStore = create((set, get) => ({
  notifications: {
    transactions: [],
    usersActions: [],
    monthlyBalance: [],
  },
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchData(`${apiBaseUrl}/notice/collection`);
      set((state) => {
        const updated = { ...state.notifications };
        (response.notifications || []).forEach((notification) => {
          const { category, noticeData } = notification;
          if (noticeData && category) {
            updated[category] = [...(updated[category] || []), noticeData];
          }
        });
        return { notifications: updated, loading: false };
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addNotification: (category, notification) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [category]: [...(state.notifications[category] || []), notification],
      },
    })),

  removeNotification: async (category, notificationId) => {
    set({ loading: true, error: null });
    try {
      await sendRequest('DELETE', { noticeId: notificationId }, `${apiBaseUrl}/notice`);
      set((state) => ({
        notifications: {
          ...state.notifications,
          [category]: (state.notifications[category] || []).filter((n) => n.id !== notificationId),
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default useNotificationsStore;
export { useNotificationsStore };
```

> **Uwaga kolejności:** w FAZIE 1 nadal wolno używać `serverUrl` + ścieżek legacy w store’ach (cutover URL = FAZA 2). Powyższy plik pokazuje **kształt końcowy po FAZIE 2**; w samym KROKU 2 FAZY 1 zastosuj te same poprawki logiki przy **istniejącym** `${serverUrl}/…` (bez spacji przed URL), a podmianę na `apiBaseUrl` zrób w FAZIE 2 KROK 1 (jeden sweep). Alternatywa ponytail: w KROKU 2 tylko logika/eksporty; URL-e ruszasz wyłącznie w FAZIE 2.

**Decyzja HOW (ponytail):** w FAZIE 1 KROK 2 **nie** zmieniaj prefiksu URL — tylko właściciel, eksporty, bugfixy. Prefiks = FAZA 2.

**`messagesStore.js` — fragment `teraz` → `zamień na`:**

```js
// teraz
messaagesLoading: false,
// …
set({ messaagesLoading: true, … });
// …
set({ messagesLoading: false, … }); // niespójne

// zamień na — jedno pole:
messagesLoading: false,
// we wszystkich set: messagesLoading
```

Eksport: już jest `export const useMessagesStore` — OK.

**`invitationsStore.js` — bug `fetchInvitations: false` w `set`:**

```js
// teraz
set({ invitationsLoading: true, invitationsLoadingError: null, fetchInvitations: false });

// zamień na
set({ invitationsLoading: true, invitationsLoadingError: null, fetchedInvitations: false });
```

**`homePageStore.js` — ujednolić eksport nazwany + default (jak notifications):**

```js
export { useHomePageStore };
export default useHomePageStore;
// oraz nazwa create: const useHomePageStore = create(...)
```

**`DashBoardHeader.jsx` — krytyczny bug:**

```js
// teraz
const { messagesData: data, messagesLoading: isLoading } = useMessagesStore;

// zamień na
const { messagesData: data, messagesLoading: isLoading } = useMessagesStore();
```

**DoD (krok):**

- Każdy obszar z tabeli ma jednego właściciela store / Context jak wyżej.
- Brak „wszystkiego w jednym store”.
- `useMessagesStore()` wywoływane jako hook; literówki / błędne klucze `set` poprawione.
- Socket → `notificationsStore.getState()` działa poza React (Zustand v5).

---

### KROK 3 — Stan lokalny UI i odświeżanie po mutacji

**Status:** `WYKONANY`

**Cel:** Lokalny stan UI zostaje lokalny; po udanej mutacji HTTP store/widok są spójne; gotowość pod WS bez własnego protokołu (major 3.3, F-6, F-7 częściowo).

**Artefakty (zmieniane wg listy mutacji):** formy / modale korzystające z `sendRequest` + brakującego odświeżenia.

#### Reguła lokalnego stanu (egzekwuj, nie przenoś)

Zostaje w komponencie (przykłady as-is — **nie** wynosić do Zustand):

- `imageMode`, `isModalOpen`, `isLoading` przycisku, `recognizedValue` w OCR hooku, otwarcie `LogOutModal`, tryb formularza.

#### Konwencja odświeżania po mutacji

| Mutacja (ścieżka legacy as-is → v1 w FAZIE 2) | Po sukcesie |
|-----------------------------------------------|-------------|
| `POST …/action/new`, `DELETE …/action` | `useTransactionsStore.getState().fetchTransactions()` **oraz** `refreshData()` z `DataContext` (stats/daily) |
| `POST …/message/send`, `DELETE …/message/delete`, `PUT …/message/readed` | `useMessagesStore.getState().fetchMessages()` (lub `refreshData` jeśli caller już przekazuje — ujednolij na store) |
| `POST …/invitation/accept\|decline` | `useInvitationsStore.getState().fetchInvitations()` + `refreshData()` (skład domu) |
| `POST …/initmonthly/new` | `refreshData()` |
| `POST …/house/new`, `POST …/users/invite` | `refreshData()` (+ invitations gdy dotyczy) |
| `DELETE …/notice` | już w `removeNotification` |
| Upload awatara | odświeżenie sesji / user (`checkSession` lub istniejący reload — nie wprowadzaj nowego globalnego store UI) |

#### Przykład refaktoru — `DeclareBudgetForm.jsx`

```jsx
// teraz (onSuccess) — tylko toast + close
onSuccess: () => {
  showInfoToast(t(addBudget.message, { defaultValue: "declareBudget.declaredCorrectlyMessage" }));
  setTimeout(onRequestClose, 600);
},

// zamień na — dodaj refresh board
onSuccess: async () => {
  showInfoToast(t(addBudget.message, { defaultValue: "declareBudget.declaredCorrectlyMessage" }));
  await refreshData(); // z useContext(DataContext)
  setTimeout(onRequestClose, 600);
},
```

#### Przykład — `invitationModal.jsx`

```jsx
// po sukcesie accept/decline:
await useInvitationsStore.getState().fetchInvitations();
// jeśli DataContext dostępny w rodzicu — przekaż refreshData propsem ALBO
// odczytaj przez useContext(DataContext) i wywołaj refreshData()
```

#### Przykład — `AddTransactionForm.jsx` / `DeleteTransactionModal.jsx`

Już wołają `fetchTransactions()`. **Dodaj** `refreshData()` z `DataContext`, żeby wykresy/stats nie zostawały stale:

```jsx
const { refreshData } = useContext(DataContext);
// w onSuccess:
await fetchTransactions();
await refreshData();
```

#### Gotowość WS (opis + minimalny kod)

- Handlery w `socketContext` już emitują ustalone `type` z kontraktu (`balance_update`, `newMessage`, `invitation`, `notification`, `initial_budget`).
- Po FAZIE 1: `notification` → tylko Zustand; pozostałe bufory ephemeral OK do Fazy 7.
- **Nie** dodawaj własnych `socket.emit` biznesowych ani room API.
- Opcjonalny komentarz w `socketContext.jsx` przy `balance_update`:

```js
// shortcut: balance_update tylko bufor ephemeral; pełna synchronizacja board/transactions = major Faza 7, gdy BE emituje spójnie
```

**DoD (krok):**

- Nie współdzielony stan UI nie jest w globalnym store.
- Objęte mutacje z tabeli kończą się odświeżeniem właściwego właściciela.
- Brak nowego protokołu WS; właściciele store gotowi pod F7.

#### Propozycja commit message

```text
feat(frontend): close v1 state model with Context and Zustand owners

Keep session/socket/board/theme in Context and domain collections in
per-area stores; refresh stores after HTTP mutations without React Query.
```

---

## FAZA 2 — Kontrakt klienta HTTP (`/api/v1`, credentials, envelope)

**Kotwica major:** Faza 4 (kroki 4.1–4.3) + przygotowanie do MILESTONE „SPA woła API pod `/api/v1`”.  
**SPEC / docs:** SPEC-FRONTEND F-3, F-8, F-15; SPEC-KOMUNIKACJA K-1–K-4; `docs/dokumentacja_komunikacji.md`.

### KROK 1 — Prefiks `/api/v1` w konfiguracji klienta

**Status:** `WYKONANY`

**Cel:** Wszystkie wywołania HTTP kontraktu API idą pod `/api/v1` przez `apiBaseUrl`; ujednolicenie raw `fetch` (OCR, awatar) (major 4.1, F-3). **Bez** proxy Vite.

**Artefakty:**

- `frontend/src/url.js` (**zmiana**)
- `frontend/src/utils/asyncUtils/sendMultipart.js` (**nowy**)
- wszystkie call site’y `${serverUrl}/…` dla API → `${apiBaseUrl}/…`
- `frontend/vite.config.js` — **bez zmian** (decyzja HOW)

#### Nowy / zmieniony kod bazowy

**`url.js` — kompletny:**

```js
export const serverUrl = 'https://budgetapi.msliwowski.net';
export const socketPath = 'https://budgetapi.msliwowski.net';

// Lokalnie (odkomentuj przy dev przeciw dual mount BE):
// export const serverUrl = 'http://localhost:5053';
// export const socketPath = 'http://localhost:5053';

/** Prefiks normy docs / SPEC-KOMUNIKACJA K-1 — jedyny base dla JSON/multipart API SPA. */
export const apiBaseUrl = `${serverUrl}/api/v1`;
```

**`sendMultipart.js` — kompletny (nowy):**

```js
import { notifyUnauthorized, notifyForbidden } from './authFailureBridge';

/**
 * Multipart POST/PUT bez ręcznego Content-Type (boundary ustawia przeglądarka).
 * credentials: include — cookie SESSID.
 */
const sendMultipart = async (method, formData, url) => {
  const response = await fetch(url, {
    method,
    body: formData,
    credentials: 'include',
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (response.status === 401) {
    notifyUnauthorized(body?.message);
    throw new Error(body?.message || 'Unauthorized');
  }
  if (response.status === 403) {
    notifyForbidden(body?.message);
    throw new Error(body?.message || 'Forbidden');
  }

  if (body?.status === 'error') {
    throw new Error(body.message || 'API error');
  }

  if (!response.ok) {
    throw new Error(body?.message || `HTTP ${response.status}`);
  }

  return body;
};

export default sendMultipart;
```

> Mostek `authFailureBridge` powstaje w KROKU 2 — przy implementacji albo (a) najpierw zaimplementuj pusty mostek w KROKU 1 i podepnij w KROKU 2, albo (b) trzymaj `sendMultipart` bez 401 do czasu KROKU 2 i dodaj gałęzie wtedy. **Preferowane (ponytail):** utwórz mostek w KROKU 2 razem z `sendRequest`/`fetchData`; w KROKU 1 `sendMultipart` tylko `credentials` + URL, bez authz — dopisz 401/403 w KROKU 2 w tych samych trzech helperach.

**KROK 1 — minimalny `sendMultipart` (bez mostka):**

```js
const sendMultipart = async (method, formData, url) => {
  const response = await fetch(url, {
    method,
    body: formData,
    credentials: 'include',
  });
  const body = await response.json();
  if (!response.ok || body?.status === 'error') {
    throw new Error(body?.message || `HTTP ${response.status}`);
  }
  return body;
};

export default sendMultipart;
```

#### Sweep call site’ów API

Zamień import / template:

```js
// teraz
import { serverUrl } from '…/url';
`${serverUrl}/auth/login`

// zamień na
import { apiBaseUrl } from '…/url';
`${apiBaseUrl}/auth/login`
```

**Lista plików (komplet wycinka):**

| Plik | Ścieżki |
|------|--------|
| `store/authContext.jsx` | `/auth/signup`, `/login`, `/logout`, `/verify` |
| `store/dataContext.jsx` | `/board/data/:filter` |
| `store/transactionsStore.js` | `/board/data/transactions/:page` |
| `store/messagesStore.js` | `/board/data/messages/:page` |
| `store/invitationsStore.js` | `/invitation/collection` |
| `store/notificationsStore.js` | `/notice/collection`, `/notice` |
| `store/homePageStore.js` | `/homepage/dataCollection` |
| `hooks/useOcrRecognition.js` | `/receipt` → `sendMultipart` + `apiBaseUrl` |
| `pages/…/UserProfilePage.jsx` | `POST /avatars/save`; `img` `GET /avatars/avatar/…` |
| `pages/…/DashboardForUser.jsx` | `/house/new` |
| `components/modals/*` | invitation, cookies, change email, delete transaction, messages delete, review |
| `components/forms/*` | action, message, invite, budget |
| `utils/asyncUtils/markMessage.js` | `/message/readed` |
| `components/…/DashBoardHeader.jsx` | `img` avatar → `apiBaseUrl` |
| `components/…/ReviewsSection.jsx` | `img` avatar → `apiBaseUrl` |

**Zostaw `serverUrl`:**

- `socketPath` / połączenie Socket.io (handshake — Faza 7 nie w tym wycinku; path hosta bez wymuszania `/api/v1` na WS)
- `mapPhotos` / `AppGallery` — `/screens/…` (assety poza tabelą API v1 w docs)

**OCR — `useOcrRecognition.js` fragment:**

```js
// teraz
const response = await fetch(`${serverUrl}/receipt`, { method: 'POST', body: formData, credentials: 'include' });
const result = await response.json();

// zamień na
import sendMultipart from '../utils/asyncUtils/sendMultipart';
import { apiBaseUrl } from '../url';
const result = await sendMultipart('POST', formData, `${apiBaseUrl}/receipt`);
```

Analogicznie upload awatara w `UserProfilePage`.

**DoD (krok):**

- `apiBaseUrl` wskazuje `/api/v1`.
- Objęte wywołania JSON/multipart API nie używają ścieżek bez prefiksu jako normy.
- Brak proxy Vite; lokalny dev = odkomentowanie `localhost` w `url.js` + BE z dual mount.

---

### KROK 2 — Credentials oraz obsługa 401/403

**Status:** `WYKONANY`

**Cel:** Sesyjne HTTP z credentials; 401 → toast + `logout`; 403 → toast; guard UI ≠ authz (major 4.2, F-8, F-15).

**Artefakty:**

- `frontend/src/utils/asyncUtils/authFailureBridge.js` (**nowy**)
- `frontend/src/utils/asyncUtils/sendRequest.js`
- `frontend/src/utils/asyncUtils/fetchData.js`
- `frontend/src/utils/asyncUtils/sendMultipart.js`
- `frontend/src/store/authContext.jsx` (rejestracja handlera)

#### Nowy plik — `authFailureBridge.js` (kompletny)

```js
let unauthorizedHandler = null;
let forbiddenHandler = null;

export const registerAuthFailureHandlers = ({ onUnauthorized, onForbidden }) => {
  unauthorizedHandler = onUnauthorized;
  forbiddenHandler = onForbidden;
};

export const notifyUnauthorized = (messageKey) => {
  unauthorizedHandler?.(messageKey);
};

export const notifyForbidden = (messageKey) => {
  forbiddenHandler?.(messageKey);
};
```

#### Rejestracja w `AuthProvider`

```jsx
// authContext.jsx — wewnątrz AuthProvider
import { useEffect } from 'react';
import { registerAuthFailureHandlers } from '../utils/asyncUtils/authFailureBridge';
import { showErrorToast } from '../configs/toastify';

// po definicji logout:
useEffect(() => {
  registerAuthFailureHandlers({
    onUnauthorized: async (messageKey) => {
      showErrorToast(messageKey || 'Session expired');
      await logout();
    },
    onForbidden: (messageKey) => {
      showErrorToast(messageKey || 'Forbidden');
    },
  });
}, []);
```

> `logout` w dependency: użyj ref albo stabilnej funkcji — uniknij pętli. Wystarczy rejestracja raz przy mount + wywołanie aktualnego `logout` z closure / `useRef`.

#### `sendRequest.js` — kompletny docelowy

```js
import { notifyUnauthorized, notifyForbidden } from './authFailureBridge';

const sendRequest = async (method, data, url) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(data),
      credentials: 'include',
    });

    let responseData = null;
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    if (response.status === 401) {
      notifyUnauthorized(responseData?.message);
      throw new Error(responseData?.message || 'Unauthorized');
    }
    if (response.status === 403) {
      notifyForbidden(responseData?.message);
      throw new Error(responseData?.message || 'Forbidden');
    }

    if (responseData?.status === 'error') {
      throw new Error(responseData.message || 'Błąd wysyłania danych.');
    }

    if (!response.ok) {
      throw new Error(responseData?.message || `HTTP ${response.status}`);
    }

    return responseData;
  } catch (error) {
    throw new Error(error.message || 'Błąd wysyłania danych.');
  }
};

export default sendRequest;
```

#### `fetchData.js` — kompletny docelowy

```js
import { notifyUnauthorized, notifyForbidden } from './authFailureBridge';

const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      credentials: 'include',
    });

    let responseData = null;
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    if (response.status === 401) {
      notifyUnauthorized(responseData?.message);
      throw new Error(responseData?.message || 'Unauthorized');
    }
    if (response.status === 403) {
      notifyForbidden(responseData?.message);
      throw new Error(responseData?.message || 'Forbidden');
    }

    if (responseData?.status === 'error') {
      throw new Error(responseData.message || 'Błąd pobierania danych z API.');
    }

    if (!response.ok) {
      throw new Error(responseData?.message || `HTTP ${response.status}`);
    }

    return responseData;
  } catch (error) {
    throw new Error(error.message || 'Błąd pobierania danych.');
  }
};

export default fetchData;
```

Dopisz te same gałęzie 401/403 do `sendMultipart.js`.

**Komentarz w `routerConfig` / przy chronionych trasach (1 linia przy `DataProvider`):**

```js
// Guard UI chroni UX dashboardu — nie zastępuje middleware API (SPEC-FRONTEND F-2 / F-15).
```

**DoD (krok):**

- Żądania sesyjne mają `credentials: 'include'`.
- 401 → toast + `logout` (obserwowalne).
- 403 → toast, bez cichego sukcesu.
- Brak twierdzenia, że ukrycie trasy = autoryzacja.

---

### KROK 3 — Envelope `status` / `message` pod i18n

**Status:** `WYKONANY`

**Cel:** Wspólny odczyt envelope; `message` jako kandydat klucza i18n z fallbackiem do surowego stringa; bez big-bang ns `api` (major 4.3, F-8; pełny ns = F6).

**Artefakty:**

- `frontend/src/utils/asyncUtils/parseApiEnvelope.js` (**nowy**)
- `frontend/src/hooks/useApiResponseHandler.jsx`
- call site’y toastów używające `response.message` (wzór, nie migracja wszystkich kluczy)

#### Nowy plik — `parseApiEnvelope.js` (kompletny)

```js
/**
 * Norma K-2 / docs: { status: 'success'|'error', message: <messageKey>, … }.
 * message = kandydat na klucz i18n; pełne ns `api` = major Faza 6.
 */
export const parseApiEnvelope = (body) => {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 'error', messageKey: null, data: null };
  }
  const status = body.status;
  const messageKey = typeof body.message === 'string' ? body.message : null;
  const { status: _s, message: _m, ...data } = body;
  return {
    ok: status === 'success',
    status,
    messageKey,
    data,
  };
};

/**
 * Resolver UI do czasu ns `api`: spróbuj t(key); jeśli brak — surowy message (docs i18n fallback).
 */
export const resolveApiMessage = (t, messageKey, defaultValue) => {
  if (!messageKey) return defaultValue ?? '';
  return t(messageKey, { defaultValue: defaultValue ?? messageKey });
};
```

#### `useApiResponseHandler.jsx` — kompletny

```jsx
import { parseApiEnvelope } from '../utils/asyncUtils/parseApiEnvelope';

export default function useApiResponseHandler() {
  const handleApiResponse = (response, { onSuccess, onError } = {}) => {
    const envelope = parseApiEnvelope(response);
    if (envelope.ok) {
      onSuccess?.(envelope);
    } else {
      onError?.(envelope);
    }
  };

  return handleApiResponse;
}
```

#### Wzorzec w UI (nie big-bang)

```jsx
// przykład AddTransactionForm — message jako klucz z fallbackiem (już zbliżone as-is)
showInfoToast(
  resolveApiMessage(tForms, saveAction.message, 'addTransaction.addTransactionCorrect')
);
```

Albo bez zmiany wszystkich call site’ów: zostaw `tForms(saveAction.message, { defaultValue: … })` — semantycznie to samo. **Wymagane w tym kroku:**

1. Helper `parseApiEnvelope` używany w `useApiResponseHandler`.
2. Krótki komentarz / użycie w ≥1 formie (np. `AddTransactionForm`) z `resolveApiMessage`.
3. Brak założenia w nowym kodzie, że `message` to zawsze finalny PL marketingowy.

**Nie** twórz jeszcze `public/locales/*/api.json` ani preload ns `api` — to major Faza 6.

**DoD (krok):**

- Sukces/błąd odczytywane wspólnym wzorcem envelope.
- UI nie traktuje `message` wyłącznie jako finalnego tekstu jednego języka w nowym kodzie kroku.
- Pełny namespace `api` poza wycinkiem.

#### Propozycja commit message

```text
feat(frontend): switch SPA HTTP client to /api/v1 with session handling

Route JSON and multipart calls through apiBaseUrl, keep credentials on
requests, and surface 401/403 via toast plus logout without treating UI
guards as authorization.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| Context vs Zustand (F-4–F-6) | `store/`: auth/socket/data/theme = Context; 5 store’ów domenowych z granicami; brak dublowania notifications |
| Odświeżenie po mutacji (F-7 częściowo) | Po add/delete transaction lista + board się odświeżają; invitation accept odświeża invitations |
| Prefiks (F-3, K-1) | Network: ścieżki `/api/v1/...`; brak normy legacy w nowym kodzie klienta |
| Credentials + 401/403 (F-8, F-15) | DevTools: cookie wysyłane; wymuszenie 401 → toast + wylogowanie; 403 → toast |
| Envelope (K-2) | `parseApiEnvelope` + handler; message z fallbackiem |
| Poza zakresem | Brak ns `api` big-bang; brak proxy Vite; brak pełnego WS F7; major nietknięty |

**Zgodność:** SPEC-FRONTEND / SPEC-KOMUNIKACJA / docs komunikacji — bez redefinicji stacku.

---

## Ślad do major (informacyjnie — po późniejszej implementacji)

Po wdrożeniu kodu wg tego planu (poza tą sesją) kandydaci do aktualizacji w `home-budget-manager_major_plan-frontend.md`:

| Element major | Status docelowy |
|---------------|-----------------|
| Faza 3 + kroki 3.1–3.3 | `WYKONANY` |
| MILESTONE „Stan zgodny z R5 / F-4–F-7” | `OSIĄGNIĘTY` (po akceptacji prowadzącego) |
| Faza 4 + kroki 4.1–4.3 | `WYKONANY` |
| MILESTONE „SPA woła API pod `/api/v1`” | `OSIĄGNIĘTY` (po akceptacji; z uwzględnieniem bramki BE dual mount) |

Ten feature plan **nie** zmienia pliku major.

---

## Checklist jakości skilla

- [x] Nagłówki wyłącznie `FAZA` / `KROK`
- [x] Propozycja commit message (EN, Conventional Commits) na końcu każdej fazy
- [x] Kompletny kod nowych plików; refaktory jako fragmenty `teraz` → `zamień na`
- [x] Pass rozwojowy wypisany; bez przesunięć między fazami major
- [x] Statusy z trójki; start: `NIE_ROZPOCZĘTY`
- [x] Brak odwołań do planów pomocniczych w rootcie
- [x] Major / docs / SPEC nietknięte w tej sesji
