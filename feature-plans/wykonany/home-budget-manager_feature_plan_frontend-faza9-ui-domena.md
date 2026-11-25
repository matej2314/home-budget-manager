# Home Budget Manager — feature plan: UI pod reguły domeny (Faza 9)

**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Major frontend, Faza 9 (kroki 9.1–9.4) |
| Plik | `feature-plans/home-budget-manager_feature_plan_frontend-faza9-ui-domena.md` |
| Źródła | `docs/data_flow.md` (delete, zaproszenia, kwota), `docs/i18n_kontrakt_ui.md`, `docs/bezpieczenstwo.md`, `spec/SPEC-FRONTEND.md` F-15–F-18, `spec/SPEC-DANE.md` D-11b / D-12a, `spec/SPEC-TESTY.md` (frontend poza piramidą v1) |
| Kolejność `KROK` | Zgodna z numeracją major 9.1 → 9.4. Pass rozwojowy: brak przesunięć |
| Poza wycinkiem | `DeclareBudgetForm` (F-18 = formularze transakcji; 2 dp na BE jest na `POST /api/v1/action/new`). Historia accept/decline. Szablony maili. Nowe testy UI. Kolumna delete na podglądach `mainSite` (ostatnie transakcje, skrót domu) |
| Po implementacji (informacyjnie) | Major: Faza 9 i kroki 9.1–9.4 → `WYKONANY`; milestone „UI zgodne z regułami domeny” → `OSIĄGNIĘTY`. Ten plik majora nie edytuje |

---

## Założenia

Stack z `frontend/package.json`: React `^19.3.1`, Zustand `^5.1.0`, i18next `^27.0.1`, react-i18next `^18.0.1`. Bez nowych zależności.

Konwencja i18n już w kodzie (`frontend/src/utils/asyncUtils/parseApiEnvelope.js`, SPEC F-12): klucz z `message` idzie do `resolveApiMessage` — obcięcie prefiksu `api:`, potem `i18n.exists` / `i18n.t` z `{ ns: 'api' }`. Brak klucza → `defaultValue`, a gdy go nie podano, surowy string (docs i18n).

Context7, i18next v27.1.5 (`sample.html`): zagnieżdżony klucz to `t('nav.home')`; brak klucza w przykładzie spada do stringa domyślnego (`getFixedT` drugi argument). W tym SPA nie przełączamy się na `getFixedT`. Namespace `api` ładuje `frontend/src/configs/i18n.js` (`loadPath: /locales/{{lng}}/{{ns}}.json`). Nowe klucze to wpisy w `pl/api.json` i `en/api.json`.

Rola w UI: `isHostRole` z `frontend/src/utils/checkUserRole.js`. Id sesji: `user.id` (`authContext`, `response.userId`). Wiersz transakcji z boardu ma `userId` i `transactionId` (`backend/database/board.js`). Authz zostaje w API (F-15).

Kolekcja zaproszeń: `GET /api/v1/invitation/collection` zwraca status `new` (`invitationStatus.new`). W docs to jest pending. UI nie filtruje literałem `pending`, bo taki status w odpowiedzi nie występuje.

---

## FAZA 1 — UI pod reguły domeny (major Faza 9)

### KROK 1 — Delete transakcji w UI (host / inmate)

**Status:** `WYKONANY`

**Cel:** Przycisk delete na liście transakcji z kolumną akcji: host na każdej transakcji domu, inmate tylko na własnej (`transaction.userId === user.id`). Modal nie blokuje wysyłki po `userName`. Ścieżka zostaje `DELETE /api/v1/action` z `{ transactionId }`. Major 9.1, SPEC F-15 / F-16, `docs/data_flow.md` (usunięcie).

**Artefakty:**

- Zmiana: `frontend/src/components/dashboard/dashboard-internal-components/TransactionsList.jsx`
- Zmiana: `frontend/src/components/modals/DeleteTransactionModal.jsx`

