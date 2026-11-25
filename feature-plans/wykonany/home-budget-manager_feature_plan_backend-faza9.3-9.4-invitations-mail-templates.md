# Home Budget Manager — feature plan: backend Faza 9.3–9.4 (zaproszenia notice + 4 szablony e-mail)

**Kotwica major:** `home-budget-manager_major_plan-backend.md` — **Faza 9.3** (kroki 9.3.1–9.3.2) oraz **Faza 9.4** (kroki 9.4.1–9.4.2).  
**Źródła:** `docs/data_flow.md` (przepływ C), `docs/dokumentacja_komunikacji.md` (WS `invitation` + e-mail), `docs/model_danych.md` (`invitations` / `notifications`), `docs/dictionary.md`, `docs/testy.md`, `spec/SPEC-KOMUNIKACJA.md` (K-13–K-15), `spec/SPEC-DANE.md` (D-12a), `spec/SPEC-BACKEND.md` (B-2 / B-3 / B-20), `spec/SPEC-TESTY.md` (T-1 / T-5 / T-15), kod `backend/`.  
**Biblioteki:** nodemailer `^6.9.15` — `transporter.sendMail({ from, to, subject, text, html })` (Context7 `/websites/nodemailer`); Jest ESM `unstable_mockModule` jak w Faza 8.  
**Statusy kroków:** `NIE_ROZPOCZĘTY` | `W_TRAKCIE` | `WYKONANY`

---

## Meta

| Pole | Wartość |
|------|---------|
| Wycinek | Pełne major **Faza 9.3** + **Faza 9.4**: trwały notice przy pending inmate, status-log, collection tylko pending **hosta**, unit+E2E zaproszeń; cztery szablony e-mail + mock SMTP (T-15) |
| Pass rozwojowy | **Brak przesunięć** między fazami major. W FAZA 2: render szablonów przed wiringiem (w `KROK 1`). `Kolejność KROK ≈ major` |
| Override bramki ścieżki wstecz | Użytkownik (2026-11-25) polecił planować 9.3–9.4 **jakby** Fazy 9.1–9.2 były `WYKONANY`, mimo statusów `NIE_ROZPOCZĘTY` w major. **Major w tej sesji nietknięty.** Ryzyko: implementacja 9.3–9.4 na saldzie/authz sprzed 9.1–9.2 |
| Poza zakresem | Faza 10+, frontend locales (klucz notice / copy mail), zmiana UNIQUE `invitingUserId`/`invitedUserId` w Prisma, implementacja 9.1–9.2, edycja major/docs/SPEC |
| Klucze i18n / notice | Notice: `notifications.pendingInvitation` (payload `message`). Tłumaczenia FE — poza wycinkiem |
| Po implementacji (informacyjnie) | Major: Faza 9.3 + 9.3.1–9.3.2 → `WYKONANY`; Faza 9.4 + 9.4.1–9.4.2 → `WYKONANY`. Milestone „Reguły domeny: saldo / authz tx / invite+mail” → `OSIĄGNIĘTY` **tylko** gdy 9.1–9.2 też realnie `WYKONANY` |

### Założenia HOW

1. **Pending inmate (K-15):** po `createInvitation` — nadal WS `invitation` do `hostId` **oraz** `emitNotification` (zapis notice house-scoped + WS `notification`). Schemat `notifications` nie ma `userId` — „dla hosta” = notice domu, który host czyta przez `/notice/collection`.
2. **Status-log (D-12a):** accept → `accepted`, decline → `rejected`; **bez** `delete` wiersza. As-is już tak działa — KROK 1 tylko weryfikuje / utrwala testami; zero hard-delete.
3. **Collection:** `GET /invitation/collection` filtruje `status = new` **i** `hostId = req.userId` (as-is filtruje tylko status — lukę domykamy).
4. **Mail (K-14):** cztery rozróżnialne `templateId`; transport bez zmian (`mailTransport.js`); best-effort (K-13). `sendInvitationEmail` nie rzuca.
5. **Triggery mail:** `host_added` → T-cand-host-added; `inmate_pending` → T-cand-inmate-pending **+** T-host-inmate-pending; accept/decline → T-cand-decision (`decision: 'accepted' \| 'rejected'`).
6. **Testy:** unit bez Express; E2E `/api/v1` + cookie. Mock SMTP: unit przez `unstable_mockModule` + E2E przez `setMailTransporterForTests` (dopisek do istniejącego hooka testowego). Komendy: `npm test` / `npm run test:e2e` w `backend/` (T-15).

