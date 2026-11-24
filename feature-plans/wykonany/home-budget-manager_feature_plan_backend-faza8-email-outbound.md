# Home Budget Manager — feature plan: backend Faza 8 (e-mail outbound / K-14)

**Kotwica major:** `home-budget-manager_major_plan-backend.md` — **Faza 8** (kroki 8.1–8.3).  
**Źródła:** `docs/dokumentacja_komunikacji.md` (powierzchnia e-mail), `docs/katalog_env.md` (SMTP_*), `docs/data_flow.md` (C), `docs/anty_patterny.md`, `spec/SPEC-KOMUNIKACJA.md` (K-13–K-14), `spec/SPEC-BACKEND.md` (B-2, B-3, B-15), `spec/SPEC-TESTY.md` (T-15, mock SMTP), kod `backend/`.  
**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Pełna Faza 8 major backend: outbound e-mail przy zaproszeniach (obie ścieżki host + inmate), sekrety SMTP w env, mail uzupełnia HTTP/WS (nie zastępuje), scoped testy równolegle z krokami (T-15) |
| Pass rozwojowy | KROK 1 (adapter + testy adaptera) → KROK 2 (trigger + treść + testy triggera; zależy od KROK 1) → KROK 3 (K-13 non-blocking + testy awarii). **Brak innych przesunięć**; bez przenosin między fazami major. Testy **równolegle** z funkcjonalnością — nie odkładane „na koniec fazy” jako pierwsze asercje |
| Poza zakresem | Faza 9 (piramida / T-5), kolejki / retry broker, magic-token invite link, e-mail poza zaproszeniami, edycja docs/SPEC/major w tej sesji, frontend |
| Po implementacji (informacyjnie) | Major: Faza 8 + kroki 8.1–8.3 → `WYKONANY`; `MILESTONE — Outbound e-mail przy zaproszeniach` → `OSIĄGNIĘTY` — **edycja major poza tym skillem** |

### Założenia HOW (zatwierdzone)

1. Trigger po sukcesie walidacji w **obu** ścieżkach: host (`addUserByHost` → od razu inmate) oraz inmate (`addUserByInmate` → pending). Orkiestracja w `services/users/addUserToHouse.js` (B-2 / K-14).
2. Brak / awaria SMTP → log + no-op; **bez** rollbacku zaproszenia / membership (K-13).
3. Env z `docs/katalog_env.md`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`; link dołączenia z `FRONTEND_ORIGIN` (fallback lokalny).
4. Treść: plain text + prosty HTML; instrukcja + nazwa domu + URL SPA — **bez** magic token (kandydat ma już konto, zaproszenie po `userName`).
5. Transport w `configs/` (jak WS/tesseract); wysyłka domenowa w `services/invitations/` (B-3). `nodemailer` już w deps (`^6.9.15`) — bez nowej zależności.
6. API nodemailer (Context7 `/nodemailer/nodemailer-homepage`): `createTransport({ host, port, secure, auth })`, `await transporter.sendMail({ from, to, subject, text, html })`. Pin do major zainstalowanej w repo (v6) — ten sam publiczny kształt co w docs homepage.

---

## FAZA 1 — E-mail outbound przy zaproszeniach (K-14)

### KROK 1 — Adapter SMTP (nodemailer) + sekrety w env + scoped testy adaptera

**Status:** `WYKONANY`

**Cel:** Reużywalny transporter z env; brak sekretów w git; bez SMTP → `null` (no-op później). Major 8.2 (sekrety) + fundament pod 8.1. SPEC-KOMUNIKACJA K-14; `docs/katalog_env.md`.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/configs/mailTransport.js` | **nowy** |
| `backend/.env.example` | dopisek SMTP_* / MAIL_FROM / FRONTEND_ORIGIN |
| `backend/tests/unit/mail-outbound.test.js` | **nowy** (sekcja adaptera w tym kroku; plik rozbudowany w KROK 2–3) |

#### Nowy plik — `backend/configs/mailTransport.js`

```javascript
import nodemailer from 'nodemailer';

/** @type {import('nodemailer').Transporter | null | undefined} */
let transporter;

/**
 * Lazy singleton SMTP. Brak host/user/password → null (K-13: produkt bez skrzynki).
 * Nie logować SMTP_PASSWORD / pełnego auth (B-15).
 */
export function getMailTransporter() {
  if (transporter !== undefined) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    transporter = null;
    return transporter;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

/** Reset lazy cache — wyłącznie pod Jest. */
export function resetMailTransporterForTests() {
  transporter = undefined;
}
```

