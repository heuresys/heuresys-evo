import { describe, it, expect } from 'vitest';
import {
  LoginCredentialsSchema,
  TotpChallengeSchema,
  TotpRecoveryChallengeSchema,
  LoginResponseSchema,
  JwtPayloadSchema,
  SessionUserSchema,
} from '../auth.zod.js';

describe('LoginCredentialsSchema', () => {
  it('accepts valid credentials', () => {
    const result = LoginCredentialsSchema.safeParse({
      username: 'francesca.gallo@rtl-bank.org',
      password: 'Heuresys2026!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects password shorter than 8 chars', () => {
    const result = LoginCredentialsSchema.safeParse({
      username: 'u',
      password: '1234567',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty username', () => {
    const result = LoginCredentialsSchema.safeParse({
      username: '',
      password: 'longenoughpassword',
    });
    expect(result.success).toBe(false);
  });
});

describe('TotpChallengeSchema', () => {
  it('accepts a valid 6-digit TOTP', () => {
    const result = TotpChallengeSchema.safeParse({
      challengeToken: 'x'.repeat(20),
      totpCode: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects TOTP with letters', () => {
    const result = TotpChallengeSchema.safeParse({
      challengeToken: 'x'.repeat(20),
      totpCode: '12345A',
    });
    expect(result.success).toBe(false);
  });

  it('rejects TOTP with wrong length', () => {
    const result = TotpChallengeSchema.safeParse({
      challengeToken: 'x'.repeat(20),
      totpCode: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects challengeToken shorter than 20 chars', () => {
    const result = TotpChallengeSchema.safeParse({
      challengeToken: 'tooShort',
      totpCode: '123456',
    });
    expect(result.success).toBe(false);
  });
});

describe('TotpRecoveryChallengeSchema', () => {
  it('accepts a valid recovery code', () => {
    const result = TotpRecoveryChallengeSchema.safeParse({
      challengeToken: 'x'.repeat(20),
      recoveryCode: 'abc12345',
    });
    expect(result.success).toBe(true);
  });

  it('rejects recovery code shorter than 8 chars', () => {
    const result = TotpRecoveryChallengeSchema.safeParse({
      challengeToken: 'x'.repeat(20),
      recoveryCode: 'abc',
    });
    expect(result.success).toBe(false);
  });
});

describe('LoginResponseSchema discriminated union', () => {
  it('parses a pending_totp branch', () => {
    const result = LoginResponseSchema.safeParse({
      status: 'pending_totp',
      challengeToken: 'x'.repeat(20),
      expiresAt: '2026-05-01T12:00:00Z',
    });
    expect(result.success).toBe(true);
  });

  it('parses an authenticated branch', () => {
    const result = LoginResponseSchema.safeParse({
      status: 'authenticated',
      user: {
        id: '11111111-2222-3333-4444-555555555555',
        username: 'u',
        role: 'EMPLOYEE',
        tenantId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        employeeId: null,
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects unknown status', () => {
    const result = LoginResponseSchema.safeParse({ status: 'ghosted' });
    expect(result.success).toBe(false);
  });
});

describe('JwtPayloadSchema', () => {
  it('parses a valid JWT payload', () => {
    const result = JwtPayloadSchema.safeParse({
      sub: '11111111-2222-3333-4444-555555555555',
      username: 'laura',
      role: 'HR_DIRECTOR',
      tenantId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      employeeId: null,
      permissions: ['EMPLOYEE_READ', 'EMPLOYEE_WRITE'],
      iat: 1714521600,
      exp: 1714525200,
    });
    expect(result.success).toBe(true);
  });

  it('defaults permissions to empty array when omitted', () => {
    const result = JwtPayloadSchema.parse({
      sub: '11111111-2222-3333-4444-555555555555',
      username: 'u',
      role: 'EMPLOYEE',
      tenantId: null,
      employeeId: null,
      iat: 1,
      exp: 2,
    });
    expect(result.permissions).toEqual([]);
  });
});

describe('SessionUserSchema', () => {
  it('roundtrip parse → re-parse stable', () => {
    const session = {
      id: '11111111-2222-3333-4444-555555555555',
      username: 'laura',
      role: 'EMPLOYEE' as const,
      tenantId: null,
      employeeId: null,
      permissions: [],
    };
    const first = SessionUserSchema.parse(session);
    const second = SessionUserSchema.parse(first);
    expect(second).toEqual(first);
  });
});
