import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { csrfHmac, csrfTokenHandler, hardenedHelmet } from '../security.js';

beforeAll(() => {
  process.env.AUTH_SECRET =
    process.env.AUTH_SECRET ?? 'test-secret-must-be-long-enough-for-hmac-32-bytes';
});

function buildApp(): express.Express {
  const app = express();
  app.use(hardenedHelmet);
  app.use(cookieParser());
  app.use(express.json());
  app.get('/csrf', csrfTokenHandler);
  app.use(csrfHmac);
  app.get('/safe', (_req, res) => res.json({ ok: true }));
  app.post('/unsafe', (_req, res) => res.json({ done: true }));
  return app;
}

describe('hardenedHelmet', () => {
  it('sets HSTS, no-sniff, frameguard, and CSP report-only headers', async () => {
    const res = await request(buildApp()).get('/safe');
    expect(res.headers['strict-transport-security']).toMatch(/max-age=31536000/);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toMatch(/SAMEORIGIN|DENY/i);
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['content-security-policy-report-only']).toBeDefined();
  });
});

describe('csrf flow', () => {
  let app: express.Express;
  beforeEach(() => {
    app = buildApp();
  });

  it('GET /safe is allowed without csrf binding', async () => {
    const res = await request(app).get('/safe');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('GET /csrf issues a binding cookie + returns derived token', async () => {
    const res = await request(app).get('/csrf');
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf('string');
    expect(res.headers['set-cookie']).toBeDefined();
    const cookieHeader = (res.headers['set-cookie'] as unknown as string[])[0]!;
    expect(cookieHeader).toMatch(/csrf-binding=/);
    expect(cookieHeader).toMatch(/HttpOnly/i);
    expect(cookieHeader).toMatch(/SameSite=Strict/i);
  });

  it('POST /unsafe without csrf token returns 403', async () => {
    const res = await request(app).post('/unsafe').send({ x: 1 });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/csrf/);
  });

  it('POST /unsafe with valid binding cookie + matching token succeeds', async () => {
    const agent = request.agent(app);
    const csrfRes = await agent.get('/csrf');
    const token = csrfRes.body.token as string;
    const res = await agent.post('/unsafe').set('X-CSRF-Token', token).send({ x: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ done: true });
  });

  it('POST /unsafe with token mismatch returns 403', async () => {
    const agent = request.agent(app);
    await agent.get('/csrf');
    const res = await agent
      .post('/unsafe')
      .set('X-CSRF-Token', 'forged-token-not-derived-from-binding')
      .send({ x: 1 });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('csrf_token_mismatch');
  });
});
