// Smoke test del parser. Eseguibile con `node tests/parse-test-env.test.mjs`.
// Esce con codice non-zero se qualcosa devia da quanto atteso.
import { parseTestEnv, getCanonicalUsersByRole, getCanonicalUsernames } from './parse-test-env.mjs';

let failed = 0;
function check(condition, label) {
  if (!condition) {
    console.error('  ✗', label);
    failed++;
  } else {
    console.log('  ✓', label);
  }
}

console.log('parse-test-env smoke test');

const users = parseTestEnv();
check(users.length === 8, `parses 8 users (got ${users.length})`);

const expectedRoles = [
  'SUPERUSER',
  'TENANT_OWNER',
  'IT_ADMIN',
  'HR_DIRECTOR',
  'HR_MANAGER',
  'DEPT_HEAD',
  'LINE_MANAGER',
  'EMPLOYEE',
];
for (const role of expectedRoles) {
  check(
    users.some((u) => u.role === role),
    `contains role ${role}`
  );
}

const byRole = getCanonicalUsersByRole();
check(byRole.SUPERUSER.username === 'sysadmin', `SUPERUSER username == sysadmin`);
check(
  byRole.TENANT_OWNER.username === 'federica.marchetti@rtl-bank.org',
  `TENANT_OWNER username canonical email`
);
check(
  byRole.EMPLOYEE.username === 'francesca.gallo@rtl-bank.org',
  `EMPLOYEE username canonical email`
);
check(byRole.SUPERUSER.password === 'Heuresys2026!', `password unica Heuresys2026!`);
check(
  users.every((u) => u.password === 'Heuresys2026!'),
  `all 8 users share Heuresys2026!`
);

const usernames = getCanonicalUsernames();
check(usernames.length === 8, `getCanonicalUsernames length 8`);
check(usernames[0] === 'sysadmin', `first username is sysadmin`);

if (failed > 0) {
  console.error(`\nFAIL: ${failed} assertion(s) failed`);
  process.exit(1);
}
console.log('\nOK: all assertions passed');