Podglądy z `mainSite={true}` (`LastTransactionsList`, skrót na `HouseInfoPage`) nie dostają kolumny akcji. `TransactionsPage` ma `mainSite={false}` — tam widać przycisk. To samo tyczy się `UserProfilePage` i `UserTransactionsModal` (też bez `mainSite`).

#### Refaktor — `TransactionsList.jsx`

Import obok pozostałych:

```javascript
import { isHostRole } from '../../../utils/checkUserRole';
```

**Teraz** (komórka akcji, ok. linie 86–97):

```jsx
{!mainSite && transaction.userName === user.userName && (
    <td>
        <button
            type="button"
            className="w-fit h-fit p-1.5 rounded-md text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
            onClick={() => handleDeleteAction(transaction)}
            title={tInternal("transactionsList.deleteBtnTitle")}
        >
            <Icon icon='material-symbols:delete-outline' width={20} height={20} />
        </button>
    </td>
)}
```

**Zamień na:**

```jsx
{!mainSite && (
    <td>
        {(isHostRole(user) || transaction.userId === user?.id) && (
            <button
                type="button"
                className="w-fit h-fit p-1.5 rounded-md text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                onClick={() => handleDeleteAction(transaction)}
                title={tInternal("transactionsList.deleteBtnTitle")}
            >
                <Icon icon='material-symbols:delete-outline' width={20} height={20} />
            </button>
        )}
    </td>
)}
```

Pusta `<td>` przy inmate i cudzej transakcji trzyma kolumnę równo z nagłówkiem akcji. Samo ukrycie komórki rozjeżdża wiersz.

#### Refaktor — `DeleteTransactionModal.jsx`

Z pliku schodzi `useAuth` i `user`. Jedyny użytek to lokalna blokada.

**Teraz:**

```javascript
const { user } = useAuth();
const { t } = useTranslation("modals");

const handleDeleteAction = async (transaction) => {

    if (transaction.userName !== user.userName) {
        showErrorToast('Nie dodałeś tej transakcji!');
        onRequestClose();
    };

    try {
        setIsLoading(true);
        const actionData = { transactionId: transaction.transactionId };
        const deleteAction = await sendRequest('DELETE', actionData, `${apiBaseUrl}/action`);
        // onSuccess / onError bez zmian w tym kroku
```

Warunek nie ma `return`, więc po toaście funkcja i tak woła DELETE.

**Zamień na:**

```javascript
const { t } = useTranslation("modals");

const handleDeleteAction = async (transaction) => {
    if (!transaction?.transactionId) return;

    try {
        setIsLoading(true);
        const actionData = { transactionId: transaction.transactionId };
        const deleteAction = await sendRequest('DELETE', actionData, `${apiBaseUrl}/action`);

        handleApiResponse(deleteAction, {
            onSuccess: async () => {
                showInfoToast(t("deleteTransaction.successMessage"));
                await fetchTransactions();
                await refreshData();
                onRequestClose();
            },
            onError: () => {
                showErrorToast(t("deleteTransaction.failedMessage"));
            }
        });
    } catch (error) {
        showErrorToast(t("deleteTransaction.errorMessage"));
        console.error('Delete transaction error:', error);
    } finally {
        setIsLoading(false);
    }
};
```

`onError` i `catch` zostają ogólne do KROK 2. Sukces: toast z `modals`, refetch listy, `refreshData` (saldo).

**Biblioteki:** brak nowego API. React 19, istniejący `sendRequest` i store transakcji.

**Testy:** brak nowych testów UI (`docs/testy.md`, SPEC-TESTY: frontend poza strategią v1).

**DoD (krok):**

- Na `TransactionsPage` host widzi przycisk przy transakcji innego `userId`. Inmate widzi go tylko przy `transaction.userId === user.id`.
- Klik hosta na cudzej transakcji wysyła DELETE i nie pokazuje tekstu „Nie dodałeś tej transakcji!”.
- Lista `mainSite` nie ma kolumny akcji.
- Po 2xx lista i saldo się odświeżają, modal się zamyka.

