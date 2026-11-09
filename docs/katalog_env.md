---
wersja: 5
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-09
---

# Katalog zmiennych środowiskowych — Home Budget Manager

## Cel

Spis konfiguracji i sekretów **bez wartości**. Uzupełnia [deployment.md](./deployment.md) i [bezpieczenstwo.md](./bezpieczenstwo.md).  
Źródła: katalog procesu `backend/` (`process.env`), `docker-compose.yml`, kierunek e-mail outbound.

**Zasada:** wartości tylko w lokalnym `.env` / na hoście prod / menedżerze sekretów — **nigdy w git**.

## Backend (wymagane / używane w kodzie)

| Zmienna | Sekret? | Opis |
|---------|---------|------|
| `SERV_PORT` | Nie | Port HTTP API (domyślnie `5053`, jeśli brak) |
| `JWT_SECRET` | **Tak** | Sekret podpisu JWT (`SESSID`) |
| `DB_HOST` | Nie* | Host MySQL (`main_db` w prod compose); as-is / składanie URL |
| `DB_USER` | **Tak** | Użytkownik DB |
| `DB_PASSWORD` | **Tak** | Hasło DB |
| `DB_NAME` | Nie* | Nazwa bazy |
| `DATABASE_URL` | **Tak** | Connection string MySQL dla **Prisma** (Client + Migrate); stan docelowy po R6 — wymagany do runtime i migracji |

\* Sam host/nazwa bazy zwykle nie są „hasłem”, ale nie publikuj schematu prod bez potrzeby.

Po R6: Prisma czyta `DATABASE_URL`. Pola `DB_*` mogą zostać przejściowo (compose / legacy) albo zostać zmapowane wyłącznie do budowy URL — bez drugiego, równoległego raw-SQL poola.

Plik typowy: `backend/.env` (local) lub montowany volume w kontenerze (prod).

## Compose / origin (production)

Ustawiane w `docker-compose.yml` (lub nadpisywane env hosta):

| Zmienna | Sekret? | Opis |
|---------|---------|------|
| `DB_HOST` | Nie* | Nadpisanie hosta DB dla kontenera backendu |
| `BACKEND_ORIGIN` | Nie | Publiczny origin API (np. domena API) |
| `FRONTEND_ORIGIN` | Nie | Publiczny origin SPA |

Uwaga: CORS w kodzie trzyma też listę originów w `server.js` / websocket — przy zmianie domeny zaktualizuj **i** env/compose, **i** whitelist w kodzie.

## E-mail outbound (kierunek — jeszcze nieużywane w kodzie)

Placeholdery pod przyszłą wysyłkę (np. zaproszenia). Nazwy robocze — do ustalenia przy implementacji:

| Zmienna | Sekret? | Opis |
|---------|---------|------|
| `SMTP_HOST` | Nie* | Host SMTP / provider |
| `SMTP_PORT` | Nie | Port |
| `SMTP_USER` | **Tak** | Konto SMTP |
| `SMTP_PASSWORD` | **Tak** | Hasło / app password |
| `MAIL_FROM` | Nie | Adres nadawcy widoczny dla odbiorcy |

Do czasu wdrożenia kanału e-mail zmienne mogą nie istnieć w `.env`.

## Frontend

Build/runtime SPA **nie** wymaga osobnego katalogu sekretów w normie v1: URL API/socket jest w kodzie (`url.js`) lub build-time. Nie trzymać sekretów w `VITE_*` / bundlu klienta.

## Czego ten katalog nie obejmuje

- Tokenów CI / Jenkins (poza zakresem tego pliku — decyzja utrzymaniowa).
- Wartości przykładowych haseł.
- Pełnej listy originów hardcodowanych w JS (patrz kod + tabela compose powyżej).

## Checklist przy nowym środowisku

1. Uzupełnij wszystkie pozycje z sekcji Backend.  
2. Ustaw origin front/API spójnie z CORS i `url.js`.  
3. Potwierdź, że `.env` / sekrety **nie** trafiają do commitów.  
4. Po wdrożeniu e-maila — dodaj SMTP_* / `MAIL_FROM` i nie loguj haseł.
