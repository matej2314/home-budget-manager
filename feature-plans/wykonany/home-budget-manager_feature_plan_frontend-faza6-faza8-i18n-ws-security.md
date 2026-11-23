# Home Budget Manager — feature plan: frontend Fazy 6–8 (i18n `api`, WS, bezpieczeństwo klienta)

**Kotwica major:** `home-budget-manager_major_plan-frontend.md` — **Faza 6** (6.1–6.3), **Faza 7** (7.1–7.2), **Faza 8** (8.1–8.2).  
**Źródła:** `docs/i18n_kontrakt_ui.md`, `docs/dokumentacja_komunikacji.md`, `docs/bezpieczenstwo.md`, `docs/katalog_env.md`, `docs/anty_patterny.md`, `spec/SPEC-FRONTEND.md` (F-8–F-15), `spec/SPEC-KOMUNIKACJA.md` (K-2, K-10–K-12), `spec/SPEC-BEZPIECZENSTWO.md`, kod `frontend/`.  
**Biblioteki (Context7):** i18next `^27` (`/i18next/i18next` v27 — `ns`, `t(key, { ns, defaultValue })`, `exists`); socket.io-client `^4.8` (`/websites/socket_io_v4_client-api` — `io`, `withCredentials`, `connect` / `disconnect` / `connect_error`). Przy konflikcie ze SPEC → wygrywa SPEC.  
**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Pełne Fazy 6–8 major FE: namespace `api` + mapowanie `message`, klient WS wg katalogu `type`, granica zaufania SPA (bez sekretów, UI ≠ authz) |
| Pass rozwojowy | Helper `resolveApiMessage` + ns `api` **przed** podpięciem toastów; katalog eventów WS **przed** sync store; bez przenosin między fazami major |
| Poza zakresem | Big-bang całego `locales/`; zmiana kontraktu BE (nadal mieszanka kluczy i surowych stringów); nowa library server-state; E2E/Vitest (brak normy testów UI w major FE); milestone’y major (oznaczanie poza tym skillem) |
| Po implementacji (informacyjnie) | Major FE: Fazy 6–8 → `WYKONANY`; milestone’y „Kontrakt message ↔ UI”, „WS bez własnych protokołów”, „Klient bez sekretów…” → `OSIĄGNIĘTY` — **edycja major poza tym skillem** |

### Założenia HOW (zatwierdzone w sesji)

1. **Konwencja i18n:** zawsze `ns: 'api'` + klucze w JSON jako `obszar.zdarzenie` (oraz istniejące `authz.*`); helper akceptuje legacy prefix `api:` (obcina przed lookup).  
2. **Migracja 6.3:** auth failure / `authz.*` / startowe klucze `auth.*` z BE + świadomy dług surowych stringów login/register — bez big-bang.  
3. **WS:** wyłącznie katalog docs/SPEC; brak room API; brak katalogu emitów biznesowych z klienta; usunięcie martwego `sendWebSocketMessage`.  
4. **Faza 8:** audyt + drobne poprawki as-is; bez nowej warstwy authz na kliencie.

---

## FAZA 1 — i18n: namespace `api` + mapowanie `message` [= major Faza 6]

### KROK 1 — Namespace `api` (pl/en) + konwencja + helper

**Status:** `WYKONANY`

**Cel:** Namespace `api` w konfiguracji i18n; jedna konwencja `ns: 'api'`; helper mapuje `message` z fallbackiem na surowy string (major 6.1, F-11/F-12, `docs/i18n_kontrakt_ui.md`).

**Artefakty:**

- Nowy: `frontend/public/locales/pl/api.json`
- Nowy: `frontend/public/locales/en/api.json`
- Zmiana: `frontend/src/configs/i18n.js`
- Zmiana: `frontend/src/utils/asyncUtils/parseApiEnvelope.js`

#### Nowy plik — `frontend/public/locales/en/api.json`

