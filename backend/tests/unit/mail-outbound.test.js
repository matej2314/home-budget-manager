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

  test('niepoprawny SMTP_PORT spada na 587', async () => {
    process.env.SMTP_HOST = 'smtp.test.local';
    process.env.SMTP_PORT = 'abc';
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
    getMailTransporter();

    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ port: 587, secure: false }),
    );
  });
});

describe('Faza 9.4 — sendInvitationEmail templateId + sendMail', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.SMTP_HOST = 'smtp.test.local';
    process.env.SMTP_USER = 'mailer';
    process.env.SMTP_PASSWORD = 'secret';
    process.env.MAIL_FROM = 'noreply@test.local';
    process.env.FRONTEND_ORIGIN = 'https://app.test.local';
  });

  // Real sendInvitationEmail — przed testami, które mockują ten moduł (Jest 29 ESM
  // nie ma unstable_unmockModule; mock zostaje w rejestrze do końca pliku).
  test('T-cand-inmate-pending: sendMail z subject ID i to = kandydat', async () => {
    const sendMail = jest.fn(async () => ({ messageId: 'm-1' }));
    jest.unstable_mockModule('../../configs/mailTransport.js', () => ({
      getMailTransporter: () => ({ sendMail }),
      resetMailTransporterForTests: () => {},
      setMailTransporterForTests: () => {},
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
      recipientUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'alice',
      templateId: 'T-cand-inmate-pending',
    });

    expect(result).toEqual({ sent: true, templateId: 'T-cand-inmate-pending' });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'noreply@test.local',
        to: 'candidate@test.local',
        subject: expect.stringContaining('[T-cand-inmate-pending]'),
        text: expect.stringMatching(/alice[\s\S]*Dom Test[\s\S]*https:\/\/app\.test\.local/i),
      }),
    );
  });

  test('T-cand-host-added → to kandydat, subject z ID', async () => {
    const sendMail = jest.fn(async () => ({ messageId: 'm-host' }));
    jest.unstable_mockModule('../../configs/mailTransport.js', () => ({
      getMailTransporter: () => ({ sendMail }),
      resetMailTransporterForTests: () => {},
      setMailTransporterForTests: () => {},
    }));
    jest.unstable_mockModule('../../database/users.js', () => ({
      findUserById: async () => ({ id: 'u-inv', email: 'candidate@test.local' }),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHouseholdById: async () => ({ houseId: 'h-1', houseName: 'Dom Host' }),
    }));

    const { sendInvitationEmail } = await import(
      '../../services/invitations/sendInvitationEmail.js'
    );

    await sendInvitationEmail({
      recipientUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'alice',
      templateId: 'T-cand-host-added',
    });

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'candidate@test.local',
        subject: expect.stringContaining('[T-cand-host-added]'),
      }),
    );
  });

  test('T-host-inmate-pending → to host email', async () => {
    const sendMail = jest.fn(async () => ({ messageId: 'm-h' }));
    jest.unstable_mockModule('../../configs/mailTransport.js', () => ({
      getMailTransporter: () => ({ sendMail }),
      resetMailTransporterForTests: () => {},
      setMailTransporterForTests: () => {},
    }));
    jest.unstable_mockModule('../../database/users.js', () => ({
      findUserById: async (id) =>
        id === 'host-1'
          ? { id: 'host-1', email: 'host@test.local' }
          : { id, email: 'other@test.local' },
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHouseholdById: async () => ({ houseId: 'h-1', houseName: 'Dom' }),
    }));

    const { sendInvitationEmail } = await import(
      '../../services/invitations/sendInvitationEmail.js'
    );

    await sendInvitationEmail({
      recipientUserId: 'host-1',
      houseId: 'h-1',
      invitingUserName: 'carol',
      templateId: 'T-host-inmate-pending',
    });

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'host@test.local',
        subject: expect.stringContaining('[T-host-inmate-pending]'),
      }),
    );
  });

  test('T-cand-decision accepted i rejected → kandydat, różne subject', async () => {
    const sendMail = jest.fn(async () => ({ messageId: 'm-d' }));
    jest.unstable_mockModule('../../configs/mailTransport.js', () => ({
      getMailTransporter: () => ({ sendMail }),
      resetMailTransporterForTests: () => {},
      setMailTransporterForTests: () => {},
    }));
    jest.unstable_mockModule('../../database/users.js', () => ({
      findUserById: async () => ({ id: 'u-inv', email: 'candidate@test.local' }),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHouseholdById: async () => ({ houseId: 'h-1', houseName: 'Dom Dec' }),
    }));

    const { sendInvitationEmail } = await import(
      '../../services/invitations/sendInvitationEmail.js'
    );

    await sendInvitationEmail({
      recipientUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'host',
      templateId: 'T-cand-decision',
      decision: 'accepted',
    });
    await sendInvitationEmail({
      recipientUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'host',
      templateId: 'T-cand-decision',
      decision: 'rejected',
    });

    expect(sendMail.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        to: 'candidate@test.local',
        subject: expect.stringMatching(/\[T-cand-decision\].*Accepted/i),
      }),
    );
    expect(sendMail.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        to: 'candidate@test.local',
        subject: expect.stringMatching(/\[T-cand-decision\].*Declined/i),
      }),
    );
  });

  test('html escapuje & < > " z houseName i invitingUserName', async () => {
    const sendMail = jest.fn(async () => ({ messageId: 'm-2' }));
    jest.unstable_mockModule('../../configs/mailTransport.js', () => ({
      getMailTransporter: () => ({ sendMail }),
      resetMailTransporterForTests: () => {},
      setMailTransporterForTests: () => {},
    }));
    jest.unstable_mockModule('../../database/users.js', () => ({
      findUserById: async () => ({ id: 'u-inv', email: 'candidate@test.local' }),
    }));
    jest.unstable_mockModule('../../database/households.js', () => ({
      findHouseholdById: async () => ({ houseId: 'h-1', houseName: 'Dom <A&B> "X"' }),
    }));

    const { sendInvitationEmail } = await import(
      '../../services/invitations/sendInvitationEmail.js'
    );

    await sendInvitationEmail({
      recipientUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'bob<script>',
      templateId: 'T-cand-inmate-pending',
    });

    const { text, html } = sendMail.mock.calls[0][0];
    expect(text).toContain('Dom <A&B> "X"');
    expect(text).toContain('bob<script>');
    expect(html).toContain('Dom &lt;A&amp;B&gt; &quot;X&quot;');
    expect(html).toContain('bob&lt;script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('Dom <A&B>');
  });
});