---

## FAZA 1 — Zaproszenia: notice trwały, status-log, unit + E2E

Kotwica major: **Faza 9.3**.

### KROK 1 — Notice trwały przy pending + scope collection po hostId

**Status:** `WYKONANY`

**Cel:** Pending od inmate → notice w DB + WS `invitation` (już jest). Collection hosta = tylko jego pending. Status-log bez hard-delete (as-is). Major 9.3.1 + lukę collection z DoD fazy. SPEC-KOMUNIKACJA K-15, SPEC-DANE D-12a.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/utils/householdUtils/addUserByInmate.js` | `emitNotification` po `createInvitation` |
| `backend/database/invitations.js` | `listInvitationsCollection(status, hostId)` |
| `backend/services/invitations/getInvitationsCollection.js` | przyjmuje `hostId` |
| `backend/controllers/invitationController.js` | przekazuje `req.userId` |

#### Refaktor — `backend/utils/householdUtils/addUserByInmate.js`

**teraz (fragment po `createInvitation`):**

```javascript
    await createInvitation({
      id: invitationId,
      status: invitationStatus.new,
      invitingUserId,
      invitedUserId,
      houseId,
      hostId,
    });

    broadcastMessage(hostId, {
      type: 'invitation',
      data: {
        invitationId,
        invitingUser: invitingUserName,
        invitedUser: userName,
      },
    });

    return { messageKey: 'addUserToHouse.correctlyAddedByInmate' };
```

**zamień na:**

```javascript
    await createInvitation({
      id: invitationId,
      status: invitationStatus.new,
      invitingUserId,
      invitedUserId,
      houseId,
      hostId,
    });

    broadcastMessage(hostId, {
      type: 'invitation',
      data: {
        invitationId,
        invitingUser: invitingUserName,
        invitedUser: userName,
      },
    });

    await emitNotification({
      id: uuidv4(),
      category: 'usersActions',
      houseId,
      message: 'notifications.pendingInvitation',
      extraData: {
        invitationId,
        invitingUserId,
        invitedUserId,
      },
    });

    return { messageKey: 'addUserToHouse.correctlyAddedByInmate', hostId };
