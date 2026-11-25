import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
  createTestApp,
  createAgent,
  signup,
  login,
  createHouse,
  signupAndLogin,
} from '../helpers/httpAgent.js';
import { prepareE2eDatabase, SEED_CAT } from '../helpers/e2eDb.js';

describe('T-5 E2E API critical paths', () => {
  const app = createTestApp();
  // Wiele bcrypt + kilka agentów — domyślne 5s Jest bywa za krótkie.
  jest.setTimeout(20000);

  beforeAll(async () => {
    await prepareE2eDatabase();
  });

  beforeEach(async () => {
    await prepareE2eDatabase();
  });

  test('T-5.1 auth: signup → login → verify → logout', async () => {
    const agent = createAgent(app);
    const email = 'auth01@test.local';
    const userName = 'auth01';

    const signupRes = await signup(agent, { userName, email });
    expect(signupRes.status).toBe(200);
    expect(signupRes.body.status).toBe('success');

    const loginRes = await login(agent, { email });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.status).toBe('success');
    expect(loginRes.headers['set-cookie']?.join(';') || '').toMatch(/SESSID=/);

    const verifyRes = await agent.get('/api/v1/auth/verify');
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body).toMatchObject({
      status: 'success',
      message: 'auth.verify.success',
      userName,
      role: 'user',
    });

    const logoutRes = await agent.post('/api/v1/auth/logout');
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.status).toBe('success');

    const afterLogout = await agent.get('/api/v1/auth/verify');
    expect(afterLogout.status).toBe(401);
    expect(afterLogout.body.message).toBe('auth.sessionRequired');
  });

  test('T-5.2 gospodarstwo: user → house/new → host → house/info', async () => {
    const { agent, loginRes } = await signupAndLogin(app, {
      userName: 'host01',
      email: 'host01@test.local',
    });
    expect(loginRes.body.role).toBe('user');

    const houseRes = await createHouse(agent, {
      houseName: 'E2E House One',
      initBudget: 1000,
    });
    expect(houseRes.status).toBe(200);
    expect(houseRes.body.status).toBe('success');
    expect(houseRes.body.newRole).toBe('host');

    const verifyRes = await agent.get('/api/v1/auth/verify');
    expect(verifyRes.body.role).toBe('host');

    const infoRes = await agent.get('/api/v1/house/info');
    expect(infoRes.status).toBe(200);
    expect(infoRes.body.status).toBe('success');
    expect(infoRes.body.info?.[0]).toMatchObject({
      houseName: 'E2E House One',
    });
  });

  test('T-5.3 invite inmate → host accept → dostęp rdzenia jako inmate', async () => {
    const host = await signupAndLogin(app, {
      userName: 'host02',
      email: 'host02@test.local',
    });
    await createHouse(host.agent, { houseName: 'E2E Invite House', initBudget: 500 });

    const inmateSeed = await signupAndLogin(app, {
      userName: 'inmte1',
      email: 'inmte1@test.local',
    });
    const inviteInmateRes = await host.agent
      .post('/api/v1/users/invite')
      .send({ userName: 'inmte1' });
    expect(inviteInmateRes.status).toBe(200);
    expect(inviteInmateRes.body.status).toBe('success');

    // JWT inmate po re-login (host_added aktualizuje DB, nie cookie zaproszonego)
    const inmateLogin = await login(inmateSeed.agent, { email: 'inmte1@test.local' });
    expect(inmateLogin.body.role).toBe('inmate');

    const candidate = await signupAndLogin(app, {
      userName: 'cand01',
      email: 'cand01@test.local',
    });

    const pendingRes = await inmateSeed.agent
      .post('/api/v1/users/invite')
      .send({ userName: 'cand01' });
    expect(pendingRes.status).toBe(200);

    const notices = await host.agent.get('/api/v1/notice/collection');
    expect(notices.status).toBe(200);
    const pendingNotice = notices.body.notifications?.find((n) => {
      const raw = n.noticeData;
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return data?.message === 'notifications.pendingInvitation';
    });
    expect(pendingNotice).toBeTruthy();

    const collection = await host.agent.get('/api/v1/invitation/collection');
    expect(collection.status).toBe(200);
    const invitation = collection.body.invitations?.find(
      (i) => i.invitedUserName === 'cand01' || i.invitedUser === candidate.loginRes.body.id,
    );
    expect(invitation).toBeTruthy();

    const acceptRes = await host.agent.post('/api/v1/invitation/accept').send({
      invitationId: invitation.id,
      invitedUserId: invitation.invitedUser,
    });
    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.status).toBe('success');

    const collectionAfter = await host.agent.get('/api/v1/invitation/collection');
    expect(
      collectionAfter.body.invitations?.some((i) => i.id === invitation.id),
    ).toBe(false);

    const candRelogin = await login(candidate.agent, { email: 'cand01@test.local' });
    expect(candRelogin.body.role).toBe('inmate');

    const infoRes = await candidate.agent.get('/api/v1/house/info');
    expect(infoRes.status).toBe(200);
    expect(infoRes.body.info?.[0]?.houseName).toBe('E2E Invite House');
  });

  test('T-5.4 transakcja: action/new → action/my + spójne saldo (board)', async () => {
    const { agent } = await signupAndLogin(app, {
      userName: 'txhost',
      email: 'txhost@test.local',
    });
    await createHouse(agent, { houseName: 'E2E Tx House', initBudget: 1000 });

    const addRes = await agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 100,
      catId: SEED_CAT.expenseEducation,
    });
    expect(addRes.status).toBe(200);
    expect(addRes.body.status).toBe('success');
    expect(addRes.body.transactionId).toBeTruthy();

    const myRes = await agent.get('/api/v1/action/my');
    expect(myRes.status).toBe(200);
    expect(myRes.body.actions?.some((a) => a.transaction_id === addRes.body.transactionId)).toBe(
      true,
    );

    const boardRes = await agent.get('/api/v1/board/data/house');
    expect(boardRes.status).toBe(200);
    const liveBalance = Number(boardRes.body.dashboardData?.houseData?.[0]?.liveBalance);
    expect(liveBalance).toBe(900);
  });
});
