---
wersja: 10
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-27
---

# Katalog zmiennych środowiskowych — Home Budget Manager

## Cel

Spis konfiguracji i sekretów **bez wartości**. Uzupełnia [deployment.md](./deployment.md) i [bezpieczenstwo.md](./bezpieczenstwo.md).  
Źródła: katalog procesu `backend/` (`process.env`), `frontend/` (Vite `VITE_*` przy build), `docker-compose.yml`, outbound e-mail (`configs/mailTransport.js`).

**Zasada:** wartości tylko w lokalnym `.env` / na hoście / menedżerze sekretów (Vault) — **nigdy w git**.

## Backend (wymagane / używane w kodzie)

| Zmienna | Sekret? | Opis |
|---------|---------|------|
| `SERV_PORT` | Nie | Port HTTP API (domyślnie `5053`, jeśli brak) |
| `JWT_SECRET` | **Tak** | Sekret podpisu JWT (`SESSID`) |
| `DB_HOST` | Nie* | Host MySQL (`main_db` w prod compose); as-is / składanie URL |
| `DB_USER` | **Tak** | Użytkownik DB |
| `DB_PASSWORD` | **Tak** | Hasło DB |
| `DB_NAME` | Nie* | Nazwa bazy |
| `DATABASE_URL` | **Tak** | Connection string MySQL dla **Prisma** (Client + Migrate) — **wymagany** w runtime i przy migracjach |

\* Sam host/nazwa bazy zwykle nie są „hasłem”, ale nie publikuj schematu prod bez potrzeby.

Prisma czyta `DATABASE_URL` (R6 wdrożone). Pola `DB_*` mogą zostać w compose / do składania URL — **bez** równoległego raw-SQL poola.

**Sync 2026-11-24:** `DATABASE_URL` to norma bieżąca, nie „po R6 w przyszłości”.

Plik typowy: `backend/.env` (local) lub montowany volume w kontenerze (prod).

## Origin API / SPA (runtime backend + build frontu)

| Zmienna | Sekret? | Opis |
|---------|---------|------|
| `DB_HOST` | Nie* | Nadpisanie hosta DB dla kontenera backendu (compose) |
| `BACKEND_ORIGIN` | Nie | Publiczny origin API — backend (`.env` / Vault); **to samo źródło** mapowane na build-arg frontu |
| `FRONTEND_ORIGIN` | Nie | Publiczny origin SPA — backend (maile / spójność ops) |

Uwaga: CORS trzyma listę originów w `backend/configs/allowedOrigins.js` (HTTP Express + Socket.io) — przy zmianie domeny zaktualizuj **i** Vault/`.env`, **i** tę whitelistę.

## E-mail outbound (opcjonalne)

Adapter SMTP: `backend/configs/mailTransport.js` (`getMailTransporter`).  
Bez `SMTP_HOST` / `SMTP_USER` / `SMTP_PASSWORD` transporter = `null` (produkt działa bez skrzynki). Przykład nazw: `backend/.env.example`.

| Zmienna | Sekret? | Opis |
|---------|---------|------|
| `SMTP_HOST` | Nie* | Host SMTP / provider — wymagany, żeby utworzyć transporter |
| `SMTP_PORT` | Nie | Port (domyślnie `587`; `465` → TLS od razu) |
| `SMTP_USER` | **Tak** | Konto SMTP — wymagane wraz z host/hasłem |
| `SMTP_PASSWORD` | **Tak** | Hasło / app password — nie logować |
| `MAIL_FROM` | Nie | Adres nadawcy w wiadomości (gdy treść maila jest wysyłana) |

`FRONTEND_ORIGIN` (tabela Compose powyżej) — publiczny origin SPA, m.in. pod link dołączenia w treści zaproszenia; w local można ustawić też w `backend/.env`.

Zmienne SMTP mogą nie istnieć w `.env` — wtedy outbound jest no-op.

## Frontend (build-time Vite)

SPA nie ładuje sekretów. Origin API/socket jest wbijany przy `vite build` / `vite` (dev):

| Zmienna | Sekret? | Opis |
|---------|---------|------|
| `VITE_BACKEND_ORIGIN` | Nie | Publiczny origin API (= wartość Vault/`BACKEND_ORIGIN`). Używany w `frontend/src/url.js` jako `serverUrl` i `socketPath` |

- **Local:** `frontend/.env` (wzór: `frontend/.env.example`).
- **Deploy (VPS / homelab):** uniwersalny job Jenkins zapisuje Vault → `.env` w rootcie projektu, potem `docker compose up -d --build`. Compose mapuje `BACKEND_ORIGIN` → build-arg `VITE_BACKEND_ORIGIN` (**bez** osobnego kroku w Jenkinsie).
- W Vault wystarczy klucz `BACKEND_ORIGIN` (nie trzeba duplikować `VITE_BACKEND_ORIGIN`).
- Zmiana originu wymaga **przebudowy** obrazu frontu (`--build`); sam recreate kontenera nie wystarczy.
- Nie wkładać haseł / `JWT_*` / DB do `VITE_*`.

## Czego ten katalog nie obejmuje

- Tokenów CI / Jenkins (poza zakresem tego pliku — decyzja utrzymaniowa).
- Wartości przykładowych haseł.
- Pełnej listy originów hardcodowanych w JS (patrz kod + tabela compose powyżej).

## Checklist przy nowym środowisku

1. Uzupełnij wszystkie pozycje z sekcji Backend.  
2. Ustaw `BACKEND_ORIGIN` / `FRONTEND_ORIGIN` w Vault; front przy deployu bierze `BACKEND_ORIGIN` przez compose build-arg. CORS w sync.  
3. Potwierdź, że `.env` / sekrety **nie** trafiają do commitów.  
4. Jeśli chcesz outbound mail: ustaw `SMTP_*` (+ opcjonalnie `MAIL_FROM` / `FRONTEND_ORIGIN`) i nie loguj haseł SMTP.
