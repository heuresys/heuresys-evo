/**
 * Shared tenant fixtures (B3.6 anticipated, used from B2.6 + tests).
 *
 * Canonical UUIDs match the legacy seed for cross-environment consistency.
 * Test-only — never reference these in production code.
 */
export const FIXTURE_TENANTS = {
  superuser: '00000000-0000-0000-0000-000000000001',
  econova: '11111111-1111-1111-1111-111111111111',
  rtl_bank: '22222222-2222-2222-2222-222222222222',
  smartfood: '33333333-3333-3333-3333-333333333333',
} as const;

export type FixtureTenant = keyof typeof FIXTURE_TENANTS;

export const FIXTURE_USERS = {
  superuser_admin: {
    id: 'a0000000-0000-0000-0000-000000000001',
    username: 'sysadmin',
    role: 'SUPERUSER',
    tenantId: FIXTURE_TENANTS.superuser,
  },
  rtl_owner: {
    id: 'a0000000-0000-0000-0000-000000000002',
    username: 'rtl.owner',
    role: 'TENANT_OWNER',
    tenantId: FIXTURE_TENANTS.rtl_bank,
  },
  econova_employee: {
    id: 'a0000000-0000-0000-0000-000000000003',
    username: 'eco.employee',
    role: 'EMPLOYEE',
    tenantId: FIXTURE_TENANTS.econova,
  },
} as const;

export type FixtureUser = keyof typeof FIXTURE_USERS;
