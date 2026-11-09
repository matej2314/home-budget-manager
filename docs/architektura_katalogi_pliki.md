---
wersja: 4
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-09
---

# Architektura katalogów i plików — Home Budget Manager

## Cel dokumentu

Propozycja i utrwalenie **układu katalogów** spójnego ze stylem z `architektura.md`: modularny monolit warstwowy, lekki porządek (bez wywracania struktury do pionowych `modules/<feature>`).

Dokument ma **dwa bloki**: stan obecny (as-is) oraz docelowy po lekkim uporządkowaniu. Nie zastępuje kontraktu I/O ani planu wdrożenia refaktoru plik-po-pliku.

Nazwy katalogów procesów w repo: **`backend/`** i **`frontend/`** (małe litery) — zgodne z aktualnym drzewem; historyczne zapisy `Backend/` / `Frontend/` w starszych notatkach oznaczają te same katalogi.

## Zasada: styl → katalogi

| Ustalenie architektoniczne | Konsekwencja w drzewie |
|----------------------------|-------------------------|
| Warstwy `routes → controllers → services → database` | **Poziomy** układ folderów w `backend/` |
| Rdzeń vs otoczka | Nazewnictwo / grupowanie w `services/` (i odpowiadające moduły w `database/`), nie osobne repo |
| ES modules | `backend/package.json` z `"type": "module"`; import/export w całym procesie API (stan docelowy) |
| Prisma ORM | `prisma/schema.prisma` + `prisma/migrations/`; klient i dostęp wyłącznie przez warstwę `database/` |
| WS, cron, OCR = adaptery | `configs/` (websocket, tesseract), `tasks/`, `store/` (multer) — bez top-level `workers/` w v1 |
| Frontend: Zustand + Context | Oba w **jednym** katalogu stanu (`store/`), jak dziś |
| Uploady w backend | `public/`, `app-images/` pozostają przy API |

**Poza zakresem drzewa v1:** monorepo `apps/` + `packages/`, katalog `modules/<obszar>/` z wewnętrznymi warstwami, osobny `src/contexts/`.

---

## Blok A — as-is

Układ zbliżony do aktualnego repozytorium (uproszczony; bez `node_modules`).

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

### Uwagi do as-is

- Nie każdy obszar API ma osobny podfolder w `services/` (np. zaproszenia, budżet miesięczny, OCR, **board** — logika rozproszona między controller / database / utils).
- Frontend trzyma **Context i Zustand w `store/`** — to zamierzony wzorzec do utrzymania.
- Nazewnictwo ról w kodzie może jeszcze używać `mate`; norma docs: `inmate` (bez wymogu osobnego katalogu pod rename).
- Backend as-is ładuje moduły w **CommonJS** — docelowo ESM (Blok B / `architektura.md`).

---

## Blok B — docelowe (lekki porządek)

Ten sam szkielet warstw i root monorepo. Zmiany: **domknięcie podfolderów usług**, czytelniejszy podział rdzeń vs otoczka, spójniejsze nazwy obszarów względem `architektura.md`, **ESM**. Bez migracji na feature-modules.

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
│   │   └── …                    # moduły dostępu per obszar (auth, household, board, …)
│   │                            # bez raw SQL; bez historycznych *Queries
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

### Co się zmienia względem Bloku A (skrót)

| Zmiana | Po co |
|--------|--------|
| Podfoldery `services/<obszar>/` dla całego rdzenia + `shell/` | Spójność z obszarami z `architektura.md`; łatwiejsze utrzymanie |
| Jawne `invitations/`, `budget/`, `board/`, `notifications/`, `receipt/` | Domknięcie luk as-is (w tym dashboard `/board`) |
| `shell/` dla homepage / reviews / gallery / cookiesTour | Oddzielenie otoczki od rdzenia bez nowego stylu architektury |
| ESM w `backend/` | Jednolity model importów; norma z `architektura.md` |
| `prisma/` + `database/` na Prisma | ORM zamiast pool/`*Queries`; migracje w repo |
| Front: bez `contexts/` | Zgodne z decyzją: Context zostaje w `store/` |
| Brak `workers/` | Workery cron/WS — tylko „do rozważenia później” w architekturze |

### Czego drzewo docelowe nie robi

- Nie przenosi Prisma Client ani raw SQL do services / controllers ani nie wprowadza warstwy `domain/`.
- Nie oznacza samo w sobie „cienkich controllerów” — to osobny krok pipeline (**R2**); Blok B to **mapa katalogów i obszarów**.
- Nie dzieli frontu na `features/<name>/` z wymuszonym data-layer.
- Nie wydziela uploadów poza `backend/` (volumes w deploy to temat `deployment.md`).

## Relacja do lekkiego refaktoru (R1–R6 + ESM)

| ID | Wpływ na katalogi |
|----|-------------------|
| ESM | `package.json` + importy w `backend/`; bez nowej gałęzi folderów |
| R1 (`inmate`) | Przede wszystkim treści plików / nazwy symboli; drzewo bez osobnej gałęzi |
| R2 (pipeline) | Przesuwanie logiki między istniejącymi warstwami + nowe pliki w `services/<obszar>/` |
| R3 (obszary) | Grupowanie jak w Bloku B (`shell/` vs rdzeń, w tym `board/`) |
| R4 (WS/cron) | Bez nowych katalogów workerów w v1 |
| R5 (frontend) | Porządek nazw/komponentów w istniejącym układzie `pages` / `components` / `store` |
| R6 (Prisma) | Dodanie `prisma/`; przebudowa `database/` na Prisma; usunięcie `*Queries` / pool |

## Jak czytać dalej

- Decyzje warstw i stylu: [architektura.md](./architektura.md)
- Kontrakt komunikacji: [dokumentacja_komunikacji.md](./dokumentacja_komunikacji.md)
- Deploy / volumes: [deployment.md](./deployment.md)
