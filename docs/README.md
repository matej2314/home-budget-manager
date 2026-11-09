---
wersja: 2
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-08
---

# Dokumentacja — Home Budget Manager

Indeks lokalnego zestawu w `docs/`. Odbiorcy: utrzymanie / refaktor oraz portfolio / rekruter.

## Jak czytać (rekomendowana kolejność)

1. [dokumentacja_koncepcyjna.md](./dokumentacja_koncepcyjna.md) — cel produktu, role, core vs otoczka  
2. [architektura.md](./architektura.md) — styl, warstwy, kierunek lekkiego refaktoru (R1–R5)  
3. [architektura_katalogi_pliki.md](./architektura_katalogi_pliki.md) — drzewo as-is i docelowe  
4. [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md) — HTTP `/api/v1`, WebSocket, e-mail  
5. [data_flow.md](./data_flow.md) — przepływy end-to-end  

Dalej według tematu (słownik, testy, deploy, security, …).

## Mapa temat → plik

| Temat | Plik |
|-------|------|
| Cel produktu, zakres, role | [dokumentacja_koncepcyjna.md](./dokumentacja_koncepcyjna.md) |
| Architektura systemu | [architektura.md](./architektura.md) |
| Struktura katalogów | [architektura_katalogi_pliki.md](./architektura_katalogi_pliki.md) |
| Kontrakt HTTP / WS / e-mail | [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md) |
| Słownik pojęć | [dictionary.md](./dictionary.md) |
| Przepływy danych | [data_flow.md](./data_flow.md) |
| Anty-patterny | [anty_patterny.md](./anty_patterny.md) |
| Strategia testów (backend / Jest) | [testy.md](./testy.md) |
| Logi, health, alerting CI | [observability.md](./observability.md) |
| Local / production, Docker, Jenkins | [deployment.md](./deployment.md) |
| Bezpieczeństwo (auth, role, uploady) | [bezpieczenstwo.md](./bezpieczenstwo.md) |
| Zmienne środowiskowe | [katalog_env.md](./katalog_env.md) |
| Model danych MySQL + Prisma Migrate | [model_danych.md](./model_danych.md) |
| i18n UI ↔ `message` API | [i18n_kontrakt_ui.md](./i18n_kontrakt_ui.md) |

## Skróty decyzyjne

| Decyzja | Gdzie |
|---------|--------|
| Role `user` / `host` / `inmate` / `superadmin` | koncepcja, dictionary, bezpieczeństwo |
| Prefiks `/api/v1` | komunikacja, data_flow, testy |
| Lekki refaktor R1–R6 (w tym Prisma) | architektura |
| DoD testów przed push/merge | testy |
| Env bez wartości w git | katalog_env, deployment, bezpieczeństwo |

Root `README.md` repozytorium opisuje instalację i demo — ten katalog jest **normą projektową** dla utrzymania i dalszej pracy.