```

**Import:** dopisz  
`import { emitNotification } from '../../services/notifications/emitNotification.js';`  
(`uuidv4` już jest).

#### Refaktor — `backend/database/invitations.js` (`listInvitationsCollection`)

**teraz:**

```javascript
export async function listInvitationsCollection(status) {
  const invitations = await prisma.invitations.findMany({ where: { status } });
```

**zamień na:**

```javascript
export async function listInvitationsCollection(status, hostId) {
  const invitations = await prisma.invitations.findMany({
    where: hostId ? { status, hostId } : { status },
  });
```

(reszta mapowania bez zmian).

#### Refaktor — `backend/services/invitations/getInvitationsCollection.js`

**teraz:**

```javascript
export async function getInvitationsCollection() {
  try {
    const invitations = await listInvitationsCollection(invitationStatus.new);
    return { messageKey: 'Invitations fetched correctly.', invitations };
```

**zamień na:**

```javascript
export async function getInvitationsCollection(hostId) {
  try {
    if (!hostId) {
      throw new AppError({
        code: 'INVITE_COLLECTION_NO_HOST',
        messageKey: 'Incorrect input data.',
        httpStatus: 400,
      });
    }
    const invitations = await listInvitationsCollection(invitationStatus.new, hostId);
    return { messageKey: 'Invitations fetched correctly.', invitations };
```

#### Refaktor — `backend/controllers/invitationController.js`

**teraz:**

```javascript
export async function getInvitationsCollectionHandler(req, res) {
  return runController(res, () => getInvitationsCollection());
}
```

**zamień na:**

```javascript
export async function getInvitationsCollectionHandler(req, res) {
  return runController(res, () => getInvitationsCollection(req.userId));
}
```

**Testy (szkic — pełny kod w KROK 2):** unit `addUserByInmate` woła `emitNotification`; unit collection z `hostId`.

**DoD kroku:**

- Po pending w DB jest notice z `message` / payload zawierającym `notifications.pendingInvitation` dla `houseId`.
- WS `invitation` nadal emitowany do hosta.
- Accept/decline **nie** usuwają wiersza `invitations` (status `accepted` / `rejected`).
- `listInvitationsCollection('new', hostId)` nie zwraca pending innych hostów.

**Status:** `WYKONANY`

---

### KROK 2 — Unit + E2E API zaproszeń

**Status:** `WYKONANY`

**Cel:** Trzy ścieżki domenowe (host immediate, inmate→accept, inmate→decline) + notice + collection. Major 9.3.2. SPEC-TESTY T-1 / T-5 / T-15.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/tests/unit/invitation-pending-notice.test.js` | **nowy** |
| `backend/tests/unit/invitation-accept-reject.test.js` | dopisek: wiersz zostaje ze statusem; happy accept |
| `backend/tests/unit/membership-invite-guards.test.js` | aktualizacja mocków (`emitNotification`) |
| `backend/tests/e2e/t5-critical-paths.test.js` | asercja notice po pending |
| `backend/tests/e2e/t5-business-edges.test.js` | po decline: brak w collection + status-log (brak membership już jest) |

#### Nowy plik — `backend/tests/unit/invitation-pending-notice.test.js`

```javascript
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

describe('addUserByInmate — notice trwały + WS (K-15 / Faza 9.3)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('createInvitation + broadcast invitation + emitNotification; zwraca hostId', async () => {
    const createInvitation = jest.fn(async () => ({}));
    const broadcastMessage = jest.fn();
    const emitNotification = jest.fn(async () => ({}));
    const findHostUserId = jest.fn(async () => 'host-1');

    jest.unstable_mockModule('../../configs/websocketConfig.js', () => ({
      broadcastMessage,
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHostUserId,
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      createInvitation,
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification,
    }));

    const { addUserByInmate } = await import(
      '../../utils/householdUtils/addUserByInmate.js'
    );

    const res = await addUserByInmate(
      'inmate-1',
      { userId: 'cand-1', houseId: null },
      'house-1',
      'cand01',
      'inmte1',
    );

    expect(res).toEqual({
      messageKey: 'addUserToHouse.correctlyAddedByInmate',
      hostId: 'host-1',
    });
    expect(createInvitation).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'new',
        invitingUserId: 'inmate-1',
        invitedUserId: 'cand-1',
        houseId: 'house-1',
        hostId: 'host-1',
      }),
    );
    expect(broadcastMessage).toHaveBeenCalledWith(
      'host-1',
      expect.objectContaining({ type: 'invitation' }),
    );
    expect(emitNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'usersActions',
        houseId: 'house-1',
        message: 'notifications.pendingInvitation',
      }),
    );
  });
});
```

#### Dopisek — `backend/tests/unit/invitation-accept-reject.test.js`

Po istniejących testach (ten sam `describe`), dodać:

```javascript
  test('accept: saveNewInmate + status accepted + notice; bez delete invitation', async () => {
    const saveNewInmate = jest.fn(async () => ({ invitedUserId: 'u-2' }));
    const updateInvitationStatus = jest.fn(async () => ({ count: 1 }));
    const emitNotification = jest.fn(async () => ({}));

    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => ({ houseId: 'house-1' })),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/saveNewInmate.js', () => ({
      saveNewInmate,
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      updateInvitationStatus,
      findInvitationById: jest.fn(),
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification,
    }));

    const { acceptInvitation } = await import(
      '../../services/invitations/acceptInvitation.js'
    );
    const src = await import('node:fs').then((fs) =>
      fs.readFileSync(
        new URL('../../services/invitations/acceptInvitation.js', import.meta.url),
        'utf8',
      ),
    );
    expect(src).not.toMatch(/\.delete\(|deleteInvitation/);

    await acceptInvitation({
      invitationId: 'i-1',
      invitedUserId: 'u-2',
      hostId: 'h-1',
    });

    expect(saveNewInmate).toHaveBeenCalledWith('u-2', 'house-1');
    expect(updateInvitationStatus).toHaveBeenCalledWith('i-1', 'accepted', 'h-1');
    expect(emitNotification).toHaveBeenCalled();
  });

  test('getInvitationsCollection filtruje po hostId', async () => {
    const listInvitationsCollection = jest.fn(async () => []);
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      listInvitationsCollection,
    }));

    const { getInvitationsCollection } = await import(
      '../../services/invitations/getInvitationsCollection.js'
    );
    await getInvitationsCollection('host-xyz');
    expect(listInvitationsCollection).toHaveBeenCalledWith('new', 'host-xyz');
  });
```

#### Refaktor mocków — `backend/tests/unit/membership-invite-guards.test.js`

W testach `addUserByInmate` dopisz mock:

```javascript
jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
  emitNotification: jest.fn(),
}));
```

(obok istniejących mocków WS / DB).

#### E2E — dopisek w `t5-critical-paths.test.js` (T-5.3)

Po `pendingRes` status 200, przed collection:

```javascript
    const notices = await host.agent.get('/api/v1/notice/collection');
    expect(notices.status).toBe(200);
    const pendingNotice = notices.body.notifications?.find((n) => {
      const raw = n.noticeData;
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return data?.message === 'notifications.pendingInvitation';
    });
    expect(pendingNotice).toBeTruthy();
```

Po `acceptRes`: collection nie zawiera już tego `invitation.id` (status ≠ new):

```javascript
    const collectionAfter = await host.agent.get('/api/v1/invitation/collection');
    expect(
      collectionAfter.body.invitations?.some((i) => i.id === invitation.id),
    ).toBe(false);
```

#### E2E — dopisek w `t5-business-edges.test.js` (reject)

Po `decline` status 200:

```javascript
    const collectionAfter = await host.agent.get('/api/v1/invitation/collection');
    expect(
      collectionAfter.body.invitations?.some((i) => i.id === invitation.id),
    ).toBe(false);
```

**DoD kroku:**

- Unit: notice + trzy ścieżki (host add guard już w membership; accept membership; decline bez membership + status).
- E2E: notice po pending; accept → role `inmate`; decline → bez membership; collection tylko pending hosta.
- `npm test` (scoped unit) zielone; `npm run test:e2e` zielone dla tych plików (T-15).

**Status:** `WYKONANY`

---

#### Propozycja commit message

```text
feat(invitations): persist host notice on pending and scope collection

Inmate invite stores a durable household notice beside the WS invitation
signal, and GET /invitation/collection returns only the host's pending rows.
```

---

## FAZA 2 — Cztery szablony e-mail zaproszeń + mock w testach

Kotwica major: **Faza 9.4**.

### KROK 1 — Szablony + podpięcia triggerów

**Status:** `WYKONANY`

**Cel:** Cztery rozróżnialne body (text+html); triggery po sukcesie domeny; SMTP tylko z env. Major 9.4.1. SPEC-KOMUNIKACJA K-13/K-14. Nodemailer: `sendMail({ from, to, subject, text, html })` (Context7).

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/services/invitations/invitationEmailTemplates.js` | **nowy** |
| `backend/services/invitations/sendInvitationEmail.js` | `templateId` + render |
| `backend/configs/mailTransport.js` | `setMailTransporterForTests` |
| `backend/services/users/addUserToHouse.js` | dwa maile przy inmate; `templateId` |
| `backend/services/invitations/acceptInvitation.js` | T-cand-decision accepted |
| `backend/services/invitations/rejectInvitation.js` | T-cand-decision rejected |

#### Nowy plik — `backend/services/invitations/invitationEmailTemplates.js`

```javascript
/** Stałe ID szablonów (K-14 / docs). */
export const InvitationEmailTemplateId = {
  CAND_HOST_ADDED: 'T-cand-host-added',
  CAND_INMATE_PENDING: 'T-cand-inmate-pending',
  HOST_INMATE_PENDING: 'T-host-inmate-pending',
  CAND_DECISION: 'T-cand-decision',
};

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toHtml(text) {
  return `<p>${escapeHtml(text).replace(/\n/g, '<br />')}</p>`;
}

/**
 * @param {{
 *   templateId: string,
 *   houseName: string,
 *   invitingUserName: string,
 *   appUrl: string,
 *   decision?: 'accepted' | 'rejected',
 * }} params
 * @returns {{ subject: string, text: string, html: string }}
 */
export function renderInvitationEmail({
  templateId,
  houseName,
  invitingUserName,
  appUrl,
  decision,
}) {
  switch (templateId) {
    case InvitationEmailTemplateId.CAND_HOST_ADDED: {
      const text = [
        `You were added to the household "${houseName}" by ${invitingUserName}.`,
        `Log in at ${appUrl} to continue.`,
      ].join('\n');
      return {
        subject: `[T-cand-host-added] You joined household "${houseName}"`,
        text,
        html: toHtml(text),
      };
    }
    case InvitationEmailTemplateId.CAND_INMATE_PENDING: {
      const text = [
        `${invitingUserName} invited you to the household "${houseName}".`,
        `Log in at ${appUrl}. The household host must accept the invitation before you join.`,
      ].join('\n');
      return {
        subject: `[T-cand-inmate-pending] Invitation to household "${houseName}"`,
        text,
        html: toHtml(text),
      };
    }
    case InvitationEmailTemplateId.HOST_INMATE_PENDING: {
      const text = [
        `${invitingUserName} proposed a new member for household "${houseName}".`,
        `Review pending invitations at ${appUrl}.`,
      ].join('\n');
      return {
        subject: `[T-host-inmate-pending] Pending invitation in "${houseName}"`,
        text,
        html: toHtml(text),
      };
    }
    case InvitationEmailTemplateId.CAND_DECISION: {
      const accepted = decision === 'accepted';
      const text = accepted
        ? [
            `Your invitation to household "${houseName}" was accepted.`,
            `Log in at ${appUrl} to continue.`,
          ].join('\n')
        : [
            `Your invitation to household "${houseName}" was declined.`,
            `Log in at ${appUrl} for other options.`,
          ].join('\n');
      return {
        subject: accepted
          ? `[T-cand-decision] Accepted — "${houseName}"`
          : `[T-cand-decision] Declined — "${houseName}"`,
        text,
        html: toHtml(text),
      };
    }
    default:
      throw new Error(`Unknown invitation email template: ${templateId}`);
  }
}
```

Prefiks `[T-…]` w `subject` = asercja wyboru szablonu w testach (bez lustra prywatnych ścieżek).

#### Refaktor — `backend/services/invitations/sendInvitationEmail.js`

**zamień cały plik na:**

```javascript
import logger from '../../configs/logger.js';
import { getMailTransporter } from '../../configs/mailTransport.js';
import { findUserById } from '../../database/users.js';
import { findHouseholdById } from '../../database/households.js';
import { renderInvitationEmail } from './invitationEmailTemplates.js';

/**
 * Skutek uboczny zaproszenia (K-14). Nigdy nie rzuca — awaria SMTP ≠ rollback (K-13).
 * @param {{
 *   recipientUserId: string,
 *   houseId: string,
 *   invitingUserName: string,
 *   templateId: string,
 *   decision?: 'accepted' | 'rejected',
 * }} params
 */
export async function sendInvitationEmail({
  recipientUserId,
  houseId,
  invitingUserName,
  templateId,
  decision,
}) {
  try {
    const transporter = getMailTransporter();
    if (!transporter) {
      logger.info('SMTP not configured; invitation email skipped');
      return { sent: false, reason: 'smtp_unconfigured', templateId };
    }

    const user = await findUserById(recipientUserId);
    const house = await findHouseholdById(houseId);
    if (!user?.email || !house?.houseName) {
      logger.warn(
        'invitation email skipped: missing recipient email or house name',
      );
      return { sent: false, reason: 'missing_data', templateId };
    }

    const appUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    const { subject, text, html } = renderInvitationEmail({
      templateId,
      houseName: house.houseName,
      invitingUserName,
      appUrl,
      decision,
    });

    await transporter.sendMail({
      from,
      to: user.email,
      subject,
      text,
      html,
    });

    return { sent: true, templateId };
  } catch (error) {
    logger.error(`invitation email failed: ${error?.message || error}`);
    return { sent: false, reason: 'send_failed', templateId };
  }
}
```

#### Refaktor — `backend/configs/mailTransport.js`

Po `resetMailTransporterForTests` dopisz:

```javascript
/** Wstrzyknięcie mocka — wyłącznie pod Jest / E2E. */
export function setMailTransporterForTests(mockTransporter) {
  transporter = mockTransporter;
}
```

#### Refaktor — `backend/services/users/addUserToHouse.js`

**teraz (fragment host / inmate + mail):**

```javascript
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
```

**zamień na:**

```javascript
    if (role === 'host') {
      const addByHost = await addUserByHost(userName, houseId, invitedUser);
      await sendInvitationEmail({
        recipientUserId: invitedUser.userId,
        houseId,
        invitingUserName,
        templateId: 'T-cand-host-added',
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
        recipientUserId: invitedUser.userId,
        houseId,
        invitingUserName,
        templateId: 'T-cand-inmate-pending',
      });
      if (addByInmate.hostId) {
        await sendInvitationEmail({
          recipientUserId: addByInmate.hostId,
          houseId,
          invitingUserName,
          templateId: 'T-host-inmate-pending',
        });
      }
      return { messageKey: addByInmate.messageKey };
    }
```

Import stałych opcjonalny — stringi ID zgodne z `InvitationEmailTemplateId`.

#### Refaktor — `backend/services/invitations/acceptInvitation.js`

Po udanym `emitNotification`, przed `return`:

```javascript
    await sendInvitationEmail({
      recipientUserId: invitedUserId,
      houseId,
      invitingUserName: 'host',
      templateId: 'T-cand-decision',
      decision: 'accepted',
    });
```

**Import:**  
`import { sendInvitationEmail } from './sendInvitationEmail.js';`

`invitingUserName: 'host'` jest wystarczające dla T-cand-decision (treść nie wymaga imienia invitującego). Bez dodatkowego fetcha.

#### Refaktor — `backend/services/invitations/rejectInvitation.js`

Po udanym `emitNotification`, przed `return`:

```javascript
    await sendInvitationEmail({
      recipientUserId: invitationData.invitedUserId,
      houseId: invitationData.houseId,
      invitingUserName: 'host',
      templateId: 'T-cand-decision',
      decision: 'rejected',
    });
```

**Import:** jak wyżej.

**DoD kroku:**

- Cztery szablony w kodzie; brak jednego uniwersalnego body.
- Każdy trigger woła właściwy `templateId` i adresata (`recipientUserId`).
- Sekrety SMTP tylko w env; awaria mail ≠ rollback.

**Status:** `WYKONANY`

---

### KROK 2 — Unit / E2E z mockiem SMTP

**Status:** `WYKONANY`

**Cel:** Asercja adresata + wyboru szablonu (prefiks `[T-…]` w subject) dla czterech ID. Major 9.4.2. T-5 / T-15.

**Artefakty:**

| Ścieżka | Zmiana |
|---------|--------|
| `backend/tests/unit/invitation-email-templates.test.js` | **nowy** |
| `backend/tests/unit/mail-outbound.test.js` | aktualizacja `kind` → `templateId`; dopiski 4 ścieżek |
| `backend/tests/e2e/invitation-mail-templates.test.js` | **nowy** (mock transporter) |

#### Nowy plik — `backend/tests/unit/invitation-email-templates.test.js`

```javascript
import { describe, expect, test } from '@jest/globals';
import {
  InvitationEmailTemplateId,
  renderInvitationEmail,
} from '../../services/invitations/invitationEmailTemplates.js';

describe('invitationEmailTemplates (K-14)', () => {
  const base = {
    houseName: 'Dom <A&B>',
    invitingUserName: 'alice<script>',
    appUrl: 'https://app.test.local',
  };

  test('cztery ID dają rozróżnialne subject + escapowany html', () => {
    const ids = Object.values(InvitationEmailTemplateId);
    const subjects = ids.map((templateId) => {
      const rendered = renderInvitationEmail({
        ...base,
        templateId,
        decision: templateId === InvitationEmailTemplateId.CAND_DECISION ? 'accepted' : undefined,
      });
      expect(rendered.subject).toContain(`[${templateId}]`);
      expect(rendered.html).toContain('Dom &lt;A&amp;B&gt;');
      expect(rendered.html).not.toContain('<script>');
      return rendered.subject;
    });
    expect(new Set(subjects).size).toBe(ids.length);
  });

  test('T-cand-decision rejected ≠ accepted w subject/text', () => {
    const ok = renderInvitationEmail({
      ...base,
      templateId: InvitationEmailTemplateId.CAND_DECISION,
      decision: 'accepted',
    });
    const no = renderInvitationEmail({
      ...base,
      templateId: InvitationEmailTemplateId.CAND_DECISION,
      decision: 'rejected',
    });
    expect(ok.subject).toMatch(/Accepted/i);
    expect(no.subject).toMatch(/Declined/i);
    expect(ok.text).not.toEqual(no.text);
  });
});
```

#### Aktualizacja — `backend/tests/unit/mail-outbound.test.js`

Wszystkie wywołania `sendInvitationEmail` z `kind` / `invitedUserId` →:

```javascript
await sendInvitationEmail({
  recipientUserId: 'u-inv',
  houseId: 'h-1',
  invitingUserName: 'alice',
  templateId: 'T-cand-inmate-pending',
});
```

Asercje `sendMail`: `subject` zawiera `[T-cand-inmate-pending]`, `to` = email kandydata.

Dopisz testy (ten sam styl mocków co Faza 8):

1. `T-cand-host-added` → `to` kandydat, subject z ID.
2. `T-cand-inmate-pending` → kandydat.
3. `T-host-inmate-pending` → host email (mock `findUserById` dla hosta).
4. `T-cand-decision` accepted i rejected → kandydat, różne subject.
5. Orkiestracja `addUserToHouse` inmate: **dwa** wywołania `sendInvitationEmail` (cand + host).
6. `acceptInvitation` / `rejectInvitation` wołają `T-cand-decision` (mock modułu mail).

Przykład orkiestracji inmate (fragment):

```javascript
  test('addUserToHouse inmate: T-cand-inmate-pending + T-host-inmate-pending', async () => {
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
      addUserByInmate: async () => ({
        messageKey: 'addUserToHouse.correctlyAddedByInmate',
        hostId: 'host-1',
      }),
    }));
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail,
    }));

    const { addUserToHouse } = await import('../../services/users/addUserToHouse.js');
    await addUserToHouse('inmate-1', 'bob', 'carol', 'inmate');

    expect(sendInvitationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientUserId: 'u-inv',
        templateId: 'T-cand-inmate-pending',
      }),
    );
    expect(sendInvitationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientUserId: 'host-1',
        templateId: 'T-host-inmate-pending',
      }),
    );
  });