### KROK 2 — 403 przy odmowie delete

**Status:** `WYKONANY`

**Cel:** Odmowa delete (403, klucz `authz.transactions.delete.denied` z BE) jest jednym toastem z namespace `api`. Nie ma toastu sukcesu. Major 9.2, SPEC F-16, `docs/i18n_kontrakt_ui.md`.

**Artefakty:**

- Zmiana: `frontend/src/utils/asyncUtils/sendRequest.js`
- Zmiana: `frontend/src/components/modals/DeleteTransactionModal.jsx` (fragment z KROK 1)
- Zmiana: `frontend/public/locales/pl/api.json`
- Zmiana: `frontend/public/locales/en/api.json`

`sendRequest` przy 403 woła `notifyForbidden` i rzuca. `handleApiResponse` / `onError` tej odpowiedzi nie dostaje. Toast i18n jest już w `authContext` (`onForbidden` → `resolveApiMessage`). `catch` w modalu dokłada drugi, ogólny toast. Krok 2 zostawia ten mostek i ucina drugi toast. 401 bez zmian.

#### Refaktor — `sendRequest.js`

**Teraz:**

```javascript
if (response.status === 403) {
  notifyForbidden(responseData?.message);
  throw new Error(responseData?.message || 'Forbidden');
}
// …
} catch (error) {
  throw new Error(error.message || 'Błąd wysyłania danych.');
}
```

Wewnętrzny `throw` wpada w ten sam `catch` i gubi flagę.

**Zamień na:**

```javascript
if (response.status === 403) {
  notifyForbidden(responseData?.message);
  const notified = new Error(responseData?.message || 'Forbidden');
  notified.notified = true;
  throw notified;
}
// …
} catch (error) {
  if (error?.notified) throw error;
  throw new Error(error.message || 'Błąd wysyłania danych.');
}
```

#### Refaktor — `DeleteTransactionModal.jsx` (po KROK 1)

Import:

```javascript
import { resolveApiMessage } from '../../utils/asyncUtils/parseApiEnvelope';
```

**Teraz:**

```javascript
onError: () => {
    showErrorToast(t("deleteTransaction.failedMessage"));
}
// …
} catch (error) {
    showErrorToast(t("deleteTransaction.errorMessage"));
    console.error('Delete transaction error:', error);
}
```

**Zamień na:**

```javascript
onError: (envelope) => {
    showErrorToast(
        resolveApiMessage(
            envelope.messageKey,
            t("deleteTransaction.failedMessage"),
        ),
    );
}
// …
} catch (error) {
    if (error?.notified) return;
    showErrorToast(
        resolveApiMessage(
            error?.message,
            t("deleteTransaction.errorMessage"),
        ),
    );
    console.error('Delete transaction error:', error);
}
```

403: jeden toast z mostka. Inny błąd (404 / 500), którego `sendRequest` nie oznacza `notified`, idzie przez `resolveApiMessage` i spada na `errorMessage`, gdy klucza nie ma w `api`. Sukces bez zmian.

#### Refaktor — `pl/api.json` i `en/api.json`

W obiekcie `authz`, po `superadmin`, dopisać `transactions`. Reszta pliku bez zmian.

**pl:**

```json
"transactions": {
  "delete": {
    "denied": "Nie masz uprawnień do usunięcia tej transakcji."
  }
}
```

**en:**

```json
"transactions": {
  "delete": {
    "denied": "You do not have permission to delete this transaction."
  }
}
```

Klucz z BE `authz.transactions.delete.denied` schodzi się z tą ścieżką.

**Biblioteki:** i18next 27 — zagnieżdżone klucze i fallback stringiem (Context7 v27.1.5, sample). Tłumaczenie 403 idzie istniejącym `resolveApiMessage`, nie nowym `t()`.

**Testy:** brak nowych testów UI.

**DoD (krok):**

