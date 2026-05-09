// Parser per tests/.test-env — Source of Truth canonical demo users.
// Pure ESM, zero deps. Esponibile sia a Node script (.mjs) sia a TS via .d.ts.
//
// Format atteso: righe utente strutturate come
//   <ROLE_UPPERCASE>  <username>  <password>  <tenant name>
// separate da multi-space o tab. Header/comment/empty lines saltate.
//
// Tutto il resto del file (header narrativo, tabella header) viene ignorato
// dal regex ROLE_LINE che richiede la prima parola di una riga sia un
// identifier ALL_CAPS (es. SUPERUSER, HR_DIRECTOR).
//
// Uso CLI debug: `node tests/parse-test-env.mjs`

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
export const TEST_ENV_PATH = join(HERE, '.test-env');

// Whitelist of canonical roles. Only lines whose first token matches one of
// these are treated as user rows (prevents false positives from prose like
// "REGOLA OPERATIVA (...)" which would otherwise look like a user row).
const VALID_ROLES = new Set([
  'SUPERUSER',
  'TENANT_OWNER',
  'IT_ADMIN',
  'HR_DIRECTOR',
  'HR_MANAGER',
  'DEPT_HEAD',
  'LINE_MANAGER',
  'EMPLOYEE',
]);

// Match: ROLE  username  password  tenant (>=1 whitespace between fields)
const ROLE_LINE = /^([A-Z][A-Z_]+)\s+(\S+)\s+(\S+)\s+(.+?)\s*$/;

/**
 * @typedef {Object} TestEnvUser
 * @property {string} role
 * @property {string} username
 * @property {string} password
 * @property {string} tenant
 */

/**
 * Parse the .test-env SoT file and return the user matrix.
 * @param {string} [filePath]
 * @returns {TestEnvUser[]}
 */
export function parseTestEnv(filePath = TEST_ENV_PATH) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  /** @type {TestEnvUser[]} */
  const users = [];

  for (const line of lines) {
    const m = line.match(ROLE_LINE);
    if (!m) continue;
    const [, role, username, password, tenant] = m;
    if (!VALID_ROLES.has(role)) continue;
    users.push({
      role,
      username,
      password,
      tenant: tenant.trim(),
    });
  }

  return users;
}

/**
 * Same as parseTestEnv but indexed by role. Throws if duplicate roles found.
 * @param {string} [filePath]
 * @returns {Record<string, TestEnvUser>}
 */
export function getCanonicalUsersByRole(filePath = TEST_ENV_PATH) {
  const users = parseTestEnv(filePath);
  /** @type {Record<string, TestEnvUser>} */
  const map = {};
  for (const u of users) {
    if (map[u.role]) {
      throw new Error(`parse-test-env: duplicate role ${u.role}`);
    }
    map[u.role] = u;
  }
  return map;
}

/**
 * Lista flat usernames (utile per registry inserts e legacy comparison).
 * @param {string} [filePath]
 * @returns {string[]}
 */
export function getCanonicalUsernames(filePath = TEST_ENV_PATH) {
  return parseTestEnv(filePath).map((u) => u.username);
}

// CLI debug: `node tests/parse-test-env.mjs`
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  console.log(JSON.stringify(parseTestEnv(), null, 2));
}
