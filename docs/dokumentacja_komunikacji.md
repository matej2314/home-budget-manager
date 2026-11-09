---
wersja: 5
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-09
---

# Dokumentacja komunikacji — Home Budget Manager

## Cel i zakres

Normatywny kontrakt I/O aplikacji z otoczeniem (klient SPA i kanały towarzyszące).

| Powierzchnia | W zakresie v1 | Uwagi |
|--------------|---------------|--------|
| **HTTP/REST** (w tym multipart) | Tak | Główny kontrakt; głębszy opis |
| **WebSocket (Socket.io)** | Tak | Lżejszy opis zdarzeń |
| **E-mail** | Tak | As-is (tożsamość) + kierunek kanału wychodzącego |
| Cron w procesie API | Nie (kontrakt zewnętrzny) | Adapter wewnętrzny — `architektura.md` |
| Webhooki / broker / CLI | Nie | Świadomie poza produktem |

Szczegóły warstw: [architektura.md](./architektura.md). Pojęcia domenowe: [dictionary.md](./dictionary.md). Bezpieczeństwo: [bezpieczenstwo.md](./bezpieczenstwo.md). i18n `message`: [i18n_kontrakt_ui.md](./i18n_kontrakt_ui.md).

## Założenia wspólne

### Prefiks HTTP (norma docs)

Wszystkie ścieżki HTTP w tym dokumencie mają prefiks **`/api/v1`**.

To **świadoma zmiana** względem obecnego kodu (montowanie bez prefiksu, np. `/auth/login`). Wdrożenie prefiksu = obowiązkowy element późniejszego refaktoru routingu / klienta (`frontend/src/url.js` i proxy).

Przykład: docs `POST /api/v1/auth/login` ↔ dziś w repo `POST /auth/login`.

#### Wyjątek przejściowy: dual mount (v1 + legacy)

Do czasu cutoveru klienta SPA na `/api/v1` backend **może** montować te same handlery równolegle:

| Reguła | Opis |
|--------|------|
| Norma docelowa | Klient i nowe endpointy: wyłącznie `/api/v1/...` |
| Dual mount | Te same handlery dostępne pod `/api/v1/...` **oraz** pod ścieżkami legacy as-is (`/auth`, `/house`, …) |
| Nowe ścieżki | **Tylko** pod `/api/v1` — zakaz poszerzania zestawu legacy |
| Legacy | Zamknięty zbiór ścieżek istniejących w as-is; nie jest normą docelową kontraktu |
| Koniec wyjątku | Po potwierdzeniu, że SPA woła wyłącznie v1 — usunięcie montażu legacy (poza samym zapisem tej normy; w major planach: poza DoD fazy kontraktu / osobna decyzja po cutoverze FE) |

Testy i dokumentacja endpointów w tym pliku opisują **ścieżki v1**. Smoke legacy jest dopuszczalny wyłącznie jako kompatybilność przejściowa, nie jako druga norma.

### Auth

| Mechanizm | Opis |
|-----------|------|
| Cookie | `SESSID` — JWT (m.in. `id`, `userName`, `role`, opcjonalnie `avatar`) |
| Opcje cookie (backend) | `httpOnly: true`, `secure: true`, `sameSite: 'lax'` |
| Czas życia (typowe logowanie / odświeżenie po zmianie roli) | rzędu 24 h przy ustawianiu cookie |
| Klient | `credentials: true` (CORS z whitelistą originów) |

WebSocket: ten sam cookie `SESSID` w handshake (middleware Socket.io).

### Role w kontrakcie (norma)

| Rola docs | Znaczenie |
|-----------|-----------|
| `user` | Bez gospodarstwa |
| `host` | Twórca / zarządca składu domu |
| `inmate` | Domownik |
| `superadmin` | Panel / operacje witryny |

**Drift kodu (R1):** middleware używa m.in. grupy `mates` (= host + historyczne `mate`) oraz nazwy `mate`. W tabelach poniżej **`inmate`** = docelowa nazwa domownika; `host \| inmate` odpowiada dzisiejszemu `verifyRole('mates')`.

