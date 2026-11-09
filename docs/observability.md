---
wersja: 3
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-08
---

# Observability — Home Budget Manager

## Cel

Jak system jest **obserwowany** w v1: sygnały, narzędzia, instrumentacja, alerting na starcie.  
Wdrożenie i środowiska: `deployment.md`. Kontrakt I/O: `dokumentacja_komunikacji.md` (bez dublowania webhooków alertów jako osobnej powierzchni produktowej).

## Filary v1

| Filar | W zakresie v1 | Decyzja |
|-------|---------------|---------|
| **Logi** | Tak | Rdzeń observability |
| **Metryki** (Prometheus itd.) | Nie | Świadomie poza |
| **Tracing** (OpenTelemetry itd.) | Nie | Świadomie poza |
| **RUM / frontend observability** | Nie | Świadomie poza |
| **APM / Sentry / vendor error-tracker** | Nie | **Nie wchodzi** do normy (ani jako kierunek w tym dokumencie) |

## Narzędzia (zatwierdzony stack — stan docelowy)

| Element | Rola |
|---------|------|
| **Winston** | Logger aplikacji backendu |
| **Transport** | **stdout** procesu (Console / stream procesu Node) — jedyny kanał logów aplikacji w normie docelowej |
| **Docker / runtime** | Odczyt logów kontenera / procesu (`docker logs`, agregator hosta podpięty pod stdout/stderr) — **bez** volume `Backend/logs/` |
| **Jenkins / CI** | Sygnał operacyjny: fail build / pipeline = eskalacja „coś poszło nie tak” przy zmianach |

| As-is (do usunięcia przy refaktorze loggera) | Uwaga |
|-----------------------------------------------|--------|
| `winston-daily-rotate-file`, pliki w `Backend/logs/`, volume logów w compose | Historyczne; **nie** są normą docelową |

Brak centralnego ELK/Loki/Grafana w normie v1 (stdout może być zbierany przez infrastrukturę hosta poza tym dokumentem — bez wymogu nowego stacku w aplikacji).

## Instrumentacja

### Gdzie powstają sygnały

- **Aplikacja backend (Express + Socket.io + cron):** `logger.info` / `logger.error` w controllerach, services, websocket, taskach → **stdout**.
- **Infrastruktura:** restart kontenera (`restart: always`), logi runtime kontenera — poza szczegółowym kontraktem aplikacji, ale zgodne z modelem „aplikacja pisze na stdout”.
- **Frontend:** brak instrumentacji observability w v1 docs.

### Konwencje

| Temat | Norma |
|-------|--------|
| Format | Timestamp + poziom + wiadomość tekstowa (Winston `printf` lub równoważny) na **stdout** |
| Poziomy | Co najmniej `error` oraz poziomy informacyjne używane świadomie; bez osobnych plików `error-*.log` / `combined-*.log` |
| Correlation ID | Nie jest dziś standardem envelope HTTP; **nie** wprowadzamy Sentry — korelacja może być późniejszym usprawnieniem logów, bez zmiany listy filarów |
| Co logować obowiązkowo | Start/stop serwera, błędy catch w ścieżkach API/WS/cron, odmowy krytyczne (auth/rola) gdy już logowane |
| Czego unikać | Hasła, pełne tokeny JWT, treści wrażliwe w cleartext; spam `info` na każdy happy-path bez wartości diagnostycznej; zapis logów aplikacji do plików w kontenerze / repo |

### Healthcheck (norma docs)

Dodać endpoint:

`GET /api/v1/health`

| Oczekiwanie | Opis |
|-------------|------|
| **200** | Proces API żyje; body proste, np. `{ "status": "ok" }` (lub równoważne) |
| Auth | Publiczny (bez `SESSID`) |
| Zależności | v1: **liveness** procesu; głęboki check DB opcjonalny później (nie blokuje wprowadzenia prostego health) |

Użycie: monitoring kontenera / reverse proxy / ręczny smoke po deployu. Implementacja dogania normę docs.

## Alerting i SLI/SLO

| Element | v1 |
|---------|-----|
| **Alert / eskalacja** | Fail **CI / Jenkins** przy złym buildzie lub testach; diagnostyka z **stdout** procesu / logów kontenera |
| **SLO / error budget** | Nie definiujemy w v1 |
| **Pager / Discord / mail alerty runtime** | Nie |
| **Sentry** | Nie |

Nie alertujemy na każdy `logger.error` automatycznie — najpierw logi (stdout) + świadomy fail pipeline.

## Granice względem innych docs

| Dokument | Podział |
|----------|---------|
| [deployment.md](./deployment.md) | Jak i gdzie stoi stack, env, compose, NGINX; brak volume logów plikowych w stanie docelowym |
| [testy.md](./testy.md) | Bramka jakości przed merge/push — uzupełnia CI, nie zastępuje logów prod |
| [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md) | Kontrakt HTTP/WS/e-mail; health w observability + ścieżka w kontrakcie |

## Poza zakresem (przypomnienie)

Metryki, distributed tracing, RUM, Sentry/APM vendor, obowiązkowy centralny stack log aggregation w aplikacji, pełne SLO — wymagają osobnej decyzji produktowej / docs poza obecną normą v1.
