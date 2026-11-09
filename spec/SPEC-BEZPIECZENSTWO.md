---
wersja: 1
data_utworzenia: 2026-11-09
data_modyfikacji: 2026-11-09
---

# SPEC — Bezpieczeństwo

## Cel / zakres względem dokumentacji

Norma implementacji **uwierzytelniania, autoryzacji, CORS, nagłówków HTTP (helmet), uploadów/OCR oraz ochrony sekretów** na granicy API i WebSocket.

Uszczegóławia: [docs/bezpieczenstwo.md](../docs/bezpieczenstwo.md), spójnie z [docs/dokumentacja_komunikacji.md](../docs/dokumentacja_komunikacji.md), [docs/anty_patterny.md](../docs/anty_patterny.md), [docs/observability.md](../docs/observability.md).  
Warstwy Express → [SPEC-BACKEND.md](./SPEC-BACKEND.md). Kontrakt I/O → [SPEC-KOMUNIKACJA.md](./SPEC-KOMUNIKACJA.md). UI nie egzekwuje ról → [SPEC-FRONTEND.md](./SPEC-FRONTEND.md).

## Wiążący styl z docs

| Ustalenie | Egzekwowanie |
|-----------|--------------|
| Granica zaufania | SPA **niezaufana**; egzekucja JWT + ról **w API** |
| Auth v1 | JWT w cookie **`SESSID`** (`httpOnly`, `secure`, `sameSite: 'lax'`) |
| Role | `user` \| `host` \| `inmate` \| `superadmin` (R1: nie `mate`) |
| Cross-cutting | Middleware na routes w **tym samym** pipeline warstw — nie osobny styl architektury |
| Wyjątek vs styl globalny | **Brak** |

## Wymagania egzekwowalne

### Uwierzytelnianie

S-1. Chronione zasoby HTTP wymagają ważnego cookie `SESSID` (JWT). Publiczne ścieżki wyłącznie świadomie (m.in. signup/login, health, wybrane GET otoczki) — lista sensu w docs komunikacji.

S-2. Opcje cookie przy ustawianiu sesji: `httpOnly: true`, `secure: true`, `sameSite: 'lax'`.

S-3. Hasła: **bcrypt** przy zapisie i weryfikacji. Zakaz przechowywania / logowania haseł w cleartext.

S-4. Logout: czyszczenie / unieważnienie sesji cookie zgodnie z API logout.

S-5. Domyslny mechanizm web v1: cookie `SESSID`. **Nie** wprowadzać refresh-token flow ani Bearer-only jako domyślnego zamiennika w tym SPEC.

### Autoryzacja

S-6. Po JWT: middleware weryfikacji **roli** na każdym chronionym endpoincie. Nie kopiować ad hoc sprawdzeń auth w każdym handlerze zamiast wspólnego middleware.

S-7. Nazwa roli domownika w tokenie, middleware, komunikatach i nowym kodzie: wyłącznie **`inmate`**. Zakaz `mate` oraz grupy `mates` w refaktorowanym kodzie — spójne grupy uprawnień pod normę docs (`host | inmate` itd.).

S-8. Reguły produktowe:
- `host` — zarządzanie składem domu (usuń domownika, akceptacja/odrzucenie zaproszeń wg kontraktu);
- `inmate` — rdzeń finansów / chat **bez** uprawnień hosta do składu;
- `superadmin` — otoczka operacyjna witryny; **≠** host gospodarstwa;
- `user` — bez gospodarstwa; bez rdzenia budżetowego.

S-9. Membership i uprawnienia do `houseId` / zasobów domu weryfikuje **serwer** (service / warstwa danych). Nie ufać samemu faktowi, że klient przesłał `houseId` w body.

### Helmet i CORS

S-10. Aplikacja Express montuje **helmet** (stan docelowy), np. `app.use(helmet())` lub równoważna konfiguracja domyślnych nagłówków bezpieczeństwa. Helmet **nie** zastępuje JWT, ról, CORS ani walidacji uploadów.

