# Home Budget Manager — major plan (frontend)

**Źródła:** `docs/` oraz `spec/SPEC-*.md` (przede wszystkim SPEC-FRONTEND, SPEC-KOMUNIKACJA, SPEC-BEZPIECZENSTWO; uzupełniająco docs architektury, i18n, anty-patterny).  
**Zakres tego pliku:** wyłącznie frontend (`frontend/`) — aktualizacja zależności, porządek SPA (R5), model stanu, kontrakt klienta HTTP/WS, R1 w UI, i18n `message`, granica zaufania klienta — do stanu docelowego z dokumentacji i SPEC.  
**Poza planem:** backend (`backend/`), Vitest / RTL / E2E UI, React Query / SWR, BFF, wymuszona architektura `features/<name>/`, playbook CI/Jenkins, usunięcie legacy mount HTTP po stronie API.  
**Spójność z major backend:** ten plik zamyka stronę klienta względem `home-budget-manager_major_plan-backend.md` (m.in. przejście SPA na `/api/v1` oraz R1 w UI). Fazy 1–3 mogą iść równolegle do prac backendu; Fazy 4–5 mają bramki zewnętrzne opisane w DoD milestone’ów.

**Statusy (fazy / kroki):** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`  
**Milestone:** domyślnie bez statusu; po spełnieniu DoD → wyłącznie `OSIĄGNIĘTY`  
**Milestone zamykający całość:** nie — bramki tylko między fazami.

### Założenie as-is vs docs

Dokumentacja i SPEC opisują **stan docelowy**. Kod w `frontend/` może się różnić (m.in. ścieżki API bez `/api/v1`, rola `mate`, brak namespace `api`). Ten major planuje dojście do normy docs/SPEC — nie utrwalanie as-is.

### Testy UI

Zgodnie z `docs/testy.md` i SPEC-TESTY: testy przeglądarkowe / Vitest / RTL świadomie **poza** strategią v1. Ten major **nie** wprowadza fazy piramidy testów UI.

---

## Faza 1 — Aktualizacja zależności frontendu

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Pierwszy etap prac SPA: inwentaryzacja zależności z lockfile / manifestu w `frontend/` oraz aktualizacja do możliwie najnowszych wersji w granicach zatwierdzonego stacku z docs / SPEC-FRONTEND (React, Vite, React Router, Zustand, Context, i18next, socket.io-client). Cel: dalszy refaktor startuje na aktualnym fundamencie zależności, a nie na historycznym zestawie. Faza może biec równolegle do prac backendu.

**DoD (faza):**

- Zależności frontendu są zaktualizowane względem stanu wyjściowego lockfile i mieszczą się w stacku docs/SPEC-FRONTEND.
- SPA da się uruchomić po upgrade w środowisku deweloperskim / lokalnym zgodnym z docs deployment.
- Brak otwartego sporu „czy upgrade jest domknięty przed Fazą 2”.

### Krok 1.1 — Inwentaryzacja zależności

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Spis zależności produkcyjnych i deweloperskich z `frontend/package.json` / lockfile oraz oznaczenie pozycji sprzecznych z normą docelową (m.in. biblioteki server-state poza stackiem v1, jeśli występują).

**DoD (krok):**

- Jest jawna lista zależności wyjściowych i pozycji do podniesienia / usunięcia względem normy docs/SPEC-FRONTEND.
- Pozycje poza stackiem docelowym są nazwane przed upgrade.

### Krok 1.2 — Aktualizacja wersji i weryfikacja uruchamialności

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Podniesienie zależności do możliwie najnowszych wersji zgodnych ze stackiem docs/SPEC oraz potwierdzenie, że SPA startuje i ładuje krytyczne ścieżki UI po upgrade.

**DoD (krok):**

- Lockfile / manifest odzwierciedlają zaktualizowane wersje.
- Frontend uruchamia się lokalnie; krytyczne odmowy startu (brakujące moduły, konflikt peer) są usunięte.
- Brak wprowadzenia React Query / SWR / analogów server-state „przy okazji” upgrade.

---

## MILESTONE — Frontend na zaktualizowanych zależnościach

**Opis:** Bramka po Fazie 1. Zależności SPA są domknięte; wolno wchodzić w porządek katalogów i granic UI.

**DoD (milestone):**

- Faza 1 ma status `WYKONANY` (lub wszystkie obowiązkowe DoD jej kroków są spełnione).
- Frontend działa na zaktualizowanych zależnościach zgodnych ze stackiem docs/SPEC.
- Prowadzący prace akceptuje start Fazy 2.

---

## Faza 2 — Układ SPA (R5) + granice prezentacja vs orkiestracja

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Porządek katalogów i odpowiedzialności UI zgodnie z Blokiem B frontu w `docs/architektura_katalogi_pliki.md` oraz R5 / SPEC-FRONTEND F-1–F-2: `pages/` (dashboard / admin), `components/`, `store/`, `configs/`, `hooks/`, `utils/` — bez migracji na `features/<name>/`. Wyraźny podział rdzenia UX budżetu vs otoczki oraz granica widoków prezentacyjnych vs orkiestracji (bez reguł biznesowych w „grubym JSX”). Faza może biec równolegle do prac backendu.

**DoD (faza):**

- Układ katalogów SPA odpowiada normie docs (Blok B front) bez wymuszania `features/<name>/`.
- Rdzeń dashboardu i otoczka (landing / panel admin) są rozdzielone w mapie stron i komponentów zgodnie z docs.
- Refaktorowane widoki nie trzymają reguł uprawnień / biznesu jako źródła prawdy — tylko prezentacja i orkiestracja UI (F-7, anty-patterny docs).

### Krok 2.1 — Mapa pages / components / store / configs / hooks / utils

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Doprowadzenie drzewa `frontend/src/` do normy katalogów z docs: strony, komponenty, stan, konfiguracja routingu/i18n, hooki, utils — bez osobnego `contexts/` poza `store/`.

**DoD (krok):**

- Krytyczne obszary UI mają dom w ustalonych katalogach normy.
- Brak otwartego sporu o migrację na feature-modules w v1.

### Krok 2.2 — Podział rdzeń UX vs otoczka

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Utrwalenie podziału: `dashboard-subpages` / komponenty dashboardu = rdzeń budżetu; landing / home-page / `adminpanel-subpages` = otoczka operacyjna — zgodnie z `docs/dokumentacja_koncepcyjna.md` i mapą katalogów.

**DoD (krok):**

- Rdzeń i otoczka nie mieszają się w mapie stron/komponentów bez świadomego uzasadnienia.
- Panel `superadmin` pozostaje otoczką, nie „hostem gospodarstwa” w UX.

### Krok 2.3 — Widoki prezentacyjne vs orkiestracja

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** W refaktorowanych powierzchniach: formatowanie i interakcja w widokach; fetch/mutacje i aktualizacja store poza grubym JSX z regułami (SPEC-FRONTEND — presentational vs orkiestracja).

**DoD (krok):**

- W objętych widokach nie ma reimplementacji reguł typu „kto może usunąć domownika” jako lokalnego źródła prawdy.
- Orkiestracja UI wywołuje API / store; decyzje uprawnień egzekwuje serwer (F-15).

---

## MILESTONE — Mapa SPA zgodna z normą katalogów

**Opis:** Bramka po Fazie 2. Układ SPA i granice prezentacji/orkiestracji są domknięte; wolno porządkować model stanu.

**DoD (milestone):**

- Faza 2 ma status `WYKONANY`.
- Mapa katalogów i podział rdzeń/otoczka spełniają DoD fazy.
- Prowadzący prace akceptuje start Fazy 3.

---

## Faza 3 — Model stanu (Context + Zustand)

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Domknięcie modelu stanu v1 bez zmiany paradygmatu: **Context** w `store/` na sesję / socket / data / theme; **Zustand** na kolekcje domenowe z jasnym właścicielem per obszar; lokalny stan UI zostaje lokalny, gdy nie jest współdzielony (SPEC-FRONTEND F-4–F-7, R5). Odświeżanie widoku po mutacji HTTP i po ustalonych eventach WS — bez React Query / SWR. Faza może biec równolegle do prac backendu.

**DoD (faza):**

- Context i Zustand współistnieją w `store/` zgodnie z docs; nie ma osobnego wymuszonego drzewa `contexts/`.
- Domenowe kolekcje mają jawnego właściciela store’a; nie wszystko trafia do jednego globalnego worka.
- Po udanej mutacji HTTP objęte widoki/store są aktualizowane; gotowość pod handlery WS jest opisana (pełne podpięcie eventów — Faza 7).

### Krok 3.1 — Context: sesja / socket / data / theme

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Uporządkowanie Contextów cross-cutting (auth, socket, data, theme) w `store/` — stan sesji, połączenia i UI współdzielony, bez wrzucania list domenowych „przy okazji”.

**DoD (krok):**

- Obszary cross-cutting mają dom w Context zgodnie z normą.
- Context nie jest jedynym pojemnikiem na wszystkie kolekcje domenowe.

### Krok 3.2 — Zustand: właściciele store per obszar

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Store’y domenowe (m.in. transakcje, wiadomości, zaproszenia, powiadomienia) z jasną granicą odpowiedzialności per obszar (F-5).

**DoD (krok):**

- Każdy objęty obszar domenowy ma właściciela store’a.
- Brak „wszystkiego w jednym store” bez granicy.

### Krok 3.3 — Stan lokalny UI i odświeżanie po mutacji

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Lokalny stan komponentu zostaje lokalny, gdy nie jest współdzielony (F-6). Po mutacji HTTP store/widok są aktualizowane; przygotowanie pod eventy WS bez własnego protokołu.

**DoD (krok):**

- Nie współdzielony stan UI nie jest wynoszony do globalnego store „na zapas”.
- Objęte mutacje HTTP kończą się spójnym odświeżeniem store/widoku.

---

## MILESTONE — Stan zgodny z R5 / F-4–F-7

**Opis:** Bramka po Fazie 3. Model stanu SPA jest zgodny z normą v1; wolno przełączać klienta na kontrakt HTTP `/api/v1`.

**DoD (milestone):**

- Faza 3 ma status `WYKONANY`.
- Context + Zustand + granice lokalnego stanu spełniają DoD fazy.
- Prowadzący prace akceptuje start Fazy 4 (z uwzględnieniem bramki zewnętrznej BE).

---

## Faza 4 — Kontrakt klienta HTTP (`/api/v1`, credentials, envelope)

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Przełączenie klienta SPA na prefiks **`/api/v1`**, żądania z credentials (cookie `SESSID`), obsługa 401/403 bez udawania uprawnień oraz mapowanie envelope `status` / `message` pod późniejsze i18n — zgodnie z `docs/dokumentacja_komunikacji.md`, SPEC-KOMUNIKACJA i SPEC-FRONTEND F-3, F-8, F-15. To **zewnętrzna bramka FE** względem dual mount legacy w majorze backendu: po tej fazie klient woła v1; usunięcie legacy po stronie API pozostaje poza tym planem.

**Bramka zewnętrzna (opisowo):** start / domknięcie cutoveru zakłada dostępność powierzchni API pod `/api/v1` (odpowiednik DoD Fazy 4 majoru backendu / dual mount). Fazy 1–3 nie wymagają tej gotowości.

**DoD (faza):**

- Chronione i publiczne wywołania SPA idą pod `/api/v1/...` (F-3).
- Żądania używają credentials; 401/403 są obsłużone w UI bez „udawania” uprawnień.
- Envelope sukces/błąd jest konsumowane spójnie; `message` jest gotowe do mapowania i18n (pełny namespace `api` — Faza 6).
- Klient nie zależy od ścieżek legacy jako normy docelowej.

### Krok 4.1 — Prefiks `/api/v1` w konfiguracji klienta

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Ujednolicenie bazowego URL API (i powiązanej konfiguracji deweloperskiej / proxy) tak, by wszystkie wywołania HTTP klienta trafiały pod `/api/v1` — zgodnie z docs komunikacji i SPEC-FRONTEND F-3.

**DoD (krok):**

- Konfiguracja klienta wskazuje prefiks `/api/v1`.
- Objęte wywołania HTTP nie wołają już ścieżek bez prefiksu jako normy.
- Środowisko deweloperskie pozwala ćwiczyć v1 (zgodnie z docs deployment / komunikacji).

### Krok 4.2 — Credentials oraz obsługa 401/403

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Egzekwowanie `credentials` przy HTTP oraz czytelna obsługa odmowy auth/authz w UI — bez traktowania ukrycia trasy jako autoryzacji (F-8, F-15, SPEC-BEZPIECZENSTWO po stronie klienta).

**DoD (krok):**

- Żądania sesyjne idą z credentials.
- 401/403 kończą się obserwowalną reakcją UI (wylogowanie / komunikat / odcięcie chronionego UX), nie cichym „sukcesem”.
- Guard tras UI nie jest przedstawiany jako zastępstwo middleware API.

### Krok 4.3 — Envelope `status` / `message` pod i18n

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Spójna konsumpcja envelope z API; `message` traktowane jako kandydat na klucz i18n (gotowość pod Fazę 6), bez big-bang migracji wszystkich stringów w tej fazie.

**DoD (krok):**

- Sukces i błąd z API są odczytywane przez wspólny wzorzec envelope.
- UI nie zakłada, że `message` to zawsze finalny tekst jednego języka jako jedyna norma.
- Pełne podpięcie namespace `api` pozostaje w Fazie 6.

---

## MILESTONE — SPA woła API pod `/api/v1`

**Opis:** Bramka po Fazie 4. Klient jest na kontrakcie v1; to domknięcie zewnętrznej bramki FE względem dual mount backendu. Usunięcie legacy mount po stronie API **nie** jest DoD tej bramki (poza major FE i poza major BE — osobna decyzja po potwierdzeniu cutoveru).

**DoD (milestone):**

- Faza 4 ma status `WYKONANY`.
- SPA woła chronione/publiczne API pod `/api/v1` z credentials; 401/403 są obsłużone.
- Prowadzący prace akceptuje start Fazy 5 (z uwzględnieniem bramki zewnętrznej BE dla `inmate`).
- Uwaga zakresu: usunięcie legacy HTTP na backendzie — poza tym major.

---

## Faza 5 — Role `inmate` w UI (R1, zakres frontend)

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Ujednolicenie nazwy roli domownika na **`inmate`** w guardach tras, etykietach, komunikatach i porównaniach roli po stronie klienta — zgodnie z `docs/dokumentacja_koncepcyjna.md`, R1, SPEC-FRONTEND F-10. UI odzwierciedla role; źródło prawdy pozostaje API (F-15). Bez zmiany modelu uprawnień host/inmate.

**Bramka zewnętrzna (opisowo):** domknięcie zakłada, że sesja / kontrakt API zwraca rolę `inmate` (odpowiednik DoD Fazy 5 majoru backendu). Do tego czasu nie utrwalać `mate` jako trwałej normy w refaktorowanym UI.

**DoD (faza):**

- W refaktorowanym UI nie ma roli `mate` — jest `inmate` (F-10).
- Guardy i komunikaty klienta są spójne z normą ról docs.
- UI nie dubluje reguł host/inmate jako jedynego źródła prawdy.

### Krok 5.1 — Rename `mate` → `inmate` w kliencie

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Zamiana historycznej nazwy w objętych miejscach SPA: porównania roli, etykiety, komunikaty, nazwy prezentacyjne powiązane z rolą domownika.

**DoD (krok):**

- Refaktorowany frontend używa wyłącznie `inmate` dla roli domownika.
- Brak aliasów historycznych w nowym / refaktorowanym kodzie UI jako normy.

### Krok 5.2 — UI odzwierciedla role; prawda = API

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Dopasowanie chronionego UX (host vs inmate vs user vs superadmin) do normy produktowej: ukrycie przycisku/trasy nie zastępuje odmowy API; po 403 UI nie udaje sukcesu operacji.

**DoD (krok):**

- Widoki hosta / inmate / user / superadmin odzwierciedlają docs bez mylenia superadmina z hostem gospodarstwa.
- Odmowa API przy niewystarczającej roli jest widoczna w UX objętych ścieżek.

---

## MILESTONE — Role w UI zgodne z normą

**Opis:** Bramka po Fazie 5. R1 po stronie klienta jest domknięte; pełne domknięcie produktowe ról = ten milestone + wcześniejszy milestone backendu „Role zgodne z normą po stronie backendu”.

**DoD (milestone):**

- Faza 5 ma status `WYKONANY`.
- R1 w zakresie frontendu jest domknięte według DoD fazy.
- Prowadzący prace akceptuje start Fazy 6.

---

## Faza 6 — i18n: namespace `api` + mapowanie `message`

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Wdrożenie normy i18n dla komunikatów API: języki `pl` + `en` (`fallbackLng: en`), namespace **`api`**, mapowanie `message` z envelope przez i18n, fallback na surowy string gdy brak klucza — zgodnie z `docs/i18n_kontrakt_ui.md` i SPEC-FRONTEND F-11–F-13. Wybór **jednej** konwencji (`api:…` albo zawsze `ns: 'api'`) jest DoD kroku — major nie narzuca której. Big-bang migracji wszystkich historycznych kluczy UI **nie** jest wymagany.

**DoD (faza):**

- Namespace `api` (pl + en) jest dostępny w konfiguracji i18n klienta.
- Jedna konwencja mapowania kluczy API jest wybrana i stosowana w nowym / refaktorowanym kodzie.
- `message` z API jest tłumaczone gdy klucz istnieje; inaczej pokazywany jest surowy string (bez pustego UX).
- Pełna migracja wszystkich starych kluczy nie blokuje DoD fazy (F-13).

### Krok 6.1 — Namespace `api` i wybór konwencji

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Dodanie namespace `api` do i18n oraz jawny wybór jednej konwencji prefiksu / `ns` na dalsze prace.

**DoD (krok):**

- `api` jest w zestawie namespace’ów ładowanych przez klienta.
- Wybrana konwencja (`api:…` **albo** zawsze `ns: 'api'`) jest zapisana jako obowiązująca dla nowego kodu.
- Pliki pl/en dla `api` istnieją przynajmniej w zakresie startowym pod refaktorowane komunikaty.

### Krok 6.2 — Mapowanie `message` + fallback

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Podpięcie konsumpcji envelope tak, by UI tłumaczyło `message` przez i18n; przy braku klucza — surowy string (docs i18n).

**DoD (krok):**

- Objęte ścieżki sukces/błąd pokazują tłumaczenie albo surowy `message`, nigdy puste toasty „bo brak klucza”.
- Nowy kod nie hardcoduje finalnego tekstu API jako jedynego języka UI.

### Krok 6.3 — Stopniowa migracja istniejących kluczy

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Przenoszenie / mapowanie historycznych kluczy (np. `authMessages.*`) do `api` tam, gdzie refaktorowana powierzchnia tego wymaga — bez obowiązku jednego PR na cały katalog locales.

**DoD (krok):**

- Refaktorowane powierzchnie nie zależą od sprzecznych konwencji naraz.
- Pozostały dług migracji jest świadomy i nie blokuje DoD fazy.

---

## MILESTONE — Kontrakt message ↔ UI

**Opis:** Bramka po Fazie 6. Klient jest właścicielem brzmienia PL/EN dla `message` z API w normie v1; wolno domknąć klienta WS.

**DoD (milestone):**

- Faza 6 ma status `WYKONANY`.
- Namespace `api`, wybrana konwencja i fallback spełniają DoD fazy.
- Prowadzący prace akceptuje start Fazy 7.

---

## Faza 7 — Klient WebSocket wg kontraktu

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Domknięcie klienta Socket.io: handshake z sesją; obsługa wyłącznie ustalonych `type` z docs / SPEC-KOMUNIKACJA; aktualizacja store/widoku po eventach — bez własnych roomów i protokołów (SPEC-FRONTEND F-9, anty-patterny). Wiąże się z modelem stanu z Fazy 3.

**DoD (faza):**

- Klient WS nie wprowadza własnych roomów / typów spoza normy docs.
- Ustalonych eventów (m.in. `notification`, `newMessage`, `balance_update`, …) klient używa zgodnie z kontraktem.
- Po objętych eventach store/widok są aktualizowane bez zmyślonego API roomów.

### Krok 7.1 — Handshake i katalog `type`

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Połączenie WS z sesją oraz ograniczenie handlerów do katalogu zdarzeń z `docs/dokumentacja_komunikacji.md` / SPEC-KOMUNIKACJA.

**DoD (krok):**

- Handshake opiera się na sesji zgodnej z kontraktem (bez osobnego „tajnego” kanału auth w kliencie).
- W refaktorowanym kodzie nie ma custom room API ani typów spoza normy.

### Krok 7.2 — Aktualizacja store / widoku po eventach

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Podpięcie handlerów do właścicieli store z Fazy 3 tak, by push (powiadomienie, wiadomość, saldo, …) odświeżał UX bez reimplementacji reguł biznesowych.

**DoD (krok):**

- Objęte eventy aktualizują właściwy store/widok.
- Komponenty nie obchodzą store własną „drugą prawdą” stanu po WS.

---

## MILESTONE — WS bez własnych protokołów

**Opis:** Bramka po Fazie 7. Klient realtime jest zgodny z kontraktem; wolno domknąć bramkę bezpieczeństwa klienta.

**DoD (milestone):**

- Faza 7 ma status `WYKONANY`.
- Katalog eventów i odświeżanie store spełniają DoD fazy.
- Prowadzący prace akceptuje start Fazy 8.

---

## Faza 8 — Bezpieczeństwo klienta i granica zaufania

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Domknięcie normy bezpieczeństwa po stronie SPA: brak sekretów serwerowych w bundlu / `VITE_*` / repo frontu; ukrycie UI nie jest autoryzacją; brak dublowania reguł host/inmate jako źródła prawdy — zgodnie z SPEC-FRONTEND F-14–F-15, `docs/bezpieczenstwo.md`, `docs/katalog_env.md` (sekcja Frontend) i anty-patternami.

**DoD (faza):**

- W bundlu / env frontu nie ma sekretów serwerowych (JWT secret, hasła DB, SMTP, tokeny CI).
- Chronione działania nadal zależą od API; UI tylko odzwierciedla uprawnienia.
- Brak regresji „reguły tylko na froncie” w objętych ścieżkach.

### Krok 8.1 — Brak sekretów w bundlu / `VITE_*`

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Przegląd konfiguracji i kodu klienta pod kątem sekretów; URL API/socket pozostaje konfiguracją publiczną klienta, nie magazynem sekretów.

**DoD (krok):**

- Brak sekretów serwerowych w repo / bundlu / zmiennych `VITE_*` frontu.
- Konfiguracja klienta ogranicza się do tego, co wolno znać przeglądarce (origin API/socket).

### Krok 8.2 — UI ≠ autoryzacja; bez dublowania reguł

**Status:** `NIE_ROZPOCZĘTY`

**Opis:** Potwierdzenie, że guardy i ukrywanie kontrolek nie zastępują API oraz że klient nie utrzymuje drugiej, sprzecznej kopii reguł host/inmate/superadmin.

**DoD (krok):**

- Objęte chronione operacje kończą się wywołaniem API; odmowa serwera jest respektowana w UX.
- Reguły składu domu / ról nie żyją wyłącznie w komponencie React jako źródło prawdy.

---

## MILESTONE — Klient bez sekretów i bez udawania authz

**Opis:** Bramka po Fazie 8. Granica zaufania klienta jest domknięta względem normy docs/SPEC. Brak dalszej fazy w tym major — milestone zamykający całość projektu frontend **nie** jest stosowany (decyzja wywiadu).

**DoD (milestone):**

- Faza 8 ma status `WYKONANY`.
- F-14 / F-15 w zakresie tego major są spełnione według DoD fazy.
- Prowadzący prace uznaje major frontend za domknięty zakresem (kolejne prace = edycja żyjącego planu albo osobne artefakty poza tą sesją).

<!-- Brak MILESTONE zamykającego po Fazie 8 jako osobnej „fazy końcowej” — bramka powyżej zamyka ostatnie przejście; bez dodatkowej fazy testów UI. -->
