#!/usr/bin/env node
/**
 * Phase 16.M · S24 · L58 — generate FK ON DELETE migration from CSV.
 *
 * Reads docs/_audit/_artifacts/2026-05-10-fk-noaction-310.csv and emits:
 *   - db/seeds/phase16m_fk_ondelete_explicit.sql
 *   - docs/_audit/2026-05-10-fk-ondelete-review.md (decision matrix)
 *
 * Decision rules (priority top-down — first match wins):
 *
 *   1. ref_table = 'tenants'                          → CASCADE  (tenant nuke = full subtree cleanup)
 *   2. ref_table = 'audit_logs'                       → RESTRICT (immutable audit trail)
 *   3. table starts with 'whistleblowing'             → RESTRICT (sensitive, retain forever)
 *   4. table starts with 'audit'                      → SET NULL (preserve log row)
 *   5. table starts with payroll|compensation|salary|bonus|merit|payslip → RESTRICT (financial trail)
 *   6. ref_table = 'users'                            → SET NULL (user delete preserves dependent rows)
 *   7. ref_table starts with 'rbp_' OR 'esco_' OR 'industry_' OR 'company_' → RESTRICT (enum-like catalogs)
 *   8. col in (manager_id, mentor_id, interviewer_id, assigned_to, resolved_by,
 *              created_by, updated_by, reviewed_by, approved_by, deleted_by, owner_id)
 *      AND ref_table = 'employees'                    → SET NULL (preserve subordinate rows)
 *   9. ref_table = 'employees' AND col endsWith '_id' AND col matches '^employee_id$|^subject_id$|^candidate_id$' → CASCADE
 *  10. else                                            → CASCADE (default: tenant-scoped cleanup)
 *
 * Usage: node scripts/db/generate-fk-ondelete-migration.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../');
const CSV_PATH = resolve(REPO_ROOT, 'docs/_audit/_artifacts/2026-05-10-fk-noaction-310.csv');
const SQL_OUT = resolve(REPO_ROOT, 'db/seeds/phase16m_fk_ondelete_explicit.sql');
const DOC_OUT = resolve(REPO_ROOT, 'docs/_audit/2026-05-10-fk-ondelete-review.md');

const PRESERVE_REF_COLS = new Set([
  'manager_id',
  'mentor_id',
  'interviewer_id',
  'assigned_to',
  'resolved_by',
  'created_by',
  'updated_by',
  'reviewed_by',
  'approved_by',
  'deleted_by',
  'owner_id',
  'modified_by',
  'submitted_by',
  'requester_id',
  'approver_id',
  'reporter_id',
  'evaluator_id',
  'completed_by',
  'rejected_by',
  'last_modified_by',
]);

function decideRule(row) {
  const { table, column, refTable } = row;

  if (refTable === 'tenants')
    return { rule: 'CASCADE', domain: 'Tenant', why: 'Tenant nuke = full subtree cleanup' };
  if (refTable === 'audit_logs')
    return { rule: 'RESTRICT', domain: 'Audit', why: 'Immutable audit trail' };

  if (table.startsWith('whistleblowing'))
    return { rule: 'RESTRICT', domain: 'Whistleblowing', why: 'Sensitive data, retain forever' };
  if (table.startsWith('audit_'))
    return { rule: 'SET NULL', domain: 'Audit', why: 'Preserve log row, drop ref' };

  if (
    /^(payroll|compensation|salary|bonus|merit|payslip|tax_)/.test(table) ||
    /^(payroll|compensation|salary|bonus|merit)/.test(refTable)
  ) {
    return { rule: 'RESTRICT', domain: 'Payroll', why: 'Financial audit trail' };
  }

  if (refTable === 'users')
    return { rule: 'SET NULL', domain: 'User-ref', why: 'User delete preserves dependent rows' };

  if (
    /^(rbp_|esco_|industry_|company_|skill_classifications|skill_clusters|locations|company_sizes)/.test(
      refTable
    )
  ) {
    return { rule: 'RESTRICT', domain: 'Catalog', why: 'Enum-like reference catalog' };
  }

  if (refTable === 'employees') {
    if (PRESERVE_REF_COLS.has(column)) {
      return {
        rule: 'SET NULL',
        domain: 'Employee-ref',
        why: 'Preserve subordinate row, employee delete sets NULL',
      };
    }
    if (/^(employee_id|subject_id|candidate_id|reviewee_id|target_employee_id)$/.test(column)) {
      return {
        rule: 'CASCADE',
        domain: 'HR-cascade',
        why: 'Employee delete cascades subordinates',
      };
    }
    return {
      rule: 'SET NULL',
      domain: 'Employee-ref',
      why: 'Default for non-primary employee link',
    };
  }

  return { rule: 'CASCADE', domain: 'Default', why: 'Tenant-scoped subtree cleanup default' };
}

const csv = readFileSync(CSV_PATH, 'utf-8').trim().split('\n');
const rows = csv.map((line) => {
  const [conname, table, column, refTable, refColumn] = line.split(',');
  return { conname, table, column, refTable, refColumn };
});

const decisions = rows.map((r) => ({ ...r, ...decideRule(r) }));

const summary = {};
for (const d of decisions) {
  const key = `${d.domain}::${d.rule}`;
  summary[key] = (summary[key] ?? 0) + 1;
}

// SQL emission ----------------------------------------------------------------

const sqlLines = [];
sqlLines.push('-- Phase 16.M · S24 · L58 — FK ON DELETE explicit per domain');
sqlLines.push('-- =============================================================================');
sqlLines.push('-- Tags 310 FK without explicit ON DELETE rule. Decision matrix in');
sqlLines.push('-- docs/_audit/2026-05-10-fk-ondelete-review.md (auto-generated).');
sqlLines.push('--');
sqlLines.push('-- Rules (priority top-down):');
sqlLines.push('--   1. ref=tenants → CASCADE');
sqlLines.push('--   2. ref=audit_logs → RESTRICT');
sqlLines.push('--   3. table=whistleblowing_% → RESTRICT');
sqlLines.push('--   4. table=audit_% → SET NULL');
sqlLines.push('--   5. table|ref=payroll|compensation|salary|bonus|merit|payslip → RESTRICT');
sqlLines.push('--   6. ref=users → SET NULL');
sqlLines.push('--   7. ref=rbp_|esco_|catalog-like → RESTRICT');
sqlLines.push('--   8. ref=employees AND col in PRESERVE_REF_COLS → SET NULL');
sqlLines.push('--   9. ref=employees AND col=employee_id|subject_id|candidate_id → CASCADE');
sqlLines.push('--  10. else → CASCADE');
sqlLines.push('-- =============================================================================');
sqlLines.push('');
sqlLines.push('BEGIN;');
sqlLines.push('');

for (const d of decisions) {
  sqlLines.push(`-- [${d.domain}/${d.rule}] ${d.why}`);
  sqlLines.push(
    `ALTER TABLE public.${d.table} DROP CONSTRAINT IF EXISTS ${d.conname}, ADD CONSTRAINT ${d.conname} FOREIGN KEY (${d.column}) REFERENCES public.${d.refTable}(${d.refColumn}) ON DELETE ${d.rule};`
  );
}

sqlLines.push('');
sqlLines.push('-- Post-apply assertion: 0 FK left with confdeltype=a (NO ACTION default)');
sqlLines.push('DO $$');
sqlLines.push('DECLARE v_count INT;');
sqlLines.push('BEGIN');
sqlLines.push('  SELECT COUNT(*) INTO v_count FROM pg_constraint con');
sqlLines.push(
  "  JOIN pg_class t ON con.conrelid = t.oid AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname='public')"
);
sqlLines.push("  WHERE con.contype='f' AND con.confdeltype='a';");
sqlLines.push(
  "  IF v_count != 0 THEN RAISE EXCEPTION 'phase16m: % FK still NO ACTION (default)', v_count; END IF;"
);
sqlLines.push(
  "  RAISE NOTICE 'phase16m: 0 FK NO ACTION default. % FK explicitly tagged.', " +
    decisions.length +
    ';'
);
sqlLines.push('END $$;');
sqlLines.push('');
sqlLines.push('COMMIT;');

writeFileSync(SQL_OUT, sqlLines.join('\n') + '\n');

// Doc emission ----------------------------------------------------------------

const byDomain = new Map();
for (const d of decisions) {
  if (!byDomain.has(d.domain)) byDomain.set(d.domain, []);
  byDomain.get(d.domain).push(d);
}

const docLines = [];
docLines.push('# FK ON DELETE review — phase16m decision matrix');
docLines.push('');
docLines.push(
  '> Generated: 2026-05-10 · S24 · L58 · auto-generated from `scripts/db/generate-fk-ondelete-migration.mjs`'
);
docLines.push(
  '> Source: `docs/_audit/_artifacts/2026-05-10-fk-noaction-310.csv` (310 FK with NO ACTION default)'
);
docLines.push('');
docLines.push('## Summary by domain × rule');
docLines.push('');
docLines.push('| Domain × Rule | Count |');
docLines.push('| --- | ---: |');
for (const [k, v] of Object.entries(summary).sort()) {
  docLines.push(`| ${k} | ${v} |`);
}
docLines.push(`| **TOTAL** | **${decisions.length}** |`);
docLines.push('');

docLines.push('## Decision rules (priority order)');
docLines.push('');
docLines.push('1. **ref_table = `tenants`** → `CASCADE`. Tenant nuke = full subtree cleanup.');
docLines.push(
  '2. **ref_table = `audit_logs`** → `RESTRICT`. Immutable audit trail; never silently deleted.'
);
docLines.push(
  '3. **table starts with `whistleblowing`** → `RESTRICT`. Sensitive content retained.'
);
docLines.push(
  '4. **table starts with `audit_`** → `SET NULL`. Preserve log row, drop dangling ref.'
);
docLines.push(
  '5. **table OR ref starts with `payroll|compensation|salary|bonus|merit|payslip|tax_`** → `RESTRICT`. Financial audit trail.'
);
docLines.push('6. **ref_table = `users`** → `SET NULL`. User delete preserves dependent rows.');
docLines.push(
  '7. **ref_table starts with `rbp_|esco_|industry_|company_` or is a catalog table** → `RESTRICT`. Enum-like.'
);
docLines.push(
  '8. **ref_table = `employees` AND column ∈ {manager_id, mentor_id, interviewer_id, assigned_to, resolved_by, created_by, updated_by, reviewed_by, approved_by, deleted_by, owner_id, modified_by, submitted_by, requester_id, approver_id, reporter_id, evaluator_id, completed_by, rejected_by, last_modified_by}** → `SET NULL`. Preserve subordinate row.'
);
docLines.push(
  '9. **ref_table = `employees` AND column ∈ {employee_id, subject_id, candidate_id, reviewee_id, target_employee_id}** → `CASCADE`. Employee primary link cascades.'
);
docLines.push('10. **default** → `CASCADE`. Tenant-scoped subtree cleanup.');
docLines.push('');

for (const [domain, items] of [...byDomain.entries()].sort()) {
  docLines.push(`## Domain: ${domain} (${items.length} FK)`);
  docLines.push('');
  docLines.push('| Constraint | Table | Column | Ref Table | Ref Col | Rule |');
  docLines.push('| --- | --- | --- | --- | --- | --- |');
  for (const d of items) {
    docLines.push(
      `| \`${d.conname}\` | \`${d.table}\` | \`${d.column}\` | \`${d.refTable}\` | \`${d.refColumn}\` | \`${d.rule}\` |`
    );
  }
  docLines.push('');
}

writeFileSync(DOC_OUT, docLines.join('\n') + '\n');

console.log(`Generated:`);
console.log(`  ${SQL_OUT} — 310 ALTER TABLE statements`);
console.log(`  ${DOC_OUT} — decision matrix doc`);
console.log(`Summary:`);
for (const [k, v] of Object.entries(summary).sort()) {
  console.log(`  ${k}: ${v}`);
}