#### Refaktor — `backend/.env.example`

**teraz** (koniec pliku po `DATABASE_URL`):

```text
DATABASE_URL=mysql://budget_user:budget_password@127.0.0.1:3306/home_budget
```

**zamień na:**

```text
DATABASE_URL=mysql://budget_user:budget_password@127.0.0.1:3306/home_budget

# E-mail outbound (K-14) — opcjonalne; bez nich wysyłka jest no-op
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASSWORD=
# MAIL_FROM="Home Budget Manager <noreply@example.com>"
# FRONTEND_ORIGIN=http://localhost:3000
```

(Wartości pozostają zakomentowane / puste w przykładzie — sekrety nigdy w git.)

#### Testy (ten krok) — fragment `backend/tests/unit/mail-outbound.test.js`

Utwórz plik z poniższą sekcją (kolejne `describe` dopiszesz w KROK 2–3 do **tego samego** pliku):

```javascript
import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';

describe('Faza 8 — mailTransport (K-14 adapter)', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;
    delete process.env.MAIL_FROM;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('bez SMTP_* zwraca null (no-op ready)', async () => {
    const { getMailTransporter, resetMailTransporterForTests } = await import(
      '../../configs/mailTransport.js'
    );
    resetMailTransporterForTests();
    expect(getMailTransporter()).toBeNull();
  });

  test('przy pełnym SMTP tworzy transporter z host/port/auth', async () => {
    process.env.SMTP_HOST = 'smtp.test.local';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'mailer';
    process.env.SMTP_PASSWORD = 'secret';

    const createTransport = jest.fn(() => ({ sendMail: jest.fn() }));
    jest.unstable_mockModule('nodemailer', () => ({
      default: { createTransport },
    }));

    const { getMailTransporter, resetMailTransporterForTests } = await import(
      '../../configs/mailTransport.js'
    );
    resetMailTransporterForTests();
    const t = getMailTransporter();

    expect(createTransport).toHaveBeenCalledWith({
      host: 'smtp.test.local',
      port: 587,
      secure: false,
      auth: { user: 'mailer', pass: 'secret' },
    });
    expect(t).toEqual({ sendMail: expect.any(Function) });
  });
});
```

#### Komenda (scoped)

```bash
cd backend && npm test -- --testPathPattern='mail-outbound'
```

#### DoD (krok)

- `getMailTransporter()` czyta wyłącznie env; brak sekretów w repo / `.env.example` bez prawdziwych haseł.
- Brak SMTP → `null`; z SMTP → `createTransport` z oczekiwanymi polami.
- Testy sekcji adaptera w `mail-outbound` zielone.

---

### KROK 2 — Trigger z service + treść (obie ścieżki) + scoped testy triggera

**Status:** `WYKONANY`

**Cel:** Po udanej walidacji HTTP w `addUserToHouse` wychodzi e-mail do kandydata (host_added / inmate_pending) z instrukcją/linkiem i kontekstem domu. Major 8.1 + 8.2 (treść). K-14; `docs/dokumentacja_komunikacji.md`; `docs/data_flow.md` C.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/services/invitations/sendInvitationEmail.js` | **nowy** |
| `backend/services/users/addUserToHouse.js` | refaktor — wywołanie po sukcesie host/inmate |
| `backend/tests/unit/mail-outbound.test.js` | dopisek sekcji trigger / treść |

#### Nowy plik — `backend/services/invitations/sendInvitationEmail.js`

```javascript
import logger from '../../configs/logger.js';
import { getMailTransporter } from '../../configs/mailTransport.js';
import { findUserById } from '../../database/users.js';
import { findHouseholdById } from '../../database/households.js';

/**
 * Skutek uboczny zaproszenia (K-14). Nigdy nie rzuca — awaria SMTP ≠ rollback (K-13).
 * @param {{ invitedUserId: string, houseId: string, invitingUserName: string, kind: 'host_added' | 'inmate_pending' }} params
 */
