# Home Budget Manager — feature plan: frontend Faza 5 (R1 `inmate` w UI)

**Kotwica major:** `home-budget-manager_major_plan-frontend.md` — **Faza 5** (kroki 5.1–5.2).  
**Źródła:** `docs/` (koncepcja, dictionary, bezpieczeństwo, i18n, anty-patterny), `spec/SPEC-FRONTEND.md` (F-10, F-15), `spec/SPEC-BEZPIECZENSTWO.md` (S-7–S-8), `spec/SPEC-KOMUNIKACJA.md`, kod `frontend/`.  
**Bramka zewnętrzna:** sesja / board / `message` po stronie API zgodne z DoD Fazy 5 majoru backendu (`inmate`, pole board `inmates`, klucze bez `Mate`, `authz.*`).  
**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Pełna Faza 5 major FE: R1 w UI — porównania roli, URL, copy, locale (API + marketing), sync kontraktu board; UX ról bez udawania authz |
| Pass rozwojowy | Brak przesunięć względem major 5.1 → 5.2 |
| Poza zakresem | Rename plików/komponentów `*Mate*` (zostają), Vitest/RTL/E2E, namespace `api` (Faza 6 FE), backend, zmiana modelu uprawnień |
| Po implementacji (informacyjnie) | Major FE: Faza 5 + 5.1–5.2 → `WYKONANY`; `MILESTONE — Role w UI zgodne z normą` → `OSIĄGNIĘTY` — **edycja major poza tym skillem** |

### Założenia HOW (zatwierdzone w sesji)

1. **URL** `/dashboard/housemates` → `/dashboard/inmates`; **porównania roli** `mate` → `inmate`. **Nazwy plików/komponentów** (`MatesList`, `HouseMatesPage`, …) **bez zmian**.
2. Klucze **`authz.*`** z BE `verifyRole` — dodać do istniejących locale już w tej fazie (nie czekać na Fazę 6).
3. **Copy marketingowe** EN/PL (menu, fast actions, pages, …) także pod R1 — bez „housemate(s)” jako normy prezentacyjnej roli/domu.

---

## FAZA 1 — Role `inmate` w UI (R1)

### KROK 1 — Rename `mate` → `inmate` (guardy, URL, locale, kontrakt board)

**Status:** `WYKONANY`

**Cel:** Refaktorowany SPA używa wyłącznie `inmate` dla roli domownika (F-10 / major 5.1); ścieżka listy członków i kontrakt danych zgodne z BE R1.

**Artefakty:**

- Zmiana: `frontend/src/utils/checkUserRole.js` (+ call site’y eksportu)
- Zmiana: `frontend/src/hooks/useDashboardShell.js`, `frontend/src/pages/DashboardPage.jsx`
- Zmiana: `frontend/src/pages/dashboard-subpages/HouseInfoPage.jsx`
- Zmiana: `frontend/src/configs/routerConfig.jsx`, `frontend/src/utils/arraysUtils/dashBoardMenuArrays.js`, linki `to=…/housemates`
- Zmiana: `frontend/src/store/dataContext.jsx` + konsumenci `houseMates` → `inmates`
- Zmiana: `frontend/src/utils/arraysUtils/fastActionsArray.js`, `fastActionsUtils.js`, `UserProfilePage.jsx` (`actionType`)
- Zmiana locale EN/PL: `common.json`, `forms.json`, `pages.json`, `dashboardInternal.json`, `dashboardComponents.json`, `homePage.json`, `modals.json` (oraz inne z grep „housemate” / „Housemates” w `frontend/public/locales/`)

#### Refaktor — helper roli

Plik: `frontend/src/utils/checkUserRole.js`

**Teraz:**

```javascript
export const mateOrHostRole = (user) => user?.role === "mate" || user?.role === "host";
export const isUserRole = (user) => user?.role === "user";
export const isHostRole = (user) => user?.role === 'host';
```

**Zamień na:**

```javascript
export const inmateOrHostRole = (user) =>
  user?.role === 'inmate' || user?.role === 'host';
export const isUserRole = (user) => user?.role === 'user';
export const isHostRole = (user) => user?.role === 'host';
export const isInmateRole = (user) => user?.role === 'inmate';
```

Call site’y:

| Plik | Teraz | Zamień na |
|------|-------|-----------|
| `useDashboardShell.js` | import/użycie `mateOrHostRole` → `isMateOrHost` | `inmateOrHostRole` → `isInmateOrHost` |
| `DashboardPage.jsx` | `isMateOrHost` | `isInmateOrHost` |

`HouseInfoPage.jsx`:

**Teraz:** `user.role === 'host' \|\| user.role === 'mate'`  
**Zamień na:** `inmateOrHostRole(user)` (import z `checkUserRole`) — jedna ścieżka porównania.

#### Refaktor — URL