### Envelope odpowiedzi (as-is)

Sukces i błąd zwykle:

```json
{
  "status": "success",
  "message": "…"
}
```

```json
{
  "status": "error",
  "message": "…"
}
```

Dodatkowe pola zależą od operacji (`value`, kolekcje danych, `newRole`, itd.). Nie ma dziś jednolitego `error.code` / `requestId` w envelope — kierunek refaktoru, nie wymóg v1 tego dokumentu.

### Język komunikatów (E6)

As-is: **mieszanka PL i EN** w `message` (oraz częściowo klucze i18n, np. `sendMessage.successMessage`).  
**Kierunek:** ujednolicenie — preferowane **klucze i18n** (albo jeden język kontraktu) mapowane w SPA; bez pełnej migracji w ramach samego zapisu tego pliku.

### Swagger

Backend wystawia Swagger UI jako pomoc operatorską/dev. **Źródłem normy** dla docs jest ten plik + kod; Swagger może być niekompletny lub rozjechany względem prefiksu `/api/v1` do czasu refaktoru.

---

## Powierzchnia HTTP

Base URL (prod, as-is host): API pod domeną backendu (np. `https://budgetapi.msliwowski.net`). Po wprowadzeniu prefiksu klient woła `…/api/v1/...`.

### Grupy zasobów — operacje

Legenda auth: **pub** = bez JWT; **JWT** = cookie `SESSID`; rola = wymagana po weryfikacji tokenu.

#### Auth — `/api/v1/auth`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| POST | `/signup` | pub | Rejestracja (`reg_username`, `reg_email`, `reg_password`, `role`, opcjonalnie `cookies`) |
| POST | `/login` | pub | Logowanie (`email`, `password`) → ustawia `SESSID` |
| POST | `/logout` | JWT | Wylogowanie / czyszczenie sesji cookie |
| GET | `/verify` | JWT | Weryfikacja sesji / dane z tokenu |

#### Household — `/api/v1/house`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| POST | `/new` | JWT + `user` | Utworzenie gospodarstwa (`houseName`, opcjonalnie `initBudget`) → często nowa rola `host` + nowe cookie |
| GET | `/info` | JWT + `host\|inmate` | Info o domu użytkownika |
| GET | `/collection` | JWT + `superadmin` | Lista gospodarstw (otoczka admin) |
| DELETE | `/delete` | JWT + `host` | Usunięcie gospodarstwa |

#### Users / zaproszenia do domu — `/api/v1/users`, `/api/v1/invitation`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| POST | `/users/invite` | JWT + `host\|inmate` | Zaproszenie użytkownika do domu |
| POST | `/invitation/accept` | JWT + `host` | Akceptacja zaproszenia (host) |
| POST | `/invitation/decline` | JWT + `host` | Odrzucenie |
| GET | `/invitation/collection` | JWT + `host` | Lista zaproszeń |
| DELETE | `/users/delete/:inhabitant` | JWT + `host` | Usunięcie domownika |
| POST | `/users/changemail` | JWT | Zmiana e-mail (`newEmail`) |
| GET | `/users/collection` | JWT + `superadmin` | Lista użytkowników |
| POST | `/users/delete/:userId` | JWT + `superadmin` | Usunięcie konta (admin) |

#### Transakcje — `/api/v1/action`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| POST | `/new` | JWT + `host\|inmate` | Nowa transakcja (`type`, `value`, `catId`) |
| GET | `/my` | JWT + `host\|inmate` | Transakcje gospodarstwa |
| DELETE | `/` | JWT + `host\|inmate` | Usunięcie transakcji |
| GET | `/collection` | `superadmin` (as-is) | Wszystkie akcje — panel admin |

#### Kategorie — `/api/v1/actioncat`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| POST | `/new` | JWT + `superadmin` | Dodanie kategorii |
| GET | `/collection` | JWT + `superadmin` | Lista |
| DELETE | `/delete` | JWT + `superadmin` | Usunięcie |

