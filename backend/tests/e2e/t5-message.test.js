import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
  createTestApp,
  signupAndLogin,
  createHouse,
  login,
} from '../helpers/httpAgent.js';
import { prepareE2eDatabase } from '../helpers/e2eDb.js';

describe('T-5.5 message E2E (HTTP zapis, bez WS)', () => {
  const app = createTestApp();
  jest.setTimeout(20000);

  beforeEach(async () => {
    await prepareE2eDatabase();
  });

  test('POST /message/send + odczyt na GET /board/data/messages', async () => {
    const host = await signupAndLogin(app, {
      userName: 'msghst',
      email: 'msghst@test.local',
    });
    await createHouse(host.agent, { houseName: 'E2E Msg House', initBudget: 100 });

    const peer = await signupAndLogin(app, {
      userName: 'msgpeer',
      email: 'msgpeer@test.local',
    });
    const inviteRes = await host.agent.post('/api/v1/users/invite').send({
      userName: 'msgpeer',
    });
    expect(inviteRes.status).toBe(200);
    await login(peer.agent, { email: 'msgpeer@test.local' });

    const sendRes = await host.agent.post('/api/v1/message/send').send({
      recipientName: 'msgpeer',
      content: 'e2e-hello-message',
    });
    expect(sendRes.status).toBe(200);
    expect(sendRes.body).toMatchObject({
      status: 'success',
      message: 'sendMessage.successMessage',
    });

    const boardRes = await peer.agent.get('/api/v1/board/data/messages');
    expect(boardRes.status).toBe(200);
    const messages = boardRes.body.dashboardData?.messagesData ?? [];
    expect(messages.some((m) => m.message === 'e2e-hello-message' && m.sender === 'msghst')).toBe(
      true,
    );
  });
});
