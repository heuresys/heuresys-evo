/**
 * Phase 15.I L60+ — Tests for setUserPalette server action.
 *
 * Validates: auth required · palette/theme whitelist · prisma.users.update
 * scoped to session.user.id (no spoofing) · auditedTransaction invoked
 * with the right actor + payload (action=UPDATE, category=USER).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

const auditedTransactionMock = vi.fn();

vi.mock('@/lib/audit/auditedTransaction', () => ({
  auditedTransaction: (
    actor: unknown,
    payload: unknown,
    mutate: (tx: unknown) => Promise<unknown>
  ) => auditedTransactionMock(actor, payload, mutate),
}));

import { auth } from '@/lib/auth';
import { setUserPalette } from '../actions';

const asMock = <T>(fn: T) => fn as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  auditedTransactionMock.mockImplementation(
    async (_actor: unknown, _payload: unknown, mutate: (tx: unknown) => Promise<unknown>) => {
      const fakeTx = {
        users: {
          update: vi.fn().mockResolvedValue({ id: 'u-self' }),
        },
      };
      const result = await mutate(fakeTx);
      return { result, auditId: 'audit-1' };
    }
  );
});

describe('setUserPalette', () => {
  it('throws Unauthorized when no session', async () => {
    asMock(auth).mockResolvedValue(null);
    await expect(setUserPalette('mu-architect', 'dark')).rejects.toThrow(/Unauthorized/);
  });

  it('throws Forbidden when session has no tenant and no env fallback', async () => {
    asMock(auth).mockResolvedValue({ user: { id: 'u-self', role: 'EMPLOYEE' } });
    delete process.env.DEFAULT_SUPERUSER_TENANT_ID;
    await expect(setUserPalette('mu-architect', 'dark')).rejects.toThrow(
      /tenant context unavailable/
    );
  });

  it('throws Invalid palette when palette is not in whitelist', async () => {
    asMock(auth).mockResolvedValue({ user: { id: 'u-self', tenantId: 't1' } });
    await expect(
      setUserPalette('not-a-palette' as unknown as 'mu-architect', 'dark')
    ).rejects.toThrow(/Invalid palette/);
  });

  it('throws Invalid theme when theme is not dark|light', async () => {
    asMock(auth).mockResolvedValue({ user: { id: 'u-self', tenantId: 't1' } });
    await expect(setUserPalette('mu-architect', 'midnight' as unknown as 'dark')).rejects.toThrow(
      /Invalid theme/
    );
  });

  it('calls prisma.users.update via tx scoped to session.user.id', async () => {
    asMock(auth).mockResolvedValue({
      user: { id: 'u-self', username: 'alice@rtl-bank.org', tenantId: 't1', role: 'EMPLOYEE' },
    });

    let capturedUpdateArgs: unknown = null;
    auditedTransactionMock.mockImplementation(
      async (_actor: unknown, _payload: unknown, mutate: (tx: unknown) => Promise<unknown>) => {
        const fakeTx = {
          users: {
            update: vi.fn().mockImplementation((args: unknown) => {
              capturedUpdateArgs = args;
              return Promise.resolve({ id: 'u-self' });
            }),
          },
        };
        await mutate(fakeTx);
        return { result: { id: 'u-self' }, auditId: 'audit-1' };
      }
    );

    const out = await setUserPalette('mu-architect', 'dark');
    expect(out).toEqual({ ok: true, palette: 'mu-architect', theme: 'dark' });
    expect(capturedUpdateArgs).toEqual({
      where: { id: 'u-self' },
      data: { palette_preference_id: 'mu-architect', theme_preference: 'dark' },
      select: { id: true },
    });
  });

  it('passes correct AuditActor and AuditPayload to auditedTransaction', async () => {
    asMock(auth).mockResolvedValue({
      user: {
        id: 'u-self',
        username: 'alice@rtl-bank.org',
        email: 'alice@rtl-bank.org',
        tenantId: 't1',
        role: 'EMPLOYEE',
      },
    });

    await setUserPalette('lambda', 'light');

    expect(auditedTransactionMock).toHaveBeenCalledTimes(1);
    const [actor, payload] = auditedTransactionMock.mock.calls[0]!;
    expect(actor).toMatchObject({
      tenantId: 't1',
      userId: 'u-self',
      userEmail: 'alice@rtl-bank.org',
      userRole: 'EMPLOYEE',
    });
    expect(payload).toMatchObject({
      action: 'UPDATE',
      category: 'USER',
      resourceType: 'user',
      resourceId: 'u-self',
      newValue: { palette_preference_id: 'lambda', theme_preference: 'light' },
    });
    expect(payload).toHaveProperty('metadata.source', 'dashboard-palette-switcher');
  });

  it('platform user (no tenantId) falls back to DEFAULT_SUPERUSER_TENANT_ID env', async () => {
    asMock(auth).mockResolvedValue({
      user: { id: 'su-1', username: 'sysadmin', role: 'SUPERUSER' },
    });
    process.env.DEFAULT_SUPERUSER_TENANT_ID = 't-platform';

    const out = await setUserPalette('beta', 'dark');
    expect(out.ok).toBe(true);
    expect(auditedTransactionMock).toHaveBeenCalledWith(
      expect.objectContaining({ tenantId: 't-platform', userId: 'su-1' }),
      expect.any(Object),
      expect.any(Function)
    );
  });
});
