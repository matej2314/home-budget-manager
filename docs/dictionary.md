---
wersja: 2
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-07
---

# Słownik — Home Budget Manager

Pojęcia **domenowe** oraz związane z **kontraktem** komunikacji. Hasła po polsku; nazwy EN / API w nawiasie. Synonimy wskazują **preferowaną** nazwę w dokumentacji.

Nie obejmuje osobnego glossariusza bibliotek (Express, Zustand, …) — to poza zakresem tego pliku.

## Role i tożsamość

| Hasło | Definicja |
|-------|-----------|
| **Użytkownik** (*user*) | Zarejestrowane konto. W węższym sensie roli: konto **bez** gospodarstwa. |
| **Host** (*host*) | Twórca gospodarstwa; zarządza składem domu (m.in. usuwanie domowników). |
| **Domownik** (*inmate*) | Członek gospodarstwa (norma docs). **Alias historyczny w kodzie:** *mate*. Preferencja docs: **inmate** / domownik. |
| **Superadmin** (*superadmin*) | Administrator witryny; operacje panelu i części zasobów otoczki. |
| **Grupa mates (kod)** | Historyczna grupa middleware = `host` + `mate`. W kontrakcie docs: `host \| inmate`. Do usunięcia w refaktorze R1. |
| **Sesja** (*SESSID*) | Cookie HTTP z JWT identyfikującym zalogowanego użytkownika. |

## Gospodarstwo i członkostwo

| Hasło | Definicja |
|-------|-----------|
| **Gospodarstwo** (*house* / *household*) | Jednostka współdzielonego budżetu i członkostwa. Preferencja docs: **gospodarstwo**; w ścieżkach API często `house`. |
| **Zaproszenie** (*invitation*) | Prośba o dołączenie użytkownika do gospodarstwa; akceptacja/odrzucenie po stronie hosta (as-is flow API). |
| **Domownik (skład)** (*inhabitant*) | Osoba w składzie domu (parametry usuwania itd.); semantycznie zbieżne z rolą *inmate*. |
| **Jedno gospodarstwo na użytkownika** | Reguła produktowa: w danym momencie użytkownik należy do co najwyżej jednego gospodarstwa. |

## Finanse

| Hasło | Definicja |
|-------|-----------|
| **Transakcja** (*action*) | Przychód lub wydatek w budżecie gospodarstwa. Preferencja docs: **transakcja**; w API ścieżki `/action`. |
| **Typ transakcji** (*type*) | Zwykle `income` (przychód) lub `expense` (wydatek). |
| **Kategoria** (*action category* / *actioncat*) | Klasyfikacja transakcji; zarządzanie kategoriami po stronie superadmin (as-is). |
| **Saldo** (*currentBalance* / *balance*) | Bieżące saldo gospodarstwa; aktualizowane przy transakcjach; push WS `balance_update`. |
| **Budżet początkowy** (*initBudget*) | Kwota startowa przy tworzeniu / kontekście domu. |
| **Budżet miesięczny** (*initial monthly budget* / *initmonthly*) | Deklaracja / init budżetu w ujęciu miesięcznym (endpoint `/initmonthly`). |
| **OCR paragonu** (*receipt*) | Rozpoznanie kwoty z obrazu paragonu (wsparcie przy wydatku); kontrakt HTTP multipart. |

## Komunikacja w produkcie

| Hasło | Definicja |
|-------|-----------|
| **Wiadomość** (*message*) | Wpis czatu wewnętrznego między użytkownikami; dostarczenie realtime: zdarzenie `newMessage`. |
| **Powiadomienie** (*notice* / *notification*) | Zapisana notyfikacja związana z aktywnością domu; push WS typu `notification`. |
| **Broadcast do domu** | Wysłanie zdarzenia WS do wszystkich członków gospodarstwa z aktywnym połączeniem. |
| **Push do użytkownika** | Wysłanie zdarzenia WS do jednego `userId`. |

## Kontrakt I/O

| Hasło | Definicja |
|-------|-----------|
| **Prefiks API** (`/api/v1`) | Norma ścieżek HTTP w docs; zmiana względem kodu bez prefiksu — do wdrożenia w refaktorze. |
| **Envelope** | Typowy kształt JSON: `status` (`success` \| `error`) + `message` (+ pola dodatkowe). |
| **Powierzchnia HTTP** | REST + multipart jako główny kontrakt SPA ↔ API. |
| **Powierzchnia WebSocket** | Socket.io: zdarzenia m.in. `connect_success`, `notification`, `newMessage`, `invitation`, `initial_budget`, `balance_update`, `error`. |
| **Powierzchnia e-mail** | As-is: e-mail jako identyfikator konta. Kierunek: kanał wychodzący (np. zaproszenia). |
| **OAuth / Bearer** | Nie są mechanizmem v1; auth = cookie `SESSID`. |

## Rdzeń vs otoczka (produkt)

| Hasło | Definicja |
|-------|-----------|
| **Rdzeń** | Logika biznesowa budżetu i współpracy domu (auth w kontekście produktu, gospodarstwo, transakcje, chat, …). |
| **Otoczka** | Landing, recenzje, galeria screenshotów, panel superadmina — warstwa prezentacyjna / operacyjna. |
| **Landing** (*home page*) | Publiczna strona startowa / marketingowa. |
| **Recenzja** (*review*) | Opinia użytkownika o aplikacji (zasób `/reviews`). |
| **Galeria** (*gallery*) | Screenshoty / materiały wizualne zarządzane m.in. przez superadmina. |
| **Panel superadmina** | UI i endpointy do operacji administracyjnych witryny. |
| **Cookies / tour** | Ustawienia cookies i stanu touru onboardingowego (`/cookiestour`). |

## Synonimy — preferencje docs

| Preferencja w docs | Alias / API / kod |
|--------------------|-------------------|
| Domownik / *inmate* | *mate* (historyczne) |
| Gospodarstwo | *house*, *household* |
| Transakcja | *action* |
| Powiadomienie | *notice*, event `notification` |
| Kategoria transakcji | *actioncat*, *action category* |

Przy sprzeczności nazwy w kodzie z tym słownikiem: **docs + plan refaktoru** wygrywają dla utrzymania; implementacja dogania (R1 i porządek API).

## Powiązane

- Koncepcja: [dokumentacja_koncepcyjna.md](./dokumentacja_koncepcyjna.md)
- Kontrakt: [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md)
- Model danych: [model_danych.md](./model_danych.md)
