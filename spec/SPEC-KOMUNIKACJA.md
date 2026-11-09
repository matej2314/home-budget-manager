---
wersja: 1
data_utworzenia: 2026-11-09
data_modyfikacji: 2026-11-09
---

# SPEC — Komunikacja (I/O)

## Cel / zakres względem dokumentacji

Norma implementacji **powierzchni komunikacji** aplikacji z otoczeniem: HTTP/REST (w tym multipart), WebSocket (Socket.io) oraz e-mail wychodzący (gdy wdrażany).

Uszczegóławia: [docs/dokumentacja_komunikacji.md](../docs/dokumentacja_komunikacji.md), spójnie z [docs/data_flow.md](../docs/data_flow.md), [docs/i18n_kontrakt_ui.md](../docs/i18n_kontrakt_ui.md), [docs/bezpieczenstwo.md](../docs/bezpieczenstwo.md).  
Pipeline warstw HTTP → [SPEC-BACKEND.md](./SPEC-BACKEND.md). Auth/role/uploady w szczegółach → [SPEC-BEZPIECZENSTWO.md](./SPEC-BEZPIECZENSTWO.md).

Ten SPEC **nie** dubluje pełnej tabeli endpointów z docs — egzekwuje reguły kontraktu przy kodowaniu i refaktorze.

## Wiążący styl z docs

| Ustalenie | Egzekwowanie |
|-----------|--------------|
| Powierzchnie v1 | HTTP + Socket.io + e-mail (kierunek outbound); cron / webhooki / broker / CLI **nie** są powierzchnią produktu |
| Prefiks HTTP | Wszystkie ścieżki API pod **`/api/v1`** (norma docs; as-is bez prefiksu = do refaktoru) |
| Pipeline | Route → controller → service → `database`/Prisma — jak SPEC-BACKEND |
| Wyjątek vs styl globalny | **Brak** — I/O nie wprowadza osobnego stylu warstw |

## Wymagania egzekwowalne

### HTTP — kontrakt wspólny

K-1. Każdy endpoint HTTP montowany i wołany wyłącznie pod prefiksem `/api/v1/...`. Nowe ścieżki bez prefiksu są niedozwolone.

K-2. Envelope odpowiedzi:

- sukces: `{ status: "success", message: <messageKey>, …pola danych }`
- błąd: `{ status: "error", message: <messageKey> }` (+ pola uzgodnione w kontrakcie, jeśli potrzeba)

`message` = **klucz i18n** (zgodnie z kierunkiem docs / `messageKey` z B-10 w SPEC-BACKEND), nie finalny tekst marketingowy w jednym języku.

K-3. Semantyka statusów HTTP (praktyka normy):

| HTTP | Znaczenie |
|------|-----------|
| 400 | Walidacja / złe wejście |
| 401 | Brak lub nieważny `SESSID` |
| 403 | Rola niewystarczająca |
| 404 | Zasób / nieznana ścieżka w handlerze |
| 409 | Konflikt (np. zajęty e-mail) |
| 500 | Błąd serwera |

K-4. Auth na chronionych zasobach: cookie **`SESSID`** (JWT). Klient z `credentials: true`; CORS z whitelistą originów. Szczegóły cookie/ról → SPEC-BEZPIECZENSTWO.

K-5. Handler HTTP pozostaje cienki: walidacja brzegu, wywołanie service, mapowanie błędu B-10 → status + envelope. Bez reguł biznesowych i bez Prisma w controllerze.

K-6. Swagger UI może istnieć jako pomoc operatorska/dev. **Źródłem normy** kontraktu są docs + ten SPEC — nie niekompletny Swagger.

### HTTP — multipart

K-7. Upload wyłącznie przez ustalone pola multipart (m.in. `receipt`, awatar, galeria) i pipeline Multer na brzegu HTTP.

K-8. **OCR** (`POST /api/v1/receipt/…`): wymaga ważnego JWT w cookie `SESSID`. Publiczny OCR bez sesji jest zabroniony w normie (zmiana względem historycznego as-is bez `verifyJWT`).

### WebSocket (Socket.io)

K-9. Transport: Socket.io w tym samym procesie API. Auth handshake: cookie `SESSID`; brak / nieważny token → odrzucenie połączenia.

K-10. Dozwolone zdarzenia serwer → klient (norma docs): m.in. `connect_success`, `notification`, `newMessage`, `invitation`, `initial_budget`, `balance_update`, `error`. Payload w obiekcie `data` zależnym od typu.

K-11. Adresowanie push wyłącznie przez:

- `broadcastMessage(userId, { type, data })`
- `broadcastToHouseMates(houseId, { type, data })`

