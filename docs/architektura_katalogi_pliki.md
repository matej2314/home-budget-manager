---
wersja: 6
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-24
---

# Architektura katalogów i plików — Home Budget Manager

## Cel dokumentu

Utrwala **układ katalogów** spójny ze stylem z `architektura.md`: modularny monolit warstwowy, lekki porządek (bez wywracania struktury do pionowych `modules/<feature>`).

Dokument ma **dwa bloki**: **Blok B = stan faktyczny** (po lekkim refaktorze) oraz **Blok A = snapshot historyczny** sprzed R1–R6/ESM (dla kontekstu driftu). Nie zastępuje kontraktu I/O ani planu wdrożenia.

**Sync 2026-11-24:** Blok B opisuje żywe drzewo; Blok A nie jest już „stanem obecnym”.

Nazwy katalogów procesów w repo: **`backend/`** i **`frontend/`** (małe litery).

## Zasada: styl → katalogi

| Ustalenie architektoniczne | Konsekwencja w drzewie |
|----------------------------|-------------------------|
| Warstwy `routes → controllers → services → database` | **Poziomy** układ folderów w `backend/` |
| Rdzeń vs otoczka | Nazewnictwo / grupowanie w `services/` (i odpowiadające moduły w `database/`), nie osobne repo |
| ES modules | `backend/package.json` z `"type": "module"`; import/export w całym procesie API (**wdrożone**) |
| Prisma ORM | `prisma/schema.prisma` + `prisma/migrations/`; klient i dostęp wyłącznie przez warstwę `database/` (**R6 wdrożone**) |
| WS, cron, OCR = adaptery | `configs/` (websocket, tesseract), `tasks/`, `store/` (multer) — bez top-level `workers/` w v1 |
| Frontend: Zustand + Context | Oba w **jednym** katalogu stanu (`store/`), jak dziś |
| Uploady w backend | `public/`, `app-images/` pozostają przy API |

**Poza zakresem drzewa v1:** monorepo `apps/` + `packages/`, katalog `modules/<obszar>/` z wewnętrznymi warstwami, osobny `src/contexts/`.

---

## Blok A — snapshot historyczny (przed lekkim refaktorem)

**Nie opisuje stanu repo z 2026-11-24.** Zachowany jako odniesienie do tego, co usunięto (CJS, `*Queries`, brak `prisma/` / `services/board/`).

```text
home-budget-manager/
├── backend/
│   ├── server.js
│   ├── package.json             # as-is: CommonJS (bez "type": "module")
│   ├── Dockerfile
│   ├── configs/                 # logger, swagger, jwtCookie, websocket, tesseract
│   ├── routes/                  # montowanie ścieżek HTTP
│   ├── middlewares/             # verifyJWT, verifyRole, websocket/
│   ├── controllers/             # handlery HTTP (płaski katalog plików)
│   ├── services/                # podfoldery tylko dla części obszarów
│   │   ├── actionCatServices/
│   │   ├── cookiesTourServices/
│   │   ├── homePageDataServices/
│   │   ├── householdServices/
│   │   ├── messagesServices/
│   │   ├── transactionServices/
│   │   └── usersServices/
│   ├── database/                # as-is: db.js + *Queries.js (raw SQL — do usunięcia w R6)
│   ├── tasks/                   # cron: bilans, dzienne transakcje/budżet
│   ├── store/                   # multer: avatar, receipt, screens
│   ├── utils/                   # validation, checkUtils, householdUtils, …
│   ├── public/user-photos/      # uploady użytkowników
│   └── app-images/              # statyczne ekrany (/screens)
│   # brak prisma/ w as-is — cel Bloku B / R6
│   # brak services/board/ — logika board w controller + *Queries
├── frontend/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── public/                  # locales (pl/en), logo, favicon
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/               # Home, About, Contact, Dashboard, Error
│       │   ├── dashboard-subpages/
│       │   └── adminpanel-subpages/
│       ├── components/          # dashboard, forms, home-page, modals, admin, charts
│       ├── store/               # Zustand + *Context.jsx (auth, socket, data, theme)
│       ├── configs/             # router, i18n, calendar
│       ├── hooks/
│       └── utils/
├── docs/
├── docker-compose.yml
└── README.md
```

### Uwagi do snapshotu A

- Historycznie: niepełne `services/`, CommonJS, raw SQL / `*Queries`, rola `mate`, brak `prisma/`.
- Frontend już wtedy trzymał Context i Zustand w `store/` — wzorzec utrzymany w Bloku B.

---

## Blok B — stan faktyczny (po lekkim refaktorze)