| Miejsce | Teraz | Zamień na |
|---------|-------|-----------|
| `routerConfig.jsx` | `path: 'housemates'` | `path: 'inmates'` (element nadal `<HouseMatesPage />`) |
| `dashBoardMenuArrays.js` | `path: 'housemates'` | `path: 'inmates'` |
| `HouseInfoPage.jsx` Link | `to='/dashboard/housemates'` | `to='/dashboard/inmates'` |

Bez trwałego aliasu starej ścieżki (hard cut R1).

#### Refaktor — kontrakt board (`houseMates` → `inmates`)

`dataContext.jsx`:

**Teraz:**

```javascript
        houseMates: [],
// …
                ...(result.dashboardData.houseMates && { houseMates: result.dashboardData.houseMates }),
```

**Zamień na:**

```javascript
        inmates: [],
// …
                ...(result.dashboardData.inmates && { inmates: result.dashboardData.inmates }),
```

Konsumenci (nazwy **komponentów** bez zmian; tylko pole danych):

- `MatesList.jsx` — `data.houseMates` → `data.inmates`
- `MatesCounter.jsx` — to samo
- `SendMessageForm.jsx` — to samo
- `useHouseInfoDashboard.js` / `HouseInfoPage.jsx` — `houseMates` → `inmates` w destrukturyzacji / propsach lokalnych

#### Refaktor — `actionType` profilu (nie nazwa komponentu)

Aby w refaktorowanym kodzie nie zostało `mates` jako norma nawigacji UX:

**Teraz:** `actionType: 'mates'` + `case 'mates'` + `type === 'mates'`  
**Zamień na:** `actionType: 'inmates'` + `case 'inmates'` + `type === 'inmates'`

Pliki: `fastActionsArray.js`, `fastActionsUtils.js`, `UserProfilePage.jsx`.

#### Locale — klucze API (sync z BE R1)

| Teraz | Zamień na | Namespace |
|-------|-----------|-----------|
| `addUserToHouse.correctlyAddedByMate` | `addUserToHouse.correctlyAddedByInmate` | `forms` |
| `notifications.addedHouseMate` | `notifications.addedInmate` | `common` |
| `notifications.deletedHouseMate` | `notifications.deletedInmate` | `common` |
| `matesList.mate` | `matesList.inmate` | `dashboardInternal` |

Teksty wartości: EN „inmate” / „household member” zamiast „housemate”; PL „domownik” (bez zmiany sensu).

`forms.addUserToHouse.inmateOrHostError` — zaktualizuj copy EN („already a housemate…”) → bez „housemate” (np. „already an inmate or host”).

#### Locale — nowe klucze `authz.*` (BE `verifyRole`)

Dodać w **`common.json`** (EN + PL), żeby `t(message)` / `tCommon(message)` działało zanim Faza 6 wprowadzi `ns: api`. Klucze płaskie ze ścieżką jak w `message` z API (spójnie z obecnym `notifications.*`):

```json
"authz": {
  "roleMissing": "…",
  "denied": "…",
  "household": {
    "denied": {
      "user": "…",
      "superadmin": "…"
    }
  },
  "host": {
    "denied": {
      "inmate": "…",
      "user": "…",
      "superadmin": "…"
    }
  },
  "inmate": {
    "denied": {
      "host": "…",
      "user": "…"
    }
  },
  "user": {
    "denied": {
      "host": "…",
      "inmate": "…"
    }
  },
  "superadmin": {
    "denied": {
      "host": "…",
      "inmate": "…",
      "user": "…"
    }
  }
}
```

i18next: klucz API `authz.household.denied.user` → `t('authz.household.denied.user')` przy `defaultNS: 'common'` — **bez** nowego namespace w tej fazie.

Treść PL/EN: sens jak dawne komunikaty `verifyRole` (odmowa uprawnień), bez hardcodu w JSX.

#### Locale — copy marketingowe / menu / fast actions

Zaktualizować **klucze etykiet i wartości** (EN + PL), m.in.:

| Obszar | Kierunek |
|--------|----------|
| `common.dashboardMenu` — klucz/label `Housemates` | np. `Inmates` / PL „Domownicy”; menu `path` już `inmates` |
| `common.fastActionsBtns` — `Add housemate`, `Your housemates` | np. `Add inmate`, `Your inmates` (+ PL) |
| `fastActionsArray.js` — `label` stringi | te same etykiety co klucze menu/fast actions (spójność z `t(label)`) |
| `pages.houseInfo.housematesLabel` / `housematesOpenBtn` / `housematesPage.title` | copy bez „housemates”; klucze JSON wolno przemianować na `inmatesLabel` itd. **albo** zostawić klucz JSON i zmienić tylko wartość — preferuj **rename klucza** gdy nazwa zawiera `housemates` i jest w refaktorowanym UI |
| `dashboardInternal.matesList` — `deleteBtnTitle`, `noHousematesError` | copy inmate/domownik |
| `dashboardInternal.mostActiveMates.heading` | bez „mates” |
| `dashboardComponents` (matesCounter / heading) | j.w. |
| `homePage.mainSlogan`, `modals` (`housemate`), `forms.sendMessage` placeholders | j.w. |

