---
wersja: 7
data_utworzenia: 2026-11-07
data_modyfikacji: 2026-11-24
---

# Model danych — Home Budget Manager

## Cel

Logiczny model MySQL: encje, kluczowe pola, relacje. Bez pełnego dumpa typów kolumna-po-kolumnie.  
**Schemat wykonywalny i migracje:** Prisma (`prisma/schema.prisma` + Prisma Migrate) — norma w [architektura.md](./architektura.md).  
Słownik pojęć: [dictionary.md](./dictionary.md). Przepływy zapisów: [data_flow.md](./data_flow.md).

## Diagram relacji (rdzeń)

```mermaid
erDiagram
  users ||--o{ householdUsers : membership
  households ||--o{ householdUsers : has
  users ||--o| households : creates_as_host
  households ||--o{ invitations : receives
  users ||--o{ invitations : invites_or_is_invited
  households ||--o{ transactions : records
  users ||--o{ transactions : performs
  actionCategories ||--o{ transactions : classifies
  households ||--o{ initialMonthlyBudgets : declares
  users ||--o{ messages : sends_or_receives
  households ||--o{ notifications : notices
  users ||--o| socketConnections : realtime
  households ||--o{ dailyTransactions : snapshot
  households ||--o{ dailyBudget : snapshot
  households ||--o{ monthly_balances : snapshot
  households ||--o{ monthlyTransactionCounts : snapshot
  users ||--o{ usersReviews : writes
```

## Role w modelu

| Miejsce | Pola | Znaczenie |
|---------|------|-----------|
| `users.role` | `user` \| `host` \| `inmate` \| `superadmin` | Rola globalna konta (sesja JWT) |
| `users.host` / `users.inmate` | flagi / odniesienia pomocnicze | Wskazanie kontekstu gospodarstwa przy awansie do `host` / `inmate` |
| `householdUsers.role` | `host` \| `inmate` | Rola **w składzie** danego domu |

Reguła produktowa: użytkownik w co najwyżej jednym gospodarstwie naraz; `user` / brak aktywnego membershipu budżetowego = wiersz `householdUsers` z **`houseId = NULL`** (nie sentinel `"0"`).

---

## Rdzeń

### `users`

Konto aplikacji.

| Pole (kluczowe) | Opis |
|-----------------|------|
| `id` | PK (UUID) |
| `name` | Nazwa wyświetlana / loginowa |
| `email` | Unikalny identyfikator logowania |
| `password` | Hash bcrypt |
| `role` | Rola globalna |
| `host` / `inmate` | Flagi / powiązania kontekstu domu |
| `avatarName` | Nazwa pliku awatara (opcjonalnie) |
| `acceptCookies` / `completeTour` | Preferencje UI / tour |

### `households`

Gospodarstwo.

| Pole (kluczowe) | Opis |
|-----------------|------|
| `houseId` | PK |
| `userId` | Twórca (host) |
| `userName` | Nazwa hosta (denormalizacja) |
| `houseName` | Nazwa domu |
| `initBudget` | Budżet startowy / bazowy |
| `currentBalance` | Bieżące saldo |
| `createdAt` / `monthlyBalanceDate` | Daty operacyjne / bilansu |

### `householdUsers`

Membership użytkownika w domu (1:1 z `users` po `userId`).

| Pole (kluczowe) | Opis |
|-----------------|------|
| `userId` | FK → users (unikalny) |
| `houseId` | FK → `households.houseId` (**nullable**); `NULL` = brak aktywnego domu; wartość niebędąca `NULL` musi istnieć w `households` |
| `userName` | Nazwa w kontekście domu |
| `role` | `host` \| `inmate` (przy braku domu zwykle rola globalna / `user` w polu membership) |

Relacja w schemacie Prisma: `householdUsers.households` ↔ `households.householdUsers` (constraint FK w MySQL). Odczyty „dom + członkowie” w warstwie `database/` przez `include` relacji — bez ręcznego sklejania w JS.

### `invitations`

Zaproszenia do gospodarstwa.

| Pole (kluczowe) | Opis |
|-----------------|------|
| `id` | PK |
| `status` | Stan zaproszenia |
| `invitingUserId` / `invitedUserId` | Strony zaproszenia |
| `houseId` / `hostId` | Dom i host decyzyjny |
| `date` | Czas utworzenia |

### `transactions`

Transakcje (przychód / wydatek).

| Pole (kluczowe) | Opis |
|-----------------|------|
| `id` / `transactionId` | Identyfikatory rekordu |
| `userId` / `houseId` | Kto / w którym domu |
| `catId` | FK → `actionCategories` |
| `type` | `income` \| `expense` |
| `value` | Kwota |
| `addedAt` | Czas dodania |

### `actionCategories`

Kategorie transakcji.

| Pole (kluczowe) | Opis |
|-----------------|------|
| `id` | PK |
| `name` | Nazwa |
| `type` | Typ / klasyfikacja kategorii |

### `initialMonthlyBudgets`

Deklaracje budżetu miesięcznego.