```json
{
  "auth": {
    "verify": {
      "success": "Session verified."
    },
    "sessionRequired": "Authentication required. Please sign in.",
    "loginSuccess": "User logged in correctly.",
    "invalidCredentials": "Incorrect login data.",
    "authError": "Internal server error.",
    "logoutSuccess": "Logged out correctly.",
    "registerSuccess": "User successfully registered. Now you can sign in."
  },
  "authz": {
    "roleMissing": "User has no assigned role.",
    "denied": "You do not have permission to perform this action.",
    "household": {
      "denied": {
        "user": "You don't have permission. This action is only for inmates or hosts.",
        "superadmin": "You don't have permission. Only hosts and inmates can perform this action."
      }
    },
    "host": {
      "denied": {
        "inmate": "This action is reserved for hosts. Contact your host.",
        "user": "Create a household to perform this action.",
        "superadmin": "Create a household to perform this action."
      }
    },
    "inmate": {
      "denied": {
        "host": "This action is only for inmates. You don't have permission.",
        "user": "You don't have enough permission. Create a household or join an existing one."
      }
    },
    "user": {
      "denied": {
        "host": "This action is only for new users.",
        "inmate": "This action is only for new users."
      }
    },
    "superadmin": {
      "denied": {
        "host": "You don't have enough permission. Contact the site administrator.",
        "inmate": "You don't have enough permission. Contact the site administrator.",
        "user": "You don't have enough permission. Contact the site administrator."
      }
    }
  }
}
```

#### Nowy plik — `frontend/public/locales/pl/api.json`

```json
{
  "auth": {
    "verify": {
      "success": "Sesja zweryfikowana."
    },
    "sessionRequired": "Wymagane uwierzytelnienie. Zaloguj się.",
    "loginSuccess": "Logowanie poprawne!",
    "invalidCredentials": "Niepoprawne dane logowania.",
    "authError": "Wewnętrzny błąd serwera.",
    "logoutSuccess": "Wylogowano poprawnie.",
    "registerSuccess": "Konto utworzone. Możesz się zalogować."
  },
  "authz": {
    "roleMissing": "Użytkownik nie ma przypisanej roli.",
    "denied": "Brak uprawnień do wykonania akcji.",
    "household": {
      "denied": {
        "user": "Nie masz uprawnień. Czynność tylko dla domowników lub gospodarzy.",
        "superadmin": "Nie masz uprawnień. Tylko gospodarze i domownicy mogą wykonać akcję."
      }
    },
    "host": {
      "denied": {
        "inmate": "Czynność zarezerwowana dla gospodarzy. Skontaktuj się ze swoim gospodarzem.",
        "user": "Załóż gospodarstwo, aby wykonać tę akcję.",
        "superadmin": "Załóż gospodarstwo, aby wykonać tę akcję."
      }
    },
    "inmate": {
      "denied": {
        "host": "Akcja tylko dla domowników. Nie masz uprawnień.",
        "user": "Nie masz wystarczających uprawnień. Załóż gospodarstwo lub zapisz się do wybranego."
      }
    },
    "user": {
      "denied": {
        "host": "Akcja tylko dla nowych użytkowników.",
        "inmate": "Akcja tylko dla nowych użytkowników."
      }
    },
    "superadmin": {
      "denied": {
        "host": "Nie masz wystarczających uprawnień. Skontaktuj się z administratorem witryny.",
        "inmate": "Nie masz wystarczających uprawnień. Skontaktuj się z administratorem witryny.",
        "user": "Nie masz wystarczających uprawnień. Skontaktuj się z administratorem witryny."
      }
    }
  }
}
```

#### Refaktor — `frontend/src/configs/i18n.js`

**Teraz:**

```javascript
        ns: ['common', 'aboutUs', 'dashboardComponents', 'dashboardInternal', 'errorPage', 'forms', 'homePage', 'pages', 'modals', 'utils'],
        defaultNS: 'common',
```

**Zamień na:**

```javascript
        ns: ['common', 'aboutUs', 'dashboardComponents', 'dashboardInternal', 'errorPage', 'forms', 'homePage', 'pages', 'modals', 'utils', 'api'],
        defaultNS: 'common',
```

(reszta pliku bez zmian — `fallbackLng: 'en'`, `loadPath`, `preload` zostają).

#### Refaktor — `frontend/src/utils/asyncUtils/parseApiEnvelope.js`

**Teraz:**

```javascript
/**
 * Resolver UI do czasu ns `api`: spróbuj t(key); jeśli brak — surowy message (docs i18n fallback).
 */
export const resolveApiMessage = (t, messageKey, defaultValue) => {
  if (!messageKey) return defaultValue ?? '';
  return t(messageKey, { defaultValue: defaultValue ?? messageKey });
};
```

