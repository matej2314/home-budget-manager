---
wersja: 4
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-09
---

# Dokumentacja koncepcyjna — Home Budget Manager

## Cel produktu

**Home Budget Manager** to webowa aplikacja do zarządzania budżetem gospodarstwa domowego.

Najważniejsza wartość:

- Wspólne prowadzenie finansów w obrębie **jednego** gospodarstwa (przychody, wydatki, kategorie, budżet miesięczny).
- Współpraca domowników: zaproszenia, role z jasnymi uprawnieniami, chat i powiadomienia.
- Wgląd w sytuację finansową domu (statystyki, kalendarz, OCR kwoty z paragonu jako wsparcie przy dodawaniu wydatku).

Produkt opisuje **stan docelowej normy koncepcyjnej** względem obecnego kodu: tam, gdzie docs i repo się różnią (przede wszystkim nazewnictwo roli `inmate`), dokumentacja jest źródłem prawdy dla utrzymania i refaktoru.

## Dla kogo jest dokumentacja

| Odbiorca | Potrzeba |
|----------|----------|
| **Właściciel / maintainer** | Spójny obraz zakresu i reguł biznesowych przy utrzymaniu, refaktorze ról i dalszej pracy nad kodem. |
| **Portfolio** | Szybkie zrozumienie idei produktu, granic MVP i świadomych ograniczeń — bez wchodzenia w szczegóły implementacji. |

Aplikacja jest skierowana do osób i małych gospodarstw domowych, które chcą wspólnie śledzić budżet w przeglądarce — nie do firm księgowych ani multi-tenant SaaS.

## Role użytkowników

Norma koncepcyjna (obowiązuje w dokumentacji; **zmiana względem obecnego kodu**, gdzie używane jest m.in. `mate`):

| Rola | Znaczenie |
|------|-----------|
| `user` | Zarejestrowany użytkownik **bez** gospodarstwa — musi je utworzyć albo dołączyć przez zaproszenie, zanim skorzysta z rdzenia finansowego. |
| `host` | Twórca gospodarstwa; zarządza domownikami (m.in. usuwanie członków) oraz pełnym zestawem funkcji domu. |
| `inmate` | Domownik dołączony do gospodarstwa; korzysta z finansów, chatu i pozostałego rdzenia w granicach uprawnień innych niż zarządzanie składem domu. |
| `superadmin` | Administrator witryny — panel operacyjny poza rdzeniem budżetowym gospodarstwa. |

**Refaktor obowiązkowy (późniejszy):** w kodzie `backend/` / `frontend/` oraz kontraktach API należy ujednolicić nazwę roli domownika na `inmate` (zamiast `mate` / ewentualnych aliasów) oraz dopasować middleware, komunikaty i UI do tej normy.

## Zakres produktu

### Rdzeń (logika biznesowa)

- Rejestracja i logowanie; sesja użytkownika.
- Utworzenie gospodarstwa (wystarczy nazwa) albo dołączenie przez zaproszenie.
- Zaproszenia domowników; zarządzanie składem domu przez `host`.
- Transakcje (przychód / wydatek) oraz kategorie transakcji.
- Budżet miesięczny (inicjalizacja / deklaracja w ramach domu).
- Statystyki i wizualizacje finansowe.
- Chat wewnętrzny między członkami gospodarstwa.
- Powiadomienia związane z życiem domu i aktywnością.
- OCR paragonu (wsparcie przy odczycie kwoty).
- Kalendarz powiązany z aktywnością finansową / planowaniem w aplikacji.
- Profil użytkownika i awatar w kontekście korzystania z produktu.

### Otoczka / część operacyjna

Nie są rdzeniem budżetowym, ale wchodzą w zakres aplikacji jako warstwa prezentacyjna i operatorska:

- Landing (strona startowa / marketingowa).
- Recenzje.
- Galeria screenshotów.
- Panel `superadmin`.

## Poza zakresem

Świadomie **nie** jest celem produktu (ani „kolejnym naturalnym krokiem” bez osobnej decyzji):

- Multi-tenant SaaS i billing subskrypcyjny.
- Natywna aplikacja mobilna.
- Synchronizacja z bankiem / Open Banking.
- Pełna księgowość i faktury.

## Główne założenia

1. **Jedno gospodarstwo na użytkownika** — w danym momencie użytkownik należy do co najwyżej jednego gospodarstwa.
2. **Gospodarstwo przed rdzeniem** — bez domu (rola `user`) użytkownik nie korzysta z funkcji finansowych i współpracy domowników.
3. **Host zarządza składem** — tylko `host` usuwa / zarządza domownikami; `inmate` nie przejmuje tych uprawnień.
4. **Wspólny budżet domu** — transakcje i statystyki dotyczą gospodarstwa, nie osobnych „kont prywatnych” w obrębie produktu.
5. **Web-first** — klient to aplikacja przeglądarkowa; API i realtime (m.in. Socket.io) służą temu klientowi.
6. **Docs nad drift kodu przy rolach** — nazwa `inmate` jest normą dokumentacyjną; kod wymaga późniejszego ujednolicenia.

## Słownik skrótowy

| Pojęcie | Znaczenie |
|---------|-----------|
| Gospodarstwo / house | Jednostka współdzielonego budżetu i członkostwa |
| Host | Twórca i administrator składu gospodarstwa |
| Inmate | Domownik (norma docs; w kodzie historycznie m.in. `mate`) |
| User | Konto bez gospodarstwa |
| Superadmin | Administrator witryny (otoczka operacyjna) |
| Action / transakcja | Przychód lub wydatek w budżecie domu |

Szczegóły pojęć: [dictionary.md](./dictionary.md).

## Kryteria sukcesu (opis funkcjonalny)

Obecna wersja produktu spełnia oczekiwania, gdy:

- Nowy użytkownik rejestruje się, tworzy gospodarstwo (staje się `host`) albo dołącza przez zaproszenie (staje się `inmate`).
- Domownicy dodają transakcje i kategorie; widać je w kontekście wspólnego budżetu domu.
- Dostępne są budżet miesięczny, statystyki oraz chat / powiadomienia między członkami gospodarstwa.
- Tylko `host` zarządza składem gospodarstwa.
- Otoczka (landing, recenzje, galeria, panel `superadmin`) działa jako warstwa operacyjna / prezentacyjna, bez mylenia jej z rdzeniem budżetowym.
- Dokumentacja i dalszy refaktor traktują rolę domownika jako `inmate`, nawet jeśli repo jeszcze używa starszej nazwy.

## Powiązane

- Architektura i lekki refaktor **R1–R6** (+ ESM): [architektura.md](./architektura.md) — m.in. role (`inmate`), pipeline warstw, obszary, adaptery WS/cron, porządek SPA oraz **R6: Prisma ORM + Migrate** zamiast raw SQL / pool.
- Kontrakt I/O: [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md)
- Model danych (encje + norma Prisma): [model_danych.md](./model_danych.md)
