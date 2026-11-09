---
wersja: 1
data_utworzenia: 2026-11-09
data_modyfikacji: 2026-11-09
---

# SPEC — jak czytać

## Docs vs SPEC

| Warstwa | Rola |
|---------|------|
| **`docs/`** | Wspólne rozumienie systemu: koncepcja, architektura, kontrakty I/O, przepływy, testy, deploy — *dlaczego / jak system jest pomyślany*. |
| **`spec/SPEC-*.md`** | Norma przy **pisaniu kodu** w danym obszarze: wzorce, wolno/nie wolno, stack, wymagania egzekwowalne — *co obowiązuje przy implementacji*. |

SPEC **uszczegóławia** dokumentację; nie zastępuje jej i nie redefiniuje ustaleń docs. Przy sprzeczności najpierw aktualizuj docs, potem SPEC.

## Mapa obszar → plik

| Obszar | Plik |
|--------|------|
| Backend (warstwy, katalogi, Prisma, błędy, logi) | [SPEC-BACKEND.md](./SPEC-BACKEND.md) |
| Komunikacja (HTTP `/api/v1`, WS, e-mail) | [SPEC-KOMUNIKACJA.md](./SPEC-KOMUNIKACJA.md) |
| Frontend (SPA, stan, i18n) | [SPEC-FRONTEND.md](./SPEC-FRONTEND.md) |
| Bezpieczeństwo (SESSID, role, helmet, OCR) | [SPEC-BEZPIECZENSTWO.md](./SPEC-BEZPIECZENSTWO.md) |
| Dane (model, migracje, seed, Studio) | [SPEC-DANE.md](./SPEC-DANE.md) |
| Testy (Jest, DoD, ścieżki krytyczne) | [SPEC-TESTY.md](./SPEC-TESTY.md) |

## Kolejność czytania (rekomendacja)

1. [docs/README.md](../docs/README.md) — indeks dokumentacji.  
2. Odpowiedni `SPEC-*.md` dla obszaru, w którym zmieniasz kod.  
3. Odwołania krzyżowe w nagłówku tego SPEC (inne obszary + docs).

## Źródło

Zestaw powstał na bazie katalogu **`docs/`** projektu Home Budget Manager oraz ustaleń wywiadu SPEC (m.in. Prisma, stdout, helmet, seed). Pliki SPEC żyją wraz z projektem — przy driftcie aktualizuj najpierw docs, potem normę w `spec/`.
