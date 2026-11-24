import request from 'supertest';
import { createApp } from '../../app.js';

/** Hasło spełniające registerValidations (unit + E2E). */
export const TEST_PASSWORD = 'Aa1!bbbbbb';

export function createTestApp() {
  return createApp();
}

/** Cookie jar SESSID — Context7 supertest `request.agent(app)`. */
export function createAgent(app = createTestApp()) {
  return request.agent(app);
}

export async function signup(agent, { userName, email, role = 'user' }) {
  const res = await agent.post('/api/v1/auth/signup').send({
    reg_username: userName,
    reg_email: email,
    reg_password: TEST_PASSWORD,
    role,
    cookies: true,
  });
  return res;
}

export async function login(agent, { email }) {
  const res = await agent.post('/api/v1/auth/login').send({
    email,
    password: TEST_PASSWORD,
  });
  return res;
}

export async function createHouse(agent, { houseName, initBudget = 1000 }) {
  const res = await agent.post('/api/v1/house/new').send({
    houseName,
    initBudget,
  });
  return res;
}

/**
 * Rejestracja + login na świeżym agencie (osobny cookie jar).
 * @returns {{ agent: import('supertest').SuperAgentTest, signupRes, loginRes }}
 */
export async function signupAndLogin(app, user) {
  const agent = createAgent(app);
  const signupRes = await signup(agent, user);
  const loginRes = await login(agent, { email: user.email });
  return { agent, signupRes, loginRes };
}