**Zamień na:**

```javascript
import i18n from '../../configs/i18n';

/**
 * Konwencja v1 (zatwierdzona): zawsze ns `api`.
 * Prefiks `api:` w kluczu z BE jest obcinany. Brak klucza → surowy string (docs i18n fallback).
 */
export const resolveApiMessage = (messageKey, defaultValue) => {
  if (!messageKey) return defaultValue ?? '';
  const key = messageKey.startsWith('api:') ? messageKey.slice(4) : messageKey;
  if (i18n.exists(key, { ns: 'api' })) {
    return i18n.t(key, { ns: 'api' });
  }
  return defaultValue ?? messageKey;
};
```

`parseApiEnvelope` bez zmian treści (nadal wyciąga `messageKey`).

**Biblioteki:** i18next — `ns` w `init`, `i18n.exists(key, { ns })`, `i18n.t(key, { ns })` (Context7 `/i18next/i18next` v27).

**Testy:** brak obowiązku Vitest w major FE; smoke: po `npm run build` pliki `/locales/{pl,en}/api.json` są w `dist` / serwowane z `public`.

**DoD kroku:**

- `api` jest w `ns` i18n; istnieją `pl/api.json` i `en/api.json` ze startowym zestawem `auth.*` + `authz.*`.
- Obowiązująca konwencja: **zawsze `ns: 'api'`** (zapisana w komentarzu helpera + ten plan).
- `resolveApiMessage` zwraca tłumaczenie gdy klucz jest w `api`, inaczej surowy `messageKey` / `defaultValue` — nigdy pusty string „bo brak klucza” przy niepustym `message`.

---

### KROK 2 — Podpięcie envelope: sukces/błąd → tłumaczenie lub surowy string

**Status:** `WYKONANY`

**Cel:** Objęte ścieżki sukces/błąd pokazują `resolveApiMessage` (major 6.2, F-8/F-12); nowy kod nie hardcoduje finalnego tekstu API jako jedynego języka UI.

**Artefakty:**

- Zmiana: `frontend/src/store/authContext.jsx`
- Zmiana: `frontend/src/components/forms/AddTransactionForm.jsx`
- Zmiana: `frontend/src/components/forms/LoginForm.jsx`
- Zmiana: `frontend/src/components/forms/SignUpForm.jsx` (toast z resolved `message` gdy to klucz)
- Zmiana (opcjonalnie w tym samym PR, te same call site’y `resolveApiMessage`): formularze/modale używające `t(response.message)` bez ns `api` — `SendMessageForm`, `ChangeEmailModal` — przejście na `resolveApiMessage`

#### Refaktor — call site `resolveApiMessage` (zmiana sygnatury)

Wszystkie miejsca `resolveApiMessage(t…, key, fallback)` → `resolveApiMessage(key, fallbackUi)`.

`authContext.jsx` — `onForbidden` / `onUnauthorized`:

**Teraz:**

```javascript
                showErrorToast(messageKey || 'Session expired');
                // …
                showErrorToast(
                    resolveApiMessage(
                        (key, opts) => i18n.t(key, { ns: 'common', ...opts }),
                        messageKey,
                        messageKey || 'Forbidden',
                    ),
                );
```

**Zamień na:**

```javascript
                showErrorToast(resolveApiMessage(messageKey, messageKey || 'Session expired'));
                // …
                showErrorToast(resolveApiMessage(messageKey, messageKey || 'Forbidden'));
```

Usuń nieużywany import `i18n` z `authContext.jsx`, jeśli po zmianie nie jest potrzebny.

`AddTransactionForm.jsx`:

**Teraz:** `resolveApiMessage(tForms, envelope.messageKey, 'addTransaction.addTransactionCorrect')`  
**Zamień na:** `resolveApiMessage(envelope.messageKey, tForms('addTransaction.addTransactionCorrect'))`  
(analogicznie gałąź error).

#### Refaktor — Login / SignUp: toast z `message` API

`LoginForm.jsx` — po `await login(data)` (gdy `sended`): pokaż toast z resolved `loginStatus.message` / `loginStatus.error` zamiast milczenia przy sukcesie/błędzie API.

