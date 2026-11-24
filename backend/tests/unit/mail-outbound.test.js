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

  // Real sendInvitationEmail — przed testami, które mockują ten moduł (Jest 29 ESM
  // nie ma unstable_unmockModule; mock zostaje w rejestrze do końca pliku).
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
      }),
    );
  });

  test('html escapuje & < > " z houseName i invitingUserName', async () => {
    const sendMail = jest.fn(async () => ({ messageId: 'm-2' }));
    jest.unstable_mockModule('../../configs/mailTransport.js', () => ({
      getMailTransporter: () => ({ sendMail }),
      resetMailTransporterForTests: () => {},
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
      invitedUserId: 'u-inv',
      houseId: 'h-1',
      invitingUserName: 'bob<script>',
      kind: 'inmate_pending',
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
      }),
    ).resolves.toEqual({ sent: false, reason: 'send_failed' });
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

describe('Faza 8 — addUserToHouse orchestration (mock sendInvitationEmail)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.SMTP_HOST = 'smtp.test.local';
    process.env.SMTP_USER = 'mailer';
    process.env.SMTP_PASSWORD = 'secret';
    process.env.MAIL_FROM = 'noreply@test.local';
    process.env.FRONTEND_ORIGIN = 'https://app.test.local';
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
});