| Pole (kluczowe) | Opis |
|-----------------|------|
| `id` | PK |
| `houseId` | FK → households |
| `value` | Kwota |
| `validUntil` / `addedAt` | Ważność / czas dodania |

### `messages`

Czat wewnętrzny.

| Pole (kluczowe) | Opis |
|-----------------|------|
| `id` | PK |
| `senderId` / `recipientId` | FK → users |
| `content` | Treść |
| `datetime` | Czas |
| `is_read` | Przeczytane |

### `notifications`

Powiadomienia powiązane z domem.

| Pole (kluczowe) | Opis |
|-----------------|------|
| `id` | PK |
| `houseId` | FK → households |
| `category` | Kategoria notice |
| `noticeData` | Payload (JSON / tekst) |

### `socketConnections`

Rejestr aktywnych połączeń Socket.io.

| Pole (kluczowe) | Opis |
|-----------------|------|
| `id` | PK |
| `userId` | FK → users |
| `connectionId` | Id socketu |
| `expireDate` | TTL / wygaśnięcie |

---

## Snapshoty / projekcje (cron)

Nie zastępują tabeli `transactions` — służą zestawieniom i bilansom okresowym.

| Tabela | Rola |
|--------|------|
| `dailyTransactions` | Dzienna liczba / agregat transakcji per dom |
| `dailyBudget` | Dzienny snapshot wartości budżetu / salda |
| `monthly_balances` | Miesięczny bilans domu |
| `monthlyTransactionCounts` | Licznik transakcji w oknie bilansu |

Źródło prawdy operacyjnej na bieżąco: `transactions` + `households.currentBalance`. Snapshoty zasilane taskami z `tasks/`.

---

## Otoczka

### `technologies`

Pozycje stacku na landingu (`id`, `name`, `icon`).

### `usersReviews`

Recenzje (`id`, `rating`, `content`, `userName`, `userId`, `date`).

### Galeria screenshotów

Pliki w storage backendu (`app-images` / multer) — **bez** osobnej tabeli jako źródła prawdy w modelu v1.

---

## Zasady spójności (skrót)

1. Transakcja zawsze w kontekście `houseId` członka domu (membership z niepustym `houseId`).  
2. Zmiana salda domu towarzyszy mutacji transakcji (przepływ D).  
3. Usunięcie domu / użytkownika pociąga czyszczenie powiązanych transakcji i membershipu (logika w services): odpięcie od domu = **`houseId = NULL`**, nie `"0"`.  
4. Powiadomienia i WS opierają się na `houseId` / `userId` z tych tabel — nie na zaufaniu do klienta.  
5. Sentinel historyczny `houseId = "0"` jest **zabroniony** (łamie FK i semantykę „brak domu”).

## Schemat i migracje (Prisma)

| Norma | Opis |
|-------|------|
| Źródło prawdy schematu | `backend/prisma/schema.prisma` — modele odpowiadają encjom powyżej (mapowanie nazw tabel/pól w schema) |
| Zmiana modelu | Najpierw aktualizacja `schema.prisma`, potem **obowiązkowa** migracja Prisma Migrate w `prisma/migrations/` |
| Dostęp runtime | Wyłącznie Prisma Client przez warstwę `database/` — bez raw SQL |
| Relacje | Gdzie w MySQL jest FK, schema Prisma ma `@relation`; zapytania złożone w `database/` używają `include` / filtrów relacji zamiast ręcznego joinu w aplikacji |
| Ręczne DDL | Zabronione jako proces utrzymania schematu (phpMyAdmin tylko diagnostyka / awaryjne odczyty — nie jako pipeline zmian) |

Katalog `backend/prisma/` (schema + migracje) oraz moduły Prisma w `backend/database/` są **wdrożone (R6 / major Faza 7)**; historyczny pool / `*Queries` nie występuje w ścieżkach runtime.

**Sync 2026-11-24:** model i migracje = stan faktyczny, nie „kierunek do R6”.

## Seed (dev / test)

| Norma | Opis |
|-------|------|
| Cel | Powtarzalne dane startowe pod **local/dev** oraz **środowisko testowe** (nie produkcja) |
| Narzędzie | Seed Prisma (skrypt seed powiązany z projektem Prisma) — spójny ze `schema.prisma` |
| Zakres | Minimalny zestaw umożliwiający ścieżki krytyczne (m.in. użytkownik, kategorie gdy wymagane przez transakcje); bez sekretów produkcyjnych |
| Prod | Seed **nie** jest częścią deployu produkcyjnego |

Szczegóły uruchamiania w testach: [testy.md](./testy.md).

## Prisma Studio

**Prisma Studio** — dozwolone narzędzie operatorskie/deweloperskie do podglądu i ręcznej inspekcji danych na bazach **non-prod**. Nie zastępuje migracji, seeda ani warstwy `database/` w aplikacji. Na produkcji — tylko świadomie i ostrożnie (jak inne klienty SQL); nie jest powierzchnią produktu.

## Poza tym dokumentem

- Pełna lista indeksów i mikro-optymalizacja typów w schema (ew. kolejne migracje).  
- Optymalizacja zapytań dashboardu / osobne read-modele.
