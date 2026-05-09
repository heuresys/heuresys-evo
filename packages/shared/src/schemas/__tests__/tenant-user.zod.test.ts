import { describe, it, expect } from 'vitest';
import {
  TenantSchema,
  PublicTenantSchema,
  SubscriptionPlanSchema,
  CompanySizeSchema,
  TenantStatusSchema,
} from '../tenant.zod.js';
import { UserSchema, PublicUserSchema } from '../user.zod.js';

const validTenant = {
  id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  code: 'ECONOVA',
  name: 'EcoNova SpA',
  description: null,
  region: 'EU-SOUTH',
  status: 'active' as const,
  subscriptionPlan: 'growth' as const,
  companySize: 'MEDIUM' as const,
  industryType: 'ESG Consulting',
  employeeCount: 42,
  setupCompleted: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-04-01T00:00:00Z',
};

const validUser = {
  id: '11111111-2222-3333-4444-555555555555',
  username: 'federica.marchetti@rtl-bank.org',
  role: 'TENANT_OWNER' as const,
  permissions: ['TENANT_READ', 'EMPLOYEE_WRITE'],
  isActive: true,
  lastLogin: null,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  employeeId: null,
  deletedAt: null,
  totpEnabled: false,
};

describe('TenantSchema', () => {
  it('parses a valid tenant', () => {
    expect(TenantSchema.safeParse(validTenant).success).toBe(true);
  });

  it('rejects code over 20 chars', () => {
    expect(TenantSchema.safeParse({ ...validTenant, code: 'X'.repeat(21) }).success).toBe(false);
  });

  it('rejects negative employeeCount', () => {
    expect(TenantSchema.safeParse({ ...validTenant, employeeCount: -1 }).success).toBe(false);
  });

  it("applies default status 'configuring' when omitted", () => {
    const { status: _omit, ...withoutStatus } = validTenant;
    expect(TenantSchema.parse(withoutStatus).status).toBe('configuring');
  });

  it("applies default subscriptionPlan 'starter' when omitted", () => {
    const { subscriptionPlan: _omit, ...withoutPlan } = validTenant;
    expect(TenantSchema.parse(withoutPlan).subscriptionPlan).toBe('starter');
  });
});

describe('Tenant enum schemas', () => {
  it.each(['starter', 'growth', 'enterprise', 'custom'])(
    'SubscriptionPlanSchema accepts %s',
    (plan) => {
      expect(SubscriptionPlanSchema.safeParse(plan).success).toBe(true);
    }
  );

  it.each(['MICRO', 'SMALL', 'MEDIUM', 'LARGE'])('CompanySizeSchema accepts %s', (size) => {
    expect(CompanySizeSchema.safeParse(size).success).toBe(true);
  });

  it('CompanySizeSchema rejects ENTERPRISE (not in enum)', () => {
    expect(CompanySizeSchema.safeParse('ENTERPRISE').success).toBe(false);
  });

  it.each(['configuring', 'active', 'suspended', 'archived'])(
    'TenantStatusSchema accepts %s',
    (status) => {
      expect(TenantStatusSchema.safeParse(status).success).toBe(true);
    }
  );
});

describe('PublicTenantSchema (picked subset)', () => {
  it('strips internal fields', () => {
    const pub = PublicTenantSchema.parse(validTenant);
    expect(Object.keys(pub).sort()).toEqual(
      ['code', 'id', 'name', 'status', 'subscriptionPlan'].sort()
    );
  });
});

describe('UserSchema', () => {
  it('parses a valid user', () => {
    expect(UserSchema.safeParse(validUser).success).toBe(true);
  });

  it('applies isActive default true when omitted', () => {
    const { isActive: _omit, ...withoutActive } = validUser;
    expect(UserSchema.parse(withoutActive).isActive).toBe(true);
  });

  it('applies totpEnabled default false when omitted', () => {
    const { totpEnabled: _omit, ...withoutTotp } = validUser;
    expect(UserSchema.parse(withoutTotp).totpEnabled).toBe(false);
  });

  it('rejects role outside RoleSchema', () => {
    expect(UserSchema.safeParse({ ...validUser, role: 'INTRUDER' }).success).toBe(false);
  });

  it('accepts soft-delete (deletedAt set)', () => {
    expect(UserSchema.safeParse({ ...validUser, deletedAt: '2026-01-01T00:00:00Z' }).success).toBe(
      true
    );
  });
});

describe('PublicUserSchema (omit permissions + deletedAt)', () => {
  it('strips internal fields', () => {
    const pub = PublicUserSchema.parse(validUser);
    expect(pub).not.toHaveProperty('permissions');
    expect(pub).not.toHaveProperty('deletedAt');
  });
});
