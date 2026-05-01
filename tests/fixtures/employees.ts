import { FIXTURE_TENANTS } from './tenants';

/**
 * Shared employee fixtures for integration tests.
 * Test-only. Real seed lives in db/seeds/.
 */
export const FIXTURE_EMPLOYEES = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    tenant_id: FIXTURE_TENANTS.rtl_bank,
    first_name: 'Mario',
    last_name: 'Rossi',
    email: 'mario.rossi@rtl-bank.test',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    tenant_id: FIXTURE_TENANTS.rtl_bank,
    first_name: 'Lucia',
    last_name: 'Bianchi',
    email: 'lucia.bianchi@rtl-bank.test',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    tenant_id: FIXTURE_TENANTS.econova,
    first_name: 'Hans',
    last_name: 'Müller',
    email: 'hans.mueller@econova.test',
  },
] as const;

export type FixtureEmployee = (typeof FIXTURE_EMPLOYEES)[number];
