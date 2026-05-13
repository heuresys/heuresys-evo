#!/usr/bin/env node
/**
 * perf/toggle-tenant-owners-tmp.mjs — Temporary reactivation TENANT_OWNER legacy users
 * for Lighthouse cross-tenant audit (S58+ item #2).
 *
 * Targets:
 *   - admin             (Heuresys System TENANT_OWNER)
 *   - smartfood-admin   (SmartFood TENANT_OWNER)
 *   - econova-admin     (EcoNova TENANT_OWNER)
 *
 * Set password = Heuresys2026! (matrix canonical password).
 *
 * NOT a violation of L51 SoT (tests/.test-env): questi utenti restano fuori dalla
 * test matrix canonical. Lo script è strumento TEMPORANEO per cross-tenant LH audit
 * one-shot. Re-eseguito con --off ri-disattiva (soft-delete + is_active=false).
 *
 * Usage:
 *   node scripts/perf/toggle-tenant-owners-tmp.mjs --on
 *   node scripts/perf/toggle-tenant-owners-tmp.mjs --off
 */

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const TARGETS = ['admin', 'smartfood-admin', 'econova-admin'];
const PASSWORD = 'Heuresys2026!';
const COST = 12;

async function main() {
  const mode = process.argv.includes('--off') ? 'off' : 'on';
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL.replace(/\?.*$/, '') });
  console.log(`[toggle-tenant-owners-tmp] mode=${mode}`);

  if (mode === 'on') {
    const hash = bcrypt.hashSync(PASSWORD, COST);
    for (const u of TARGETS) {
      const r = await pool.query(
        `UPDATE users
            SET password_hash=$1, is_active=true, deleted_at=NULL, updated_at=NOW()
          WHERE username=$2`,
        [hash, u]
      );
      console.log(`  ON  ${u}: rowCount=${r.rowCount}`);
    }
  } else {
    for (const u of TARGETS) {
      const r = await pool.query(
        `UPDATE users
            SET is_active=false, deleted_at=NOW(), updated_at=NOW()
          WHERE username=$1`,
        [u]
      );
      console.log(`  OFF ${u}: rowCount=${r.rowCount}`);
    }
  }
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
