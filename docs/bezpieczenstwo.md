---
wersja: 5
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-24
---

# Bezpieczeństwo — Home Budget Manager

## Cel

Normy zabezpieczeń na granicy systemu i w rdzeniu auth/autoryzacji. Uzupełnia [architektura.md](./architektura.md), [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md) i [anty_patterny.md](./anty_patterny.md) — bez playbooka pentestu.

## Granica zaufania

| Strefa | Poziom zaufania | Konsekwencja |
|--------|-----------------|--------------|
| Przeglądarka / SPA | **Niezaufana** | Ukrycie UI ≠ uprawnienie |
| API Express | **Granica egzekwowania** | JWT + role na chronionych operacjach |
| MySQL | Zaufany magazyn w sieci prywatnej hosta | Brak ekspozycji DB na publiczny internet w normie prod |
| WebSocket | Ta sama tożsamość co HTTP | Auth na handshake (`SESSID`) |

Klient nigdy nie jest źródłem prawdy dla roli ani membershipu gospodarstwa.

## Uwierzytelnianie

| Norma | Opis |
|-------|------|
| Mechanizm | JWT w cookie **`SESSID`** |
| Cookie | `httpOnly: true`, `secure: true`, `sameSite: 'lax'` |
| Hasła | **bcrypt** przy zapisie / weryfikacji |
| Logout | Unieważnienie sesji po stronie klienta (czyszczenie cookie) wg API logout |
| Prefiks | Chronione zasoby pod `/api/v1/...` |

Nie wprowadzamy w v1 osobnego refresh-token flow ani Bearer-only jako domyślnego mechanizmu web.

## Autoryzacja (role)

Role normatywne: `user`, `host`, `inmate`, `superadmin`.

| Zasada | Opis |
|--------|------|
| Egzekucja | Middleware po JWT — **zawsze na API**, nie tylko w React |
| Host | Zarządzanie składem (usuń domownika; accept/decline; **dodanie kandydata od razu**); kasowanie **wszystkich** transakcji domu |
| Inmate | Rdzeń finansów / chat; może **inicjować** zaproszenie (pending); kasuje **tylko własne** transakcje; bez accept/decline i bez usuwania członków |
| Superadmin | Otoczka operacyjna — nie mylić z hostem gospodarstwa |
| Publiczne | Wyłącznie świadomie (np. login/signup, health, wybrane GET otoczki) |

**Authz delete transakcji (API):** brak uprawnień → **403** + klucz i18n; brak zasobu / zły dom → **404**. UI ukrywa przyciski, ale nie zastępuje API.

**Pending invite:** WS `invitation` + trwały notice dla hosta; kolekcja hosta = pending; status po decyzji = log w DB.

## Nagłówki HTTP (Helmet)

| Norma | Opis |
|-------|------|
| Biblioteka | **helmet** na aplikacji Express (`app.use(helmet())` w fabryce `backend/app.js`) |
| Cel | Sensowne domyślne nagłówki bezpieczeństwa HTTP (XSS/clickjacking/MIME itd. wg domyślnej polityki helmet) |
| Zakres | Hardening odpowiedzi HTTP API — **nie** zastępuje JWT, ról, CORS ani walidacji uploadów |

Helmet jest zamontowany na brzegu HTTP; nie zastępuje JWT, ról ani CORS.

## CORS

Whitelist originów (prod + local Vite oraz ustalone hosty). Żądania z credentialami tylko z dozwolonych originów. Nie używać `*` przy `credentials: true`.

## Uploady i OCR

| Norma | Opis |
|-------|------|
| Auth | Endpointy uploadu i **OCR** wymagają ważnego `SESSID` (oraz sensownej roli, gdy dotyczy rdzenia domu) |
| Wejście | Multipart tylko przez ustalone pola (`receipt`, awatar, galeria) |
| Treść | Walidacja typu/rozmiaru po stronie multer; nie ufać rozszerzeniu z klienta |
| OCR | Kosztowny CPU — nie wystawiać anonimowo (patrz anty-pattern publicznego OCR) |

## WebSocket

- Handshake z cookie `SESSID`; brak tokenu → odrzucenie połączenia.
- Emit zdarzeń tylko do adresatów wynikających z membership / recipientId — bez „broadcast do świata”.
- Nie opierać autoryzacji wyłącznie na tym, że klient „zna” `houseId` w payloadzie bez sprawdzenia po stronie serwera przy operacjach HTTP.

## Sekrety i logi

| Norma | Opis |
|-------|------|
| Git | Brak `.env`, haseł, `JWT_SECRET`, tokenów Jenkins |
| Runtime | Sekrety na hoście / w secrets CI (`deployment.md`) |
| Logi | Bez haseł, bez pełnych JWT, bez zbędnych PII w cleartext (`observability.md`) |

## Health

`GET /api/v1/health` jest publiczny z założenia (liveness). Nie zwraca sekretów ani szczegółów infrastruktury.

## Świadomie poza zakresem v1

- Rate limiting / lockout po nieudanych logowaniach
- WAF, bot management
- Pełny model STRIDE / raport pentestu
- Sentry / vendor APM
- Hardening phpMyAdmin (osobny temat ops)

## Szybka checklista review

1. Nowy endpoint: JWT? właściwa rola?  
2. Upload/OCR: niepubliczne?  
3. Reguła tylko na froncie? → odrzuć.  
4. Log / błąd: czy nie wycieka sekret?  
5. CORS: nowy origin na whitelistcie świadomie?  
6. Helmet zamontowany na app Express (norma docelowa)?