```

#### Nowy plik — `backend/tests/e2e/invitation-mail-templates.test.js`

```javascript
import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
  createTestApp,
  signupAndLogin,
  createHouse,
  login,
} from '../helpers/httpAgent.js';
import { prepareE2eDatabase } from '../helpers/e2eDb.js';
import {
  resetMailTransporterForTests,
  setMailTransporterForTests,
} from '../../configs/mailTransport.js';

describe('Faza 9.4 — E2E mock SMTP (4 szablony)', () => {
  const app = createTestApp();
  jest.setTimeout(20000);
  const sendMail = jest.fn(async () => ({ messageId: 'e2e-mail' }));

  beforeAll(async () => {
    await prepareE2eDatabase();
  });

  beforeEach(async () => {
    await prepareE2eDatabase();
    sendMail.mockClear();
    process.env.SMTP_HOST = 'smtp.test.local';
    process.env.SMTP_USER = 'mailer';
    process.env.SMTP_PASSWORD = 'secret';
    process.env.MAIL_FROM = 'noreply@test.local';
    process.env.FRONTEND_ORIGIN = 'https://app.test.local';
    resetMailTransporterForTests();
    setMailTransporterForTests({ sendMail });
  });

  test('host invite → T-cand-host-added do kandydata', async () => {
    const host = await signupAndLogin(app, {
      userName: 'mailhst',
      email: 'mailhst@test.local',
    });
    await createHouse(host.agent, { houseName: 'Mail House', initBudget: 100 });
    const cand = await signupAndLogin(app, {
      userName: 'mailcnd',
      email: 'mailcnd@test.local',
    });

    expect(
      (await host.agent.post('/api/v1/users/invite').send({ userName: 'mailcnd' })).status,
    ).toBe(200);

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'mailcnd@test.local',
        subject: expect.stringContaining('[T-cand-host-added]'),
      }),
    );
  });

  test('inmate pending → cand + host templates; accept → T-cand-decision', async () => {
    const host = await signupAndLogin(app, {
      userName: 'mailhs2',
      email: 'mailhs2@test.local',
    });
    await createHouse(host.agent, { houseName: 'Mail Pend', initBudget: 100 });
    const inmate = await signupAndLogin(app, {
      userName: 'mailin2',
      email: 'mailin2@test.local',
    });
    expect(
      (await host.agent.post('/api/v1/users/invite').send({ userName: 'mailin2' })).status,
    ).toBe(200);
    await login(inmate.agent, { email: 'mailin2@test.local' });
    sendMail.mockClear();

    const cand = await signupAndLogin(app, {
      userName: 'mailcn2',
      email: 'mailcn2@test.local',
    });
    expect(
      (await inmate.agent.post('/api/v1/users/invite').send({ userName: 'mailcn2' })).status,
    ).toBe(200);

    const subjects = sendMail.mock.calls.map((c) => c[0].subject);
    expect(subjects.some((s) => s.includes('[T-cand-inmate-pending]'))).toBe(true);
    expect(subjects.some((s) => s.includes('[T-host-inmate-pending]'))).toBe(true);
    expect(sendMail.mock.calls.some((c) => c[0].to === 'mailcn2@test.local')).toBe(true);
    expect(sendMail.mock.calls.some((c) => c[0].to === 'mailhs2@test.local')).toBe(true);

    const collection = await host.agent.get('/api/v1/invitation/collection');
    const invitation = collection.body.invitations?.find(
      (i) => i.invitedUserName === 'mailcn2' || i.invitedUser === cand.loginRes.body.id,
    );
    expect(invitation).toBeTruthy();
    sendMail.mockClear();

    expect(
      (
        await host.agent.post('/api/v1/invitation/accept').send({
          invitationId: invitation.id,
          invitedUserId: invitation.invitedUser,
        })
      ).status,
    ).toBe(200);

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'mailcn2@test.local',
        subject: expect.stringContaining('[T-cand-decision]'),
      }),
    );
  });

  test('decline → T-cand-decision Declined', async () => {
    const host = await signupAndLogin(app, {
      userName: 'mailhs3',
      email: 'mailhs3@test.local',
    });
    await createHouse(host.agent, { houseName: 'Mail Dec', initBudget: 100 });
    const inmate = await signupAndLogin(app, {
      userName: 'mailin3',
      email: 'mailin3@test.local',
    });
    expect(
      (await host.agent.post('/api/v1/users/invite').send({ userName: 'mailin3' })).status,
    ).toBe(200);
    await login(inmate.agent, { email: 'mailin3@test.local' });

    const cand = await signupAndLogin(app, {
      userName: 'mailcn3',
      email: 'mailcn3@test.local',
    });
    expect(
      (await inmate.agent.post('/api/v1/users/invite').send({ userName: 'mailcn3' })).status,
    ).toBe(200);

    const collection = await host.agent.get('/api/v1/invitation/collection');
    const invitation = collection.body.invitations?.find(
      (i) => i.invitedUserName === 'mailcn3' || i.invitedUser === cand.loginRes.body.id,
    );
    sendMail.mockClear();

    expect(
      (await host.agent.post('/api/v1/invitation/decline').send({ invitationId: invitation.id }))
        .status,
    ).toBe(200);

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'mailcn3@test.local',
        subject: expect.stringMatching(/\[T-cand-decision\].*Declined/i),
      }),
    );
  });
});
```

**DoD kroku:**

- Cztery ID pokryte unit + E2E z mockiem; brak zależności od zewnętrznego SMTP.
- Istniejące testy Fazy 8 zaktualizowane do `templateId` — zielone.

**Status:** `WYKONANY`

---

#### Propozycja commit message

```text
feat(invitations): split four invitation email templates with SMTP mocks

