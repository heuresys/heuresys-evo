import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import hkdf from '@panva/hkdf';
import { EncryptJWT } from 'jose';
import { requireAuth } from '../auth';

const SECRET = 'integration-test-secret-cross-service-1234567890ABCDEF';

vi.mock('@auth/express', () => ({
  getSession: vi.fn(async () => null),
}));

async function mintV4Cookie(payload: Record<string, unknown>): Promise<string> {
  const key = await hkdf('sha256', SECRET, '', 'NextAuth.js Generated Encryption Key', 32);
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .encrypt(key);
}

function makeReq(cookies: Record<string, string> = {}): Request {
  return { cookies } as unknown as Request;
}

function makeRes(): {
  res: Response;
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
} {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { res: { status } as unknown as Response, status, json };
}

describe('requireAuth middleware', () => {
  let originalSecret: string | undefined;

  beforeEach(() => {
    originalSecret = process.env.AUTH_SECRET;
    process.env.AUTH_SECRET = SECRET;
  });

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalSecret;
    vi.clearAllMocks();
  });

  it('accepts a NextAuth v4 cookie and populates req.session.user with all claims', async () => {
    const cookie = await mintV4Cookie({
      id: 'user-1',
      username: 'enzo',
      role: 'SUPERUSER',
      tenantId: 'tenant-1',
      email: 'enzo@heuresys.com',
      name: 'Enzo S.',
    });
    const req = makeReq({ 'authjs.session-token': cookie });
    const { res, status } = makeRes();
    const next: NextFunction = vi.fn();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(status).not.toHaveBeenCalled();
    const sessionUser = req.session?.user as {
      id?: string;
      tenantId?: string;
      role?: string;
      username?: string;
      email?: string;
    };
    expect(sessionUser?.id).toBe('user-1');
    expect(sessionUser?.tenantId).toBe('tenant-1');
    expect(sessionUser?.role).toBe('SUPERUSER');
    expect(sessionUser?.username).toBe('enzo');
    expect(sessionUser?.email).toBe('enzo@heuresys.com');
  });

  it('returns 401 when no cookie and getSession returns null', async () => {
    const req = makeReq();
    const { res, status, json } = makeRes();
    const next: NextFunction = vi.fn();

    await requireAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: 'unauthorized' });
  });

  it('falls back to getSession (v5 path) when v4 cookie decode fails', async () => {
    const { getSession } = await import('@auth/express');
    vi.mocked(getSession).mockResolvedValueOnce({
      user: { id: 'v5-user', email: 'v5@local', name: 'V5' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    });
    const req = makeReq({ 'authjs.session-token': 'invalid.token.value' });
    const { res, status } = makeRes();
    const next: NextFunction = vi.fn();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(status).not.toHaveBeenCalled();
    expect(req.session?.user?.id).toBe('v5-user');
  });

  it('returns 401 when AUTH_SECRET is missing and no v5 session', async () => {
    delete process.env.AUTH_SECRET;
    const cookie = await mintV4Cookie({ id: 'x' });
    const req = makeReq({ 'authjs.session-token': cookie });
    const { res, status } = makeRes();
    const next: NextFunction = vi.fn();

    await requireAuth(req, res, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