**Dodaj** (np. `useEffect` jak w SignUp, albo bezpośrednio po `login`):

```javascript
import { resolveApiMessage } from '../../utils/asyncUtils/parseApiEnvelope';
import { showErrorToast, showInfoToast } from '../../configs/toastify';

// po udanym/błędnym loginie (gdy masz świeży status):
if (loginStatus.message) {
  showInfoToast(resolveApiMessage(loginStatus.message));
}
if (loginStatus.error) {
  showErrorToast(resolveApiMessage(loginStatus.error));
}
```

Uwaga as-is: BE auth często zwraca **surowy EN** (`Incorrect login data.`) — wtedy helper pokazuje surowy string (zgodne z fallbackiem docs), dopóki BE nie przejdzie na klucze. Klucze już normatywne (`auth.sessionRequired`, `authz.*`) tłumaczą się z `api`.

`SignUpForm.jsx` — w gałęzi sukcesu/błędu preferuj `resolveApiMessage(signUpStatus.message|error)` z fallbackiem na istniejące `signUpForm.positiveMessage` / `negativeMessage` (UI copy zostaje jako `defaultValue`).

**DoD kroku:**

- 401/403 bridge i objęte formularze (login, signup, add transaction + wskazane `t(message)`) używają `resolveApiMessage`.
- Brak klucza w `api` → widoczny surowy `message` (lub sensowny UI fallback), bez pustego toasta.
- Żaden nowy kod w tym kroku nie ustawia finalnego PL-only tekstu z API jako jedynego źródła copy.

---

### KROK 3 — Stopniowa migracja istniejących kluczy

**Status:** `WYKONANY`

**Cel:** Refaktorowane powierzchnie nie mieszają sprzecznych konwencji; dług migracji świadomy (major 6.3, F-13).

**Artefakty:**

- Zmiana: `frontend/public/locales/pl/common.json`, `frontend/public/locales/en/common.json` — **nie usuwaj** od razu całego `authz` / `authMessages` jeśli coś jeszcze czyta `ns: 'common'`; po przejściu bridge’a na `api` oznacz w komentarzu planu / krótkim komentarzu w JSON jest zbędne na dłuższą metę.
- Ewentualny alias w `api.json` dla legacy kluczy flat, jeśli BE kiedyś zwróci `authMessages.loginCorrect` (opcjonalnie):

```json
"authMessages": {
  "loginCorrect": "…",
  "invalidInput": "…",
  "authError": "…"
}
```

**Zakres migracji w tym wycinku (zamknięty):**

| Powierzchnia | Działanie |
|--------------|-----------|
| `authz.*` (verifyRole) | SoT tłumaczeń = `api.json`; bridge 403 przez `resolveApiMessage` |
| `auth.sessionRequired`, `auth.verify.success` | Klucze w `api.json` |
| `authMessages.*` w `common` | Nie wymagane do skasowania w tym PR; nowe toasty idą przez `api` / surowy fallback |
| Reszta `locales/` UI | **Poza zakresem** (F-13) |

**Świadomy dług (nie blokuje DoD fazy):** surowe stringi z `loginUser` / `registerUser` / `logoutUser` do czasu refaktoru BE na klucze `auth.*`.

**DoD kroku:**

- Refaktorowane ścieżki (auth bridge, transakcja, login/signup toast) nie wołają równolegle `ns: 'common'` i `ns: 'api'` dla tego samego `message` API.
- Pozostały dług (surowe EN z auth services, pełne `common.authz`) jest opisany powyżej — nie blokuje DoD Fazy 6 major.

#### Propozycja commit message

```text
feat(i18n): map API envelope message through namespace api

Add pl/en api catalogs and resolveApiMessage with raw-string fallback so SPA owns PL/EN copy without empty toasts.
```

---

## FAZA 2 — Klient WebSocket wg kontraktu [= major Faza 7]

### KROK 1 — Handshake sesyjny + katalog dozwolonych `type`

**Status:** `WYKONANY`

**Cel:** Połączenie WS z cookie sesji; handlery wyłącznie z katalogu docs/SPEC; bez custom room API (major 7.1, F-9, K-10–K-12).

**Artefakty:**

- Nowy: `frontend/src/utils/socketEventCatalog.js`
- Zmiana: `frontend/src/store/socketContext.jsx`
- Usunięcie: `frontend/src/utils/sendWebSocketMessage.js` (martwy emit `JSON.stringify` jako nazwa event — własny protokół; zero importerów)