export async function sendInvitationEmail({
  invitedUserId,
  houseId,
  invitingUserName,
  kind,
}) {
  try {
    const transporter = getMailTransporter();
    if (!transporter) {
      logger.info('SMTP not configured; invitation email skipped');
      return { sent: false, reason: 'smtp_unconfigured' };
    }

    const user = await findUserById(invitedUserId);
    const house = await findHouseholdById(houseId);
    if (!user?.email || !house?.houseName) {
      logger.warn('invitation email skipped: missing recipient email or house name');
      return { sent: false, reason: 'missing_data' };
    }

    const appUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    const houseName = house.houseName;
    const isPending = kind === 'inmate_pending';

    const subject = isPending
      ? `Invitation to household "${houseName}"`
      : `You joined household "${houseName}"`;

    const text = isPending
      ? [
          `${invitingUserName} invited you to the household "${houseName}".`,
          `Log in at ${appUrl}. The household host must accept the invitation before you join.`,
        ].join('\n')
      : [
          `You were added to the household "${houseName}" by ${invitingUserName}.`,
          `Log in at ${appUrl} to continue.`,
        ].join('\n');

    const html = `<p>${text.replace(/\n/g, '<br/>')}</p>`;

    await transporter.sendMail({
      from,
      to: user.email,
      subject,
      text,
      html,
    });

    return { sent: true };
  } catch (error) {
    logger.error(`invitation email failed: ${error?.message || error}`);
    return { sent: false, reason: 'send_failed' };
  }
}
```

#### Refaktor — `backend/services/users/addUserToHouse.js`

**teraz** (importy + gałęzie host/inmate):

```javascript
import logger from '../../configs/logger.js';
import { addUserByHost } from '../../utils/householdUtils/addUserByHost.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { addUserByInmate } from '../../utils/householdUtils/addUserByInmate.js';
import { invitedUserData } from '../../utils/householdUtils/getInvitedUserData.js';
import { AppError } from '../../utils/errors/AppError.js';