#### Budżet miesięczny — `/api/v1/initmonthly`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| POST | `/new` | JWT + `host\|inmate` | Deklaracja / init budżetu miesięcznego |

#### Dashboard — `/api/v1/board`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| GET | `/data/:filter?/:page?` | JWT + `host\|inmate` | Dane tablicy / zestawień |

#### Wiadomości — `/api/v1/message`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| POST | `/send` | JWT | Wysłanie wiadomości (+ push WS `newMessage`) |
| PUT | `/readed` | JWT | Oznaczenie przeczytania |
| DELETE | `/delete` | JWT | Usunięcie |

#### Powiadomienia — `/api/v1/notice`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| GET | `/collection` | JWT | Lista powiadomień |
| DELETE | `/` | JWT | Usunięcie powiadomienia |

#### OCR paragonu — `/api/v1/receipt`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| POST | `/` | multipart `receipt` (as-is: **bez** `verifyJWT` na routerze) | Zwraca rozpoznaną kwotę (`value`) |

Uwaga utrzymaniowa: brak JWT na OCR to **ryzyko** — kandydat do domknięcia przy refaktorze (nie zmienia to normy „upload = HTTP”).

#### Awatary — `/api/v1/avatars`

| Metoda | Ścieżka | Auth | Opis |
|--------|---------|------|------|
| POST | `/save` | JWT + multipart | Zapis awatara |
| GET | `/avatar/:userId?` | JWT (gdy dotyczy chronionego odczytu) | Pobranie |
| DELETE | `/delete` | JWT | Usunięcie |

#### Otoczka — homepage, reviews, gallery, cookies/tour

| Prefiks | Operacje (skrót) | Auth typowe |
|---------|------------------|-------------|
| `/api/v1/homepage` | `GET /dataCollection` (pub); `POST /technology` | `superadmin` na zapis |
| `/api/v1/reviews` | `POST /new` (JWT); `GET /collection` (pub) | |
| `/api/v1/gallery` | `POST /save` | JWT + `superadmin` + plik |
| `/api/v1/cookiestour` | `POST /cookie_value` | JWT |

### Przykłady HTTP

