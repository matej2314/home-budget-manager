import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
  createTestApp,
  createAgent,
  signupAndLogin,
  createHouse,
  login,
  signup,
} from '../helpers/httpAgent.js';
import { prepareE2eDatabase, SEED_CAT } from '../helpers/e2eDb.js';

describe('T-5 business edges (saldo / invite reject / authz)', () => {
  const app = createTestApp();
  jest.setTimeout(30000);

  beforeEach(async () => {
    await prepareE2eDatabase();
  });

  test('income + expense → spójne liveBalance', async () => {
    const { agent } = await signupAndLogin(app, {
      userName: 'balhst',
      email: 'balhst@test.local',
    });
    await createHouse(agent, { houseName: 'E2E Bal House', initBudget: 1000 });

    const income = await agent.post('/api/v1/action/new').send({
      type: 'income',
      value: 50,
      catId: SEED_CAT.incomeSalary,
    });
    expect(income.status).toBe(200);

    const expense = await agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 20,
      catId: SEED_CAT.expenseEducation,
    });
    expect(expense.status).toBe(200);

    const boardRes = await agent.get('/api/v1/board/data/house');
    const liveBalance = Number(boardRes.body.dashboardData?.houseData?.[0]?.liveBalance);
    expect(liveBalance).toBe(1030);
  });

  test('delete expense as-is: balanceType expense odejmuje ponownie (900→800)', async () => {
    const { agent } = await signupAndLogin(app, {
      userName: 'delhst',
      email: 'delhst@test.local',
    });
    await createHouse(agent, { houseName: 'E2E Del House', initBudget: 1000 });

    const addRes = await agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 100,
      catId: SEED_CAT.expenseEducation,
    });
    expect(addRes.status).toBe(200);
    const txId = addRes.body.transactionId;

    const afterAdd = await agent.get('/api/v1/board/data/house');
    expect(Number(afterAdd.body.dashboardData?.houseData?.[0]?.liveBalance)).toBe(900);

    const delRes = await agent.delete('/api/v1/action/').send({ transactionId: txId });
    expect(delRes.status).toBe(200);

    const afterDel = await agent.get('/api/v1/board/data/house');
    // as-is: delete zawsze woła nextBalance(..., 'expense', value)
    expect(Number(afterDel.body.dashboardData?.houseData?.[0]?.liveBalance)).toBe(800);
  });

  test('zły type transakcji → 400', async () => {
    const { agent } = await signupAndLogin(app, {
      userName: 'badtx1',
      email: 'badtx1@test.local',
    });
    await createHouse(agent, { houseName: 'E2E BadTx', initBudget: 100 });

    const res = await agent.post('/api/v1/action/new').send({
      type: 'transfer',
      value: 10,
      catId: SEED_CAT.expenseEducation,
    });
    expect(res.status).toBe(400);
  });

  test('inmate nie kasuje tx hosta → 404', async () => {
    const host = await signupAndLogin(app, {
      userName: 'txownr',
      email: 'txownr@test.local',
    });
    await createHouse(host.agent, { houseName: 'E2E OwnTx', initBudget: 500 });

    const inmate = await signupAndLogin(app, {
      userName: 'txinmt',
      email: 'txinmt@test.local',
    });
    expect((await host.agent.post('/api/v1/users/invite').send({ userName: 'txinmt' })).status).toBe(
      200,
    );
    await login(inmate.agent, { email: 'txinmt@test.local' });

    const addRes = await host.agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 40,
      catId: SEED_CAT.expenseEducation,
    });
    expect(addRes.status).toBe(200);

    const delRes = await inmate.agent
      .delete('/api/v1/action/')
      .send({ transactionId: addRes.body.transactionId });
    expect(delRes.status).toBe(404);
  });

  test('reject pending invite → kandydat bez membership', async () => {
    const host = await signupAndLogin(app, {
      userName: 'rejhst',
      email: 'rejhst@test.local',
    });
    await createHouse(host.agent, { houseName: 'E2E Reject House', initBudget: 200 });

    const inmate = await signupAndLogin(app, {
      userName: 'rejint',
      email: 'rejint@test.local',
    });
    expect((await host.agent.post('/api/v1/users/invite').send({ userName: 'rejint' })).status).toBe(
      200,
    );
    await login(inmate.agent, { email: 'rejint@test.local' });

    const candidate = await signupAndLogin(app, {
      userName: 'rejcan',
      email: 'rejcan@test.local',
    });
    expect(
      (await inmate.agent.post('/api/v1/users/invite').send({ userName: 'rejcan' })).status,
    ).toBe(200);

    const collection = await host.agent.get('/api/v1/invitation/collection');
    const invitation = collection.body.invitations?.find(
      (i) => i.invitedUserName === 'rejcan' || i.invitedUser === candidate.loginRes.body.id,
    );
    expect(invitation).toBeTruthy();

    const decline = await host.agent.post('/api/v1/invitation/decline').send({
      invitationId: invitation.id,
    });
    expect(decline.status).toBe(200);

    const candRelogin = await login(candidate.agent, { email: 'rejcan@test.local' });
    expect(candRelogin.body.role).toBe('user');

    const infoRes = await candidate.agent.get('/api/v1/house/info');
    expect(infoRes.status).not.toBe(200);
  });

  test('user bez domu → add action odmawia', async () => {
    const agent = createAgent(app);
    await signup(agent, { userName: 'nohous', email: 'nohous@test.local' });
    const loginRes = await login(agent, { email: 'nohous@test.local' });
    expect(loginRes.status).toBe(200);

    const res = await agent.post('/api/v1/action/new').send({
      type: 'expense',
      value: 10,
      catId: SEED_CAT.expenseEducation,
    });
    // household role middleware lub service — nie 200
    expect(res.status).not.toBe(200);
  });
});