- Inmate, który mimo ukrytego przycisku dostanie 403, widzi polski albo angielski tekst z `api.authz.transactions.delete.denied`, nie `deleteTransaction.successMessage`.
- Przy tym 403 jest jeden toast, nie drugi z `errorMessage`.
- 2xx dalej odświeża listę.

### KROK 3 — Lista zaproszeń pending (host)

**Status:** `WYKONANY`

**Cel:** Host widzi zaproszenia z `GET /api/v1/invitation/collection` (status `new`). Po accept / decline wiersz znika po refetchu. Nie ma ekranu historii `accepted` / `rejected`. Major 9.3, SPEC F-17, `docs/data_flow.md` (ścieżka inmate → pending).

**Artefakty:**

- Zmiana: `frontend/src/hooks/useDashboardShell.js`
- Zmiana: `frontend/src/store/socketContext.jsx`
- Zmiana: `frontend/src/pages/DashboardPage.jsx`
- Zmiana: `frontend/src/components/modals/invitationModal.jsx`

Store `fetchInvitations` zostaje. Już nie woła kolekcji dla roli innej niż host.

#### Refaktor — `useDashboardShell.js`

**Teraz:**

```javascript
const invitationsMessages = connected && messages?.invitations;
// …
const allInvitations = useMemo(() => {
  const dbInvitations =
    (!invitationsLoading && !invitationsLoadingError && invitationsData) || [];
  return [
    ...(Array.isArray(dbInvitations) ? dbInvitations : []),
    ...(Array.isArray(invitationsMessages) ? invitationsMessages : []),
  ];
}, [
  invitationsLoading,
  invitationsLoadingError,
  invitationsData,
  invitationsMessages,
]);
```

oraz w efekcie: `allInvitations.length` i `openModal('invitation', allInvitations)`.

**Zamień na:**

```javascript
const pendingInvitations = useMemo(() => {
  const rows = Array.isArray(invitationsData) ? invitationsData : [];
  return rows.filter((invitation) => invitation.status === 'new');
}, [invitationsData]);
```

W efekcie te same warunki fetchu hosta, tylko `pendingInvitations.length` zamiast `allInvitations.length`. Otwarcie: `openModal('invitation')` — bez kopii listy w `modal.data`. Z tablicy zależności efektu schodzi `allInvitations` i `invitationsMessages`; wchodzi `pendingInvitations`. `messages` zostaje dla toastu nowej wiadomości.

Surowy event WS nie jest wierszem kolekcji i zostaje w pamięci po accept. Dlatego znika z listy.

#### Refaktor — `socketContext.jsx`

**Teraz:**

```javascript
newSocket.on("invitation", (data) => {
    setMessages((prevMessages) => ({
        ...prevMessages,
        invitations: [...prevMessages.invitations, data],
    }));
    const currentUser = userRef.current;
    if (isHostRole(currentUser)) {
        useInvitationsStore.getState().fetchInvitations(currentUser);
    }
});
```

**Zamień na:**

```javascript
newSocket.on("invitation", () => {
    const currentUser = userRef.current;
    if (isHostRole(currentUser)) {
        useInvitationsStore.getState().fetchInvitations(currentUser);
    }
});
```

Pole `messages.invitations` w stanie początkowym może zostać. Nic go już nie czyta.

#### Refaktor — `DashboardPage.jsx`

**Teraz:**

```jsx
<InvitationModal isOpen={modal.isOpen} onRequestClose={closeModal} invitationsData={modal.data} />
```

**Zamień na:**

```jsx
<InvitationModal isOpen={modal.isOpen} onRequestClose={closeModal} />
```

#### Refaktor — `invitationModal.jsx`

Import: `useEffect` obok `useContext`. Prop `invitationsData` schodzi.

