#!/usr/bin/env node
// Apply canonical demo users — unified Heuresys2026! restricted to tests/.test-env matrix.
// Idempotent: re-running converges to the same target state.
//
// SoT: tests/.test-env (8 entries · 1 SUPERUSER + 7 RTL Bank roles).
//
// Targets (8 active):
//   - 7 RTL Bank canonical roles (TENANT_OWNER..EMPLOYEE)
//   - 1 platform SUPERUSER (sysadmin)
// Soft-deactivated (5 legacy):
//   - rtl-bank.alice.esposito   (duplicate DEPT_HEAD legacy bcrypt $2a$)
//   - rtl-bank.alberto.colombo  (duplicate EMPLOYEE legacy bcrypt $2a$)
//   - admin                     (Heuresys TENANT_OWNER — out-of-test-matrix S22)
//   - smartfood-admin           (SmartFood TENANT_OWNER — out-of-test-matrix S22)
//   - econova-admin             (EcoNova TENANT_OWNER — out-of-test-matrix S22)
//
// Run: node scripts/db/apply-canonical-users.mjs
// Requires: services/app/.env or .env.local with DATABASE_URL.

import { PrismaClient } from '../../services/app/prisma/generated/client/index.js';
import bcrypt from 'bcryptjs';

const PASSWORD = 'Heuresys2026!';
const COST = 12;

const CANONICAL_RTL = [
  'federica.marchetti@rtl-bank.org',
  'marco.desantis@rtl-bank.org',
  'valentina.conti@rtl-bank.org',
  'maria.colombo@rtl-bank.org',
  'paolo.caputo@rtl-bank.org',
  'giuseppe.ferri@rtl-bank.org',
  'francesca.gallo@rtl-bank.org',
];

const SUPERUSER = 'sysadmin';

const LEGACY_TO_DEACTIVATE = [
  // Pre-L50 username forms (kept here so re-running apply on a stale DB
  // converges by deactivating any leftover legacy alias).
  'rtl-bank.alice.esposito', // duplicate DEPT_HEAD ($2a$)
  'rtl-bank.alberto.colombo', // duplicate EMPLOYEE ($2a$)
  'rtl-hr', // duplicate user for valentina.conti
  'admin', // Heuresys TENANT_OWNER — restricted out by S22 .test-env scope
  'smartfood-admin', // SmartFood TENANT_OWNER — restricted out by S22 .test-env scope
  'econova-admin', // EcoNova TENANT_OWNER — restricted out by S22 .test-env scope
  'evo.dev', // platform SUPERUSER — out of test matrix
  // L50: alice/alberto/laura post-rename forms (idempotent guard)
  'alice.esposito@rtl-bank.org',
  'alberto.colombo@rtl-bank.org',
  'laura.bertolini@econova.org',
];

async function main() {
  const prisma = new PrismaClient();
  const hash = bcrypt.hashSync(PASSWORD, COST);
  console.log(`[apply-canonical-users] hash generated ($2b$${COST}$, len=${hash.length})`);

  const all = [...CANONICAL_RTL, SUPERUSER];

  // 1. UPDATE password_hash + is_active for all canonical users (idempotent)
  let updated = 0;
  for (const username of all) {
    const result = await prisma.$executeRaw`
      UPDATE users
      SET password_hash = ${hash},
          is_active = true,
          deleted_at = NULL,
          updated_at = NOW()
      WHERE username = ${username}
    `;
    if (result === 1) updated++;
    else if (result === 0) console.warn(`[WARN] user not found: ${username}`);
    else console.warn(`[WARN] unexpected affected rows ${result} for ${username}`);
  }
  console.log(`[apply-canonical-users] canonical users updated: ${updated}/${all.length}`);

  // 2. Soft-delete legacy duplicates (only if they still exist and are active)
  let deactivated = 0;
  for (const username of LEGACY_TO_DEACTIVATE) {
    const result = await prisma.$executeRaw`
      UPDATE users
      SET is_active = false,
          deleted_at = NOW(),
          updated_at = NOW()
      WHERE username = ${username}
        AND is_active = true
        AND deleted_at IS NULL
    `;
    if (result === 1) {
      deactivated++;
      console.log(`[apply-canonical-users] soft-deleted legacy: ${username}`);
    }
  }
  console.log(
    `[apply-canonical-users] legacy/restricted soft-deleted: ${deactivated}/${LEGACY_TO_DEACTIVATE.length}`
  );

  // 3. Refresh canonical_demo_users registry
  await prisma.$executeRaw`TRUNCATE canonical_demo_users`;
  await prisma.$executeRaw`
    INSERT INTO canonical_demo_users(role, username) VALUES
      ('SUPERUSER',    ${SUPERUSER}),
      ('TENANT_OWNER', ${'federica.marchetti@rtl-bank.org'}),
      ('IT_ADMIN',     ${'marco.desantis@rtl-bank.org'}),
      ('HR_DIRECTOR',  ${'valentina.conti@rtl-bank.org'}),
      ('HR_MANAGER',   ${'maria.colombo@rtl-bank.org'}),
      ('DEPT_HEAD',    ${'paolo.caputo@rtl-bank.org'}),
      ('LINE_MANAGER', ${'giuseppe.ferri@rtl-bank.org'}),
      ('EMPLOYEE',     ${'francesca.gallo@rtl-bank.org'})
  `;
  console.log('[apply-canonical-users] registry refreshed (8 roles)');

  // 4. Verification: all canonical accept the password
  const verified = await prisma.$queryRaw`
    SELECT username, password_hash FROM users
    WHERE username = ANY(${all})
      AND is_active = true
      AND deleted_at IS NULL
  `;
  let passed = 0,
    failed = 0;
  for (const row of verified) {
    if (bcrypt.compareSync(PASSWORD, row.password_hash)) passed++;
    else {
      failed++;
      console.error(`[FAIL] ${row.username}: hash does not accept Heuresys2026!`);
    }
  }
  console.log(
    `[apply-canonical-users] verification: ${passed}/${all.length} pass${failed ? `, ${failed} FAIL` : ''}`
  );

  await prisma.$disconnect();

  if (failed > 0 || passed !== all.length) {
    console.error(
      `[apply-canonical-users] EXIT 1 (failed=${failed}, passed=${passed}/${all.length})`
    );
    process.exit(1);
  }
  console.log('[apply-canonical-users] DONE');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
