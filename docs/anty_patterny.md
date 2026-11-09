---
wersja: 3
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-08
---

# Anty-patterny — Home Budget Manager

Pułapki typowe dla **tego** stacku i ustalonego stylu (modularny monolit warstwowy, SPA, adaptery WS/cron/OCR w procesie API).  
Forma: hasło → dlaczego boli → co robić zamiast. Odniesienia do kierunku refaktoru (R1–R5) i kontraktu `/api/v1` tam, gdzie pasują.

## 1. Gruby controller / Prisma lub SQL poza warstwą `database`

**Dlaczego boli:** Łamie pipeline `routes → controllers → services → database`. Trudny test, duplikacja zapytań, ukryte reguły w HTTP, omijanie Prisma Migrate.

**Zamiast:** Cienki controller (statusy, mapowanie); reguły w `services/`; dostęp do MySQL wyłącznie przez Prisma w `database/` (**R2**, **R6**). Bez raw SQL i bez importu Prisma Client w controllerach / routes / tasks.

## 2. Reguły uprawnień tylko na froncie

**Dlaczego boli:** SPA da się obejść. Ukryty przycisk ≠ bezpieczeństwo. Role `host` / `inmate` / `superadmin` muszą być egzekwowane w API.

**Zamiast:** `verifyJWT` + weryfikacja roli na każdym chronionym endpoincie; UI tylko odzwierciedla uprawnienia.

## 3. Drift ról (`mate` vs `inmate`, grupa `mates`)

**Dlaczego boli:** Docs, JWT, middleware i UI mówią różnymi językami. Błędy 403, regresje przy refaktorze, mylące portfolio/code review.

**Zamiast:** Jedna norma: `inmate` + spójne grupy uprawnień (**R1**). Nie dodawać kolejnych aliasów „na chwilę”.

## 4. Publiczny OCR / endpoint bez JWT „bo tak wyszło”

**Dlaczego boli:** Koszt CPU (Tesseract), abuse uploadów, niespójność z resztą API chronionego sesją.

**Zamiast:** OCR za `SESSID` (i sensowną rolą domu), limity multipart; traktować jako świadomy wyjątek tylko jeśli produktowo uzasadniony i opisany w kontrakcie.

## 5. Mieszane PL/EN w `message` jako kontrakt dla UI

**Dlaczego boli:** i18n w SPA się sypie; testy asercji na tekstach są kruche; trudno utrzymać jeden ton produktu.

**Zamiast:** Klucze i18n (lub jeden język kontraktu) w envelope; tłumaczenie po stronie klienta — zgodnie z kierunkiem w `dokumentacja_komunikacji.md`.

## 6. Logika biznesowa w komponencie React + dubel w API

**Dlaczego boli:** Rozjazd reguł (np. kto może usunąć domownika). Bugi „działa w UI, pada na API” albo odwrotnie.

**Zamiast:** Źródło prawdy = backend; front formatuje i orchestrację UI. Wspólne reguły nie żyją w dwóch miejscach na sztywno.

## 7. Cały server state w Context / Zustand bez granicy „UI vs dane”

**Dlaczego boli:** Przerośnięte store’y, zbędne re-rendery, trudne invalidacje po WS. Model v1 (Zustand + Context) jest OK — anty-patternem jest wrzucanie *wszystkiego* globalnie.

**Zamiast:** Context/Zustand na sesję, socket, UI; dane list/szczegółów z jasnym właścicielem store’a i odświeżaniem po mutacji/WS. Bez dokładania React Query „przy okazji” poza decyzją architektoniczną (**R5** = bez zmiany modelu w docs).

## 8. Ciężki cron / OCR blokujący event loop obok HTTP

**Dlaczego boli:** Timeouty API, zacinający się chat/WS, zły UX przy obciążeniu.

**Zamiast:** Lekkie taski; długie OCR / ciężkie joby — kolejka lub **później** osobne workery (**R4**, „do rozważenia”). Nie dokładać synchronicznego ciężaru w request path bez limitu.

## 9. Zmyślanie roomów Socket.io / innego kontraktu WS

**Dlaczego boli:** Integracja „według wyobrażenia” zamiast `broadcastMessage` / `broadcastToHouseMates` i ustalonych `type`. Martwy kod po stronie klienta, niedostarczone eventy.

**Zamiast:** Trzymać się zdarzeń z `dokumentacja_komunikacji.md` (`notification`, `newMessage`, `balance_update`, …) i modelu push po użytkowniku / domu.

## 10. Traktowanie otoczki jak rdzenia uprawnień budżetu

**Dlaczego boli:** Mylenie landing / reviews / gallery / panelu `superadmin` z regułami gospodarstwa. Złe middleware na złych ścieżkach albo odwrotnie — dziury w rdzeniu.

**Zamiast:** Jasny podział produktowy i w `services/shell/` vs rdzeń (**R3**). Superadmin ≠ host gospodarstwa.

## 11. (Bonus kontraktu) Nowe ścieżki bez prefiksu `/api/v1`

**Dlaczego boli:** Rozjechanie normy docs z klientem; trudniejsza wersjonowanie API.

**Zamiast:** Montować i wołać wyłącznie pod `/api/v1` zgodnie z `dokumentacja_komunikacji.md`.

---

## Jak używać tej listy

Przy code review i lekkim refaktorze: jeśli zmiana wprowadza któryś z punktów 1–11, to sygnał do korekty **zanim** rozrośnie się kolejna warstwa obejść.

- Warstwy: [architektura.md](./architektura.md)
- Przepływy: [data_flow.md](./data_flow.md)
- Security checklist: [bezpieczenstwo.md](./bezpieczenstwo.md)
- i18n kluczy API: [i18n_kontrakt_ui.md](./i18n_kontrakt_ui.md)