Distinguish host-added, inmate-pending (candidate and host), and decision
mails; assert template id and recipient via mocked nodemailer sendMail.
```

---

## Weryfikacja wycinka

| Kryterium | Jak sprawdzić |
|-----------|----------------|
| K-15 notice + WS | Unit `invitation-pending-notice`; E2E notice w `/notice/collection` |
| D-12a status-log | Unit accept/reject bez delete; E2E brak w collection po decyzji |
| Collection tylko pending hosta | `listInvitationsCollection(status, hostId)` + unit |
| K-14 cztery szablony | `invitationEmailTemplates` + prefiksy subject |
| K-13 best-effort | bez zmian semantyki no-throw w `sendInvitationEmail` |
| T-15 scoped | `npm test` + `npm run test:e2e` (pliki wycinka) zielone |
| Zgodność docs/SPEC | data_flow C, SPEC-KOMUNIKACJA K-13–K-15, SPEC-DANE D-12a, SPEC-TESTY T-5.3 |
| Nagłówki | wyłącznie `FAZA` / `KROK`; commit EN Conventional Commits na końcu każdej fazy |
| Major | nietknięty w tej sesji |

## Ślad do major (po późniejszej implementacji — informacyjnie)

- Faza 9.3 + kroki 9.3.1–9.3.2 → `WYKONANY`
- Faza 9.4 + kroki 9.4.1–9.4.2 → `WYKONANY`
- Milestone „Reguły domeny: saldo / authz tx / invite+mail” → `OSIĄGNIĘTY` **dopiero** gdy 9.1–9.2 też `WYKONANY` (obecny override tego nie domyka)
)