Grep w `frontend/public/locales/{en,pl}` oraz `frontend/src` po `housemate`, `Housemates`, `\bmate\b` (rola) — wyczyścić w objętych plikach. **Nie** wymagać rename pliku `MatesList.jsx`.

#### DoD (krok)

- Brak porównania `role === 'mate'` / `mateOrHostRole` w `frontend/src`.
- Route listy: `/dashboard/inmates`; brak normy `/housemates`.
- Store/board: pole `inmates`; konsumenci zaktualizowani.
- Locale: klucze API z tabeli + `authz.*` EN/PL; copy marketingowe bez „housemate(s)” jako normy.
- Nazwy plików komponentów `*Mate*` **nietknięte**.

---

### KROK 2 — UI odzwierciedla role; prawda = API (F-15)

**Status:** `WYKONANY`

**Cel:** Widoki host / inmate / user / superadmin zgodne z docs; ukrycie UI ≠ autoryzacja; 403 z API widoczne przez istniejący envelope + i18n (major 5.2, F-15).

**Artefakty:**

- Audyt + ewentualne poprawki UX: `MatesList.jsx` (przycisk usuwania), `fastActionsUtils.js` (host-only declare), `DashBoardMenu.jsx` / superadmin, `HouseInfoPage` / `DashboardForUser`, `DashboardPage` (modal zaproszeń tylko host)
- Bez nowych warstw authz w kliencie; bez Vitest (poza major FE)

#### Audyt UX vs S-8 (checklist implementacji)

| Reguła | Oczekiwane UX | Uwaga F-15 |
|--------|---------------|------------|
| `host` zarządza składem | Usuwanie domownika / akceptacja zaproszeń widoczne dla `host` | API i tak odrzuci inmate |
| `inmate` — rdzeń bez host-ops | Shell `inmateOrHostRole`; brak host-only akcji | 403 + toast przy obejściu |
| `user` — bez domu | Redirect `/userDashboard` (już w shell) | — |
| `superadmin` ≠ host domu | Linki admin; **nie** traktować jak host gospodarstwa | — |

#### Refaktor — delete w liście (as-is drift)

`MatesList.jsx` — przycisk usuwania:

**Teraz:** `hidden={user.role !== 'superadmin'}`  
**Zamień na:** `hidden={!isHostRole(user)}` (import `isHostRole`)

Sens: egzekwowanie składu = host (docs/S-8); superadmin ≠ host. API pozostaje źródłem prawdy przy 403.

#### 403 widoczne w UX

Istniejący tor: `sendRequest` / `fetchData` / `sendMultipart` mapują 403 → envelope `status: 'error'` + `message` (klucz); formularze wołają `showErrorToast(t(…))` przez `useApiResponseHandler`.

W tym kroku:

1. Potwierdzić na ścieżkach host-only (np. delete inhabitant, declare budget gdy inmate) że toast pokazuje `authz.*` / istniejący klucz — **nie** sukces.
2. Jeśli któryś call site łyka błąd bez toastu — dopiąć `onError` + `t(messageKey)` najmniejszym diffem (reuse `useApiResponseHandler` / `resolveApiMessage`).

Bez nowych bibliotek i bez testów przeglądarkowych w planie.

#### DoD (krok)

- Checklist S-8 przejrzany; delete domownika w UI dla `host`, nie dla „tylko superadmin”.
- Inmate/host/user/superadmin nie są mylone w objętych widokach.
- Odmowa API (403) na objętej mutacji kończy się widocznym błędem i18n, nie „udanym” UX.

---

#### Propozycja commit message

```text
feat(ui): align client roles and copy with inmate R1

Use inmate in guards and board data, rename inmates route and locales,
and keep API as the authz source of truth for host-only actions.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| Major FE Faza 5 | F-10: brak roli `mate` w porównaniach; copy/URL/`inmates` |
| F-15 | UI nie jest jedynym authz; 403 widoczne |
| Sync BE | Pole `inmates`, klucze `*Inmate` / `authz.*` |
| Poza zakresem | Pliki `MatesList.jsx` itd. nadal istnieją pod starymi nazwami |
| Testy UI | Świadomie brak (major FE / SPEC-TESTY) |
| Nagłówki | `FAZA` / `KROK` + commit EN Conventional Commits |

## Ślad do major (informacyjnie, po implementacji)

- Faza 5 FE → `WYKONANY` (5.1, 5.2 → `WYKONANY`)
- `MILESTONE — Role w UI zgodne z normą` → `OSIĄGNIĘTY` (po domknięciu + bramce BE R1)
- Start Fazy 6 FE (namespace `api`) — poza tym wycinkiem
