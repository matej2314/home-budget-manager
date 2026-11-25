import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
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

  afterEach(() => {
    resetMailTransporterForTests();
  });

  afterAll(() => {
    resetMailTransporterForTests();
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;
    delete process.env.MAIL_FROM;
  });

  test('host invite → T-cand-host-added do kandydata', async () => {
    const host = await signupAndLogin(app, {
      userName: 'mailhst',
      email: 'mailhst@test.local',
    });
    await createHouse(host.agent, { houseName: 'Mail House', initBudget: 100 });
    await signupAndLogin(app, {
      userName: 'mailcnd',
      email: 'mailcnd@test.local',
    });

    expect(
      (await host.agent.post('/api/v1/users/invite').send({ userName: 'mailcnd' }))
        .status,
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
      (await host.agent.post('/api/v1/users/invite').send({ userName: 'mailin2' }))
        .status,
    ).toBe(200);
    await login(inmate.agent, { email: 'mailin2@test.local' });
    sendMail.mockClear();

    const cand = await signupAndLogin(app, {
      userName: 'mailcn2',
      email: 'mailcn2@test.local',
    });
    expect(
      (await inmate.agent.post('/api/v1/users/invite').send({ userName: 'mailcn2' }))
        .status,
    ).toBe(200);

    const subjects = sendMail.mock.calls.map((c) => c[0].subject);
    expect(subjects.some((s) => s.includes('[T-cand-inmate-pending]'))).toBe(true);
    expect(subjects.some((s) => s.includes('[T-host-inmate-pending]'))).toBe(true);
    expect(sendMail.mock.calls.some((c) => c[0].to === 'mailcn2@test.local')).toBe(
      true,
    );
    expect(sendMail.mock.calls.some((c) => c[0].to === 'mailhs2@test.local')).toBe(
      true,
    );

    const collection = await host.agent.get('/api/v1/invitation/collection');
    const invitation = collection.body.invitations?.find(
      (i) =>
        i.invitedUserName === 'mailcn2' || i.invitedUser === cand.loginRes.body.id,
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
      (await host.agent.post('/api/v1/users/invite').send({ userName: 'mailin3' }))
        .status,
    ).toBe(200);
    await login(inmate.agent, { email: 'mailin3@test.local' });

    const cand = await signupAndLogin(app, {
      userName: 'mailcn3',
      email: 'mailcn3@test.local',
    });
    expect(
      (await inmate.agent.post('/api/v1/users/invite').send({ userName: 'mailcn3' }))
        .status,
    ).toBe(200);

    const collection = await host.agent.get('/api/v1/invitation/collection');
    const invitation = collection.body.invitations?.find(
      (i) =>
        i.invitedUserName === 'mailcn3' || i.invitedUser === cand.loginRes.body.id,
    );
    sendMail.mockClear();

    expect(
      (
        await host.agent
          .post('/api/v1/invitation/decline')
          .send({ invitationId: invitation.id })
      ).status,
    ).toBe(200);

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'mailcn3@test.local',
        subject: expect.stringMatching(/\[T-cand-decision\].*Declined/i),
      }),
    );
  });
});
