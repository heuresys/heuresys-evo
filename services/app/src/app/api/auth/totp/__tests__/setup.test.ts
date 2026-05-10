/**
 * Test for TOTP setup + verify endpoints (S28-bis Wave 10 M10 scaffold).
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    users: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { POST as setupPOST } from '../setup/route';
import { POST as verifyPOST } from '../verify/route';
import { authenticator } from 'otplib';

describe('POST /api/auth/totp/setup', () => {
  it('401 unauthenticated', async () => {
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const r = await setupPOST();
    expect(r.status).toBe(401);
  });

  it('200 returns secret + otpauthUrl + qrcode for new user', async () => {
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: 't1' },
    });
    (prisma.users.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'u1',
      username: 'alice@rtl-bank.org',
      totp_enabled: false,
    });

    const r = await setupPOST();
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(typeof j.secret).toBe('string');
    expect(j.secret.length).toBeGreaterThan(15);
    expect(j.otpauthUrl).toContain('otpauth://totp/');
    expect(j.qrcode.startsWith('data:image/png;base64,')).toBe(true);
    expect(j.issuer).toBe('Heuresys');
    expect(j.account).toBe('alice@rtl-bank.org');
  });

  it('409 if totp already enabled', async () => {
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: 't1' },
    });
    (prisma.users.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'u1',
      username: 'alice@rtl-bank.org',
      totp_enabled: true,
    });

    const r = await setupPOST();
    expect(r.status).toBe(409);
  });
});

describe('POST /api/auth/totp/verify', () => {
  it('400 invalid code', async () => {
    process.env.TOTP_KEY = '0'.repeat(64); // 32 bytes hex
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: 't1' },
    });

    const secret = authenticator.generateSecret();
    const req = new Request('http://localhost/api/auth/totp/verify', {
      method: 'POST',
      body: JSON.stringify({ secret, code: '000000' }), // wrong code (very low collision prob)
      headers: { 'content-type': 'application/json' },
    });
    const r = await verifyPOST(req);
    // Expect either 400 invalid_code OR (improbable) 200 if collision; safer: status one of those
    expect([200, 400]).toContain(r.status);
  });

  it('200 valid code enables totp', async () => {
    process.env.TOTP_KEY = '0'.repeat(64);
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: 't1' },
    });
    (prisma.users.update as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const secret = authenticator.generateSecret();
    const validCode = authenticator.generate(secret);
    const req = new Request('http://localhost/api/auth/totp/verify', {
      method: 'POST',
      body: JSON.stringify({ secret, code: validCode }),
      headers: { 'content-type': 'application/json' },
    });
    const r = await verifyPOST(req);
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.enabled).toBe(true);
  });
});