Żywy układ katalogów w repo: warstwy, podfoldery `services/<obszar>/` (w tym `board/`, `shell/`), **ESM**, **Prisma**. Bez feature-modules.

```text
home-budget-manager/
├── backend/
│   ├── server.js
│   ├── package.json             # "type": "module" (ESM)
│   ├── Dockerfile
│   ├── configs/
│   │   ├── logger.js
│   │   ├── swaggerConfig.js
│   │   ├── jwtCookieOptions.js
│   │   ├── websocketConfig.js
│   │   └── tesseract.js
│   ├── routes/
│   ├── middlewares/
│   │   └── websocket/
│   ├── controllers/             # nadal płasko lub 1:1 z obszarami — bez nowej warstwy
│   ├── services/
│   │   ├── auth/
│   │   ├── household/
│   │   ├── invitations/
│   │   ├── transactions/
│   │   ├── categories/
│   │   ├── budget/              # initial / monthly budget
│   │   ├── board/               # dashboard / agregaty odczytu domu (ścieżka /board)
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── users/               # profil, awatary (logika aplikacji)
│   │   ├── receipt/             # orkiestracja OCR (adapter w configs/store)
│   │   └── shell/               # homepage, reviews, gallery, cookiesTour
│   ├── prisma/
│   │   ├── schema.prisma        # źródło prawdy schematu MySQL
│   │   └── migrations/          # obowiązkowa historia Prisma Migrate
│   ├── database/
│   │   ├── prismaClient.js      # singleton Prisma Client
│   │   └── …                    # moduły dostępu per obszar (auth, households, board, …)
│   │                            # bez raw SQL; bez historycznych *Queries;
│   │                            # join po relacjach Prisma (include), nie Map w JS
│   ├── tasks/                   # adaptery cron (zostają w procesie API; wołają services)
│   ├── store/                   # multer storages
│   ├── utils/
│   ├── public/user-photos/
│   └── app-images/
├── frontend/
│   ├── public/
│   │   └── locales/
│   └── src/
│       ├── pages/
│       │   ├── dashboard-subpages/    # rdzeń UX budżetu
│       │   └── adminpanel-subpages/   # otoczka operacyjna (superadmin)
│       ├── components/
│       │   ├── dashboard/
│       │   ├── forms/
│       │   ├── home-page-components/  # landing / otoczka
│       │   ├── modals/
│       │   ├── admin-panel-components/
│       │   └── charts/
│       ├── store/               # Zustand + Context (bez osobnego contexts/)
│       ├── configs/
│       ├── hooks/
│       └── utils/
├── docs/
├── docker-compose.yml
└── README.md
```

### Co Blok B domknął względem snapshotu A (skrót)

| Zmiana | Status |
|--------|--------|
| Podfoldery `services/<obszar>/` + `shell/` | **Wdrożone** |
| Jawne `invitations/`, `budget/`, `board/`, `notifications/`, `receipt/` | **Wdrożone** |
| ESM w `backend/` | **Wdrożone** |
| `prisma/` + `database/` na Prisma | **Wdrożone** (R6) |
| Front: Context + Zustand w `store/` | **Utrzymane** |
| Brak `workers/` | **Świadomie** (R4 — workery odroczone) |

### Czego drzewo v1 nadal nie robi

- Nie przenosi Prisma Client do services / controllers ani nie wprowadza warstwy `domain/`.
- Nie dzieli frontu na `features/<name>/` z wymuszonym data-layer.
- Nie wydziela uploadów poza `backend/` (volumes — `deployment.md`); port `ObjectStorage` — major Faza 11.
- Nie usuwa dual mount HTTP (to kod routera — major Faza 10).

## Relacja do lekkiego refaktoru (R1–R6 + ESM)

| ID | Wpływ na katalogi | Status |
|----|-------------------|--------|
| ESM | `package.json` + importy w `backend/` | Domknięte |
| R1 (`inmate`) | Treści / symbole; bez osobnej gałęzi folderów | Domknięte |
| R2 (pipeline) | Logika w `services/<obszar>/` | Domknięte |
| R3 (obszary) | `shell/` vs rdzeń, w tym `board/` | Domknięte |
| R4 (WS/cron) | Bez katalogów workerów w v1 | Domknięte (w procesie) |
| R5 (frontend) | Układ `pages` / `components` / `store` | Domknięte |
| R6 (Prisma) | `prisma/` + API w `database/` | Domknięte |

## Jak czytać dalej

- Decyzje warstw i stylu: [architektura.md](./architektura.md)
- Kontrakt komunikacji: [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md)
- Deploy / volumes: [deployment.md](./deployment.md)