#### Nowy plik — `frontend/src/utils/socketEventCatalog.js`

```javascript
/**
 * Katalog serwer → klient (docs/dokumentacja_komunikacji.md, SPEC-KOMUNIKACJA K-10).
 * Klient v1 nie definiuje osobnego katalogu emitów biznesowych (K-12).
 */
export const SERVER_SOCKET_EVENTS = Object.freeze([
  'connect_success',
  'notification',
  'newMessage',
  'invitation',
  'initial_budget',
  'balance_update',
  'error',
]);

export const isServerSocketEvent = (type) => SERVER_SOCKET_EVENTS.includes(type);
```

#### Refaktor — `frontend/src/store/socketContext.jsx` (handshake + katalog)

Zachowaj istniejące `io(socketPath, { transports: ['websocket'], withCredentials: true, … })` — handshake = cookie `SESSID` (docs).

**Teraz (fragment emitów biznesowych):**

```javascript
    const sendMessage = (type, message) => {
        if (socket && connected) {
            socket.emit(type, message);
        } else {
            setError("Socket.IO is not connected");
        }
    };

    return (
        <SocketContext.Provider value={{ socket, connected, messages, sendMessage, error }}>
```

**Zamień na:**

```javascript
    // Brak katalogu emitów biznesowych z SPA (K-12 / F-9). Cykl życia = connect/disconnect biblioteki.
    return (
        <SocketContext.Provider value={{ socket, connected, messages, error }}>
```

Dodaj handler `connect_success` (obok istniejących):

```javascript
            newSocket.on('connect_success', () => {
                setConnected(true);
                setError(null);
            });
```

Handlery rejestruj **tylko** dla nazw z `SERVER_SOCKET_EVENTS` (jawna lista `on(...)` jak dziś — bez dynamicznego `on(any)`). Lifecycle Socket.io (`connect`, `disconnect`, `connect_error`) zostają — to nie są biznesowe `type` z docs.

Usuń plik `sendWebSocketMessage.js`.

**Biblioteki:** socket.io-client v4 — `io(url, { withCredentials, transports })`, eventy `connect` / `disconnect` / `connect_error` (Context7 Client API).

**DoD kroku:**

- Handshake oparty o `withCredentials: true` + ten sam origin API co HTTP — bez osobnego tajnego kanału auth w kliencie.
- Brak `sendMessage` / `sendWebSocketMessage` jako otwartego API roomów/typów.
- W refaktorowanym kodzie brak handlerów spoza katalogu K-10 (+ lifecycle biblioteki).

---

### KROK 2 — Aktualizacja store / widoku po eventach

**Status:** `WYKONANY`

**Cel:** Push odświeża właściwy store/widok bez drugiej prawdy biznesowej (major 7.2, F-7).

**Artefakty:**

- Nowy: `frontend/src/utils/asyncUtils/boardRefreshBridge.js` (wzorzec jak `authFailureBridge`)
- Zmiana: `frontend/src/store/dataContext.jsx` — rejestracja `refreshData`
- Zmiana: `frontend/src/store/socketContext.jsx` — podpięcie store’ów
- Zmiana: `frontend/src/store/messagesStore.js` — opcjonalny `invalidate` / re-fetch helper (poniżej)
- Zmiana: `frontend/src/store/invitationsStore.js` — wywołanie `fetchInvitations` z handlera (jeśli jeszcze nie świeże)

#### Nowy plik — `frontend/src/utils/asyncUtils/boardRefreshBridge.js`

```javascript
let boardRefreshHandler = null;

export const registerBoardRefresh = (fn) => {
  boardRefreshHandler = fn;
};

export const notifyBoardRefresh = (filter = 'all') => {
  boardRefreshHandler?.(filter);
};
```

#### Refaktor — `dataContext.jsx`

Po zdefiniowaniu `refreshData` / `fetchBoardData`:

```javascript
import { registerBoardRefresh } from '../utils/asyncUtils/boardRefreshBridge';

// w ciele providera, raz przy mount:
useEffect(() => {
  registerBoardRefresh((filter) => {
    fetchBoardData(filter);
  });
}, []);
```

