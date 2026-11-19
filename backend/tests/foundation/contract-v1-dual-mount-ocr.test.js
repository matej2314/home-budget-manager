import { describe, expect, test } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../../app.js';

describe('Faza 4 — dual mount + envelope + OCR auth', () => {
  const app = createApp();

  test('dual mount: /auth/verify and /api/v1/auth/verify without cookie', async () => {
    const legacy = await request(app).get('/auth/verify');
    const v1 = await request(app).get('/api/v1/auth/verify');
    expect(legacy.status).toBe(401);
    expect(v1.status).toBe(401);
    expect(v1.body.message).toBe('auth.sessionRequired');
    expect(legacy.body.message).toBe(v1.body.message);
  });

  test('GET /api/v1/auth/verify with valid SESSID returns auth.verify.success', async () => {
    const token = jwt.sign(
      { id: 'user-1', role: 'user', userName: 'tester', avatar: null },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const res = await request(app)
      .get('/api/v1/auth/verify')
      .set('Cookie', [`SESSID=${token}`]);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'success',
      message: 'auth.verify.success',
      userId: 'user-1',
      userName: 'tester',
      role: 'user',
    });
  });

  test('POST /api/v1/receipt without SESSID is 401 envelope', async () => {
    const res = await request(app).post('/api/v1/receipt');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      status: 'error',
      message: 'auth.sessionRequired',
    });
  });

  test('POST /receipt legacy without SESSID is also 401', async () => {
    const res = await request(app).post('/receipt');
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('auth.sessionRequired');
  });
});