#### `POST /api/v1/auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "********"
}
```

Response **200** (skrót): body ze `status: "success"` oraz Set-Cookie `SESSID=…`.  
Błędy: **400** walidacja, **401** złe dane — `status: "error"`, `message` (PL/EN).

#### `POST /api/v1/house/new`

Wymaga roli `user`. Body:

```json
{
  "houseName": "Dom Kowalskich",
  "initBudget": 2000
}
```

**200:** sukces + zwykle nowe cookie z rolą `host`.

#### `POST /api/v1/action/new`

Wymaga `host` | `inmate`. Body:

```json
{
  "type": "expense",
  "value": 49.99,
  "catId": "<uuid-kategorii>"
}
```

Skutki uboczne (as-is): aktualizacja salda domu, powiadomienie + WS `notification` / `balance_update` dla domowników.

### Multipart

| Endpoint (docs) | Pole pliku | Cel |
|-----------------|------------|-----|
| `POST /api/v1/receipt/` | `receipt` | OCR kwoty |
| `POST /api/v1/avatars/save` | (wg multer w `store/`) | Awatar |
| `POST /api/v1/gallery/save` | (wg multer) | Screenshoty (superadmin) |

Limity typów/rozmiaru: wg konfiguracji multer w kodzie (nie duplikowane tu jako sztywne SLA).

### Semantyka błędów HTTP (praktyka as-is)

| HTTP | Typowe znaczenie w API |
|------|-------------------------|
| 400 | Walidacja / złe wejście |
| 401 | Brak lub nieważny `SESSID` |
| 403 | Rola niewystarczająca |
| 404 | Zasób / „URL not found” w switchach controllerów |
| 409 | Konflikt (np. e-mail zajęty przy rejestracji) |
| 500 | Błąd serwera |

---

## Powierzchnia WebSocket (Socket.io)

| Temat | As-is |
|-------|--------|
| Transport | Socket.io na tym samym originie/porcie co API |
| Auth | Cookie `SESSID` przy połączeniu |
| Rejestr połączeń | Tabela połączeń w MySQL (TTL / restore) |
| Klient | `socket.io-client` → host API |

### Zdarzenia serwer → klient

| `type` / event | Zakres | Typowe użycie |
|----------------|--------|----------------|
| `connect_success` | user | Przywrócenie / potwierdzenie połączenia |
| `notification` | gospodarstwo | Nowa notyfikacja (zapis DB + broadcast) |
| `newMessage` | recipient | Nowa wiadomość czatu |
| `invitation` | host | Sygnał zaproszenia (gdy inmate inicjuje flow) |
| `initial_budget` | gospodarstwo | Broadcast init budżetu |
| `balance_update` | gospodarstwo | Nowe saldo domu |
| `error` | user | Błąd po stronie WS / operacji powiązanej |

Payload: obiekt `data` zależny od typu (np. `houseId`, `newBalance`, treść wiadomości). Klient nie definiuje osobnego „room API” w kontrakcie docs — adresowanie jest po `userId` / członkach `householdUsers`.

### Model push

- **`broadcastMessage(userId, { type, data })`** — jeden użytkownik.
- **`broadcastToHousehold(houseId, { type, data })`** — wszyscy członkowie domu z aktywnym socketem (norma docs; as-is w kodzie: historyczna nazwa `broadcastToHouseMates` — rename w R1 / major BE Krok 5.3).

Klient może emitować standardowe zdarzenia cyklu życia Socket.io (`disconnect`); biznesowe eventy wychodzące z przeglądarki nie są osobnym katalogiem kontraktu v1 poza flow HTTP, które **wyzwala** push.

---

## Powierzchnia e-mail

### As-is

- E-mail jest **identyfikatorem konta** w HTTP (`signup`, `login`, `changemail`) i w modelu użytkownika.
- Zależność `nodemailer` jest w `package.json`, ale **brak implementacji wysyłki** (brak użycia transportera w kodzie).
- Zaproszenia i powiadomienia idą dziś przez **HTTP + WebSocket / zapis notice**, nie przez skrzynkę mailową.

### Kierunek (planowany kontrakt wychodzący)

Docelowo e-mail jako kanał wychodzący, w pierwszej kolejności pod **zaproszenia do gospodarstwa** (i ewentualnie krytyczne powiadomienia — do decyzji przy implementacji).

Szkic kontraktu (niezaimplementowany):

| Element | Propozycja normy |
|---------|------------------|
| Trigger | Akcja zaproszenia (po walidacji HTTP) |
| Adresat | E-mail zaproszonego użytkownika / kandydat |
| Treść | Link lub instrukcja dołączenia + kontekst domu |
| Idempotencja / retry | Do ustalenia przy implementacji |
| Sekrety | SMTP / provider wyłącznie w env backendu |

Do czasu wdrożenia: klient **nie** polega na mailu jako jedynym kanale zaproszenia.

---

## Świadome poza zakresem tego dokumentu

- Pełny dump OpenAPI / wszystkich pól Swagger 1:1.
- Semantyka cron (`tasks/`) jako API.
- Zmiana mechanizmu auth (refresh token, Bearer-only).
- Publiczne webhooki.

## Powiązane kierunki refaktoru (komunikacja)

| Temat | Działanie |
|-------|-----------|
| Prefiks `/api/v1` | Montaż v1 (+ dual mount legacy do cutoveru SPA) + update klienta; potem usunięcie legacy |
| R1 role | `mate` → `inmate`, grupa `mates` → spójna nazwa |
| OCR | Rozważyć obowiązkowy JWT — [bezpieczenstwo.md](./bezpieczenstwo.md) |
| Envelope / i18n | Klucze — [i18n_kontrakt_ui.md](./i18n_kontrakt_ui.md) |
| E-mail outbound | Implementacja wg sekcji kierunku; SMTP w [katalog_env.md](./katalog_env.md) |

Przepływy E2E: [data_flow.md](./data_flow.md).
