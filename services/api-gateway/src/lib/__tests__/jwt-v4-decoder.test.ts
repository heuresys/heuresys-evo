import { describe, it, expect } from 'vitest';
import hkdf from '@panva/hkdf';
import { EncryptJWT } from 'jose';
import { decodeNextAuthV4Token } from '../jwt-v4-decoder';

const SECRET = 'test-secret-AUTH_SECRET-shared-cross-service-1234567890';

async function mintV4Token(payload: Record<string, unknown>, ttlSeconds = 3600): Promise<string> {
  const key = await hkdf('sha256', SECRET, '', 'NextAuth.js Generated Encryption Key', 32);
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .encrypt(key);
}

describe('decodeNextAuthV4Token', () => {
  it('round-trips a v4-format token and exposes claims', async () => {
    const token = await mintV4Token({
      id: 'user-uuid-1',
      username: 'enzo',
      role: 'SUPERUSER',
      tenantId: 'tenant-uuid-1',
      email: 'enzo@heuresys.com',
      name: 'Enzo Spenuso',
    });
    const decoded = await decodeNextAuthV4Token(token, SECRET);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe('user-uuid-1');
    expect(decoded?.username).toBe('enzo');
    expect(decoded?.role).toBe('SUPERUSER');
    expect(decoded?.tenantId).toBe('tenant-uuid-1');
    expect(decoded?.email).toBe('enzo@heuresys.com');
  });

  it('returns null on tampered token', async () => {
    const token = await mintV4Token({ id: 'x' });
    const tampered = `${token.slice(0, -4)}AAAA`;
    const decoded = await decodeNextAuthV4Token(tampered, SECRET);
    expect(decoded).toBeNull();
  });

  it('returns null on wrong secret', async () => {
    const token = await mintV4Token({ id: 'x' });
    const decoded = await decodeNextAuthV4Token(token, 'wrong-secret-xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    expect(decoded).toBeNull();
  });

  it('returns null on empty token', async () => {
    expect(await decodeNextAuthV4Token('', SECRET)).toBeNull();
  });

  it('returns null on empty secret', async () => {
    const token = await mintV4Token({ id: 'x' });
    expect(await decodeNextAuthV4Token(token, '')).toBeNull();
  });

  it('returns null on expired token', async () => {
    const token = await mintV4Token({ id: 'x' }, -10);
    const decoded = await decodeNextAuthV4Token(token, SECRET);
    expect(decoded).toBeNull();
  });

  it('rejects A256CBC-HS512 token (Auth.js v5 default — incompatible)', async () => {
    const v5Key = await hkdf('sha256', SECRET, '', 'Auth.js Generated Encryption Key ()', 64);
    const v5Token = await new EncryptJWT({ id: 'x' })
      .setProtectedHeader({ alg: 'dir', enc: 'A256CBC-HS512' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .encrypt(v5Key);
    const decoded = await decodeNextAuthV4Token(v5Token, SECRET);
    expect(decoded).toBeNull();
  });
});