(albo `registerBoardRefresh(refreshData)` jeśli sygnatura się zgadza).

#### Refaktor — handlery w `socketContext.jsx`

| Event | Zachowanie (minimalne kompletne) |
|-------|----------------------------------|
| `notification` | jak dziś → `notificationsStore.addNotification` |
| `newMessage` | ephemeral `messages.newMessages` **+** `useMessagesStore.getState().fetchMessages(currentPage)` (albo page 1) |
| `invitation` | ephemeral **+** `useInvitationsStore.getState().fetchInvitations()` |
| `balance_update` | ephemeral (dla `DisplayLiveBalance`) **+** `notifyBoardRefresh('all')` |
| `initial_budget` | ephemeral (dla `DisplayMonthlyBudget`) **+** `notifyBoardRefresh('all')` |
| `connect_success` | KROK 1 |
| `error` | `setError` (payload / message) |

Przykład `balance_update`:

```javascript
import { notifyBoardRefresh } from '../utils/asyncUtils/boardRefreshBridge';
import { useMessagesStore } from './messagesStore';
import { useInvitationsStore } from './invitationsStore';

            newSocket.on('balance_update', (data) => {
                setMessages((prev) => ({
                    ...prev,
                    balanceUpdates: [data],
                }));
                notifyBoardRefresh('all');
            });

            newSocket.on('newMessage', (data) => {
                setMessages((prev) => ({
                    ...prev,
                    newMessages: [...prev.newMessages, data],
                }));
                const page = useMessagesStore.getState().currentPage || 1;
                useMessagesStore.getState().fetchMessages(page);
            });

            newSocket.on('invitation', (data) => {
                setMessages((prev) => ({
                    ...prev,
                    invitations: [...prev.invitations, data],
                }));
                useInvitationsStore.getState().fetchInvitations();
            });
```

Komponenty (`DisplayLiveBalance`, `MessagesList`, `useDashboardShell`) **nie** dostają równoległej logiki biznesowej — czytają store / ephemeral jak dziś.

**DoD kroku:**

- Objęte eventy aktualizują ephemeral i/lub właściwy Zustand/Context.
- Brak „drugiej prawdy” salda / wiadomości tylko w lokalnym stanie komponentu z pominięciem store przy mutacji push (lista wiadomości może scalać live buffer jak dziś — źródło push nadal socket context).

#### Propozycja commit message

```text
feat(socket): bind catalogued WS events to session handshake and stores

Restrict client handlers to the docs event catalog and refresh board/messages after push without inventing room APIs.
```

---

## FAZA 3 — Bezpieczeństwo klienta i granica zaufania [= major Faza 8]

### KROK 1 — Brak sekretów w bundlu / `VITE_*`

**Status:** `WYKONANY`

**Cel:** Potwierdzenie i domknięcie normy F-14 / `docs/katalog_env.md` (Frontend) / S-16 w zakresie SPA.

**Artefakty:**

- Przegląd: `frontend/src/url.js`, `frontend/package.json`, brak `.env` z sekretami w `frontend/`, brak `import.meta.env.VITE_*` z sekretami
- Zmiana tylko jeśli audyt coś znajdzie (as-is: URL publiczny w `url.js` — **dozwolone**)

#### Audyt (DoD checklist — wykonać przy implementacji)

```text
[ ] rg VITE_|JWT_SECRET|SMTP_|password\s*=|secret\s*= w frontend/ (src + root config) — brak sekretów serwerowych
[ ] url.js / socketPath = tylko origin API (publiczna konfiguracja klienta)
[ ] Żaden nowy import.meta.env nie niesie haseł DB / JWT / SMTP / tokenów CI
[ ] .env* frontu (jeśli powstanie) nie trafia do gita (istniejące .gitignore)
```

Jeśli audyt czysty (stan oczekiwany na 2026-11-20): **zero diffu** poza ewentualnym jednolinijkowym komentarzem przy `url.js`:

```javascript
/** Publiczny origin API/socket — nie magazyn sekretów (F-14 / docs/katalog_env). */
```

**DoD kroku:**

- Brak sekretów serwerowych w repo / bundlu / `VITE_*` frontu.
- Konfiguracja klienta = origin API/socket.

---

### KROK 2 — UI ≠ autoryzacja; bez dublowania reguł