S-11. CORS: whitelist originów (prod + local Vite + ustalone hosty). Żądania z credentials tylko z whitelisty. Zakaz `Access-Control-Allow-Origin: *` przy `credentials: true`.

### Uploady i OCR

S-12. Endpointy uploadu (awatar, galeria, …) oraz **OCR** wymagają ważnego `SESSID` (oraz sensownej roli, gdy dotyczy rdzenia domu). Publiczny OCR / anonimowy upload — zabronione.

S-13. Multipart tylko przez ustalone pola; walidacja typu/rozmiaru po stronie multer — nie ufać rozszerzeniu z klienta.

### WebSocket

S-14. Handshake Socket.io z cookie `SESSID`; brak / nieważny token → odrzucenie połączenia.

S-15. Emit tylko do adresatów wynikających z membership / `recipientId` — bez broadcastu „do świata”. Autoryzacja operacji biznesowych nadal po stronie HTTP/service, nie wyłącznie po „znajomości” `houseId` w payloadzie WS.

### Sekrety i logi

S-16. W git: brak `.env`, haseł, `JWT_SECRET`, tokenów CI/Jenkins. Runtime: sekrety na hoście / w secrets CI.

S-17. Logi (stdout, SPEC-BACKEND): bez haseł, bez pełnych JWT, bez zbędnych PII w cleartext.

### Health

S-18. `GET /api/v1/health` pozostaje publiczny (liveness) i **nie** zwraca sekretów ani szczegółów infrastruktury.

## Wzorce projektowe i struktura

| Wymagane / dozwolone | Sens |
|----------------------|------|
| Middleware authz na brzegu HTTP | Jedna ścieżka weryfikacji JWT + roli |
| Reguły membership w services | Spójność z danymi; brak zaufania do klienta |
| Helmet na app | Domyślne nagłówki HTTP |
| Ten sam identity HTTP ↔ WS | Cookie `SESSID` |

## Wolno

- Refaktor R1 (`mate` → `inmate`) w tokenie, middleware, UI i komunikatach.
- Dostosować konfigurację helmet, o ile nie osłabia domyślnej ochrony bez uzasadnienia w docs/SPEC.
- Trzymać listę originów CORS w konfiguracji serwera + env/compose spójnie z docs.

## Nie wolno

- Egzekwować uprawnień wyłącznie w React.
- Publicznego OCR / uploadu bez `SESSID`.
- CORS `*` z credentials.
- Sekretów w repozytorium.
- Logowania haseł / pełnych tokenów.
- Uznawać `superadmin` za hosta gospodarstwa.
- Wprowadzać Bearer-only / refresh jako domyślny auth web v1 w tym obszarze.

## Zatwierdzony stack (obszar)

| Element | Status |
|---------|--------|
| JWT w cookie `SESSID` | Tak |
| bcrypt | Tak |
| Middleware Express (`verifyJWT`, role) | Tak |
| CORS (whitelist) | Tak |
| **helmet** | Tak (docelowo na app Express) |

## Kryteria akceptacji (obserwowalne)

- [ ] Chroniony endpoint bez `SESSID` → 401; z złą rolą → 403.
- [ ] OCR / upload bez sesji → odmowa auth.
- [ ] W refaktorowanym kodzie brak `mate` / `mates` — jest `inmate` i spójne grupy.
- [ ] Odpowiedzi API zawierają nagłówki ustawiane przez helmet (stan po wdrożeniu S-10).
- [ ] CORS z nieznanego originu przy credentials nie przechodzi jak z whitelisty.
- [ ] WS bez cookie sesji nie nawiązuje autoryzowanej sesji aplikacji.
- [ ] `GET /api/v1/health` bez auth, bez sekretów w body.
- [ ] Repo bez committed `.env` / `JWT_SECRET`.

## Poza zakresem tego SPEC

- Rate limiting / lockout po nieudanych logowaniach.
- 2FA, WAF, bot management.
- Pełny model STRIDE / playbook pentestu.
- Sentry / vendor APM.
- Hardening phpMyAdmin (ops).
- Szczegóły envelope i listy endpointów → SPEC-KOMUNIKACJA.
- Prisma / warstwy → SPEC-BACKEND.