```javascript
const invitationsData = useInvitationsStore((state) => state.invitationsData);
const invitationsLoading = useInvitationsStore((state) => state.invitationsLoading);
const fetchedInvitations = useInvitationsStore((state) => state.fetchedInvitations);

const pendingInvitations = (Array.isArray(invitationsData) ? invitationsData : [])
    .filter((invitation) => invitation.status === 'new');

useEffect(() => {
    if (!isOpen || invitationsLoading || !fetchedInvitations) return;
    if (pendingInvitations.length === 0) onRequestClose();
}, [isOpen, invitationsLoading, fetchedInvitations, pendingInvitations.length, onRequestClose]);
```

W `onSuccess` accept i decline zostaje toast i `refreshAfterInvitation()`. Nie ma `onRequestClose()` w tym callbacku. Ostatni wiersz zamyka modal efekt powyżej, gdy kolekcja wróci pusta. Przy błędzie zostaje dotychczasowy toast `failedAccept` / `failedReject`.

Lista: `pendingInvitations.map` zamiast `invitationsData.map`. Kształt wiersza bez zmian (`id`, `invitingUserName`, `invitedUserName`, `date`, `invitedUser`).

Zamknięcie krzyżykiem przy nadal niepustej liście zostaje jak dziś: efekt nie otwiera modala drugi raz, dopóki `invitationsData` się nie zmieni. Osobnego przycisku „pokaż zaproszenia” ten krok nie dodaje.

**Biblioteki:** Zustand 5 — ten sam `useInvitationsStore` / `getState().fetchInvitations` co w handlerze WS. Bez nowego API store.

**Testy:** brak nowych testów UI.

**DoD (krok):**

- Modal hosta pokazuje wiersze ze store po kolekcji, ze statusem `new`.
- Accept i decline wołają istniejące POST `/invitation/accept` i `/invitation/decline`, potem refetch. Wiersz znika. `accepted` / `rejected` nie mają widoku.
- Event `invitation` nie dokleja drugiej listy obok kolekcji.
- Przy dwóch pending akceptacja jednego zostawia drugi w otwartym modalu.

### KROK 4 — Walidacja kwoty 2 dp

**Status:** `WYKONANY`

**Cel:** `AddTransactionForm` nie wysyła kwoty z więcej niż dwoma miejscami po przecinku i nie zaokrągla jej przez `toFixed(2)`. To samo pole przyjmuje wynik OCR. Błąd z API `transactions.invalidAmount` ma tłumaczenie w `api`. Major 9.4, SPEC F-18, D-11b. Wzorzec jak `parseAmount2dp` w `backend/utils/validation.js`: `^-?\d+(\.\d{1,2})?$`.

**Artefakty:**

- Zmiana: `frontend/src/utils/validation.js`
- Zmiana: `frontend/src/components/forms/AddTransactionForm.jsx`
- Zmiana: `frontend/public/locales/pl/forms.json`, `en/forms.json`
- Zmiana: `frontend/public/locales/pl/api.json`, `en/api.json`

`DeclareBudgetForm` bez zmian.

#### Dopisek — `frontend/src/utils/validation.js`

Obok `isValidNumber`:

```javascript
/** F-18 / D-11b: max 2 miejsca po przecinku. Nie zaokrągla. */
export const isAmount2dp = (value) => {
    const s = String(value ?? '').trim().replace(',', '.');
    if (!/^-?\d+(\.\d{1,2})?$/.test(s)) return false;
    return Number.isFinite(Number(s));
};
```

#### Refaktor — `AddTransactionForm.jsx`

Import `isValidNumber` zamienić na `isAmount2dp`.

**Teraz:**

```javascript
const rawValue = String(value).replace(',', '.');

if (!isValidNumber(rawValue)) {
    showErrorToast(tForms("addTransaction.incorrectNumberInputValue"));
    return;
}
// …
const parsedValue = parseFloat(rawValue);

const newActionData = {
    type,
    value: parsedValue.toFixed(2),
    catId: selectedOption.dataset.id,
};
```

oraz w `catch` ogólny toast `addTransactionError` (przy `status: 'error'` `sendRequest` rzuca, więc `onError` w `handleApiResponse` tej odpowiedzi nie dostaje).

**Zamień na:**