**Status:** `WYKONANY`

**Cel:** Guardy UX odzwierciedlają rolę z sesji API; odmowa serwera jest widoczna; brak drugiej kopii reguł host/inmate jako SoT (major 8.2, F-15, docs/bezpieczeństwo).

**Artefakty (przegląd + drobne poprawki):**

- `frontend/src/utils/checkUserRole.js` — porównania roli z `user.role` z auth context (już po R1)
- `frontend/src/hooks/useDashboardShell.js` — komentarz już mówi: reguły egzekwuje API
- `frontend/src/configs/routerConfig.jsx` — trasy dashboardu bez udawania authz
- `frontend/src/components/dashboard/dashboardComponents/DashBoardMenu.jsx` — `superadmin` tylko UX
- Bridge 403 (`notifyForbidden` + toast `authz.*`) — respektowanie odmowy API

#### Wymagane potwierdzenia (obserwowalne)

| Ścieżka | Oczekiwanie |
|---------|-------------|
| Ukryty przycisk hosta / inmate | Nadal wywołanie API przy obejściu UI kończy się 403 + toast z `resolveApiMessage` |
| `inmateOrHostRole` / `isHostRole` | Tylko UX (menu, fast actions, redirect user→userDashboard) — nie lokalny ACL zamiast middleware |
| Brak lokalnej macierzy „kto może usunąć domownika” jako SoT | Operacje idą przez `sendRequest` / API |

#### Refaktor — tylko jeśli znajdziesz lokalną regułę-sojt

Przykład **zakazany** (nie wprowadzać):

```javascript
// BAD: SoT na froncie
if (user.role !== 'host') throw new Error('cannot remove inmate');
```

**Dozwolone (as-is):**

```javascript
if (isHostRole(user)) { /* pokaż kontrolkę */ }
// delete i tak: sendRequest → API → 403 obsłużone tostem
```

Jeśli w trakcie audytu nie ma naruszeń: krok = checklista + ewentualne ujednolicenie komentarzy przy guardach (`// UX only — authz = API`).

**DoD kroku:**

- Chronione operacje w objętych ścieżkach kończą się wywołaniem API; 403 jest toastowane przez istniejący bridge.
- Reguły składu domu / ról nie żyją wyłącznie w komponencie React jako źródło prawdy.

#### Propozycja commit message

```text
chore(security): confirm SPA trust boundary without client secrets or authz SoT

Keep public API origins only and treat role-based UI as reflection of session, not authorization.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| F-11/F-12 | `api` w `ns`; `resolveApiMessage` używa `ns: 'api'`; fallback surowy |
| F-13 | Brak wymogu pełnej migracji `locales/`; dług auth stringów opisany |
| F-9 / K-10–K-12 | Katalog eventów; brak room API / emitów biznesowych z SPA |
| F-7 | Push → store/ephemeral/board refresh |
| F-14 / katalog_env FE | Audyt bez sekretów w `VITE_*` / bundlu |
| F-15 | UI guard ≠ authz; 403 toast |
| Build | `cd frontend && npm run build` przechodzi |
| Zgodność docs/SPEC | Bez redefinicji stacku; konwencja i18n jak w założeniach sesji |

---

## Ślad do major (informacyjnie — nie edytować w tej sesji)

Po **rzeczywistej** implementacji i akceptacji prowadzącego:

| Element major FE | Docelowy status |
|------------------|-----------------|
| Faza 6 + kroki 6.1–6.3 | `WYKONANY` |
| MILESTONE — Kontrakt message ↔ UI | `OSIĄGNIĘTY` |
| Faza 7 + kroki 7.1–7.2 | `WYKONANY` |
| MILESTONE — WS bez własnych protokołów | `OSIĄGNIĘTY` |
| Faza 8 + kroki 8.1–8.2 | `WYKONANY` |
| MILESTONE — Klient bez sekretów i bez udawania authz | `OSIĄGNIĘTY` |

---

## Pass rozwojowy (podsumowanie sesji)

1. Helper + ns `api` → przed toastami / call site’ami.  
2. Katalog eventów + usunięcie otwartego emit → przed sync store.  
3. Bridge `boardRefresh` → przed handlerami `balance_update` / `initial_budget`.  
Brak przenosin prac między fazami major 6 / 7 / 8.
