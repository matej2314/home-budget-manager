import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../app.js';

describe('Faza 3 — health + helmet', () => {
  const app = createApp();

  test('GET /api/v1/health is public liveness without secrets', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(res.body).not.toHaveProperty('JWT_SECRET');
    expect(JSON.stringify(res.body)).not.toMatch(/password|secret|token/i);
  });

  test('health response carries helmet X-Content-Type-Options', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  test('legacy /health is not required (no accidental dual mount)', async () => {
    const res = await request(app).get('/health');
    expect(res.status).not.toBe(200);
  });
});