Zakaz zmyślania osobnego „room API” / eventów spoza ustalonego katalogu bez aktualizacji docs i tego SPEC.

K-12. Biznesowy push jest **skutkiem ubocznym** przepływu HTTP/service (lub uzgodnionego flow w docs). Klient v1 nie definiuje osobnego katalogu emitów biznesowych poza cyklem życia Socket.io (`disconnect` itd.).

### E-mail outbound

K-13. Do czasu wdrożenia outbound: zaproszenia i powiadomienia idą HTTP + WS / notice. **Nie wolno** opierać produktu na e-mailu jako jedynym kanale zaproszenia.

K-14. Gdy wdrażany outbound (norma):

| Element | Reguła |
|---------|--------|
| Trigger | Po walidacji HTTP operacji zaproszenia (service) |
| Adresat | E-mail zaproszonego / kandydata |
| Treść | Link lub instrukcja dołączenia + kontekst domu |
| Transport | np. nodemailer; sekrety SMTP wyłącznie w env ([docs/katalog_env.md](../docs/katalog_env.md)) |
| Idempotencja / retry | Bez rozbudowanej normy w tym SPEC — nie blokuje pierwszego wdrożenia; szczegóły przy implementacji bez sprzeczności z docs |

## Wzorce projektowe i struktura

| Wymagane / dozwolone | Sens |
|----------------------|------|
| Kontrakt-first HTTP | Prefiks, envelope, statusy — spójne z docs |
| Cienka granica HTTP | Controller mapuje; service orkiestruje + może wyzwalać WS/mail |
| Adapter WS w procesie | Socket.io jak w architekturze; bez osobnego serwisu realtime v1 |
| Multipart na brzegu | Multer → dalej service (OCR, awatar, galeria) |
| Mail jako adapter wychodzący | Wywołanie z service po sukcesie reguł zaproszenia |

## Wolno

- Refaktorować montowanie routera i klienta SPA na `/api/v1`.
- Emisować ustalone eventy WS po mutacjach (transakcja → `balance_update` / `notification`, wiadomość → `newMessage`, itd. wg docs).
- Dodać nodemailer pod K-14 przy wdrożeniu outbound.
- Utrzymywać Swagger jako pomoc, o ile nie staje się sprzeczny z normą bez aktualizacji.

## Nie wolno

- Nowych ścieżek API poza `/api/v1`.
- Eventów / roomów WS spoza katalogu docs bez zmiany normy.
- Publicznego OCR bez `SESSID`.
- Traktowania e-maila jako jedynego kanału zaproszenia przed wdrożeniem K-14.
- Wprowadzania webhooków publicznych, brokera kolejek ani CLI jako powierzchni produktu w v1 tego SPEC.
- Uznawania Swaggera za nadrzędne źródło kontraktu względem docs/SPEC.

## Zatwierdzony stack (obszar)

| Element | Status |
|---------|--------|
| Express (HTTP) | Tak |
| Socket.io | Tak |
| multer (multipart) | Tak |
| nodemailer | Tak — gdy outbound (K-14) |

Poza zakresem v1 tego SPEC (nie jako „zakaz na zawsze” produktu): GraphQL, gRPC, SSE zamiast Socket.io, BFF.

## Kryteria akceptacji (obserwowalne)

- [ ] Klient i serwer wołają chronione/publiczne API pod `/api/v1/...`.
- [ ] Odpowiedzi sukces/błąd mają `status` + `message` (klucz); błędy mapują się na statusy z K-3.
- [ ] `POST` OCR bez ważnego `SESSID` → 401 (lub równoważna odmowa auth).
- [ ] Po mutacji wyzwalającej push klient otrzymuje ustalony `type` (np. `balance_update` / `newMessage`) bez custom room API.
- [ ] Handshake WS bez cookie sesji jest odrzucany.
- [ ] Przed wdrożeniem maila: flow zaproszenia działa bez skrzynki; po wdrożeniu — wysyłka po walidacji HTTP, sekrety tylko w env.

## Poza zakresem tego SPEC

- Pełny dump OpenAPI / pól Swagger 1:1.
- Semantyka `tasks/` (cron) jako zewnętrzne API.
- Zmiana mechanizmu auth na Bearer-only / refresh token.
- Szczegóły warstw Prisma / katalogów services → SPEC-BACKEND.
- Strategia testów kontraktu → SPEC-TESTY.
- Pełna migracja i18n namespace `api` po stronie SPA → SPEC-FRONTEND / [docs/i18n_kontrakt_ui.md](../docs/i18n_kontrakt_ui.md).
