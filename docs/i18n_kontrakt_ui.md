---
wersja: 2
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-07
---

# i18n i kontrakt UI — Home Budget Manager

## Cel

Konwencja tłumaczeń SPA (i18next) oraz docelowy kontrakt pola `message` z API. Uzupełnia [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md) (język envelope) bez dublowania listy endpointów.

## Języki v1

| Kod | Rola |
|-----|------|
| `pl` | Polski |
| `en` | Angielski; **fallback** (`fallbackLng: en`) |

Wykrywanie: `localStorage` → język przeglądarki → domyślny. Brak innych locale w normie v1.

## Namespace’y UI (as-is + rozszerzenie)

Obecne (ładowane z `/locales/{{lng}}/{{ns}}.json`):

`common`, `aboutUs`, `dashboardComponents`, `dashboardInternal`, `errorPage`, `forms`, `homePage`, `pages`, `modals`, `utils`.

**Norma docs — dodać osobny namespace:**

| Namespace | Pliki | Przeznaczenie |
|-----------|-------|----------------|
| **`api`** | `pl/api.json`, `en/api.json` | Tłumaczenia kluczy zwracanych w `message` z backendu |

Konfiguracja i18n musi dopisać `api` do `ns` / preload przy wdrożeniu tej normy.

Istniejące klucze typu `authMessages.*` w `common` można stopniowo przenieść lub mapować do `api` — bez obowiązku big-bang w jednym PR.

## Kontrakt API ↔ UI (norma docelowa)

```text
API response.message  =  klucz i18n (np. "api:auth.loginSuccess")
SPA                   →  t(message)  /  t(key, { ns: 'api' })
```

| Zasada | Opis |
|--------|------|
| Backend | Zwraca **klucz**, nie finalny tekst marketingowy w jednym języku |
| Frontend | Jedyny właściciel brzmienia PL/EN dla użytkownika |
| Envelope | Nadal `status` + `message` (+ pola danych) |

Konwencja nazewnictwa kluczy w `api.json` (rekomendacja):

```text
<obszar>.<zdarzenie>
```

Przykłady: `auth.loginSuccess`, `auth.invalidCredentials`, `house.created`, `action.added`, `message.sendFailed`.

Prefiks namespace w kluczu (`api:…`) albo zawsze `ns: 'api'` — wybrać jedną konwencję w implementacji i trzymać się jej.

## As-is vs kierunek

| Stan | Opis |
|------|------|
| **As-is** | Backend często zwraca surowy PL lub EN; część kluczy już wygląda jak i18n (`sendMessage.successMessage`); UI mapuje wybrane auth messages lokalnie |
| **Kierunek** | Wszystkie nowe i refaktorowane odpowiedzi → klucz w `api.json` (pl + en) |

## Fallback do czasu pełnej migracji

Jeśli SPA **nie znajdzie** klucza w `api` (ani w uzgodnionym mapowaniu):

→ pokaż **surowy** string z `message` (jak dziś przy nieprzetłumaczonych odpowiedziach).

Nie blokuj UX pustym tostem. Przy refaktorze endpointu: dodaj klucz PL+EN **w tym samym** kroku co zmiana API (DoD utrzymaniowy).

## Obowiązki przy zmianie

| Warstwa | Obowiązek |
|---------|-----------|
| Nowy / zmieniony komunikat API | Klucz w `en/api.json` i `pl/api.json` |
| Tylko copy UI (przycisk, label) | Odpowiedni namespace UI — bez ruszania API |
| Testy backend | Mogą asercjować klucz `message`, nie przetłumaczony tekst |

## Poza zakresem

- Pełny audyt wszystkich stringów w `locales/`.
- RTL / trzeci język.
- Formatowanie dat/kwot (locale) — osobna decyzja UI, nie ten kontrakt `message`.