```javascript
const rawValue = String(value).trim().replace(',', '.');

if (!isAmount2dp(rawValue)) {
    showErrorToast(tForms("addTransaction.tooManyDecimalPlaces"));
    return;
}
// …
const newActionData = {
    type,
    value: rawValue,
    catId: selectedOption.dataset.id,
};
```

`catch`:

```javascript
} catch (error) {
    if (error?.notified) return;
    showErrorToast(
        resolveApiMessage(
            error?.message,
            tForms('addTransaction.addTransactionError'),
        ),
    );
}
```

`onSuccess` bez zmian. `10.555` nie idzie w POST. `10`, `10.5`, `10,50` idą jako string bez zaokrąglenia w górę. OCR tylko wpisuje wartość w to samo pole; bramka jest przy submit.

#### Locale

W `forms.addTransaction` (pl i en), obok `incorrectNumberInputValue`:

- pl: `"tooManyDecimalPlaces": "Kwota może mieć najwyżej 2 miejsca po przecinku."`
- en: `"tooManyDecimalPlaces": "Amount can have at most 2 decimal places."`

W `api.json`, obok `auth` / `authz`, klucz z BE:

**pl:**

```json
"transactions": {
  "invalidAmount": "Kwota może mieć najwyżej 2 miejsca po przecinku."
}
```

**en:**

```json
"transactions": {
  "invalidAmount": "Amount can have at most 2 decimal places."
}
```

To jest korzeń `transactions`, nie `authz.transactions` z KROK 2.

**Biblioteki:** ten sam `resolveApiMessage` co w KROK 2. Walidacja jest lokalnym regexem, spójnym z helperem BE, bez wołania backendu przed submitem.

**Testy:** brak nowych testów UI. Reguła 2 dp na BE jest już w `backend/tests/unit/parse-amount-2dp.test.js`; ten krok jej nie rusza.

**DoD (krok):**

- Submit `10.555` i `10,555` nie wywołuje POST. Toast to `forms.addTransaction.tooManyDecimalPlaces`.
- Submit `10.5` wysyła `"10.5"`, nie `"10.50"` wymuszone zaokrągleniem z dłuższego wejścia.
- Gdy API zwróci 400 z `transactions.invalidAmount`, toast jest z `pl/api.json` albo `en/api.json`, nie sam surowy klucz.

#### Propozycja commit message

```text
feat(ui): mirror delete rules, pending invites, and 2-decimal amounts

The API already decides who can delete, which invites are pending, and which amounts are valid. The SPA follows that contract and shows one translated error when delete is refused.
```

---

## Weryfikacja wycinka

- Kotwica: major Faza 9, kroki 9.1–9.4. F-15 zostaje: widoczność przycisku nie zastępuje 403.
- Delete: host / inmate, ścieżka `DELETE /api/v1/action`, odświeżenie listy i salda po sukcesie.
- 403: klucz `authz.transactions.delete.denied`, jeden toast, brak sukcesu.
- Zaproszenia: kolekcja hosta, status `new`, bez historii, refetch po decyzji.
- Kwota: odrzucenie >2 dp w formularzu transakcji (z OCR w tym polu), tłumaczenie `transactions.invalidAmount`.
- Brak nowego pliku. Brak testów UI, zgodnie ze SPEC-TESTY.
- KROK 2 jest przed użyciem `error.notified` w KROK 4. Innych przesunięć nie ma.
- Major, docs, SPEC i starsze pliki w `feature-plans/` bez zmian w tej sesji.

## Ślad do major

Po wdrożeniu kodu i akceptacji DoD (poza tą sesją):

| Pozycja w `home-budget-manager_major_plan-frontend.md` | Status po wdrożeniu |
|---|---|
| Faza 9 | `WYKONANY` |
| Krok 9.1, 9.2, 9.3, 9.4 | `WYKONANY` |
| MILESTONE — UI zgodne z regułami domeny (saldo / delete / invite) | `OSIĄGNIĘTY` |
