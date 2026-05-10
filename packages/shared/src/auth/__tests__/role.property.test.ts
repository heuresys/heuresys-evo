/**
 * Property-based test esempio (S28 Wave 2 M6 fast-check setup).
 *
 * Pattern: per ogni proprietà di dominio invariante, generare 100 random
 * input via fast-check + verificare che l'invariante valga sempre.
 *
 * Esempio: hasRole — relazione di ordine totale tra ruoli RBP.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { hasRole, isPlatformAdmin, isTenantAdmin, ROLES, type Role } from '../role.js';

describe('role property-based invariants', () => {
  it('hasRole è riflessiva: hasRole(r, r) === true per ogni ruolo', () => {
    fc.assert(
      fc.property(fc.constantFrom<Role>(...ROLES), (r) => {
        expect(hasRole(r, r)).toBe(true);
      }),
      { numRuns: 50 }
    );
  });

  it('hasRole è transitiva: hasRole(a,b) ∧ hasRole(b,c) ⇒ hasRole(a,c)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Role>(...ROLES),
        fc.constantFrom<Role>(...ROLES),
        fc.constantFrom<Role>(...ROLES),
        (a, b, c) => {
          if (hasRole(a, b) && hasRole(b, c)) {
            expect(hasRole(a, c)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('SUPERUSER domina ogni altro ruolo (top of hierarchy)', () => {
    fc.assert(
      fc.property(fc.constantFrom<Role>(...ROLES), (r) => {
        expect(hasRole('SUPERUSER', r)).toBe(true);
      }),
      { numRuns: 50 }
    );
  });

  it('isPlatformAdmin e isTenantAdmin sono mutuamente esclusivi nei TENANT_OWNER/IT_ADMIN ranges', () => {
    fc.assert(
      fc.property(fc.constantFrom<Role>(...ROLES), (r) => {
        const platform = isPlatformAdmin(r);
        const tenant = isTenantAdmin(r);
        // SUPERUSER/SYSADMIN sono platform; TENANT_OWNER/IT_ADMIN sono tenant
        // Nessun ruolo è entrambi simultaneamente
        if (platform && tenant) {
          throw new Error(`Role ${r} is both platform and tenant admin (invariant violated)`);
        }
        expect(platform && tenant).toBe(false);
      }),
      { numRuns: 50 }
    );
  });
});