describe('Faza 8 — K-13 mail nie blokuje zaproszenia', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  // Real sendInvitationEmail — musi iść przed testami mockującymi ten moduł.
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
      setMailTransporterForTests: () => {},
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
        recipientUserId: 'u-inv',
        houseId: 'h-1',
        invitingUserName: 'alice',
        templateId: 'T-cand-host-added',
      }),
    ).resolves.toEqual({
      sent: false,
      reason: 'send_failed',
      templateId: 'T-cand-host-added',
    });
  });

  test('ścieżka inmate nadal emituje WS invitation (mail ≠ jedyny kanał)', async () => {
    const src = await import('node:fs').then((fs) =>
      fs.readFileSync(
        new URL('../../utils/householdUtils/addUserByInmate.js', import.meta.url),
        'utf8',
      ),
    );
    expect(src).toMatch(/broadcastMessage/);
    expect(src).toMatch(/type:\s*['"]invitation['"]/);
    expect(src).toMatch(/createInvitation/);
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
});

describe('Faza 9.4 — addUserToHouse / accept / reject orchestration', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.SMTP_HOST = 'smtp.test.local';
    process.env.SMTP_USER = 'mailer';
    process.env.SMTP_PASSWORD = 'secret';
    process.env.MAIL_FROM = 'noreply@test.local';
    process.env.FRONTEND_ORIGIN = 'https://app.test.local';
  });

  test('addUserToHouse host woła T-cand-host-added', async () => {
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
      recipientUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'alice',
      templateId: 'T-cand-host-added',
    });
  });

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

  test('addUserToHouse przy AppError walidacji nie woła sendInvitationEmail', async () => {
    const sendInvitationEmail = jest.fn(async () => ({ sent: true }));
    const addUserByHost = jest.fn(async () => ({
      messageKey: 'addUserToHouse.inviteSuccessMessage',
    }));
    jest.unstable_mockModule('../../utils/householdUtils/getInvitedUserData.js', () => ({
      invitedUserData: async () => null,
    }));
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: async () => ({ houseId: 'h-1' }),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/addUserByHost.js', () => ({
      addUserByHost,
    }));
    jest.unstable_mockModule('../../utils/householdUtils/addUserByInmate.js', () => ({
      addUserByInmate: async () => ({ messageKey: 'addUserToHouse.correctlyAddedByInmate' }),
    }));
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail,
    }));

    const { AppError } = await import('../../utils/errors/AppError.js');
    const { addUserToHouse } = await import('../../services/users/addUserToHouse.js');

    await expect(addUserToHouse('host-1', 'bob', 'alice', 'host')).rejects.toBeInstanceOf(
      AppError,
    );
    expect(addUserByHost).not.toHaveBeenCalled();
    expect(sendInvitationEmail).not.toHaveBeenCalled();
  });

  test('acceptInvitation woła T-cand-decision accepted', async () => {
    const sendInvitationEmail = jest.fn(async () => ({ sent: true }));
    jest.unstable_mockModule('../../utils/checkUtils/checkUserHouse.js', () => ({
      default: jest.fn(async () => ({ houseId: 'house-1' })),
    }));
    jest.unstable_mockModule('../../utils/householdUtils/saveNewInmate.js', () => ({
      saveNewInmate: jest.fn(async () => ({})),
    }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      updateInvitationStatus: jest.fn(async () => ({ count: 1 })),
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification: jest.fn(async () => ({})),
    }));
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail,
    }));

    const { acceptInvitation } = await import(
      '../../services/invitations/acceptInvitation.js'
    );
    await acceptInvitation({
      invitationId: 'i-1',
      invitedUserId: 'u-2',
      hostId: 'h-1',
    });

    expect(sendInvitationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientUserId: 'u-2',
        templateId: 'T-cand-decision',
        decision: 'accepted',
      }),
    );
  });

  test('rejectInvitation woła T-cand-decision rejected', async () => {
    const sendInvitationEmail = jest.fn(async () => ({ sent: true }));
    jest.unstable_mockModule('../../database/invitations.js', () => ({
      findInvitationById: jest.fn(async () => ({
        id: 'i-1',
        status: 'new',
        houseId: 'house-1',
        invitedUserId: 'u-cand',
      })),
      updateInvitationStatus: jest.fn(async () => ({ count: 1 })),
    }));
    jest.unstable_mockModule('../../services/notifications/emitNotification.js', () => ({
      emitNotification: jest.fn(async () => ({})),
    }));
    jest.unstable_mockModule('../../services/invitations/sendInvitationEmail.js', () => ({
      sendInvitationEmail,
    }));

    const { rejectInvitation } = await import(
      '../../services/invitations/rejectInvitation.js'
    );
    await rejectInvitation({ invitationId: 'i-1', hostId: 'h-1' });

    expect(sendInvitationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientUserId: 'u-cand',
        houseId: 'house-1',
        templateId: 'T-cand-decision',
        decision: 'rejected',
      }),
    );
  });
});