const addUserToHouse = async (userId, userName, invitingUserName, role) => {
  try {
    const invitedUser = await invitedUserData(userName);
    const getHouseId = await checkUserHouse(userId);
    const houseId = getHouseId.houseId;

    if (!invitedUser || !houseId) {
      throw new AppError({
        code: 'USER_1',
        messageKey: 'addUserToHouse.invalidInputError',
        httpStatus: 400,
      });
    }

    if (role === 'host') {
      const addByHost = await addUserByHost(userName, houseId, invitedUser);
      return { messageKey: addByHost.messageKey };
    }

    if (role === 'inmate') {
      const addByInmate = await addUserByInmate(
        userId,
        invitedUser,
        houseId,
        userName,
        invitingUserName,
      );
      return { messageKey: addByInmate.messageKey };
    }
  } catch (error) {
    // ... bez zmian w catch
```

**zamień na:**

```javascript
import logger from '../../configs/logger.js';
import { addUserByHost } from '../../utils/householdUtils/addUserByHost.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { addUserByInmate } from '../../utils/householdUtils/addUserByInmate.js';
import { invitedUserData } from '../../utils/householdUtils/getInvitedUserData.js';
import { AppError } from '../../utils/errors/AppError.js';
import { sendInvitationEmail } from '../invitations/sendInvitationEmail.js';

const addUserToHouse = async (userId, userName, invitingUserName, role) => {
  try {
    const invitedUser = await invitedUserData(userName);
    const getHouseId = await checkUserHouse(userId);
    const houseId = getHouseId.houseId;

    if (!invitedUser || !houseId) {
      throw new AppError({
        code: 'USER_1',
        messageKey: 'addUserToHouse.invalidInputError',
        httpStatus: 400,
      });
    }

    if (role === 'host') {
      const addByHost = await addUserByHost(userName, houseId, invitedUser);
      await sendInvitationEmail({
        invitedUserId: invitedUser.userId,
        houseId,
        invitingUserName,
        kind: 'host_added',
      });
      return { messageKey: addByHost.messageKey };
    }

    if (role === 'inmate') {
      const addByInmate = await addUserByInmate(
        userId,
        invitedUser,
        houseId,
        userName,
        invitingUserName,
      );
      await sendInvitationEmail({
        invitedUserId: invitedUser.userId,
        houseId,
        invitingUserName,
        kind: 'inmate_pending',
      });
      return { messageKey: addByInmate.messageKey };
    }
  } catch (error) {
    // ... bez zmian w catch
```

Kolejność: najpierw reguły domenowe (`addUserByHost` / `addUserByInmate`), **potem** mail — e-mail nie wychodzi przy `AppError` z walidacji.

#### Testy (ten krok) — dopisz do `mail-outbound.test.js`

```javascript
describe('Faza 8 — sendInvitationEmail treść + trigger z addUserToHouse', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.SMTP_HOST = 'smtp.test.local';
    process.env.SMTP_USER = 'mailer';
    process.env.SMTP_PASSWORD = 'secret';
    process.env.MAIL_FROM = 'noreply@test.local';
    process.env.FRONTEND_ORIGIN = 'https://app.test.local';
  });

  test('inmate_pending: sendMail z nazwą domu, instrukcją i URL SPA', async () => {
    const sendMail = jest.fn(async () => ({ messageId: 'm-1' }));
    jest.unstable_mockModule('../../configs/mailTransport.js', () => ({
      getMailTransporter: () => ({ sendMail }),
      resetMailTransporterForTests: () => {},
    }));
    jest.unstable_mockModule('../../database/users.js', () => ({
      findUserById: async () => ({ id: 'u-inv', email: 'candidate@test.local' }),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHouseholdById: async () => ({ houseId: 'h-1', houseName: 'Dom Test' }),
    }));

    const { sendInvitationEmail } = await import(
      '../../services/invitations/sendInvitationEmail.js'
    );

    const result = await sendInvitationEmail({
      invitedUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'alice',
      kind: 'inmate_pending',
    });

    expect(result).toEqual({ sent: true });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'noreply@test.local',
        to: 'candidate@test.local',
        subject: expect.stringContaining('Dom Test'),
        text: expect.stringMatching(/alice[\s\S]*Dom Test[\s\S]*https:\/\/app\.test\.local/i),
      })
    );
  });

  test('addUserToHouse (host i inmate) woła sendInvitationEmail po sukcesie domeny', async () => {
    const sendInvitationEmail = jest.fn(async () => ({ sent: true }));
    jest.unstable_mockModule('../../utils/householdUtils/getInvitedUserData.js', () => ({
      invitedUserData: async () => ({ userId: 'u-inv', houseId: null }),
    }));
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: async () => ({ houseId: 'h-1' }),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/addUserByHost.js', () => ({
      addUserByHost: async () => ({ messageKey: 'addUserToHouse.inviteSuccessMessage' }),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/addUserByInmate.js', () => ({
      addUserByInmate: async () => ({ messageKey: 'addUserToHouse.correctlyAddedByInmate' }),
    }));
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail,
    }));

    const { addUserToHouse } = await import('../../services/users/addUserToHouse.js');

    await addUserToHouse('host-1', 'bob', 'alice', 'host');
    expect(sendInvitationEmail).toHaveBeenCalledWith({
      invitedUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'alice',
      kind: 'host_added',
    });

    sendInvitationEmail.mockClear();
    await addUserToHouse('inmate-1', 'bob', 'carol', 'inmate');
    expect(sendInvitationEmail).toHaveBeenCalledWith({
      invitedUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'carol',
      kind: 'inmate_pending',
    });
  });
});
```

#### Komenda

```bash
cd backend && npm test -- --testPathPattern='mail-outbound'
```

#### DoD (krok)

- Mail dopiero po sukcesie `addUserByHost` / `addUserByInmate` (nie przy 400 z walidacji).
- Obie ścieżki wołają `sendInvitationEmail` z właściwym `kind`.
- Treść zawiera nazwę domu, instrukcję oraz URL z `FRONTEND_ORIGIN`.
- Testy sekcji trigger/treść zielone.

---

### KROK 3 — Mail nie blokuje flow (K-13) + scoped testy awarii SMTP

**Status:** `WYKONANY`

**Cel:** Potwierdzenie, że zaproszenie domyka się przez HTTP/WS/notice bez polegania na skrzynce; awaria `sendMail` nie psuje odpowiedzi sukcesu service. Major 8.3; K-13; T-15.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/tests/unit/mail-outbound.test.js` | dopisek sekcji K-13 |
| (bez zmian produkcyjnych, jeśli KROK 1–2 już mają try/catch no-throw w `sendInvitationEmail`) | weryfikacja zachowania |

Jeśli przy implementacji okaże się, że `await sendInvitationEmail` w `addUserToHouse` wymaga jawnego odizolowania — **nie** zmieniać kontraktu HTTP; ewentualnie `void sendInvitationEmail(...).catch(...)` jest zbędne, bo funkcja już nie rzuca. Zostaw `await` (kolejność logów, prostszy test).

#### Testy (ten krok) — dopisz do `mail-outbound.test.js`

```javascript
describe('Faza 8 — K-13 mail nie blokuje zaproszenia', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('sendInvitationEmail przy throw z sendMail zwraca sent:false, nie rzuca', async () => {
    process.env.SMTP_HOST = 'smtp.test.local';
    process.env.SMTP_USER = 'mailer';
    process.env.SMTP_PASSWORD = 'secret';

    jest.unstable_mockModule('../../configs/mailTransport.js', () => ({
      getMailTransporter: () => ({
        sendMail: jest.fn(async () => {
          throw new Error('SMTP down');
        }),
      }),
      resetMailTransporterForTests: () => {},
    }));
    jest.unstable_mockModule('../../database/users.js', () => ({
      findUserById: async () => ({ id: 'u-inv', email: 'c@test.local' }),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHouseholdById: async () => ({ houseId: 'h-1', houseName: 'Dom' }),
    }));

    const { sendInvitationEmail } = await import(
      '../../services/invitations/sendInvitationEmail.js'
    );

    await expect(
      sendInvitationEmail({
        invitedUserId: 'u-inv',
        houseId: 'h-1',
        invitingUserName: 'alice',
        kind: 'host_added',
      })
    ).resolves.toEqual({ sent: false, reason: 'send_failed' });
  });

  test('addUserToHouse zwraca sukces gdy sendInvitationEmail raportuje send_failed', async () => {
    jest.unstable_mockModule('../../utils/householdUtils/getInvitedUserData.js', () => ({
      invitedUserData: async () => ({ userId: 'u-inv', houseId: null }),
    }));
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: async () => ({ houseId: 'h-1' }),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/addUserByHost.js', () => ({
      addUserByHost: async () => ({ messageKey: 'addUserToHouse.inviteSuccessMessage' }),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/addUserByInmate.js', () => ({
      addUserByInmate: async () => ({ messageKey: 'addUserToHouse.correctlyAddedByInmate' }),
    }));
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail: async () => ({ sent: false, reason: 'send_failed' }),
    }));

    const { addUserToHouse } = await import('../../services/users/addUserToHouse.js');
    const result = await addUserToHouse('host-1', 'bob', 'alice', 'host');
    expect(result).toEqual({ messageKey: 'addUserToHouse.inviteSuccessMessage' });
  });

  test('ścieżka inmate nadal emituje WS invitation (mail ≠ jedyny kanał)', async () => {
    const src = await import('node:fs').then((fs) =>
      fs.readFileSync(
        new URL('../../utils/householdUtils/addUserByInmate.js', import.meta.url),
        'utf8'
      )
    );
    expect(src).toMatch(/broadcastMessage/);
    expect(src).toMatch(/type:\s*['"]invitation['"]/);
    expect(src).toMatch(/createInvitation/);
  });
});
```

#### Komenda

```bash
cd backend && npm test -- --testPathPattern='mail-outbound'
# regresja:
cd backend && npm test
```

#### DoD (krok)

- Awaria / brak SMTP nie zmienia sukcesu `addUserToHouse` po udanej domenie.
- Inmate flow nadal zapisuje invitation + `broadcastMessage` `invitation` (HTTP/WS/notice bez maila).
- Cały plik `mail-outbound.test.js` zielony; brak regresji w `npm test`.

---

#### Propozycja commit message

```text
feat(invitations): send optional SMTP mail after invite validation

Outbound mail supplements HTTP/WS for host and inmate invite paths; missing
or failing SMTP stays a no-op so the product never depends on the mailbox.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| Major Faza 8 DoD | Mail po walidacji; sekrety tylko env; flow bez skrzynki; scoped testy mock SMTP zielone |
| SPEC | K-13, K-14; B-2/B-3/B-15; T-15 |
| Docs | Treść/link/dom + SMTP_* zgodne z komunikacją i katalogiem env — bez wymogu edycji docs w tym skillu (po wdrożeniu prowadzący może zdjąć etykietę „jeszcze nieużywane” w `katalog_env.md` / komunikacji) |
| Nagłówki | Wyłącznie `FAZA` / `KROK`; commit message EN Conventional Commits na końcu fazy |
| Testy równolegle | Adapter, trigger i K-13 mają asercje w swoich krokach — nie „pierwsze testy dopiero w KROK 3” |

## Ślad do major (informacyjnie, po implementacji)

- Faza 8 → `WYKONANY` (kroki 8.1, 8.2, 8.3 → `WYKONANY`)
- `MILESTONE — Outbound e-mail przy zaproszeniach` → `OSIĄGNIĘTY`
- Start Fazy 9 — poza tym wycinkiem; akceptacja prowadzącego wg DoD milestone
